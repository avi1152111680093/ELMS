import {
  Button,
  CssBaseline,
  TextField,
  Link,
  Box,
  Typography,
  Container,
  Snackbar,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import Cookies from "js-cookie";
import { InputLabel, Select, MenuItem, FormControl } from "@mui/material";
import { loginUser, useAuthState, useAuthDispatch } from "../context";
import useDocumentTitle from "./useDocumentTitle";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        IIT Goa ELMS
      </Link>{" "}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

let webSocket;

function LoginPage(props) {
  useDocumentTitle("Login");
  const CSRFToken = () => {
    return <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />;
  };
  const csrftoken = Cookies.get("csrftoken");
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useAuthDispatch();
  const { loading, errorMessage } = useAuthState();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    webSocket = new WebSocket("ws://127.0.0.1:8000/ws/update-user");
    webSocket.onclose = function (e) {
      console.error("Chat socket closed unexpectedly");
    };
  }, []);

  const handleSubmitButton = async (e) => {
    e.preventDefault();

    const payload = { username, password, role };

    try {
      let response = await loginUser(dispatch, payload);
      if (!response.user) {
        setOpen(true);
        return;
      }
      if (response.user.is_employee) {
        // Update the Dashboard of Admin and Employee when an Employee
        // logs in, to show the online symbol for that Employee
        webSocket.send(
          JSON.stringify({
            action: "UPDATE",
            employee: false,
            admin: true,
            manager: true,
          })
        );
        // After updating the dashboard of Admin and Manager, we navigate to url '/employee'
        history.push("/employee");
      } else if (response.user.is_admin) history.push("/admin");
      else history.push("/manager");
    } catch (error) {
      console.log(error + " here");
    }
  };
  const handleSnackbarClose = () => {
    setOpen(false);
  };
  const handleChange = (e) => {
    if (e.target.id === "username") setUsername(e.target.value);
    else setPassword(e.target.value);
  };
  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <img
            src="https://upload.wikimedia.org/wikipedia/en/thumb/a/a7/Indian_Institute_of_Technology_Goa_Logo.svg/1200px-Indian_Institute_of_Technology_Goa_Logo.svg.png"
            alt=""
            height={150}
            width={150}
          />
          <Typography component="h1" variant="h5">
            ELMS Sign In
          </Typography>
          <form
            className={classes.form}
            noValidate
            method="POST"
            action="/login"
          >
            <CSRFToken />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={handleChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={handleChange}
            />
            <FormControl fullWidth required>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                value={role}
                label="Role"
                onChange={handleRoleChange}
                margin="normal"
                required
              >
                <MenuItem value={0}>Employee</MenuItem>
                <MenuItem value={1}>Admin</MenuItem>
                <MenuItem value={2}>Manager</MenuItem>
              </Select>
            </FormControl>
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleSubmitButton}
              disabled={loading}
            >
              Sign In
            </Button>
            {/* <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
            </Grid> */}
          </form>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={open}
          onClose={handleSnackbarClose}
          key={"topcenter"}
          autoHideDuration={2000}
        >
          <Alert
            variant="filled"
            severity="error"
            onClose={handleSnackbarClose}
          >
            {errorMessage}
          </Alert>
        </Snackbar>
      </Container>
      )
    </>
  );
}

export default LoginPage;
