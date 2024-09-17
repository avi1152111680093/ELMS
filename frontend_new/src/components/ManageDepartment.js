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
} from "@mui/material";
import { deprecatedPropType, DialogContent } from "@material-ui/core";
import { Edit } from "@mui/icons-material";

function ManageDepartment(props) {
  useEffect(() => {
    fetchDepartments();
  }, []);

  const [open, setOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [deptName, setDeptName] = useState("");
  const [deptCode, setDeptCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [editDeptCode, setEditDeptCode] = useState("");

  const fetchDepartments = () => {
    return fetch("http://127.0.0.1:8000/dept/add-dept")
      .then((response) => response.json())
      .then((data) => {
        setDepartments([...data]);
      });
  };

  const handleAddDeptButton = () => {
    setOpen(true);
  };

  const handleAddDept = () => {
    setLoading(true);
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dept_name: deptName,
        dept_code: deptCode,
      }),
    };
    fetch("http://127.0.0.1:8000/dept/add-dept", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        fetchDepartments();
        props.fetchNumOfDepts();
        setOpen(false);
        resetFields();
        setLoading(false);
      });
  };

  const handleEditDept = () => {
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dept_name: deptName,
        dept_code: deptCode,
      }),
    };
    fetch(
      `http://127.0.0.1:8000/dept/update-dept/${editDeptCode}`,
      requestOptions
    )
      .then((res) => res.json())
      .then((data) => {
        fetchDepartments();
      });
    setOpen2(false);
    setDeptName("");
    setDeptCode("");
  };

  const resetFields = () => {
    setDeptName("");
    setDeptCode("");
  };

  const handleClose = () => {
    setOpen2(false);
    setOpen(false);
    resetFields();
  };

  const handleDeptNameChange = (e) => {
    e.preventDefault();
    setDeptName(e.target.value);
  };

  const handleDeptCodeChange = (e) => {
    e.preventDefault();
    setDeptCode(e.target.value);
  };

  return (
    <>
      <Grid container spacing={0} sx={{ width: 1600 }}>
        <Grid item xs={4}>
          <Typography variant="h4">Departments</Typography>
        </Grid>
        <Grid item xs={4}></Grid>
        <Grid item xs={4}>
          <Button variant="outlined" onClick={handleAddDeptButton}>
            Add Department
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
              <DialogTitle>Add Department</DialogTitle>
              <DialogContent>
                <form>
                  <Stack spacing={3}>
                    <TextField
                      id="dept_name"
                      type="text"
                      fullWidth
                      variant="standard"
                      label="Department Name"
                      value={deptName}
                      onChange={handleDeptNameChange}
                    />
                    <TextField
                      id="dept_code"
                      type="text"
                      fullWidth
                      variant="standard"
                      label="Department Code"
                      value={deptCode}
                      onChange={handleDeptCodeChange}
                    />
                  </Stack>
                </form>
              </DialogContent>
              <DialogActions>
                <Button
                  color="primary"
                  onClick={handleAddDept}
                  disabled={loading}
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
                  Department Name
                </TableCell>
                <TableCell style={{ fontWeight: "bolder" }}>
                  Department Code
                </TableCell>
                <TableCell style={{ fontWeight: "bolder" }}>
                  Created On
                </TableCell>
                <TableCell style={{ fontWeight: "bolder" }}>Edit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {departments.map((department, idx) => (
                <TableRow>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{department.dept_name}</TableCell>
                  <TableCell>{department.dept_code}</TableCell>
                  <TableCell>{department.created_on.substr(0, 10)}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        setDeptName(department.dept_name);
                        setDeptCode(department.dept_code);
                        setEditDeptCode(department.dept_code);
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
                        <DialogTitle>Edit Department</DialogTitle>
                        <DialogContent>
                          <form>
                            <Stack spacing={3}>
                              <TextField
                                id="dept_name2"
                                type="text"
                                fullWidth
                                variant="standard"
                                label="Department Name"
                                value={deptName}
                                onChange={handleDeptNameChange}
                              />
                              <TextField
                                id="dept_code2"
                                type="text"
                                fullWidth
                                variant="standard"
                                label="Department Code"
                                value={deptCode}
                                onChange={handleDeptCodeChange}
                              />
                            </Stack>
                          </form>
                        </DialogContent>
                        <DialogActions>
                          <Button
                            color="primary"
                            onClick={() => {
                              handleEditDept();
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            color="error"
                            onClick={() => {
                              setOpen2(false);
                              setDeptName("");
                              setDeptCode("");
                            }}
                          >
                            Cancel
                          </Button>
                        </DialogActions>
                      </Box>
                    </Dialog>
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

export default ManageDepartment;
