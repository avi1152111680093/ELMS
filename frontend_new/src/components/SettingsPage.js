import React from "react";
import { Button } from "@mui/material";
import { useHistory } from "react-router-dom";

function SettingsPage({ role }) {
  let history = useHistory();

  return (
    <>
      <Button
        variant="contained"
        onClick={() => {
          history.push(`/${role}/change-password`);
        }}
      >
        Change Password
      </Button>
    </>
  );
}

export default SettingsPage;
