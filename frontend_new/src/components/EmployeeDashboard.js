import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useState, useEffect } from "react";
import { Route, useHistory } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Drawer,
  Divider,
  List,
  Container,
  ListItem,
  Grid,
  Card,
  CardContent,
  DialogContent,
  Chip,
} from "@material-ui/core";
import { IconButton, Badge, Input } from "@mui/material";
import {
  Settings,
  ExitToApp,
  ChevronLeft,
  Dashboard,
  Notifications,
  Message,
  DateRange,
} from "@material-ui/icons";
import MenuIcon from "@material-ui/icons/Menu";
import clsx from "clsx";
// import EmployeeTable from "./EmployeeTable";
import UserProfilePage from "./UserProfilePage";
// import ManageDepartment from "./ManageDepartment";
import SettingsPage from "./SettingsPage";
// import ManageLeaveType from "./ManageLeaveType";
// import ManageEmployee from "./ManageEmployee";
import { logout, useAuthDispatch, useAuthState } from "../context";
import NotificationsMenu from "./NotificationsMenu";
import useDocumentTitle from "./useDocumentTitle";
import LeavesTable from "./LeavesTable";
import {
  Box,
  Dialog,
  DialogActions,
  DialogTitle,
  Stack,
  TextField,
  Select,
  InputLabel,
  FormControl,
  Button,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import { getStates } from "country-state-picker";
import { updateUser } from "../context/actions";
import ChangePassword from "./ChangePassword";
import LeaveCalendar from "./LeaveCalendar";
import MessagesPage from "./MessagesPage";

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    // paddingTop: theme.spacing(4),
    // paddingBottom: theme.spacing(4),
    marginTop: "120px",
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
  menuStyle: {
    marginTop: "40px",
  },
}));

let webSocket, autoLogoutWebSocket;

function EmployeeDashboard(props) {
  useDocumentTitle("ELMS   |   Employee");

  let history = useHistory();
  let dispatch = useAuthDispatch();

  const { user } = useAuthState();

  const classes = useStyles();

  const [open, setOpen] = useState(true);
  const [open2, setOpen2] = useState(false);
  const [openTAL, setOpenTAL] = useState(false);
  const [openTLAM, setOpenTLAM] = useState(false);
  const [openTLAY, setOpenTLAY] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notificationsAnchorEl, setNotificaionsAnchorEl] = useState(false);
  const [admin, setAdmin] = useState("");
  const [manager, setManager] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [purpose, setPurpose] = useState("");
  const [town, setTown] = useState("");
  const [state, setState] = useState("");
  const [leaves, setLeaves] = useState([]);
  const [invisible, setInvisible] = useState(true);
  const [selectedFile, setSelectedFile] = useState([]);
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [fileLimitSnackbarOpen, setFileLimitSnackbarOpen] = useState(false);
  // let webSocket;

  useEffect(() => {
    getAssignedNames();
    fetchLeaveTypes();
    fetchLeaves();
    webSocket = new WebSocket("ws://127.0.0.1:8000/ws/update-user");
    autoLogoutWebSocket = new WebSocket("ws://127.0.0.1:8000/ws/delete-user");
    webSocket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.action === "UPDATE") {
        if (data.employee) {
          fetchLeaves();
        }
      } else if (data.action === "LOGOUT")
        logout(dispatch, { username: user.username, webSocket: webSocket });
    };
    webSocket.onclose = function (e) {
      console.error("Chat socket closed unexpectedly");
    };
  }, []);

  const handleMessages = () => {
    history.push("/employee/messages");
  };

  const fetchLeaves = () => {
    fetch(`http://127.0.0.1:8000/leaves/get-leaves/${user.username}/`)
      .then((res) => res.json())
      .then((data) => {
        setLeaves([...data]);
      });
  };

  const handlePurposeChange = (e) => {
    setPurpose(e.target.value);
  };

  const handleLeaveTypeChange = (e) => {
    setLeaveType(e.target.value);
  };

  const fetchLeaveTypes = () => {
    fetch(
      `http://127.0.0.1:8000/leave-types/get-leave-type-${
        user.contract_based ? "contract" : "regular"
      }`
    )
      .then((response) => response.json())
      .then((data) => {
        setLeaveTypes([...data]);
      });
  };

  const getAssignedNames = () => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: user.username,
      }),
    };

    fetch("http://127.0.0.1:8000/accounts/get-names/", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        setAdmin(data.admin);
        setManager(data.manager);
      });
  };

  const handleProfileMenuOpen = (e) => {
    setAnchorEl(e.currentTarget);
    setIsMenuOpen(true);
  };

  const handleProfileMenuClose = () => {
    setIsMenuOpen(false);
  };

  const handleNotificationsMenuClose = () => {
    setIsNotificationsOpen(false);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  // const handleProfileClick = () => {
  //   setIsMenuOpen(false);
  //   history.push("/employee/profile");
  // };

  const handleDashboardClick = () => {
    history.push("/employee/");
  };

  const handleLeaveApplyClick = () => {
    setOpen2(true);
  };

  const handleViewLeaveCalendar = () => {
    history.push("/employee/leave-calendar");
  };

  const handleSettignsClick = () => {
    setIsMenuOpen(false);
    history.push("/employee/settings");
  };

  const handleLogoutClick = async () => {
    await logout(dispatch, { username: user.username, webSocket: webSocket });
    webSocket.send(
      JSON.stringify({
        action: "UPDATE",
        admin: true,
        manager: true,
        employee: false,
      })
    );
    history.push("/login");
  };

  const handleNotificationClick = (e) => {
    e.preventDefault();
    setNotificaionsAnchorEl(e.currentTarget);
    setIsNotificationsOpen(true);
  };

  const handleClose = () => {
    setOpen2(false);
    setOpenTAL(false);
    setOpenTLAM(false);
    setOpenTLAY(false);
  };

  const handleChange = (event) => {
    if (event.target.id === "town") setTown(event.target.value);
    else setState(event.target.value);
  };

  const resetLeaveForm = () => {
    setLeaveType("");
    setFromDate(null);
    setToDate(null);
    setPurpose("");
    setTown("");
    setState("");
    setSelectedFile([]);
  };

  const handleApplyLeaveCancel = () => {
    setOpen2(false);
    resetLeaveForm();
  };

  const handleApplyLeave = () => {
    var files = new FormData();
    files.append("files", selectedFile[0]);
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: user.username,
        leave_type: leaveType,
        admin: user.admin,
        manager: user.manager,
        from_date: fromDate,
        to_date: toDate,
        purpose: purpose,
        address_during_leave: town + " " + state,
        files: selectedFile,
      }),
    };

    fetch("http://127.0.0.1:8000/leaves/apply-leave/", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        updateUser(dispatch, { username: user.username });
        fetchLeaves();
        setOpen2(false);
        webSocket.send(
          JSON.stringify({
            admin: true,
            manager: false,
            employee: false,
            action: "UPDATE",
          })
        );
      });
  };

  const renderProfileMenu = (
    <Menu
      className={classes.menuStyle}
      elevation={0}
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      id="primary-profile-account-menu"
      // keepMounted
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      open={isMenuOpen}
      onClose={handleProfileMenuClose}
    >
      {/* <MenuItem onClick={handleProfileClick}>
        <ListItemIcon>
          <AccountCircle />
        </ListItemIcon>
        <ListItemText>Profile</ListItemText>
      </MenuItem> */}

      <MenuItem onClick={handleSettignsClick}>
        <ListItemIcon>
          <Settings />
        </ListItemIcon>
        <ListItemText>Settings</ListItemText>
      </MenuItem>

      <MenuItem onClick={handleLogoutClick}>
        <ListItemIcon>
          <ExitToApp />
        </ListItemIcon>
        <ListItemText>Logout</ListItemText>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden
            )}
            onClick={handleDrawerOpen}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            LMS Dashboard (Employee)
          </Typography>

          <IconButton
            color="inherit"
            onClick={handleNotificationClick}
            aria-label="notifications of current user"
            aria-controls="primary-profile-notifications-menu"
            aria-haspopup="true"
            sx={{ marginRight: 5 }}
          >
            {notifications === 0 ? (
              <Notifications />
            ) : (
              <Badge badgeContent={notifications} color="primary">
                <Notifications />
              </Badge>
            )}
          </IconButton>

          <NotificationsMenu
            open={isNotificationsOpen}
            handleNotificationsMenuClose={handleNotificationsMenuClose}
          />

          <IconButton
            edge="end"
            aria-label="account of current user"
            aria-controls="primary-profile-account-menu"
            aria-haspopup="true"
            color="inherit"
            onClick={handleProfileMenuOpen}
          >
            <Avatar style={{ height: "35px", width: "35px" }}>
              {user.first_name.charAt(0) + user.last_name.charAt(0)}
            </Avatar>
          </IconButton>

          {renderProfileMenu}
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeft />
          </IconButton>
        </div>

        <Divider />

        <List>
          <ListItem button onClick={handleDashboardClick}>
            <ListItemIcon>
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button onClick={handleLeaveApplyClick}>
            <ListItemIcon>
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary="Apply Leave" />
          </ListItem>
          <Dialog open={open2} onClose={handleClose} fullScreen>
            <Box
              sx={{
                width: 600,
                paddingBottom: 2,
                paddingLeft: 1,
                paddingRight: 1,
                alignSelf: "center",
              }}
            >
              <DialogTitle>Leave Application</DialogTitle>
              <DialogContent>
                <form encType="multipart/form-data">
                  <Stack spacing={3}>
                    <TextField
                      value={user.first_name + " " + user.last_name}
                      label="Username"
                      disabled
                      style={{ marginRight: 15 }}
                      fullWidth
                    />
                    <div
                      style={{
                        display: "flex",
                      }}
                    >
                      <TextField
                        value={admin}
                        label="Assigned Admin"
                        style={{ marginRight: 15 }}
                        disabled
                        fullWidth
                      />
                      <TextField
                        value={manager}
                        label="Assigned Manager"
                        disabled
                        fullWidth
                      />
                    </div>
                    <FormControl fullWidth required>
                      <InputLabel id="leave-type-label">Leave Type</InputLabel>
                      <Select
                        labelId="leave-type-label"
                        id="leave-type"
                        value={leaveType}
                        label="Leave Type"
                        margin="normal"
                        required
                        onChange={handleLeaveTypeChange}
                      >
                        {leaveTypes.map((leaveType) => (
                          <MenuItem value={leaveType.leave_type_name}>
                            {leaveType.leave_type_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <div
                      style={{
                        display: "flex",
                      }}
                    >
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="From"
                          value={fromDate}
                          onChange={(newValue) => {
                            setFromDate(newValue);
                          }}
                          renderInput={(params) => <TextField {...params} />}
                          style={{ marginRight: 15 }}
                        />
                      </LocalizationProvider>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="To"
                          value={toDate}
                          onChange={(newValue) => {
                            setToDate(newValue);
                          }}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                    </div>
                    <TextField
                      multiline={true}
                      rows={3}
                      name="purpose"
                      label="Purpose for Leave"
                      onChange={handlePurposeChange}
                      value={purpose}
                    />
                    <Divider />
                    <Typography>Address during Leave</Typography>
                    <TextField
                      id="town"
                      type="text"
                      fullWidth
                      variant="standard"
                      label="Town/City"
                      value={town}
                      onChange={handleChange}
                    />
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                      <InputLabel id="state-helper-label">State</InputLabel>
                      <Select
                        labelId="state-helper-label"
                        id="state-helper"
                        value={state}
                        label="State"
                        onChange={handleChange}
                      >
                        {getStates("in").map((state, idx) => {
                          return <MenuItem value={state}>{state}</MenuItem>;
                        })}
                      </Select>
                      <Divider
                        style={{
                          marginTop: 10,
                          marginBottom: 10,
                        }}
                      />
                      <div>
                        <Button
                          variant="outlined"
                          component="label"
                          size="small"
                          style={{
                            width: 200,
                          }}
                        >
                          Upload File
                          <input
                            type="file"
                            name="files"
                            multiple
                            onChange={(e) => {
                              if (!e.target.files[0]) return;
                              // const file = e.target.files.copy();
                              const file = [...e.target.files];
                              if (file.length > 2) {
                                setFileLimitSnackbarOpen(true);
                              } else {
                                setSelectedFile(file);
                                setIsFilePicked(true);
                              }
                            }}
                            hidden
                          />
                          <Snackbar
                            open={fileLimitSnackbarOpen}
                            onClose={() => {
                              setFileLimitSnackbarOpen(false);
                            }}
                            autoHideDuration={5000}
                          >
                            <Alert
                              onClose={() => {
                                setFileLimitSnackbarOpen(false);
                              }}
                              severity="error"
                            >
                              File limit exceeded. Max : 2
                            </Alert>
                          </Snackbar>
                        </Button>
                        <div>
                          {isFilePicked &&
                            selectedFile.map((file, idx) => {
                              return (
                                <Chip
                                  style={{
                                    marginTop: 5,
                                  }}
                                  label={file.name}
                                />
                              );
                            })}
                        </div>
                      </div>
                    </FormControl>
                  </Stack>
                </form>
              </DialogContent>
              <DialogActions>
                <Button color="primary" onClick={handleApplyLeave}>
                  Apply Leave
                </Button>
                <Button color="error" onClick={handleApplyLeaveCancel}>
                  Cancel
                </Button>
              </DialogActions>
            </Box>
          </Dialog>
          <ListItem button onClick={handleViewLeaveCalendar}>
            <ListItemIcon>
              <DateRange />
            </ListItemIcon>
            <ListItemText primary="View Leave Calendar" />
          </ListItem>
          <ListItem button onClick={handleMessages}>
            <Badge color="secondary" variant="dot" invisible={invisible}>
              <ListItemIcon>
                <Message />
              </ListItemIcon>
            </Badge>
            <ListItemText primary="Messages" />
          </ListItem>
        </List>
        <Divider />
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer}>
          <Container maxWidth="lg" className={classes.container}>
            <Route path="/employee/" exact>
              <Grid container spacing={3} justifyContent="space-around">
                <Grid item xs={12} md={4} lg={3}>
                  <Card
                    style={{ textAlign: "center" }}
                    onClick={() => {
                      setOpenTAL(true);
                    }}
                  >
                    <CardContent>
                      <Typography
                        style={{ fontSize: 16 }}
                        color="textSecondary"
                      >
                        Total Available Leaves
                      </Typography>
                      <Typography color="textSecondary" variant="caption">
                        in total
                      </Typography>
                      <Typography
                        variant="h5"
                        component="div"
                        color={user.leave_balance < 4 ? "error" : "initial"}
                      >
                        {user.leave_balance}
                      </Typography>
                    </CardContent>
                  </Card>
                  <Dialog
                    open={openTAL}
                    onClose={() => {
                      setOpenTAL(false);
                    }}
                  >
                    <Box
                      sx={{
                        width: 400,
                        paddingBottom: 3,
                        paddingLeft: 1,
                        paddingRight: 1,
                      }}
                    >
                      <DialogTitle>Total Available Leaves</DialogTitle>
                      <DialogContent>
                        {leaveTypes.map((leaveType) => (
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Typography variant="subtitle1">
                                {leaveType.leave_type_name}
                              </Typography>
                              <Typography variant="subtitle1">
                                {leaveType.limit}
                              </Typography>
                            </div>
                            <Divider />
                          </div>
                        ))}
                      </DialogContent>
                    </Box>
                  </Dialog>
                </Grid>
                <Grid item xs={12} md={4} lg={3}>
                  <Card
                    style={{ textAlign: "center" }}
                    onClick={() => {
                      setOpenTLAM(true);
                    }}
                  >
                    <CardContent>
                      <Typography
                        style={{ fontSize: 16 }}
                        color="textSecondary"
                      >
                        Total Leaves Applied
                      </Typography>
                      <Typography color="textSecondary" variant="caption">
                        this month
                      </Typography>
                      <Typography variant="h5" component="div">
                        {user.leaves_month}
                      </Typography>
                    </CardContent>
                  </Card>
                  <Dialog
                    open={openTLAM}
                    onClose={() => {
                      setOpenTLAM(false);
                    }}
                  >
                    <Box
                      sx={{
                        width: 400,
                        paddingBottom: 2,
                        paddingLeft: 1,
                        paddingRight: 1,
                      }}
                    >
                      <DialogTitle>Total Leaves Applied (month)</DialogTitle>
                      <DialogContent>
                        {leaveTypes.map((leaveType) => (
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Typography variant="subtitle1">
                                {leaveType.leave_type_name}
                              </Typography>
                              <Typography variant="subtitle1">
                                {leaveType.limit}
                              </Typography>
                            </div>
                            <Divider />
                          </div>
                        ))}
                      </DialogContent>
                    </Box>
                  </Dialog>
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                  <Card
                    style={{ textAlign: "center" }}
                    onClick={() => {
                      setOpenTLAY(true);
                    }}
                  >
                    <CardContent>
                      <Typography
                        style={{ fontSize: 16 }}
                        color="textSecondary"
                      >
                        Total Leaves Applied
                      </Typography>
                      <Typography color="textSecondary" variant="caption">
                        in total
                      </Typography>
                      <Typography variant="h5" component="div">
                        {user.leaves_total}
                      </Typography>
                    </CardContent>
                  </Card>
                  <Dialog
                    open={openTLAY}
                    onClose={() => {
                      setOpenTLAY(false);
                    }}
                  >
                    <Box
                      sx={{
                        width: 400,
                        paddingBottom: 2,
                        paddingLeft: 1,
                        paddingRight: 1,
                      }}
                    >
                      <DialogTitle>Total Leaves Applied (year)</DialogTitle>
                      <DialogContent>
                        {leaveTypes.map((leaveType) => (
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Typography variant="subtitle1">
                                {leaveType.leave_type_name}
                              </Typography>
                              <Typography variant="subtitle1">
                                {leaveType.limit}
                              </Typography>
                            </div>
                            <Divider />
                          </div>
                        ))}
                      </DialogContent>
                    </Box>
                  </Dialog>
                </Grid>
                <Grid item xs={12} md={4} lg={12}>
                  <LeavesTable
                    leaves={leaves}
                    fetchLeaves={fetchLeaves}
                    webSocket={webSocket}
                  />
                </Grid>
              </Grid>
            </Route>
            <Route path="/employee/profile" exact>
              <UserProfilePage />
            </Route>
            <Route path="/employee/settings" exact>
              <SettingsPage role="employee" />
            </Route>
            <Route path="/employee/change-password" exact>
              <ChangePassword />
            </Route>
            <Route path="/employee/leave-calendar" exact>
              <LeaveCalendar leaves={leaves} />
            </Route>
            <Route path="/employee/messages" exact>
              <MessagesPage />
            </Route>
          </Container>
        </div>
      </main>
    </div>
  );
}

export default EmployeeDashboard;
