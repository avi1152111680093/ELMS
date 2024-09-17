import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Route, useHistory } from "react-router-dom";
import { faLeaf } from "@fortawesome/free-solid-svg-icons";
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
  DialogContent,
  CardContent,
} from "@material-ui/core";
import {
  Box,
  Dialog,
  DialogActions,
  IconButton,
  DialogTitle,
  Stack,
  TextField,
  Select,
  InputLabel,
  FormControl,
  Button,
  Badge,
} from "@mui/material";
import {
  Settings,
  ExitToApp,
  ChevronLeft,
  Dashboard,
  Person,
  Business,
  Notifications,
} from "@material-ui/icons";
import MenuIcon from "@material-ui/icons/Menu";
import clsx from "clsx";
import EmployeeTable from "./EmployeeTable";
import UserProfilePage from "./UserProfilePage";
import ManageDepartment from "./ManageDepartment";
import SettingsPage from "./SettingsPage";
import ManageLeaveType from "./ManageLeaveType";
import NotificationsMenu from "./NotificationsMenu";
import ManageEmployee from "./ManageEmployee";
import ProtectedRoute from "./ProtectedRoute";
import { logout, useAuthDispatch, useAuthState } from "../context";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import { getStates } from "country-state-picker";
import useDocumentTitle from "./useDocumentTitle";
import ChangePassword from "./ChangePassword";
import LeaveCalendar from "./LeaveCalendar";
import ReportGeneration from "./ReportGeneration";

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

const Gutter = ({ w, h, mt, ml }) => {
  return (
    <div
      style={{
        backgroundColor: "lightgrey",
        width: w,
        height: h,
        borderRadius: "3px",
        marginLeft: ml,
        marginTop: mt,
      }}
    ></div>
  );
};

let webSocket;

function AdminDashboard(props) {
  useDocumentTitle("ELMS    |   Admin");
  let history = useHistory();
  let dispatch = useAuthDispatch();

  const { user } = useAuthState();

  const classes = useStyles();

  const [open, setOpen] = useState(true);
  const [open2, setOpen2] = useState(false);
  const [notifications, setNotifications] = useState(1);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notificationsAnchorEl, setNotificaionsAnchorEl] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [numOfEmployees, setNumOfEmployees] = useState(null);
  const [numOfDepartments, setNumOfDepartments] = useState(null);
  const [numOfLeaveTypes, setNumOfLeaveTypes] = useState(null);
  const [value, setValue] = React.useState(null);
  const [state, setState] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [empID, setEmpID] = useState("");
  const [department, setDepartment] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [flat, setFlat] = useState("");
  const [area, setArea] = useState("");
  const [town, setTown] = useState("");
  const [leaves, setLeaves] = useState([]);
  const [allLeaves, setAllLeaves] = useState([]);

  const [joiningDate, setJoiningDate] = useState(null);

  useEffect(() => {
    fetchNumOfEmployees();
    fetchNumOfDepts();
    fetchNumOfLeaveTypes();
    fetchLeaves();
    fetchAllLeaves();
    webSocket = new WebSocket("ws://127.0.0.1:8000/ws/update-user");
    webSocket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.action === "UPDATE") {
        if (data.admin) {
          fetchLeaves();
        }
      } else if (data.action === "LOGOUT")
        logout(dispatch, { username: user.username, webSocket: webSocket });
    };
    webSocket.onclose = function (e) {
      console.error("Chat socket closed unexpectedly");
    };
  }, []);

  const fetchLeaves = () => {
    fetch(`http://127.0.0.1:8000/leaves/get-admin-leaves/${user.username}/`)
      .then((res) => res.json())
      .then((data) => {
        setLeaves([...data]);
      });
  };

  const fetchAllLeaves = () => {
    fetch("http://127.0.0.1:8000/leaves/get-all-leaves/")
      .then((res) => res.json())
      .then((data) => {
        setAllLeaves([...data]);
      });
  };

  const fetchNumOfDepts = () => {
    fetch("http://127.0.0.1:8000/dept/number-dept")
      .then((response) => response.json())
      .then((data) => {
        setNumOfDepartments(data.length);
      });
  };

  const handleNotificationsMenuClose = () => {
    setIsNotificationsOpen(false);
  };

  const handleChange = (event) => {
    if (event.target.id === "manager_first_name")
      setFirstName(event.target.value);
    else if (event.target.id === "manager_last_name")
      setLastName(event.target.value);
    else if (event.target.id === "manager_username")
      setUsername(event.target.value);
    else if (event.target.id === "manager_id") setEmpID(event.target.value);
    else if (event.target.id === "manager_department_code")
      setDepartment(event.target.value);
    else if (event.target.id === "manager_number")
      setPhoneNumber(event.target.value);
    else if (event.target.id === "manager_flat") setFlat(event.target.value);
    else if (event.target.id === "manager_area") setArea(event.target.value);
    else if (event.target.id === "manager_town") setTown(event.target.value);
    else setState(event.target.value);
  };

  const fetchNumOfLeaveTypes = () => {
    fetch("http://127.0.0.1:8000/leave-types/number-leave-types")
      .then((response) => response.json())
      .then((data) => {
        setNumOfLeaveTypes(data.length);
      });
  };

  const handleProfileMenuOpen = (e) => {
    setAnchorEl(e.currentTarget);
    setIsMenuOpen(true);
  };

  const handleProfileMenuClose = () => {
    setIsMenuOpen(false);
  };

  const handleME = (e) => {
    history.push("/admin/mng-emp");
  };

  const handleML = (e) => {
    history.push("/admin/mng-leave-type");
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDashboardClick = () => {
    history.push("/admin");
  };

  const handleAddDeparmentClick = () => {
    history.push("/admin/mng-dpt");
  };

  const handleViewLeaveCalendar = () => {
    history.push("/admin/leave-calendar");
  };

  const handleReportGenerationClick = () => {
    history.push("/admin/report-generation");
  };

  const handleSettignsClick = () => {
    setIsMenuOpen(false);
    history.push("/admin/settings");
  };

  const handleLogoutClick = () => {
    logout(dispatch, { username: user.username, webSocket: webSocket });
  };

  const handleNotificationClick = (e) => {
    e.preventDefault();
    setNotificaionsAnchorEl(e.currentTarget);
    setIsNotificationsOpen(true);
  };

  const fetchNumOfEmployees = () => {
    fetch("http://127.0.0.1:8000/accounts/number-employees/")
      .then((res) => res.json())
      .then((data) => {
        setNumOfEmployees(data.length);
      });
  };

  const handleAddManagerClick = () => {
    setOpen2(true);
  };

  const handleClose = () => {
    setOpen2(false);
  };

  const handleAddManager = () => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        first_name: firstName,
        last_name: lastName,
        employee_id: empID,
        dob: value.toISOString().slice(0, 10),
        department_code: department,
        phone_number: phoneNumber,
        joining_date: joiningDate.toISOString().slice(0, 10),
        flat: flat,
        town: town,
        state: state,
      }),
    };

    fetch("http://127.0.0.1:8000/accounts/register/manager", requestOptions)
      .then((response) => response.json())
      .then((data) => {});

    setOpen2(false);
    setValue(null);
    setUsername("");
    setFirstName("");
    setLastName("");
    setEmpID("");
    setDepartment("");
    setPhoneNumber("");
    setFlat("");
    setArea("");
    setTown("");
    setJoiningDate(null);
  };

  const renderProfileMenu = (
    <Menu
      className={classes.menuStyle}
      elevation={0}
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      id="primary-profile-account-menu"
      keepMounted
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
            LMS Dashboard (Admin)
          </Typography>

          <IconButton
            color="inherit"
            onClick={handleNotificationClick}
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

          <ListItem button onClick={handleME}>
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText primary="Manage Employees" />
          </ListItem>

          <ListItem button onClick={handleAddDeparmentClick}>
            <ListItemIcon>
              <Business />
            </ListItemIcon>
            <ListItemText primary="Manage Department" />
          </ListItem>

          <ListItem button onClick={handleML}>
            <ListItemIcon>
              <FontAwesomeIcon icon={faLeaf}></FontAwesomeIcon>
            </ListItemIcon>
            <ListItemText primary="Manage Leave Type" />
          </ListItem>
          <ListItem button onClick={handleViewLeaveCalendar}>
            <ListItemIcon>
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary="View Leave Calendar" />
          </ListItem>
          <ListItem button onClick={handleReportGenerationClick}>
            <ListItemIcon>
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary="Report Generation" />
          </ListItem>
        </List>
        <Divider />
        <ListItem button onClick={handleAddManagerClick}>
          <ListItemIcon>
            <Person />
          </ListItemIcon>
          <ListItemText primary="Add Manager" />
        </ListItem>
        <Dialog open={open2} onClose={handleClose}>
          <Box
            sx={{
              width: 600,
              paddingBottom: 2,
              paddingLeft: 1,
              paddingRight: 1,
            }}
          >
            <DialogTitle>Add Manager</DialogTitle>
            <DialogContent>
              <form>
                <Stack spacing={3}>
                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    <TextField
                      id="manager_first_name"
                      type="text"
                      variant="standard"
                      label="First Name"
                      style={{ marginRight: 15 }}
                      value={firstName}
                      onChange={handleChange}
                    />
                    <TextField
                      id="manager_last_name"
                      type="text"
                      variant="standard"
                      label="Last Name"
                      value={lastName}
                      onChange={handleChange}
                    />
                  </div>
                  <TextField
                    id="manager_username"
                    type="text"
                    fullWidth
                    variant="standard"
                    label="Manager Username"
                    value={username}
                    onChange={handleChange}
                  />
                  <TextField
                    id="manager_id"
                    type="text"
                    fullWidth
                    variant="standard"
                    label="Manager ID"
                    value={empID}
                    onChange={handleChange}
                  />
                  <TextField
                    id="manager_department_code"
                    type="text"
                    fullWidth
                    variant="standard"
                    label="Manager Department"
                    value={department}
                    onChange={handleChange}
                  />
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Date of Birth"
                      value={value}
                      onChange={(newValue) => {
                        setValue(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Joining Date"
                      value={joiningDate}
                      onChange={(newValue) => {
                        setJoiningDate(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                  <TextField
                    id="manager_number"
                    type="tel"
                    fullWidth
                    variant="standard"
                    label="Manager Phone Number"
                    value={phoneNumber}
                    onChange={handleChange}
                  />
                  <Divider />
                  <Typography>Address</Typography>
                  <TextField
                    id="manager_flat"
                    type="text"
                    fullWidth
                    variant="standard"
                    label="Flat, House no., Building, Company, Apartment"
                    value={flat}
                    onChange={handleChange}
                  />
                  <TextField
                    id="manager_town"
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
                      {/* <MenuItem value="">
                          <em>None</em>
                        </MenuItem> */}
                      {getStates("in").map((state, idx) => {
                        return <MenuItem value={state}>{state}</MenuItem>;
                      })}
                    </Select>
                  </FormControl>
                  {/* TODO */}
                  {/* Joining Date DatePicker */}
                </Stack>
              </form>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={handleAddManager}>
                Add
              </Button>
              <Button color="error" onClick={handleClose}>
                Cancel
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer}>
          <Container maxWidth="lg" className={classes.container}>
            <ProtectedRoute path="/admin" exact>
              <Grid container spacing={3} justifyContent="space-around">
                <Grid item xs={12} md={4} lg={3}>
                  {/* Total NUmber of Employees */}
                  <Card style={{ textAlign: "center" }}>
                    <CardContent>
                      <Typography
                        style={{ fontSize: 16 }}
                        color="textSecondary"
                      >
                        Number of Employees
                      </Typography>
                      <Typography variant="h5" component="div">
                        {numOfEmployees !== null ? (
                          numOfEmployees
                        ) : (
                          <Gutter w="30px" h="30px" ml="110px" mt="3.2px" />
                        )}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4} lg={3}>
                  <Card style={{ textAlign: "center" }}>
                    <CardContent>
                      <Typography
                        style={{ fontSize: 16 }}
                        color="textSecondary"
                      >
                        Number of Departments
                      </Typography>
                      <Typography variant="h5" component="div">
                        {numOfDepartments !== null ? (
                          numOfDepartments
                        ) : (
                          <Gutter w="30px" h="30px" ml="110px" mt="3.2px" />
                        )}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                  <Card style={{ textAlign: "center" }}>
                    <CardContent>
                      <Typography
                        style={{ fontSize: 16 }}
                        color="textSecondary"
                      >
                        Number of Leave Types
                      </Typography>
                      <Typography variant="h5" component="div">
                        {numOfLeaveTypes !== null ? (
                          numOfLeaveTypes
                        ) : (
                          <Gutter w="30px" h="30px" ml="160px" />
                        )}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4} lg={12}>
                  <EmployeeTable
                    role="admin"
                    leaves={leaves}
                    webSocket={webSocket}
                    fetchLeaves={fetchLeaves}
                  />
                </Grid>
              </Grid>
            </ProtectedRoute>
            <ProtectedRoute path="/admin/profile" exact>
              <UserProfilePage />
            </ProtectedRoute>
            <ProtectedRoute path="/admin/mng-dpt" exact>
              <ManageDepartment fetchNumOfDepts={fetchNumOfDepts} />
            </ProtectedRoute>
            <ProtectedRoute path="/admin/mng-leave-type" exact>
              <ManageLeaveType fetchNumOfLeaveTypes={fetchNumOfLeaveTypes} />
            </ProtectedRoute>
            <ProtectedRoute path="/admin/mng-emp" exact>
              <ManageEmployee
                fetchNumOfEmployees={fetchNumOfEmployees}
                fetchLeaves={fetchLeaves}
              />
            </ProtectedRoute>
            <ProtectedRoute path="/admin/settings" exact>
              <SettingsPage role="admin" />
            </ProtectedRoute>
            <Route path="/admin/change-password" exact>
              <ChangePassword />
            </Route>
            <Route path="/admin/leave-calendar" exact>
              <LeaveCalendar leaves={allLeaves} />
            </Route>
            <Route path="/admin/report-generation" exact>
              <ReportGeneration />
            </Route>
          </Container>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
