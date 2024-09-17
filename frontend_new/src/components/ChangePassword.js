import React, { useState } from "react";
import {
  Button,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuthState } from "../context";

const useStyles = makeStyles({
  textField: {
    width: 400,
  },
});

function ChangePassword() {
  let { user } = useAuthState();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [disabled, setDisabled] = useState(false);

  const validate = () => {
    if (!oldPassword) {
      setErrorMessage("Empty Old Password!");
      setOpen(true);
      return false;
    }

    if (!newPassword) {
      setErrorMessage("Empty New Password!");
      setOpen(true);
      return false;
    }

    if (!confirmNewPassword) {
      setErrorMessage("Empty Confirm New Password!");
      setOpen(true);
      return false;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMessage("Password does not match!");
      setOpen(true);
      return false;
    }

    return true;
  };

  const handlePasswordChange = (e) => {
    setDisabled(true);
    if (validate()) {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: user.username,
          old_password: oldPassword,
          new_password: newPassword,
        }),
      };
      fetch("http://127.0.0.1:8000/accounts/change-password/", requestOptions)
        .then((res) => res.json())
        .then((data) => {
          setDisabled(false);
          if (data.errorMessage) setErrorMessage(data.errorMessage);
          else setSuccessMessage(data.successMessage);
          setOpen(true);
          setTimeout(() => {
            setErrorMessage("");
            setSuccessMessage("");
          }, 2000);
        });
    } else setDisabled(false);
  };

  return (
    <>
      <form>
        <Typography variant="h5" sx={{ marginBottom: 3 }}>
          Change Password
        </Typography>
        <Typography variant="subtitle1" sx={{ marginBottom: 5 }}>
          Please provide with the Credentials below:
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Old Password"
            type={showOldPassword ? "text" : "password"}
            required
            //   error="Empty"
            onChange={(e) => {
              setOldPassword(e.target.value);
            }}
            className={classes.textField}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    tabIndex={-1}
                    aria-label="toggle password visibility"
                    onClick={() => {
                      setShowOldPassword(!showOldPassword);
                    }}
                    onMouseDown={() => {
                      setShowOldPassword(!showOldPassword);
                    }}
                  >
                    {showOldPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="New Password"
            required
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
            }}
            className={classes.textField}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    tabIndex={-1}
                    aria-label="toggle password visibility"
                    onClick={() => {
                      setShowNewPassword(!showNewPassword);
                    }}
                    onMouseDown={() => {
                      setShowNewPassword(!showNewPassword);
                    }}
                  >
                    {showNewPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Confirm New Password"
            required
            type={showConfirmNewPassword ? "text" : "password"}
            value={confirmNewPassword}
            onChange={(e) => {
              setConfirmNewPassword(e.target.value);
            }}
            className={classes.textField}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    tabIndex={-1}
                    aria-label="toggle password visibility"
                    onClick={() => {
                      setShowConfirmNewPassword(!showConfirmNewPassword);
                    }}
                    onMouseDown={() => {
                      setShowConfirmNewPassword(!showConfirmNewPassword);
                    }}
                  >
                    {showConfirmNewPassword ? (
                      <Visibility />
                    ) : (
                      <VisibilityOff />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>
        <Button
          sx={{
            marginTop: 3,
            color: "red",
          }}
          onClick={handlePasswordChange}
          disabled={disabled}
        >
          Set Password
        </Button>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          key={"topcenter"}
          autoHideDuration={2000}
        >
          <Alert
            variant="filled"
            severity={errorMessage ? "error" : "success"}
            onClose={() => {
              setOpen(false);
            }}
          >
            {errorMessage || successMessage}
          </Alert>
        </Snackbar>
      </form>
    </>
  );
}

export default ChangePassword;
