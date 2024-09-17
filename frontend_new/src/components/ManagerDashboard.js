import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useState, useEffect } from "react";
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
  CardContent,
} from "@material-ui/core";
import { Badge, IconButton } from "@mui/material";
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
import ManageEmployee from "./ManageEmployee";
import ManagerNotificationsMenu from "./ManagerNotificationsMenu";
import NotificationsMenu from "./NotificationsMenu";
import { logout, useAuthDispatch, useAuthState } from "../context";
import useDocumentTitle from "./useDocumentTitle";
import ChangePassword from "./ChangePassword";
import LeaveCalendar from "./LeaveCalendar";

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

function ManagerDashboard(props) {
  useDocumentTitle("ELMS   |   Manager");
  let history = useHistory();
  let dispatch = useAuthDispatch();

  const { user } = useAuthState();

  const classes = useStyles();

  const [open, setOpen] = useState(true);
  const [notifications, setNotifications] = useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [numOfEmployees, setNumOfEmployees] = useState(null);
  const [numOfDepartments, setNumOfDepartments] = useState(null);
  const [numOfLeaveTypes, setNumOfLeaveTypes] = useState(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notificationsAnchorEl, setNotificaionsAnchorEl] = useState(false);
  const [leaves, setLeaves] = useState([]);
  const [allLeaves, setAllLeaves] = useState([]);

  useEffect(() => {
    fetchNumOfEmployees();
    fetchNumOfDepts();
    fetchNumOfLeaveTypes();
    fetchLeaves();
    fetchAllLeaves();
    webSocket = new WebSocket("ws://127.0.0.1:8000/ws/update-user");
    webSocket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.manager) fetchLeaves();
    };
    webSocket.onclose = function (e) {
      console.error("Chat socket closed unexpectedly");
    };
  }, []);

  const fetchLeaves = () => {
    fetch(`http://127.0.0.1:8000/leaves/get-manager-leaves/${user.username}/`)
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

  const fetchNumOfEmployees = () => {
    fetch("http://127.0.0.1:8000/accounts/number-employees/")
      .then((res) => res.json())
      .then((data) => {
        setNumOfEmployees(data.length);
      });
  };

  const fetchNumOfDepts = () => {
    fetch("http://127.0.0.1:8000/dept/number-dept")
      .then((response) => response.json())
      .then((data) => {
        setNumOfDepartments(data.length);
      });
  };

  const fetchNumOfLeaveTypes = () => {
    fetch("http://127.0.0.1:8000/leave-types/number-leave-types")
      .then((response) => response.json())
      .then((data) => {
        setNumOfLeaveTypes(data.length);
      });
  };

  // const getUser = () =>
  //   localStorage.getItem("currentUser")
  //     ? JSON.parse(localStorage.getItem("currentUser")).user
  //     : "";
  // const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

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

  const handleME = (e) => {
    history.push("/manager/mng-emp");
  };

  const handleML = (e) => {
    history.push("/manager/mng-leave-type");
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleViewLeaveCalendar = () => {
    history.push("/manager/leave-calendar");
  };

  // const handleProfileClick = () => {
  //   setIsMenuOpen(false);
  //   history.push("/manager/profile");
  // };

  const handleDashboardClick = () => {
    history.push("/manager/");
  };

  const handleAddDeparmentClick = () => {
    history.push("/manager/mng-dpt");
  };

  const handleSettignsClick = () => {
    setIsMenuOpen(false);
    history.push("/manager/settings");
  };

  const handleLogoutClick = async () => {
    await logout(dispatch, { username: user.username, webSocket: webSocket });
    history.push("/login");
  };

  const handleNotificationClick = (e) => {
    e.preventDefault();
    setNotificaionsAnchorEl(e.currentTarget);
    setIsNotificationsOpen(true);
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
            LMS Dashboard (Manager)
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
        </List>
        <Divider />
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer}>
          <Container maxWidth="lg" className={classes.container}>
            <Route path="/manager/" exact>
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
                    role="manager"
                    leaves={leaves}
                    webSocket={webSocket}
                    fetchLeaves={fetchLeaves}
                  />
                </Grid>
              </Grid>
            </Route>
            <Route path="/manager/profile" exact>
              <UserProfilePage />
            </Route>
            <Route path="/manager/mng-dpt" exact>
              <ManageDepartment fetchNumOfDepts={fetchNumOfDepts} />
            </Route>
            <Route path="/manager/mng-leave-type" exact>
              <ManageLeaveType fetchNumOfLeaveTypes={fetchNumOfLeaveTypes} />
            </Route>
            <Route path="/manager/mng-emp" exact>
              <ManageEmployee
                fetchNumOfEmployees={fetchNumOfEmployees}
                fetchLeaves={fetchLeaves}
              />
            </Route>
            <Route path="/manager/settings" exact>
              <SettingsPage role="manager" />
            </Route>
            <Route path="/manager/change-password" exact>
              <ChangePassword />
            </Route>
            <Route path="/manager/leave-calendar" exact>
              <LeaveCalendar leaves={allLeaves} />
            </Route>
          </Container>
        </div>
      </main>
    </div>
  );
}

export default ManagerDashboard;
