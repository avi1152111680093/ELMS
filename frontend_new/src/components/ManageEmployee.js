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
  MenuItem,
} from "@mui/material";
import { Edit, Delete, FiberManualRecord } from "@mui/icons-material";
import { DialogContent, Divider } from "@material-ui/core";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import { getStates } from "country-state-picker";
import { Select, InputLabel, FormControl } from "@mui/material";

let webSocket;

function ManageEmployee(props) {
  // const { user } = useAuthState();

  useEffect(() => {
    fetchEmployees();
    fetchAdmins();
    fetchManagers();
    fetchDepartments();
    webSocket = new WebSocket("ws://127.0.0.1:8000/ws/update-user");
    webSocket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.action === "UPDATE") {
        if (data.admin || data.manager) {
          fetchEmployees();
        }
      }
    };
    webSocket.onclose = function (e) {
      console.error("Chat socket closed unexpectedly");
    };
  }, []);

  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [value, setValue] = React.useState(null);
  const [state, setState] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [empID, setEmpID] = useState("");
  const [department, setDepartment] = useState("");
  const [departments, setDepartments] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [flat, setFlat] = useState("");
  const [town, setTown] = useState("");
  const [joiningDate, setJoiningDate] = useState(null);
  const [editUsername, setEditUsername] = useState("");
  const [deleteUsername, setDeleteUsername] = useState("");
  const [managers, setManagers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [manager, setManager] = useState("");
  const [admin, setAdmin] = useState("");
  const [employeeType, setEmployeeType] = useState("");
  const [email, setEmail] = useState("");
  const [disabled, setDisabled] = useState(false);

  const fetchEmployees = () => {
    fetch("http://127.0.0.1:8000/accounts/register/employee")
      .then((response) => response.json())
      .then((data) => {
        setEmployees([...data]);
      });
  };

  const fetchManagers = () => {
    fetch("http://127.0.0.1:8000/accounts/get-managers/")
      .then((res) => res.json())
      .then((data) => {
        setManagers([...data]);
      });
  };

  const fetchAdmins = () => {
    fetch("http://127.0.0.1:8000/accounts/get-admins/")
      .then((res) => res.json())
      .then((data) => {
        setAdmins([...data]);
      });
  };

  const fetchDepartments = () => {
    return fetch("http://127.0.0.1:8000/dept/add-dept")
      .then((response) => response.json())
      .then((data) => {
        setDepartments([...data]);
      });
  };

  const handleAddEmployeeButton = () => {
    setOpen(true);
  };

  const resetAddEmployee = () => {
    setOpen(false);
    setValue(null);
    setUsername("");
    setFirstName("");
    setLastName("");
    setManager("");
    setAdmin("");
    setEmployeeType("");
    setEmpID("");
    setDepartment("");
    setPhoneNumber("");
    setFlat("");
    setTown("");
    setJoiningDate(null);
  };

  const handleAddEmployee = () => {
    setDisabled(true);
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        first_name: firstName,
        last_name: lastName,
        employee_id: empID,
        dob: value.toISOString().slice(0, 10),
        department_code: department,
        phone_number: phoneNumber,
        joining_date: joiningDate.toISOString().slice(0, 10),
        flat: flat,
        town: town,
        state: state,
        manager: manager,
        admin: admin,
        email: email,
        contract: employeeType === "contract",
        regular: employeeType === "regular",
      }),
    };

    fetch("http://127.0.0.1:8000/accounts/register/employee", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        fetchEmployees();
        resetAddEmployee();
        props.fetchNumOfEmployees();
      });
  };

  const handleClose = () => {
    setOpen(false);
    setOpen2(false);
    setOpen3(false);
    resetAddEmployee();
  };

  const handleEditEmployeeButtonClose = () => {
    setOpen2(false);
    setValue(null);
    setUsername("");
    setFirstName("");
    setLastName("");
    setEmpID("");
    setDepartment("");
    setPhoneNumber("");
    setFlat("");
    setTown("");
    setJoiningDate(null);
  };

  const handleEditEmployee = () => {
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        employee_id: empID,
        department_code: department,
        phone_number: phoneNumber,
        flat: flat,
        town: town,
        state: state,
      }),
    };

    fetch(
      `http://127.0.0.1:8000/accounts/update/${editUsername}`,
      requestOptions
    )
      .then((res) => res.json())
      .then((data) => {
        fetchEmployees();
      });
    setOpen2(false);
    setValue(null);
    setUsername("");
    setFirstName("");
    setLastName("");
    setEmpID("");
    setDepartment("");
    setPhoneNumber("");
    setFlat("");
    setTown("");
    setJoiningDate(null);
  };

  const handleDeleteEmployee = () => {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch(
      `http://127.0.0.1:8000/accounts/delete/${deleteUsername}`,
      requestOptions
    ).then(() => {
      fetchEmployees();
      props.fetchNumOfEmployees();
      props.fetchLeaves();
    });
    setOpen3(false);
    // setDeleteUsername("");
  };

  const handleChange = (event) => {
    if (event.target.id === "employee_first_name")
      setFirstName(event.target.value);
    else if (event.target.id === "employee_last_name")
      setLastName(event.target.value);
    else if (event.target.id === "employee_username")
      setUsername(event.target.value);
    else if (event.target.id === "employee_id") setEmpID(event.target.value);
    else if (event.target.id === "employee_department_code")
      setDepartment(event.target.value);
    else if (event.target.id === "employee_number")
      setPhoneNumber(event.target.value);
    else if (event.target.id === "employee_flat") setFlat(event.target.value);
    else if (event.target.id === "employee_town") setTown(event.target.value);
    else if (event.target.id === "employee_email") setEmail(event.target.value);
    else setState(event.target.value);
  };

  const handleChange2 = (event) => {
    if (event.target.id === "employee_first_name2")
      setFirstName(event.target.value);
    else if (event.target.id === "employee_last_name2")
      setLastName(event.target.value);
    else if (event.target.id === "employee_username2")
      setUsername(event.target.value);
    else if (event.target.id === "employee_id2") setEmpID(event.target.value);
    else if (event.target.id === "employee_department_code2")
      setDepartment(event.target.value);
    else if (event.target.id === "employee_number2")
      setPhoneNumber(event.target.value);
    else if (event.target.id === "employee_flat2") setFlat(event.target.value);
    else if (event.target.id === "employee_town2") setTown(event.target.value);
    else setState(event.target.value);
  };

  return (
    <>
      <Grid container spacing={0} sx={{ width: 1600 }}>
        <Grid item xs={4}>
          <Typography variant="h4">Employee Data</Typography>
        </Grid>
        <Grid item xs={4}></Grid>
        <Grid item xs={4}>
          <Button variant="outlined" onClick={handleAddEmployeeButton}>
            Add Employee
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
              <DialogTitle>Add Employee</DialogTitle>
              <DialogContent>
                <form>
                  <Stack spacing={3}>
                    <div
                      style={{
                        display: "flex",
                      }}
                    >
                      <TextField
                        id="employee_first_name"
                        type="text"
                        variant="standard"
                        label="First Name"
                        style={{ marginRight: 15 }}
                        value={firstName}
                        onChange={handleChange}
                      />
                      <TextField
                        id="employee_last_name"
                        type="text"
                        variant="standard"
                        label="Last Name"
                        value={lastName}
                        onChange={handleChange}
                      />
                    </div>
                    <TextField
                      id="employee_username"
                      type="text"
                      fullWidth
                      variant="standard"
                      label="Employee Username"
                      value={username}
                      onChange={handleChange}
                    />
                    <TextField
                      id="employee_email"
                      type="text"
                      fullWidth
                      variant="standard"
                      label="Employee Email"
                      value={email}
                      onChange={handleChange}
                    />
                    <TextField
                      id="employee_id"
                      type="text"
                      fullWidth
                      variant="standard"
                      label="Employee ID"
                      value={empID}
                      onChange={handleChange}
                    />
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                      <InputLabel id="employee-department-helper-label">
                        Employee Department
                      </InputLabel>
                      <Select
                        labelId="employee-department-helper-label"
                        id="employee-department-helper"
                        value={department}
                        label="Employee Department"
                        onChange={(e) => setDepartment(e.target.value)}
                      >
                        {departments.map((department, idx) => (
                          <MenuItem key={idx} value={department.dept_code}>
                            {department.dept_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Date of Birth"
                        value={value}
                        onChange={(newValue) => {
                          setValue(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Joining Date"
                        value={joiningDate}
                        onChange={(newValue) => {
                          setJoiningDate(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                      <InputLabel id="employee-helper-label">
                        Employee Type
                      </InputLabel>
                      <Select
                        labelId="employee-helper-label"
                        id="employee-helper"
                        value={employeeType}
                        label="Employee Type"
                        onChange={(e) => setEmployeeType(e.target.value)}
                      >
                        <MenuItem value="regular">Regular Employee</MenuItem>
                        <MenuItem value="contract">Contract Employee</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      id="employee_number"
                      type="tel"
                      fullWidth
                      variant="standard"
                      label="Employee Phone Number"
                      value={phoneNumber}
                      onChange={handleChange}
                    />
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                      <InputLabel id="admin-helper-label">
                        Assign Admin
                      </InputLabel>
                      <Select
                        labelId="admin-helper-label"
                        id="admin-helper"
                        value={admin}
                        label="Assign Admin"
                        onChange={(e) => setAdmin(e.target.value)}
                      >
                        {admins.map((admin) => (
                          <MenuItem value={admin.username}>
                            {admin.first_name + " " + admin.last_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                      <InputLabel id="manager-helper-label">
                        Assign Manager
                      </InputLabel>
                      <Select
                        labelId="manager-helper-label"
                        id="manager-helper"
                        value={manager}
                        label="Assign Manager"
                        onChange={(e) => setManager(e.target.value)}
                      >
                        {managers.map((manager) => (
                          <MenuItem value={manager.username}>
                            {manager.first_name + " " + manager.last_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Divider />
                    <Typography>Address</Typography>
                    <TextField
                      id="employee_flat"
                      type="text"
                      fullWidth
                      variant="standard"
                      label="Flat, House no., Building, Company, Apartment"
                      value={flat}
                      onChange={handleChange}
                    />
                    <TextField
                      id="employee_town"
                      type="text"
                      fullWidth
                      variant="standard"
                      label="Town/City"
                      value={town}
                      onChange={handleChange}
                    />
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                      <InputLabel id="state-helper-label">State</InputLabel>
                      <Select
                        labelId="state-helper-label"
                        id="state-helper"
                        value={state}
                        label="State"
                        onChange={handleChange}
                      >
                        {/* <MenuItem value="">
                          <em>None</em>
                        </MenuItem> */}
                        {getStates("in").map((state, idx) => {
                          return <MenuItem value={state}>{state}</MenuItem>;
                        })}
                      </Select>
                    </FormControl>
                    {/* TODO */}
                    {/* Joining Date DatePicker */}
                  </Stack>
                </form>
              </DialogContent>
              <DialogActions>
                <Button
                  color="primary"
                  onClick={handleAddEmployee}
                  disabled={disabled}
                >
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
                  Employee Name
                </TableCell>
                <TableCell style={{ fontWeight: "bolder" }}>
                  Employee Type
                </TableCell>
                <TableCell style={{ fontWeight: "bolder" }}>
                  Employee ID
                </TableCell>
                <TableCell style={{ fontWeight: "bolder" }}>
                  Employee Department
                </TableCell>
                <TableCell style={{ fontWeight: "bolder" }}>
                  Edit/Remove
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee, idx) => (
                <TableRow>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>
                    {employee.online ? (
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
                    {employee.first_name + " " + employee.last_name}
                  </TableCell>
                  <TableCell>
                    {employee.contract_based ? "Contract" : "Regular"}
                  </TableCell>
                  <TableCell>{employee.employee_id}</TableCell>
                  <TableCell>{employee.department_code}</TableCell>
                  <TableCell>
                    <ButtonGroup>
                      <IconButton
                        disabled={employee.disabled}
                        onClick={() => {
                          setValue(employee.dob);
                          setUsername(employee.username);
                          setFirstName(employee.first_name);
                          setLastName(employee.last_name);
                          setEmpID(employee.employee_id);
                          setDepartment(employee.department_code);
                          setPhoneNumber(employee.phone_number);
                          setFlat(employee.flat);
                          setTown(employee.town);
                          setJoiningDate(employee.joining_date);
                          setState(employee.state);
                          setEditUsername(employee.username);
                          setOpen2(true);
                        }}
                      >
                        <Edit
                          htmlColor="yellow"
                          sx={{
                            color: employee.disabled ? "gray" : "yellow",
                          }}
                        />
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
                          <DialogTitle>Add Employee</DialogTitle>
                          <DialogContent>
                            <form>
                              <Stack spacing={3}>
                                <div
                                  style={{
                                    display: "flex",
                                  }}
                                >
                                  <TextField
                                    id="employee_first_name2"
                                    type="text"
                                    variant="standard"
                                    label="First Name"
                                    style={{ marginRight: 15 }}
                                    value={firstName}
                                    onChange={handleChange2}
                                  />
                                  <TextField
                                    id="employee_last_name2"
                                    type="text"
                                    variant="standard"
                                    label="Last Name"
                                    value={lastName}
                                    onChange={handleChange2}
                                  />
                                </div>
                                <TextField
                                  id="employee_id2"
                                  type="text"
                                  fullWidth
                                  variant="standard"
                                  label="Employee ID"
                                  value={empID}
                                  onChange={handleChange2}
                                />
                                <TextField
                                  id="employee_department_code2"
                                  type="text"
                                  fullWidth
                                  variant="standard"
                                  label="Employee Department"
                                  value={department}
                                  onChange={handleChange2}
                                />
                                <TextField
                                  id="employee_number2"
                                  type="tel"
                                  fullWidth
                                  variant="standard"
                                  label="Employee Phone Number"
                                  value={phoneNumber}
                                  onChange={handleChange2}
                                />
                                <Divider />
                                <Typography>Address</Typography>
                                <TextField
                                  id="employee_flat2"
                                  type="text"
                                  fullWidth
                                  variant="standard"
                                  label="Flat, House no., Building, Company, Apartment"
                                  value={flat}
                                  onChange={handleChange2}
                                />
                                <TextField
                                  id="employee_town2"
                                  type="text"
                                  fullWidth
                                  variant="standard"
                                  label="Town/City"
                                  value={town}
                                  onChange={handleChange2}
                                />
                                <FormControl sx={{ m: 1, minWidth: 120 }}>
                                  <InputLabel id="state-helper-label2">
                                    State
                                  </InputLabel>
                                  <Select
                                    labelId="state-helper-label2"
                                    id="state-helper2"
                                    value={state}
                                    label="State"
                                    onChange={handleChange2}
                                  >
                                    {getStates("in").map((state, idx) => {
                                      return (
                                        <MenuItem value={state}>
                                          {state}
                                        </MenuItem>
                                      );
                                    })}
                                  </Select>
                                </FormControl>
                              </Stack>
                            </form>
                          </DialogContent>
                          <DialogActions>
                            <Button
                              color="primary"
                              onClick={handleEditEmployee}
                            >
                              Edit
                            </Button>
                            <Button
                              color="error"
                              onClick={handleEditEmployeeButtonClose}
                            >
                              Cancel
                            </Button>
                          </DialogActions>
                        </Box>
                      </Dialog>
                      <IconButton
                        disabled={employee.disabled}
                        onClick={() => {
                          setDeleteUsername(employee.username);
                          setOpen3(true);
                        }}
                      >
                        <Delete
                          color="error"
                          sx={{
                            color: employee.disabled ? "gray" : "red",
                          }}
                        />
                      </IconButton>
                      <Dialog onClose={handleClose} open={open3}>
                        <DialogTitle>
                          <Typography>
                            Do you want to remove this Employee?
                          </Typography>
                        </DialogTitle>
                        <DialogActions>
                          <Button
                            color="error"
                            onClick={() => {
                              handleDeleteEmployee();
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

export default ManageEmployee;
