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
  InputLabel,
  MenuItem,
  FormControl,
  ListItemText,
  Select,
  Checkbox,
} from "@mui/material";
import { Edit, Delete, Done, Close } from "@mui/icons-material";
import { DialogContent } from "@material-ui/core";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const leave_type_employee = ["Contract Based", "Regular Based"];

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
  const [leaveTypeLimit, setLeaveTypeLimit] = useState("");
  const [editLeaveTypeCode, setEditLeaveTypeCode] = useState("");
  const [deleteLeaveTypeCode, setDeleteLeaveTypeCode] = useState("");
  const [leaveTypeEmployee, setLeaveTypeEmployee] = useState([]);

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

  const handleEditLeaveTypeButtonClose = () => {
    setOpen2(false);
    setLeaveTypeCode("");
    setLeaveTypeName("");
    setLeaveTypeLimit("");
  };

  const resetFields = () => {
    setLeaveTypeName("");
    setLeaveTypeCode("");
    setLeaveTypeLimit("");
    setLeaveTypeEmployee([]);
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
        contract_based: leaveTypeEmployee.includes("Contract Based"),
        regular_based: leaveTypeEmployee.includes("Regular Based"),
        limit: leaveTypeLimit,
      }),
    };
    fetch("http://127.0.0.1:8000/leave-types/add-leave-type", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        fetchLeaveTypes();
        props.fetchNumOfLeaveTypes();
      });
    setOpen(false);
    resetFields();
  };

  const handleDeleteLeaveType = () => {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch(
      `http://127.0.0.1:8000/leave-types/delete-leave-types/${deleteLeaveTypeCode}`,
      requestOptions
    ).then(() => {
      fetchLeaveTypes();
      props.fetchNumOfLeaveTypes();
    });
    setOpen3(false);
    setLeaveTypeName("");
    setLeaveTypeCode("");
    setLeaveTypeLimit("");
  };

  const handleEditLeaveType = () => {
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        leave_type_name: leaveTypeName,
        leave_type_code: leaveTypeCode,
        limit: leaveTypeLimit,
      }),
    };
    fetch(
      `http://127.0.0.1:8000/leave-types/update-leave-type/${editLeaveTypeCode}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        fetchLeaveTypes();
      });
    setOpen2(false);
    setLeaveTypeName("");
    setLeaveTypeCode("");
    setLeaveTypeLimit("");
  };

  const handleClose = () => {
    setOpen(false);
    setOpen2(false);
    setOpen3(false);
    resetFields();
  };

  const handleLeaveTypeNameChange = (e) => {
    e.preventDefault();
    setLeaveTypeName(e.target.value);
  };

  const handleLeaveTypeCodeChange = (e) => {
    e.preventDefault();
    setLeaveTypeCode(e.target.value);
  };

  const handleLeaveTypeLimitChange = (e) => {
    e.preventDefault();
    setLeaveTypeLimit(e.target.value);
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setLeaveTypeEmployee(typeof value === "string" ? value.split(",") : value);
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
                    <TextField
                      id="leave_type_limit"
                      type="text"
                      fullWidth
                      variant="standard"
                      label="Leave Type Limit"
                      value={leaveTypeLimit}
                      onChange={handleLeaveTypeLimitChange}
                    />
                    <FormControl fullWidth>
                      <InputLabel id="demo-multiple-checkbox-label">
                        Applicable Employee Type
                      </InputLabel>
                      <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        value={leaveTypeEmployee}
                        onChange={handleChange}
                        renderValue={(selected) => selected.join(", ")}
                        MenuProps={MenuProps}
                        fullWidth
                        label={"Applicable Employee Type"}
                      >
                        {leave_type_employee.map((name) => (
                          <MenuItem key={name} value={name}>
                            <Checkbox
                              checked={leaveTypeEmployee.indexOf(name) > -1}
                            />
                            <ListItemText primary={name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
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
                  Regular Employees
                </TableCell>
                <TableCell style={{ fontWeight: "bolder" }}>
                  Contract Employees
                </TableCell>
                <TableCell style={{ fontWeight: "bolder" }}>Rule</TableCell>
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
                <TableRow>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{leave.leave_type_name}</TableCell>
                  <TableCell style={{ paddingLeft: "60px" }}>
                    {leave.leave_type_code}
                  </TableCell>
                  <TableCell style={{ paddingLeft: "60px" }}>
                    {leave.regular_based ? (
                      <Done color="success" />
                    ) : (
                      <Close color="error" />
                    )}
                  </TableCell>
                  <TableCell style={{ paddingLeft: "60px" }}>
                    {leave.contract_based ? (
                      <Done color="success" />
                    ) : (
                      <Close color="error" />
                    )}
                  </TableCell>
                  <TableCell>{leave.limit}</TableCell>
                  <TableCell>{leave.created_on.substr(0, 10)}</TableCell>
                  <TableCell>
                    <ButtonGroup>
                      <IconButton
                        onClick={() => {
                          setLeaveTypeName(leave.leave_type_name);
                          setLeaveTypeCode(leave.leave_type_code);
                          setLeaveTypeLimit(leave.limit);
                          setEditLeaveTypeCode(leave.leave_type_code);
                          setOpen2(true);
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
                                  id="leave_type_name2"
                                  type="text"
                                  fullWidth
                                  variant="standard"
                                  label="Leave Type Name"
                                  value={leaveTypeName}
                                  onChange={handleLeaveTypeNameChange}
                                />
                                <TextField
                                  id="leave_type_code2"
                                  type="text"
                                  fullWidth
                                  variant="standard"
                                  label="Leave Type Code"
                                  value={leaveTypeCode}
                                  onChange={handleLeaveTypeCodeChange}
                                />
                                <TextField
                                  id="leave_type_limit2"
                                  type="text"
                                  fullWidth
                                  variant="standard"
                                  label="Leave Type Limit"
                                  value={leaveTypeLimit}
                                  onChange={handleLeaveTypeLimitChange}
                                />
                              </Stack>
                            </form>
                          </DialogContent>
                          <DialogActions>
                            <Button
                              color="primary"
                              onClick={() => {
                                handleEditLeaveType();
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              color="error"
                              onClick={handleEditLeaveTypeButtonClose}
                            >
                              Cancel
                            </Button>
                          </DialogActions>
                        </Box>
                      </Dialog>
                      <IconButton
                        onClick={() => {
                          setDeleteLeaveTypeCode(leave.leave_type_code);
                          setOpen3(true);
                        }}
                      >
                        <Delete color="error" />
                      </IconButton>
                      <Dialog onClose={handleClose} open={open3}>
                        <DialogTitle>
                          <Typography>
                            Do you want to delete this Leave Type?
                          </Typography>
                        </DialogTitle>
                        <DialogActions>
                          <Button
                            color="error"
                            onClick={() => {
                              handleDeleteLeaveType();
                            }}
                          >
                            Delete
                          </Button>
                          <Button color="warning" onClick={handleClose}>
                            Cancel
                          </Button>
                        </DialogActions>
                      </Dialog>
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
