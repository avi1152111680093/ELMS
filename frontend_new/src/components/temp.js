import React, { useState, useEffect } from "react";
import {
  TextField,
  Paper,
  Grid,
  Typography,
  Button,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  Box,
  TableRow,
  Stack,
  TableCell,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  ButtonGroup,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { DialogContent } from "@material-ui/core";

function ManageLeaveType(props) {
  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [leaveTypeName, setLeaveTypeName] = useState("");
  const [leaveTypeCode, setLeaveTypeCode] = useState("");

  const fetchLeaveTypes = () => {
    fetch("http://127.0.0.1:8000/leave-types/add-leave-type")
      .then((response) => response.json())
      .then((data) => {
        setLeaveTypes([...data]);
      });
  };

  const handleAddLeaveTypeButton = () => {
    setOpen(true);
  };

  const handleEditLeaveTypeButton = (leavetypename, leavetypecode) => {
    setLeaveTypeName(leavetypename);
    setLeaveTypeCode(leavetypecode);
    setOpen2(true);
  };

  const handleAddLeaveType = () => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        leave_type_name: leaveTypeName,
        leave_type_code: leaveTypeCode,
      }),
    };
    fetch("http://127.0.0.1:8000/leave-types/add-leave-type", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setLeaveTypes([...leaveTypes, data]);
        props.fetchNumOfLeaveTypes();
      });
    setOpen(false);
    setLeaveTypeName("");
    setLeaveTypeCode("");
  };

  const handleDeleteLeaveType = (code) => {
    // const requestOptions = {
    //   method: "DELETE",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     leave_type_code: code,
    //   }),
    // };
    // fetch(
    //   `http://127.0.0.1:8000/leave-types/delete-leave-types/${code}`,
    //   requestOptions
    // ).then(() => {
    //   fetchLeaveTypes();
    //   props.fetchNumOfLeaveTypes();
    // });
    // setOpen3(false);
    // setLeaveTypeName("");
    // setLeaveTypeCode("");
    console.log(code);
  };

  const handleEditLeaveType = (code) => {
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        leave_type_name: leaveTypeName,
        leave_type_code: leaveTypeCode,
      }),
    };
    fetch(
      `http://127.0.0.1:8000/leave-types/update-leave-type/${code}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        fetchLeaveTypes();
      });
    setOpen2(false);
    setLeaveTypeName("");
    setLeaveTypeCode("");
  };

  const handleClose = () => {
    setOpen(false);
    setOpen2(false);
    setOpen3(false);
  };

  const handleLeaveTypeNameChange = (e) => {
    e.preventDefault();
    setLeaveTypeName(e.target.value);
  };

  const handleLeaveTypeCodeChange = (e) => {
    e.preventDefault();
    setLeaveTypeCode(e.target.value);
  };

  return (
    <>
      <Grid container spacing={0} sx={{ width: 1600 }}>
        <Grid item xs={4}>
          <Typography variant="h4">Leave Types</Typography>
        </Grid>
        <Grid item xs={4}></Grid>
        <Grid item xs={4}>
          <Button variant="outlined" onClick={handleAddLeaveTypeButton}>
            Add Leave Type
          </Button>
          <Dialog open={open} onClose={handleClose}>
            <Box
              sx={{
                width: 600,
                paddingBottom: 2,
                paddingLeft: 1,
                paddingRight: 1,
              }}
            >
              <DialogTitle>Add Leave Type</DialogTitle>
              <DialogContent>
                <form>
                  <Stack spacing={3}>
                    <TextField
                      id="leave_type_name"
                      type="text"
                      fullWidth
                      variant="standard"
                      label="Leave Type Name"
                      value={leaveTypeName}
                      onChange={handleLeaveTypeNameChange}
                    />
                    <TextField
                      id="leave_type_code"
                      type="text"
                      fullWidth
                      variant="standard"
                      label="Leave Type Code"
                      value={leaveTypeCode}
                      onChange={handleLeaveTypeCodeChange}
                    />
                  </Stack>
                </form>
              </DialogContent>
              <DialogActions>
                <Button color="primary" onClick={handleAddLeaveType}>
                  Add
                </Button>
                <Button color="error" onClick={handleClose}>
                  Cancel
                </Button>
              </DialogActions>
            </Box>
          </Dialog>
        </Grid>
      </Grid>
      <Paper elevation={1} sx={{ marginTop: 6 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: "bolder" }}>S. No.</TableCell>
                <TableCell style={{ fontWeight: "bolder" }}>
                  Leave Type Name
                </TableCell>
                <TableCell style={{ fontWeight: "bolder" }}>
                  Leave Type Code
                </TableCell>
                <TableCell style={{ fontWeight: "bolder" }}>
                  Created On
                </TableCell>
                <TableCell style={{ fontWeight: "bolder" }}>
                  Edit/Remove
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaveTypes.map((leave, idx) => (
                <TableRow key={leave.id}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{leave.leave_type_name}</TableCell>
                  <TableCell style={{ paddingLeft: "60px" }}>
                    {leave.leave_type_code}
                  </TableCell>
                  <TableCell>{leave.created_on}</TableCell>
                  <TableCell>
                    <ButtonGroup>
                      <IconButton
                        onClick={() => {
                          return handleEditLeaveTypeButton(
                            leave.leave_type_name,
                            leave.leave_type_code
                          );
                        }}
                      >
                        <Edit htmlColor="yellow" />
                      </IconButton>
                      <Dialog open={open2} onClose={handleClose}>
                        <Box
                          sx={{
                            width: 600,
                            paddingBottom: 2,
                            paddingLeft: 1,
                            paddingRight: 1,
                          }}
                        >
                          <DialogTitle>Edit Leave Type</DialogTitle>
                          <DialogContent>
                            <form>
                              <Stack spacing={3}>
                                <TextField
                                  id="leave_type_name"
                                  type="text"
                                  fullWidth
                                  variant="standard"
                                  label="Leave Type Name"
                                  value={leaveTypeName}
                                  onChange={handleLeaveTypeNameChange}
                                />
                                <TextField
                                  id="leave_type_code"
                                  type="text"
                                  fullWidth
                                  variant="standard"
                                  label="Leave Type Code"
                                  value={leaveTypeCode}
                                  onChange={handleLeaveTypeCodeChange}
                                />
                              </Stack>
                            </form>
                          </DialogContent>
                          <DialogActions>
                            <Button
                              color="primary"
                              onClick={() =>
                                handleEditLeaveType(leave.leave_type_code)
                              }
                            >
                              Edit
                            </Button>
                            <Button color="error" onClick={handleClose}>
                              Cancel
                            </Button>
                          </DialogActions>
                        </Box>
                      </Dialog>
                      <IconButton
                        onClick={() => {
                          setOpen3(true);
                        }}
                      >
                        <Delete color="error" />
                      </IconButton>
                      {/* <Dialog onClose={handleClose} open={open3}>
                        <DialogTitle>
                          <Typography>
                            Do you want to delete this Leave Type?
                          </Typography>
                        </DialogTitle>
                        <DialogActions>
                          <Button
                            color="error"
                            onClick={() =>
                              handleDeleteLeaveType(leave.leave_type_code)
                            }
                          >
                            Delete
                          </Button>
                          <Button color="warning" onClick={handleClose}>
                            Cancel
                          </Button>
                        </DialogActions>
                      </Dialog> */}
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}

export default ManageLeaveType;
