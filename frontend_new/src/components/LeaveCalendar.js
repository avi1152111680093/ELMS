import React, { useState, useEffect } from "react";
import { Divider, Typography, TextField } from "@mui/material";
import { useAuthState } from "../context";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
// import DatePicker from "@mui/lab/DatePicker";
import DatePicker from "sassy-datepicker";
import Calendar from "react-calendar";
import "./Calendar.css";
import LeaveCalendarLeavesTable from "./LeaveCalendarLeavesTable";

function LeaveCalendar({ leaves }) {
  const [leavesOnDate, setLeavesOnDate] = useState([]);

  useEffect(() => {
    console.log(leaves);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          alignSelf: "center",
          marginBottom: 10,
        }}
      >
        <DatePicker
          onChange={(date) => {
            setLeavesOnDate(
              leaves.filter(
                (leave) =>
                  leave.manager_approved &&
                  leave.applied_on.slice(0, 10) ==
                    date.toISOString().slice(0, 10)
              )
            );
          }}
        />
      </div>
      <Divider />
      <div>
        <LeaveCalendarLeavesTable leaves={leavesOnDate} />
      </div>
    </div>
  );
}

export default LeaveCalendar;
