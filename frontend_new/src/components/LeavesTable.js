import React, { useEffect, useState } from "react";
import { useAuthDispatch, useAuthState } from "../context";
import {
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  TableFooter,
  TablePagination,
  TableContainer,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  Typography,
  Button,
  Badge,
  DialogContent,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { Close, HourglassBottom, Done, Message } from "@mui/icons-material";
import { updateUser } from "../context/actions";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  messageContainer: {
    minHeight: 200,
  },
  message: {
    marginBottom: 10,
  },
  messageFrom: {
    fontWeight: "bold",
  },
  messageText: {
    padding: 10,
    background: "blue",
    borderRadius: 10,
    color: "white",
  },
}));

function LeavesTable({ leaves, fetchLeaves, webSocket }) {
  const classes = useStyles();
  let dispatch = useAuthDispatch();
  let { user } = useAuthState();

  useEffect(() => {}, [leaves]);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [open, setOpen] = useState(false);
  const [cancelLeaveID, setCancelLeaveID] = useState(null);
  const [chatShow, setChatShow] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatLeaveId, setChatLeaveID] = useState(null);

  const handleChatBoxOpen = (leaveId) => {
    setChatLeaveID(leaveId);
    console.log("====================================");
    console.log(leaveId);
    console.log("====================================");
    fetch(`http://127.0.0.1:8000/msgs/${leaveId}`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
      });
    setChatShow(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCancelLeave = () => {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: user.username,
        leave_id: cancelLeaveID,
      }),
    };

    fetch("http://127.0.0.1:8000/leaves/delete-leave/", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        webSocket.send(
          JSON.stringify({
            action: "UPDATE",
            admin: true,
            employee: false,
            manager: false,
          })
        );
        updateUser(dispatch, { username: user.username });
        fetchLeaves();
        setOpen(false);
      });
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ marginTop: 5 }}>
        <Table style={{ minWidth: "500px" }}>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: "bolder" }}>S. No.</TableCell>
              <TableCell style={{ fontWeight: "bolder" }} align="left">
                Leave ID
              </TableCell>
              <TableCell style={{ fontWeight: "bolder" }}>Leave Type</TableCell>
              <TableCell style={{ fontWeight: "bolder" }}>Applied On</TableCell>
              <TableCell style={{ fontWeight: "bolder" }}>From</TableCell>
              <TableCell style={{ fontWeight: "bolder" }}>To</TableCell>
              <TableCell style={{ fontWeight: "bolder" }}>Admin</TableCell>
              <TableCell style={{ fontWeight: "bolder" }}>Manager</TableCell>
              <TableCell style={{ fontWeight: "bolder" }}>Cancel</TableCell>
              <TableCell style={{ fontWeight: "bolder" }}>Messages</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? leaves.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : leaves
            ).map((leave, idx) => (
              <TableRow key={leave.id}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{leave.id}</TableCell>
                <TableCell>{leave.leave_type}</TableCell>
                <TableCell>{leave.applied_on.substr(0, 10)}</TableCell>
                <TableCell>{leave.from_date}</TableCell>
                <TableCell>{leave.to_date}</TableCell>
                <TableCell style={{ paddingLeft: "25px" }}>
                  {leave.waiting_approval ? (
                    <HourglassBottom color="warning" />
                  ) : leave.admin_approved ? (
                    <Done color="success" />
                  ) : (
                    <Close color="error" />
                  )}
                </TableCell>
                <TableCell style={{ paddingLeft: "32px" }}>
                  {leave.waiting_approval ? (
                    <HourglassBottom color="warning" />
                  ) : !leave.admin_approved ? (
                    <Close color="error" />
                  ) : leave.manager_rejected ? (
                    <Close color="error" />
                  ) : leave.manager_approved ? (
                    <Done color="success" />
                  ) : (
                    <HourglassBottom color="warning" />
                  )}
                </TableCell>
                <TableCell>
                  <IconButton
                    color="error"
                    onClick={() => {
                      setCancelLeaveID(leave.id);
                      setOpen(true);
                    }}
                    disabled={!leave.waiting_approval}
                  >
                    <CancelIcon />
                  </IconButton>
                  <Dialog
                    open={open}
                    onClose={() => {
                      setOpen(false);
                    }}
                  >
                    <IconButton
                      disableRipple
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      <Close
                        fontSize="small"
                        sx={{
                          marginLeft: 43.9,
                          // marginTop: 0.5,
                        }}
                      />
                    </IconButton>
                    <DialogTitle>
                      <Typography>
                        Do you want to cancel the Leave Application?
                      </Typography>
                    </DialogTitle>
                    <DialogActions>
                      <Button color="error" onClick={handleCancelLeave}>
                        Cancel
                      </Button>
                    </DialogActions>
                  </Dialog>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleChatBoxOpen(leave.id)}>
                    <Badge variant="dot" color="primary">
                      <Message />
                    </Badge>
                  </IconButton>
                  <Dialog open={chatShow} onClose={() => setChatShow(false)}>
                    <IconButton
                      disableRipple
                      onClick={() => {
                        setChatShow(false);
                      }}
                    >
                      <Close
                        fontSize="small"
                        sx={{
                          marginLeft: 43.9,
                          // marginTop: 0.5,
                        }}
                      />
                    </IconButton>
                    <DialogTitle>
                      <Typography>Leave ID: {chatLeaveId}</Typography>
                    </DialogTitle>
                    <DialogContent>
                      <div className={classes.messageContainer}>
                        {messages.map((msg, idx) => (
                          <div id={idx} className={classes.message}>
                            <div className={classes.messageFrom}>
                              {msg.msg_from}:
                            </div>
                            <div className={classes.messageText}>{msg.msg}</div>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, { label: "All", value: -1 }]}
                count={leaves.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onRowsPerPageChange={handleChangeRowsPerPage}
                onPageChange={handleChangePage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
}

export default LeavesTable;
