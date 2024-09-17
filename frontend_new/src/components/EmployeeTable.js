import React, { useEffect, useState } from "react";
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
  Typography,
  IconButton,
  ButtonGroup,
  Dialog,
  DialogTitle,
  Button,
  DialogActions,
  Box,
  Tabs,
  Tab,
  Badge,
  DialogContent,
  TextField,
} from "@mui/material";
import {
  ClearOutlined,
  ArrowForward,
  Close,
  HourglassBottom,
  Done,
  FiberManualRecord,
  Message,
} from "@mui/icons-material";

function ApproveDialog(props) {
  const { open, onClose, role, id, webSocket, fetchLeaves } = props;

  const handleApprove = () => {
    // TODO: Go to database and change the status
    console.log("Approving leave with ID " + id);
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        leave_id: id,
      }),
    };

    fetch(`http://127.0.0.1:8000/leaves/leave-${role}-approve/`, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log("sending request from admin", {
          admin: role === "admin" ? false : true,
          employee: true,
          manager: role === "manager" ? false : true,
        });
        fetchLeaves();
        onClose();
        webSocket.send(
          JSON.stringify({
            action: "UPDATE",
            admin: role === "admin" ? false : true,
            employee: true,
            manager: role === "manager" ? false : true,
          })
        );
      });
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>
        {role === "manager" ? (
          <Typography>Do you want to approve the Leave Application?</Typography>
        ) : (
          <Typography>
            Do you want to forward the Leave Application to Manager?
          </Typography>
        )}
      </DialogTitle>
      <DialogActions>
        <Button color="success" onClick={handleApprove}>
          {role === "manager" ? "Approve" : "Forward"}
        </Button>
        <Button color="warning" onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function RejectDialog(props) {
  const { open, onClose, role, id, webSocket, fetchLeaves } = props;

  const handleReject = () => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        leave_id: id,
      }),
    };

    fetch(`http://127.0.0.1:8000/leaves/leave-${role}-reject/`, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        webSocket.send(
          JSON.stringify({
            action: "UPDATE",
            employee: true,
            admin: role === "admin" ? false : true,
            manager: role === "manager" ? false : true,
          })
        );
        fetchLeaves();
        onClose();
      });
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>
        <Typography>Do you want to reject the Leave Application?</Typography>
      </DialogTitle>
      <DialogActions>
        <Button color="error" onClick={handleReject}>
          Reject
        </Button>
        <Button color="warning" onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function SendMessageDialog(props) {
  const { open, onClose, role, leave_id } = props;
  const [msg, setMsg] = useState("");

  const handleMessageSend = () => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        msg,
        from: role,
        leave_id,
      }),
    };
    fetch("http://127.0.0.1:8000/msgs/send", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        onClose();
        setMsg("");
      });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Send Message</DialogTitle>
      <DialogContent>
        <TextField
          value={msg}
          label="Message"
          multiline
          fullWidth
          onChange={(e) => {
            setMsg(e.target.value);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleMessageSend}>
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function EmployeeTable(props) {
  // let { user } = useAuthState();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page0, setPage0] = React.useState(0);
  const [rowsPerPage0, setRowsPerPage0] = React.useState(5);
  const [page1, setPage1] = React.useState(0);
  const [rowsPerPage1, setRowsPerPage1] = React.useState(5);
  const [page2, setPage2] = React.useState(0);
  const [rowsPerPage2, setRowsPerPage2] = React.useState(5);
  const [approveDialog, setApproveDialog] = React.useState(false);
  const [rejectDialog, setrejectDialog] = React.useState(false);
  const [sendMessageDialog, setSendMessageDialog] = useState(false);
  const [leaveID, setLeaveID] = useState(null);
  const [value, setValue] = React.useState(0);
  let waitingAdminLeaves;
  // waitingManagerLeaves,
  let approvedAdminLeaves;
  // approvedManagerLeaves,
  // rejectedAdminLeaves,
  // rejectedManagerLeaves;

  useEffect(() => {
    waitingAdminLeaves = props.leaves.filter((el) => el.waiting_approval);
    approvedAdminLeaves = props.leaves.filter((el) => el.manager_approved);
    console.log(approvedAdminLeaves);
    // console.log(props.leaves[1].id);
  }, [props.leaves]);

  const sendMessageDialogClose = () => {
    setSendMessageDialog(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangePage0 = (event, newPage) => {
    setPage0(newPage);
  };

  const handleChangePage1 = (event, newPage) => {
    setPage1(newPage);
  };

  const handleChangePage2 = (event, newPage) => {
    setPage2(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeRowsPerPage0 = (event) => {
    setRowsPerPage0(parseInt(event.target.value, 10));
    setPage0(0);
  };

  const handleChangeRowsPerPage1 = (event) => {
    setRowsPerPage1(parseInt(event.target.value, 10));
    setPage1(0);
  };

  const handleChangeRowsPerPage2 = (event) => {
    setRowsPerPage2(parseInt(event.target.value, 10));
    setPage2(0);
  };

  const handleApproveButton = (e) => {
    setApproveDialog(true);
  };

  const handleRejectButton = (e) => {
    setrejectDialog(true);
  };

  const handleClose = () => {
    if (approveDialog) setApproveDialog(false);
    if (rejectDialog) setrejectDialog(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", marginTop: 10 }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Waiting Applications" {...a11yProps(0)} />
          <Tab label="Accepted Applications" {...a11yProps(1)} />
          <Tab label="Rejected Applications" {...a11yProps(2)} />
          <Tab label="All Applications" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <TableContainer component={Paper}>
          <Table style={{ minWidth: "500px" }}>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: "bolder" }}>S. No.</TableCell>
                <TableCell style={{ fontWeight: "bolder" }} align="left">
                  Employee Name
                </TableCell>
                <TableCell style={{ fontWeight: "bolder" }}>
                  Leave Type
                </TableCell>
                <TableCell style={{ fontWeight: "bolder" }}>
                  Applied On
                </TableCell>
                <TableCell style={{ fontWeight: "bolder" }}>From</TableCell>
                <TableCell style={{ fontWeight: "bolder" }}>To</TableCell>
                <TableCell style={{ fontWeight: "bolder" }}>Admin</TableCell>
                <TableCell style={{ fontWeight: "bolder" }}>Manager</TableCell>
                {props.role === "manager" ? (
                  <TableCell style={{ fontWeight: "bolder" }}>
                    Approve/Reject
                  </TableCell>
                ) : (
                  <TableCell style={{ fontWeight: "bolder" }}>
                    Forward/Reject
                  </TableCell>
                )}
                <TableCell style={{ fontWeight: "bolder" }}>
                  Send Message
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage0 > 0
                ? props.leaves.slice(
                    page0 * rowsPerPage0,
                    page0 * rowsPerPage0 + rowsPerPage0
                  )
                : props.leaves
              ).map((row, idx) =>
                props.role === "admin" && row.waiting_approval ? (
                  <>
                    <TableRow>
                      <TableCell>{row.id}</TableCell>
                      <TableCell align="left">
                        {row.is_online ? (
                          <FiberManualRecord
                            color="success"
                            sx={
                              {
                                // width: 0.045,
                                // height: 0.045,
                              }
                            }
                          />
                        ) : (
                          <FiberManualRecord
                            color="disabled"
                            sx={
                              {
                                // width: 0.045,
                                // height: 0.045,
                              }
                            }
                          />
                        )}
                        {row.name}
                      </TableCell>
                      <TableCell>{row.leave_type}</TableCell>
                      <TableCell>{row.applied_on.substr(0, 10)}</TableCell>
                      <TableCell>{row.from_date}</TableCell>
                      <TableCell>{row.to_date}</TableCell>
                      <TableCell style={{ paddingLeft: "25px" }}>
                        {row.waiting_approval ? (
                          <HourglassBottom color="warning" />
                        ) : row.admin_approved ? (
                          <Done color="success" />
                        ) : (
                          <Close color="error" />
                        )}
                      </TableCell>
                      <TableCell style={{ paddingLeft: "32px" }}>
                        {row.waiting_approval ? (
                          <HourglassBottom color="warning" />
                        ) : !row.admin_approved ? (
                          <Close color="error" />
                        ) : row.manager_rejected ? (
                          <Close color="error" />
                        ) : row.manager_approved ? (
                          <Done color="success" />
                        ) : (
                          <HourglassBottom color="warning" />
                        )}
                      </TableCell>
                      {props.role === "manager" ? (
                        <TableCell align="center">
                          {!row.manager_rejected && !row.manager_approved ? (
                            <ButtonGroup variant="contained">
                              <IconButton
                                color="success"
                                onClick={() => {
                                  setLeaveID(row.id);
                                  handleApproveButton();
                                }}
                              >
                                <ArrowForward />
                              </IconButton>
                              <ApproveDialog
                                open={approveDialog}
                                onClose={handleClose}
                                role="manager"
                                id={leaveID}
                                webSocket={props.webSocket}
                                fetchLeaves={props.fetchLeaves}
                              />
                              <IconButton
                                color="error"
                                onClick={() => {
                                  setLeaveID(row.id);
                                  handleRejectButton();
                                }}
                              >
                                <ClearOutlined />
                              </IconButton>
                              <RejectDialog
                                open={rejectDialog}
                                onClose={handleClose}
                                id={leaveID}
                                role="manager"
                                webSocket={props.webSocket}
                                fetchLeaves={props.fetchLeaves}
                              />
                            </ButtonGroup>
                          ) : row.manager_approved ? (
                            <Typography color="green">Approved</Typography>
                          ) : (
                            <Typography color="red">Rejected</Typography>
                          )}
                        </TableCell>
                      ) : (
                        <TableCell align="center">
                          {row.waiting_approval ? (
                            <ButtonGroup variant="contained">
                              <IconButton
                                color="success"
                                onClick={() => {
                                  setLeaveID(row.id);
                                  handleApproveButton();
                                }}
                              >
                                <ArrowForward />
                              </IconButton>
                              <ApproveDialog
                                open={approveDialog}
                                onClose={handleClose}
                                role="admin"
                                id={leaveID}
                                webSocket={props.webSocket}
                                fetchLeaves={props.fetchLeaves}
                              />
                              <IconButton
                                color="error"
                                onClick={() => {
                                  setLeaveID(row.id);
                                  handleRejectButton();
                                }}
                              >
                                <ClearOutlined />
                              </IconButton>
                              <RejectDialog
                                open={rejectDialog}
                                onClose={handleClose}
                                id={leaveID}
                                role="admin"
                                webSocket={props.webSocket}
                                fetchLeaves={props.fetchLeaves}
                              />
                            </ButtonGroup>
                          ) : row.manager_approved ? (
                            <Typography color="green">Accepted</Typography>
                          ) : row.manager_rejected ? (
                            <Typography color="red">Rejected</Typography>
                          ) : row.admin_approved ? (
                            <Typography color="green">Forwarded</Typography>
                          ) : (
                            <Typography color="red">Rejected</Typography>
                          )}
                        </TableCell>
                      )}
                      <TableCell align="center">
                        <IconButton
                          onClick={() => {
                            setSendMessageDialog(true);
                          }}
                        >
                          <Message />
                        </IconButton>
                        <SendMessageDialog
                          open={sendMessageDialog}
                          onClose={sendMessageDialogClose}
                          role="admin"
                          leave_id={row.id}
                        />
                      </TableCell>
                    </TableRow>
                  </>
                ) : (
                  props.role === "manager" &&
                  !row.manager_approved &&
                  !row.manager_rejected && (
                    <TableRow>
                      <TableCell>{row.id}</TableCell>
                      <TableCell align="left">
                        {row.is_online ? (
                          <FiberManualRecord
                            color="success"
                            sx={
                              {
                                // width: 0.045,
                                // height: 0.045,
                              }
                            }
                          />
                        ) : (
                          <FiberManualRecord
                            color="disabled"
                            sx={
                              {
                                // width: 0.045,
                                // height: 0.045,
                              }
                            }
                          />
                        )}
                        {row.name}
                      </TableCell>
                      <TableCell>{row.leave_type}</TableCell>
                      <TableCell>{row.applied_on.substr(0, 10)}</TableCell>
                      <TableCell>{row.from_date}</TableCell>
                      <TableCell>{row.to_date}</TableCell>
                      <TableCell style={{ paddingLeft: "25px" }}>
                        {row.waiting_approval ? (
                          <HourglassBottom color="warning" />
                        ) : row.admin_approved ? (
                          <Done color="success" />
                        ) : (
                          <Close color="error" />
                        )}
                      </TableCell>
                      <TableCell style={{ paddingLeft: "32px" }}>
                        {row.waiting_approval ? (
                          <HourglassBottom color="warning" />
                        ) : !row.admin_approved ? (
                          <Close color="error" />
                        ) : row.manager_rejected ? (
                          <Close color="error" />
                        ) : row.manager_approved ? (
                          <Done color="success" />
                        ) : (
                          <HourglassBottom color="warning" />
                        )}
                      </TableCell>
                      {props.role === "manager" ? (
                        <TableCell align="center">
                          {!row.manager_rejected && !row.manager_approved ? (
                            <ButtonGroup variant="contained">
                              <IconButton
                                color="success"
                                onClick={() => {
                                  setLeaveID(row.id);
                                  handleApproveButton();
                                }}
                              >
                                <ArrowForward />
                              </IconButton>
                              <ApproveDialog
                                open={approveDialog}
                                onClose={handleClose}
                                role="manager"
                                id={leaveID}
                                webSocket={props.webSocket}
                                fetchLeaves={props.fetchLeaves}
                              />
                              <IconButton
                                color="error"
                                onClick={() => {
                                  setLeaveID(row.id);
                                  handleRejectButton();
                                }}
                              >
                                <ClearOutlined />
                              </IconButton>
                              <RejectDialog
                                open={rejectDialog}
                                onClose={handleClose}
                                id={leaveID}
                                role="manager"
                                webSocket={props.webSocket}
                                fetchLeaves={props.fetchLeaves}
                              />
                            </ButtonGroup>
                          ) : row.manager_approved ? (
                            <Typography color="green">Approved</Typography>
                          ) : (
                            <Typography color="red">Rejected</Typography>
                          )}
                        </TableCell>
                      ) : (
                        <TableCell align="center">
                          {row.waiting_approval ? (
                            <ButtonGroup variant="contained">
                              <IconButton
                                color="success"
                                onClick={() => {
                                  setLeaveID(row.id);
                                  handleApproveButton();
                                }}
                              >
                                <ArrowForward />
                              </IconButton>
                              <ApproveDialog
                                open={approveDialog}
                                onClose={handleClose}
                                role="admin"
                                id={leaveID}
                                webSocket={props.webSocket}
                                fetchLeaves={props.fetchLeaves}
                              />
                              <IconButton
                                color="error"
                                onClick={() => {
                                  setLeaveID(row.id);
                                  handleRejectButton();
                                }}
                              >
                                <ClearOutlined />
                              </IconButton>
                              <RejectDialog
                                open={rejectDialog}
                                onClose={handleClose}
                                id={leaveID}
                                role="admin"
                                webSocket={props.webSocket}
                                fetchLeaves={props.fetchLeaves}
                              />
                            </ButtonGroup>
                          ) : row.manager_approved ? (
                            <Typography color="green">Accepted</Typography>
                          ) : row.manager_rejected ? (
                            <Typography color="red">Rejected</Typography>
                          ) : row.admin_approved ? (
                            <Typography color="green">Forwarded</Typography>
                          ) : (
                            <Typography color="red">Rejected</Typography>
                          )}
                        </TableCell>
                      )}
                      <TableCell align="center">
                        <IconButton
                          onClick={() => {
                            setSendMessageDialog(true);
                          }}
                        >
                          <Message />
                        </IconButton>
                        <SendMessageDialog
                          open={sendMessageDialog}
                          onClose={sendMessageDialogClose}
                          role="manager"
                          leave_id={row.id}
                        />
                      </TableCell>
                    </TableRow>
                  )
                )
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, { label: "All", value: -1 }]}
                  count={props.leaves.length}
                  rowsPerPage={rowsPerPage0}
                  page={page0}
                  onRowsPerPageChange={handleChangeRowsPerPage0}
                  onPageChange={handleChangePage0}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <TableContainer component={Paper}>
          <Table style={{ minWidth: "500px" }}>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: "bolder" }}>S. No.</TableCell>
                <TableCell style={{ fontWeight: "bolder" }} align="left">
                  Employee Name
                </TableCell>
                <TableCell style={{ fontWeight: "bolder" }}>
                  Leave Type
                </TableCell>
                <TableCell style={{ fontWeight: "bolder" }}>
                  Applied On
                </TableCell>
                <TableCell style={{ fontWeight: "bolder" }}>From</TableCell>
                <TableCell style={{ fontWeight: "bolder" }}>To</TableCell>
                <TableCell style={{ fontWeight: "bolder" }}>Admin</TableCell>
                <TableCell style={{ fontWeight: "bolder" }}>Manager</TableCell>
                {props.role === "manager" ? (
                  <TableCell style={{ fontWeight: "bolder" }}>
                    Approve/Reject
                  </TableCell>
                ) : (
                  <TableCell style={{ fontWeight: "bolder" }}>
                    Forward/Reject
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage1 > 0
                ? props.leaves.slice(
                    page1 * rowsPerPage1,
                    page1 * rowsPerPage1 + rowsPerPage1
                  )
                : props.leaves
              ).map((row, idx) =>
                props.role === "admin" && row.manager_approved ? (
                  <>
                    <TableRow>
                      <TableCell>{row.id}</TableCell>
                      <TableCell align="left">
                        {row.is_online ? (
                          <FiberManualRecord
                            color="success"
                            sx={
                              {
                                // width: 0.045,
                                // height: 0.045,
                              }
                            }
                          />
                        ) : (
                          <FiberManualRecord
                            color="disabled"
                            sx={
                              {
                                // width: 0.045,
                                // height: 0.045,
                              }
                            }
                          />
                        )}
                        {row.name}
                      </TableCell>
                      <TableCell>{row.leave_type}</TableCell>
                      <TableCell>{row.applied_on.substr(0, 10)}</TableCell>
                      <TableCell>{row.from_date}</TableCell>
                      <TableCell>{row.to_date}</TableCell>
                      <TableCell style={{ paddingLeft: "25px" }}>
                        {row.waiting_approval ? (
                          <HourglassBottom color="warning" />
                        ) : row.admin_approved ? (
                          <Done color="success" />
                        ) : (
                          <Close color="error" />
                        )}
                      </TableCell>
                      <TableCell style={{ paddingLeft: "32px" }}>
                        {row.waiting_approval ? (
                          <HourglassBottom color="warning" />
                        ) : !row.admin_approved ? (
                          <Close color="error" />
                        ) : row.manager_rejected ? (
                          <Close color="error" />
                        ) : row.manager_approved ? (
                          <Done color="success" />
                        ) : (
                          <HourglassBottom color="warning" />
                        )}
                      </TableCell>
                      {props.role === "manager" ? (
                        <TableCell align="center">
                          {!row.manager_rejected && !row.manager_approved ? (
                            <ButtonGroup variant="contained">
                              <IconButton
                                color="success"
                                onClick={() => {
                                  setLeaveID(row.id);
                                  handleApproveButton();
                                }}
                              >
                                <ArrowForward />
                              </IconButton>
                              <ApproveDialog
                                open={approveDialog}
                                onClose={handleClose}
                                role="manager"
                                id={leaveID}
                                webSocket={props.webSocket}
                                fetchLeaves={props.fetchLeaves}
                              />
                              <IconButton
                                color="error"
                                onClick={() => {
                                  setLeaveID(row.id);
                                  handleRejectButton();
                                }}
                              >
                                <ClearOutlined />
                              </IconButton>
                              <RejectDialog
                                open={rejectDialog}
                                onClose={handleClose}
                                id={leaveID}
                                role="manager"
                                webSocket={props.webSocket}
                                fetchLeaves={props.fetchLeaves}
                              />
                            </ButtonGroup>
                          ) : row.manager_approved ? (
                            <Typography color="green">Approved</Typography>
                          ) : (
                            <Typography color="red">Rejected</Typography>
                          )}
                        </TableCell>
                      ) : (
                        <TableCell align="center">
                          {row.waiting_approval ? (
                            <ButtonGroup variant="contained">
                              <IconButton
                                color="success"
                                onClick={() => {
                                  setLeaveID(row.id);
                                  handleApproveButton();
                                }}
                              >
                                <ArrowForward />
                              </IconButton>
                              <ApproveDialog
                                open={approveDialog}
                                onClose={handleClose}
                                role="admin"
                                id={leaveID}
                                webSocket={props.webSocket}
                                fetchLeaves={props.fetchLeaves}
                              />
                              <IconButton
                                color="error"
                                onClick={() => {
                                  setLeaveID(row.id);
                                  handleRejectButton();
                                }}
                              >
                                <ClearOutlined />
                              </IconButton>
                              <RejectDialog
                                open={rejectDialog}
                                onClose={handleClose}
                                id={leaveID}
                                role="admin"
                                webSocket={props.webSocket}
                                fetchLeaves={props.fetchLeaves}
                              />
                            </ButtonGroup>
                          ) : row.manager_approved ? (
                            <Typography color="green">Accepted</Typography>
                          ) : row.manager_rejected ? (
                            <Typography color="red">Rejected</Typography>
                          ) : row.admin_approved ? (
                            <Typography color="green">Forwarded</Typography>
                          ) : (
                            <Typography color="red">Rejected</Typography>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  </>
                ) : (
                  props.role === "manager" &&
                  row.manager_approved && (
                    <TableRow>
                      <TableCell>{row.id}</TableCell>
                      <TableCell align="left">
                        {row.is_online ? (
                          <FiberManualRecord
                            color="success"
                            sx={
                              {
                                // width: 0.045,
                                // height: 0.045,
                              }
                            }
                          />
                        ) : (
                          <FiberManualRecord
                            color="disabled"
                            sx={
                              {
                                // width: 0.045,
                                // height: 0.045,
                              }
                            }
                          />
                        )}
                        {row.name}
                      </TableCell>
                      <TableCell>{row.leave_type}</TableCell>
                      <TableCell>{row.applied_on.substr(0, 10)}</TableCell>
                      <TableCell>{row.from_date}</TableCell>
                      <TableCell>{row.to_date}</TableCell>
                      <TableCell style={{ paddingLeft: "25px" }}>
                        {row.waiting_approval ? (
                          <HourglassBottom color="warning" />
                        ) : row.admin_approved ? (
                          <Done color="success" />
                        ) : (
                          <Close color="error" />
                        )}
                      </TableCell>
                      <TableCell style={{ paddingLeft: "32px" }}>
                        {row.waiting_approval ? (
                          <HourglassBottom color="warning" />
                        ) : !row.admin_approved ? (
                          <Close color="error" />
                        ) : row.manager_rejected ? (
                          <Close color="error" />
                        ) : row.manager_approved ? (
                          <Done color="success" />
                        ) : (
                          <HourglassBottom color="warning" />
                        )}
                      </TableCell>
                      {props.role === "manager" ? (
                        <TableCell align="center">
                          {!row.manager_rejected && !row.manager_approved ? (
                            <ButtonGroup variant="contained">
                              <IconButton
                                color="success"
                                onClick={() => {
                                  setLeaveID(row.id);
                                  handleApproveButton();
                                }}
                              >
                                <ArrowForward />
                              </IconButton>
                              <ApproveDialog
                                open={approveDialog}
                                onClose={handleClose}
                                role="manager"
                                id={leaveID}
                                webSocket={props.webSocket}
                                fetchLeaves={props.fetchLeaves}
                              />
                              <IconButton
                                color="error"
                                onClick={() => {
                                  setLeaveID(row.id);
                                  handleRejectButton();
                                }}
                              >
                                <ClearOutlined />
                              </IconButton>
                              <RejectDialog
                                open={rejectDialog}
                                onClose={handleClose}
                                id={leaveID}
                                role="manager"
                                webSocket={props.webSocket}
                                fetchLeaves={props.fetchLeaves}
                              />
                            </ButtonGroup>
                          ) : row.manager_approved ? (
                            <Typography color="green">Approved</Typography>
                          ) : (
                            <Typography color="red">Rejected</Typography>
                          )}
                        </TableCell>
                      ) : (
                        <TableCell align="center">
                          {row.waiting_approval ? (
                            <ButtonGroup variant="contained">
                              <IconButton
                                color="success"
                                onClick={() => {
                                  setLeaveID(row.id);
                                  handleApproveButton();
                                }}
                              >
                                <ArrowForward />
                              </IconButton>
                              <ApproveDialog
                                open={approveDialog}
                                onClose={handleClose}
                                role="admin"
                                id={leaveID}
                                webSocket={props.webSocket}
                                fetchLeaves={props.fetchLeaves}
                              />
                              <IconButton
                                color="error"
                                onClick={() => {
                                  setLeaveID(row.id);
                                  handleRejectButton();
                                }}
                              >
                                <ClearOutlined />
                              </IconButton>
                              <RejectDialog
                                open={rejectDialog}
                                onClose={handleClose}
                                id={leaveID}
                                role="admin"
                                webSocket={props.webSocket}
                                fetchLeaves={props.fetchLeaves}
                              />
                            </ButtonGroup>
                          ) : row.manager_approved ? (
                            <Typography color="green">Accepted</Typography>
                          ) : row.manager_rejected ? (
                            <Typography color="red">Rejected</Typography>
                          ) : row.admin_approved ? (
                            <Typography color="green">Forwarded</Typography>
                          ) : (
                            <Typography color="red">Rejected</Typography>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  )
                )
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, { label: "All", value: -1 }]}
                  count={props.leaves.length}
                  rowsPerPage={rowsPerPage1}
                  page={page1}
                  onRowsPerPageChange={handleChangeRowsPerPage1}
                  onPageChange={handleChangePage1}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <TableContainer component={Paper}>
          <Table style={{ minWidth: "500px" }}>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: "bolder" }}>S. No.</TableCell>
                <TableCell style={{ fontWeight: "bolder" }} align="left">
                  Employee Name
                </TableCell>
                <TableCell style={{ fontWeight: "bolder" }}>
                  Leave Type
                </TableCell>
                <TableCell style={{ fontWeight: "bolder" }}>
                  Applied On
                </TableCell>
                <TableCell style={{ fontWeight: "bolder" }}>From</TableCell>
                <TableCell style={{ fontWeight: "bolder" }}>To</TableCell>
                <TableCell style={{ fontWeight: "bolder" }}>Admin</TableCell>
                <TableCell style={{ fontWeight: "bolder" }}>Manager</TableCell>
                {props.role === "manager" ? (
                  <TableCell style={{ fontWeight: "bolder" }}>
                    Approve/Reject
                  </TableCell>
                ) : (
                  <TableCell style={{ fontWeight: "bolder" }}>
                    Forward/Reject
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage2 > 0
                ? props.leaves.slice(
                    page2 * rowsPerPage2,
                    page2 * rowsPerPage2 + rowsPerPage2
                  )
                : props.leaves
              ).map((row, idx) =>
                props.role === "admin" &&
                (row.manager_rejected || !row.admin_approved) ? (
                  <>
                    <TableRow>
                      <TableCell>{row.id}</TableCell>
                      <TableCell align="left">
                        {row.is_online ? (
                          <FiberManualRecord
                            color="success"
                            sx={
                              {
                                // width: 0.045,
                                // height: 0.045,
                              }
                            }
                          />
                        ) : (
                          <FiberManualRecord
                            color="disabled"
                            sx={
                              {
                                // width: 0.045,
                                // height: 0.045,
                              }
                            }
                          />
                        )}
                        {row.name}
                      </TableCell>
                      <TableCell>{row.leave_type}</TableCell>
                      <TableCell>{row.applied_on.substr(0, 10)}</TableCell>
                      <TableCell>{row.from_date}</TableCell>
                      <TableCell>{row.to_date}</TableCell>
                      <TableCell style={{ paddingLeft: "25px" }}>
                        {row.waiting_approval ? (
                          <HourglassBottom color="warning" />
                        ) : row.admin_approved ? (
                          <Done color="success" />
                        ) : (
                          <Close color="error" />
                        )}
                      </TableCell>
                      <TableCell style={{ paddingLeft: "32px" }}>
                        {row.waiting_approval ? (
                          <HourglassBottom color="warning" />
                        ) : !row.admin_approved ? (
                          <Close color="error" />
                        ) : row.manager_rejected ? (
                          <Close color="error" />
                        ) : row.manager_approved ? (
                          <Done color="success" />
                        ) : (
                          <HourglassBottom color="warning" />
                        )}
                      </TableCell>
                      {props.role === "manager" ? (
                        <TableCell align="center">
                          {!row.manager_rejected && !row.manager_approved ? (
                            <ButtonGroup variant="contained">
                              <IconButton
                                color="success"
                                onClick={() => {
                                  setLeaveID(row.id);
                                  handleApproveButton();
                                }}
                              >
                                <ArrowForward />
                              </IconButton>
                              <ApproveDialog
                                open={approveDialog}
                                onClose={handleClose}
                                role="manager"
                                id={leaveID}
                                webSocket={props.webSocket}
                                fetchLeaves={props.fetchLeaves}
                              />
                              <IconButton
                                color="error"
                                onClick={() => {
                                  setLeaveID(row.id);
                                  handleRejectButton();
                                }}
                              >
                                <ClearOutlined />
                              </IconButton>
                              <RejectDialog
                                open={rejectDialog}
                                onClose={handleClose}
                                id={leaveID}
                                role="manager"
                                webSocket={props.webSocket}
                                fetchLeaves={props.fetchLeaves}
                              />
                            </ButtonGroup>
                          ) : row.manager_approved ? (
                            <Typography color="green">Approved</Typography>
                          ) : (
                            <Typography color="red">Rejected</Typography>
                          )}
                        </TableCell>
                      ) : (
                        <TableCell align="center">
                          {row.waiting_approval ? (
                            <ButtonGroup variant="contained">
                              <IconButton
                                color="success"
                                onClick={() => {
                                  setLeaveID(row.id);
                                  handleApproveButton();
                                }}
                              >
                                <ArrowForward />
                              </IconButton>
                              <ApproveDialog
                                open={approveDialog}
                                onClose={handleClose}
                                role="admin"
                                id={leaveID}
                                webSocket={props.webSocket}
                                fetchLeaves={props.fetchLeaves}
                              />
                              <IconButton
                                color="error"
                                onClick={() => {
                                  setLeaveID(row.id);
                                  handleRejectButton();
                                }}
                              >
                                <ClearOutlined />
                              </IconButton>
                              <RejectDialog
                                open={rejectDialog}
                                onClose={handleClose}
                                id={leaveID}
                                role="admin"
                                webSocket={props.webSocket}
                                fetchLeaves={props.fetchLeaves}
                              />
                            </ButtonGroup>
                          ) : row.manager_approved ? (
                            <Typography color="green">Accepted</Typography>
                          ) : row.manager_rejected ? (
                            <Typography color="red">Rejected</Typography>
                          ) : row.admin_approved ? (
                            <Typography color="green">Forwarded</Typography>
                          ) : (
                            <Typography color="red">Rejected</Typography>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  </>
                ) : (
                  props.role === "manager" &&
                  row.manager_rejected && (
                    <TableRow>
                      <TableCell>{row.id}</TableCell>
                      <TableCell align="left">
                        {row.is_online ? (
                          <FiberManualRecord
                            color="success"
                            sx={
                              {
                                // width: 0.045,
                                // height: 0.045,
                              }
                            }
                          />
                        ) : (
                          <FiberManualRecord
                            color="disabled"
                            sx={
                              {
                                // width: 0.045,
                                // height: 0.045,
                              }
                            }
                          />
                        )}
                        {row.name}
                      </TableCell>
                      <TableCell>{row.leave_type}</TableCell>
                      <TableCell>{row.applied_on.substr(0, 10)}</TableCell>
                      <TableCell>{row.from_date}</TableCell>
                      <TableCell>{row.to_date}</TableCell>
                      <TableCell style={{ paddingLeft: "25px" }}>
                        {row.waiting_approval ? (
                          <HourglassBottom color="warning" />
                        ) : row.admin_approved ? (
                          <Done color="success" />
                        ) : (
                          <Close color="error" />
                        )}
                      </TableCell>
                      <TableCell style={{ paddingLeft: "32px" }}>
                        {row.waiting_approval ? (
                          <HourglassBottom color="warning" />
                        ) : !row.admin_approved ? (
                          <Close color="error" />
                        ) : row.manager_rejected ? (
                          <Close color="error" />
                        ) : row.manager_approved ? (
                          <Done color="success" />
                        ) : (
                          <HourglassBottom color="warning" />
                        )}
                      </TableCell>
                      {props.role === "manager" ? (
                        <TableCell align="center">
                          {!row.manager_rejected && !row.manager_approved ? (
                            <ButtonGroup variant="contained">
                              <IconButton
                                color="success"
                                onClick={() => {
                                  setLeaveID(row.id);
                                  handleApproveButton();
                                }}
                              >
                                <ArrowForward />
                              </IconButton>
                              <ApproveDialog
                                open={approveDialog}
                                onClose={handleClose}
                                role="manager"
                                id={leaveID}
                                webSocket={props.webSocket}
                                fetchLeaves={props.fetchLeaves}
                              />
                              <IconButton
                                color="error"
                                onClick={() => {
                                  setLeaveID(row.id);
                                  handleRejectButton();
                                }}
                              >
                                <ClearOutlined />
                              </IconButton>
                              <RejectDialog
                                open={rejectDialog}
                                onClose={handleClose}
                                id={leaveID}
                                role="manager"
                                webSocket={props.webSocket}
                                fetchLeaves={props.fetchLeaves}
                              />
                            </ButtonGroup>
                          ) : row.manager_approved ? (
                            <Typography color="green">Approved</Typography>
                          ) : (
                            <Typography color="red">Rejected</Typography>
                          )}
                        </TableCell>
                      ) : (
                        <TableCell align="center">
                          {row.waiting_approval ? (
                            <ButtonGroup variant="contained">
                              <IconButton
                                color="success"
                                onClick={() => {
                                  setLeaveID(row.id);
                                  handleApproveButton();
                                }}
                              >
                                <ArrowForward />
                              </IconButton>
                              <ApproveDialog
                                open={approveDialog}
                                onClose={handleClose}
                                role="admin"
                                id={leaveID}
                                webSocket={props.webSocket}
                                fetchLeaves={props.fetchLeaves}
                              />
                              <IconButton
                                color="error"
                                onClick={() => {
                                  setLeaveID(row.id);
                                  handleRejectButton();
                                }}
                              >
                                <ClearOutlined />
                              </IconButton>
                              <RejectDialog
                                open={rejectDialog}
                                onClose={handleClose}
                                id={leaveID}
                                role="admin"
                                webSocket={props.webSocket}
                                fetchLeaves={props.fetchLeaves}
                              />
                            </ButtonGroup>
                          ) : row.manager_approved ? (
                            <Typography color="green">Accepted</Typography>
                          ) : row.manager_rejected ? (
                            <Typography color="red">Rejected</Typography>
                          ) : row.admin_approved ? (
                            <Typography color="green">Forwarded</Typography>
                          ) : (
                            <Typography color="red">Rejected</Typography>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  )
                )
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, { label: "All", value: -1 }]}
                  count={props.leaves.length}
                  rowsPerPage={rowsPerPage2}
                  page={page2}
                  onRowsPerPageChange={handleChangeRowsPerPage2}
                  onPageChange={handleChangePage2}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <TableContainer component={Paper}>
          <Table style={{ minWidth: "500px" }}>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: "bolder" }}>S. No.</TableCell>
                <TableCell style={{ fontWeight: "bolder" }} align="left">
                  Employee Name
                </TableCell>
                <TableCell style={{ fontWeight: "bolder" }}>
                  Leave Type
                </TableCell>
                <TableCell style={{ fontWeight: "bolder" }}>
                  Applied On
                </TableCell>
                <TableCell style={{ fontWeight: "bolder" }}>From</TableCell>
                <TableCell style={{ fontWeight: "bolder" }}>To</TableCell>
                <TableCell style={{ fontWeight: "bolder" }}>Admin</TableCell>
                <TableCell style={{ fontWeight: "bolder" }}>Manager</TableCell>
                {props.role === "manager" ? (
                  <TableCell style={{ fontWeight: "bolder" }}>
                    Approve/Reject
                  </TableCell>
                ) : (
                  <TableCell style={{ fontWeight: "bolder" }}>
                    Forward/Reject
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? props.leaves.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : props.leaves
              ).map((row, idx) => (
                <TableRow>
                  <TableCell>{row.id}</TableCell>
                  <TableCell align="left">
                    {row.is_online ? (
                      <FiberManualRecord color="success" />
                    ) : (
                      <FiberManualRecord color="disabled" />
                    )}
                    {row.name}
                  </TableCell>
                  <TableCell>{row.leave_type}</TableCell>
                  <TableCell>{row.applied_on.substr(0, 10)}</TableCell>
                  <TableCell>{row.from_date}</TableCell>
                  <TableCell>{row.to_date}</TableCell>
                  <TableCell style={{ paddingLeft: "25px" }}>
                    {row.waiting_approval ? (
                      <HourglassBottom color="warning" />
                    ) : row.admin_approved ? (
                      <Done color="success" />
                    ) : (
                      <Close color="error" />
                    )}
                  </TableCell>
                  <TableCell style={{ paddingLeft: "32px" }}>
                    {row.waiting_approval ? (
                      <HourglassBottom color="warning" />
                    ) : !row.admin_approved ? (
                      <Close color="error" />
                    ) : row.manager_rejected ? (
                      <Close color="error" />
                    ) : row.manager_approved ? (
                      <Done color="success" />
                    ) : (
                      <HourglassBottom color="warning" />
                    )}
                  </TableCell>
                  {props.role === "manager" ? (
                    <TableCell align="center">
                      {!row.manager_rejected && !row.manager_approved ? (
                        <ButtonGroup variant="contained">
                          <IconButton
                            color="success"
                            onClick={() => {
                              setLeaveID(row.id);
                              handleApproveButton();
                            }}
                          >
                            <ArrowForward />
                          </IconButton>
                          <ApproveDialog
                            open={approveDialog}
                            onClose={handleClose}
                            role="manager"
                            id={leaveID}
                            webSocket={props.webSocket}
                            fetchLeaves={props.fetchLeaves}
                          />
                          <IconButton
                            color="error"
                            onClick={() => {
                              setLeaveID(row.id);
                              handleRejectButton();
                            }}
                          >
                            <ClearOutlined />
                          </IconButton>
                          <RejectDialog
                            open={rejectDialog}
                            onClose={handleClose}
                            id={leaveID}
                            role="manager"
                            webSocket={props.webSocket}
                            fetchLeaves={props.fetchLeaves}
                          />
                        </ButtonGroup>
                      ) : row.manager_approved ? (
                        <Typography color="green">Approved</Typography>
                      ) : (
                        <Typography color="red">Rejected</Typography>
                      )}
                    </TableCell>
                  ) : (
                    <TableCell align="center">
                      {row.waiting_approval ? (
                        <ButtonGroup variant="contained">
                          <IconButton
                            color="success"
                            onClick={() => {
                              setLeaveID(row.id);
                              handleApproveButton();
                            }}
                          >
                            <ArrowForward />
                          </IconButton>
                          <ApproveDialog
                            open={approveDialog}
                            onClose={handleClose}
                            role="admin"
                            id={leaveID}
                            webSocket={props.webSocket}
                            fetchLeaves={props.fetchLeaves}
                          />
                          <IconButton
                            color="error"
                            onClick={() => {
                              setLeaveID(row.id);
                              handleRejectButton();
                            }}
                          >
                            <ClearOutlined />
                          </IconButton>
                          <RejectDialog
                            open={rejectDialog}
                            onClose={handleClose}
                            id={leaveID}
                            role="admin"
                            webSocket={props.webSocket}
                            fetchLeaves={props.fetchLeaves}
                          />
                        </ButtonGroup>
                      ) : row.manager_approved ? (
                        <Typography color="green">Accepted</Typography>
                      ) : row.manager_rejected ? (
                        <Typography color="red">Rejected</Typography>
                      ) : row.admin_approved ? (
                        <Typography color="green">Forwarded</Typography>
                      ) : (
                        <Typography color="red">Rejected</Typography>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, { label: "All", value: -1 }]}
                  count={props.leaves.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  onPageChange={handleChangePage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </TabPanel>
    </Box>
  );
}

export default EmployeeTable;
