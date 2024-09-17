import React, { useState, useEffect } from "react";
import { Menu, MenuItem } from "@mui/material";
import { useAuthState } from "../context";

function AdminNotificationsMenu({
  open,
  anchorEl,
  handleNotificationsMenuClose,
}) {
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuthState();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = () => {
    fetch(
      `http://127.0.0.1:8000/notifications/get-notifications/${user.username}/`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("====================================");
        console.log(data);
        console.log("====================================");
      });
  };

  return (
    <Menu
      open={open}
      elevation={0}
      anchorEl={anchorEl}
      keepMounted
      //   anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id="primary-profile-notifications-menu"
      //   transformOrigin={{ vertical: "top", horizontal: "center" }}
      onClose={handleNotificationsMenuClose}
      style={{
        marginTop: -755,
        marginLeft: 1450,
      }}
    >
      <MenuItem>Item1Item1Item1Item1Item1Item1Item1Item1Item1Item1</MenuItem>
      <MenuItem>Item2</MenuItem>
      <MenuItem>Item3</MenuItem>
    </Menu>
  );
}

export default AdminNotificationsMenu;
