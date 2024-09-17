import React, { useEffect } from "react";
import {
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
  Paper,
} from "@mui/material";
import { Close, HourglassBottom, Done } from "@mui/icons-material";

function LeaveCalendarLeavesTable({ leaves }) {
  useEffect(() => {}, [leaves]);

  return (
    <TableContainer component={Paper} sx={{ marginTop: 5 }}>
      <Table style={{ minWidth: "500px" }}>
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: "bolder" }}>S. No.</TableCell>
            <TableCell style={{ fontWeight: "bolder" }} align="left">
              Leave ID
            </TableCell>
            <TableCell style={{ fontWeight: "bolder" }} align="left">
              Employee Name
            </TableCell>
            <TableCell style={{ fontWeight: "bolder" }}>Leave Type</TableCell>
            <TableCell style={{ fontWeight: "bolder" }}>From</TableCell>
            <TableCell style={{ fontWeight: "bolder" }}>To</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {leaves.map((leave, idx) => (
            <TableRow key={leave.id}>
              <TableCell>{idx + 1}</TableCell>
              <TableCell>{leave.id}</TableCell>
              <TableCell align="left">{leave.name}</TableCell>
              <TableCell>{leave.leave_type}</TableCell>
              <TableCell>{leave.from_date}</TableCell>
              <TableCell>{leave.to_date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default LeaveCalendarLeavesTable;
