import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import LeavesChart from "./LeavesChart";
import { Typography, Grid } from "@mui/material";
import {
  AppBar,
  Toolbar,
  TextField,
  IconButton,
  FormLabel,
  FormControl,
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  Button,
} from "@mui/material";
import { FilterAlt } from "@mui/icons-material";
import EmployeeReport from "./EmployeeReport";
import DepartmentReport from "./DepartmentReport";
import LeaveTypeReport from "./LeaveTypeReport";
import DateRangePicker from "@mui/lab/DateRangePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
var fileDownload = require("js-file-download");

const useStyles = makeStyles((theme) => ({
  filterBarContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    gap: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
}));

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

function ReportGeneration() {
  const classes = useStyles();

  const [leaveTypes, setLeaveTypes] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [empLoaded, setEmpLoaded] = useState(false);
  const [empLoading, setEmpLoading] = useState(null);
  const [empLeaves, setEmpLeaves] = useState([]);
  const [empDetails, setEmpDetails] = useState(null);
  const [deptLoaded, setDeptLoaded] = useState(false);
  const [deptLoading, setDeptLoading] = useState(null);
  const [deptDetails, setDeptDetails] = useState(null);
  const [leaveTypeDetails, setLeaveTypeDetails] = useState(null);
  const [deptPieChartData, setDeptPieChartData] = useState(null);
  const [leaveTypePieChartData, setLeaveTypePieChartData] = useState(null);
  const [numEmp, setNumEmp] = useState(null);
  const [deptLeaves, setDeptLeaves] = useState([]);
  const [leaveTypesLoaded, setLeaveTypesLoaded] = useState(false);
  const [leaveTypesLoading, setLeaveTypesLoading] = useState(null);
  const [leaveTypesLeaves, setLeaveTypesLeaves] = useState([]);
  const [empID, setEmpID] = useState("");
  const [department, setDepartment] = useState();
  const [leaveType, setLeaveType] = useState();
  const [value, setValue] = useState("");
  const [dateRange, setDateRange] = React.useState([null, null]);

  useEffect(() => {
    fetchDepartments();
    fetchLeaveTypes();
  }, []);

  const fetchDepartments = () => {
    return fetch("http://127.0.0.1:8000/dept/add-dept")
      .then((response) => response.json())
      .then((data) => {
        setDepartments([...data]);
      });
  };

  const fetchLeaveTypes = () => {
    fetch("http://127.0.0.1:8000/leave-types/add-leave-type")
      .then((response) => response.json())
      .then((data) => {
        setLeaveTypes([...data]);
      });
  };

  const handleEmpLoading = () => {
    setEmpLoaded(true);
    setEmpLoading(true);
  };
  const handleEmpLoadingDone = () => {
    setEmpLoading(false);
  };

  const handleDeptLoading = () => {
    setDeptLoaded(true);
    setDeptLoading(true);
  };
  const handleDeptLoadingDone = () => {
    setDeptLoading(false);
  };

  const handleLeaveTypesLoading = () => {
    setLeaveTypesLoaded(true);
    setLeaveTypesLoading(true);
  };
  const handleLeaveTypesLoadingDone = () => {
    setLeaveTypesLoading(false);
  };

  const handleChangeDepartment = (event) => {
    const {
      target: { value },
    } = event;
    setDepartment(value);
  };

  const handleChangeLeaveType = (event) => {
    const {
      target: { value },
    } = event;
    setLeaveType(value);
  };

  const handleFilterByChange = (e) => {
    setValue(e.target.value);
  };

  const handleFilterClick = (e) => {
    if (value === "employee_id") {
      handleEmpLoading();
      console.log("EMPLOYEE ID");
      fetch(`http://127.0.0.1:8000/leaves/filter-leaves-empid/${empID}/`)
        .then((res) => res.json())
        .then((_data) => {
          if (dateRange[0] == null && dateRange[1] == null) setEmpLeaves(_data);
          else {
            var query_from = dateRange[0].toISOString().slice(0, 10);
            var query_to = dateRange[1].toISOString().slice(0, 10);
            setEmpLeaves(
              _data
                .filter((leave) => leave.manager_approved)
                .filter(
                  (leave) =>
                    (new Date(leave.from_date) < new Date(query_from) &&
                      new Date(leave.to_date) > new Date(query_from)) ||
                    (new Date(leave.from_date) > new Date(query_from) &&
                      new Date(leave.to_date) < new Date(query_to)) ||
                    (new Date(leave.from_date) < new Date(query_to) &&
                      new Date(leave.to_date) > new Date(query_to))
                )
            );
          }
          fetch(`http://127.0.0.1:8000/accounts/get-user-by-id/${empID}/`)
            .then((res) => res.json())
            .then((data) => {
              setEmpDetails(data);
              handleEmpLoadingDone();
            });
        });
    } else if (value === "department") {
      handleDeptLoading();
      console.log("DEPARTMENT", department);
      fetch(`http://127.0.0.1:8000/leaves/filter-leaves-dept/${department}/`)
        .then((res) => res.json())
        .then((data) => {
          setDeptLeaves(data);
          fetch(`http://127.0.0.1:8000/dept/get-dept/${department}`)
            .then((res) => res.json())
            .then((data) => {
              setDeptDetails(data);
              fetch(`http://127.0.0.1:8000/leaves/pie-chart-data/`)
                .then((res) => res.json())
                .then((data) => {
                  setDeptPieChartData(data);
                  handleDeptLoadingDone();
                });
            });
        });
    } else if (value === "leave_type") {
      handleLeaveTypesLoading();
      fetch(
        `http://127.0.0.1:8000/leaves/filter-leaves-leaveType/${leaveType}/`
      )
        .then((res) => res.json())
        .then((data) => {
          setLeaveTypesLeaves(data);
          fetch("http://127.0.0.1:8000/leave-types/pie-chart-data/")
            .then((res) => res.json())
            .then((data) => {
              setLeaveTypePieChartData(data);
              fetch(
                `http://127.0.0.1:8000/leave-types/get-by-name/${leaveType}`
              )
                .then((res) => res.json())
                .then((data) => {
                  setLeaveTypeDetails(data);
                  handleLeaveTypesLoadingDone();
                });
            });
        });
    }
  };

  const handleReportGeneration = () => {
    let leaveId = [];
    for (let leave in empLeaves) {
      leaveId.push(empLeaves[leave].id);
    }
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        leaveIds: leaveId,
      }),
      responseType: "blob",
    };

    fetch("http://127.0.0.1:8000/leaves/generate-report", requestOptions)
      .then((res) => {
        return res.blob();
      })
      .then((data) => {
        fileDownload(data, "report.xlsx");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Grid container spacing={0}>
        <Grid item xs={6} marginBottom={2}>
          <Typography variant="h4">Report Generation</Typography>
        </Grid>
        <Grid item xs={6} marginBottom={2}>
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              disabled={!empLoaded}
              onClick={handleReportGeneration}
            >
              Export Report
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <AppBar position="static" color="transparent">
            <Toolbar>
              <div className={classes.filterBarContainer}>
                <FormControl style={{ marginRight: 100 }}>
                  <FormLabel id="filter-by-button">Filter by</FormLabel>
                  <RadioGroup
                    aria-labelledby="filter-by-button"
                    name="filter-by-button-group"
                    value={value}
                    row
                    onChange={handleFilterByChange}
                  >
                    <FormControlLabel
                      value="employee_id"
                      control={<Radio />}
                      label="Employee ID"
                    />
                  </RadioGroup>
                </FormControl>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateRangePicker
                    startText="Leaves From"
                    endText="Leaves Till"
                    value={dateRange}
                    onChange={(newValue) => {
                      setDateRange(newValue);
                    }}
                    renderInput={(startProps, endProps) => (
                      <React.Fragment>
                        <TextField {...startProps} />
                        <Box sx={{ mx: 2 }}> to </Box>
                        <TextField {...endProps} />
                      </React.Fragment>
                    )}
                  />
                </LocalizationProvider>
                <TextField
                  variant="outlined"
                  label="Employee ID"
                  style={{ width: 500 }}
                  value={empID}
                  onChange={(e) => {
                    setEmpID(e.target.value);
                  }}
                >
                  Emoloyee ID
                </TextField>
              </div>
              <div>
                <IconButton
                  type="submit"
                  style={{ marginLeft: 15 }}
                  onClick={handleFilterClick}
                >
                  <FilterAlt />
                </IconButton>
              </div>
            </Toolbar>
          </AppBar>
        </Grid>
        <Grid item xs={12}>
          {value === "employee_id" ? (
            <EmployeeReport
              loaded={empLoaded}
              loading={empLoading}
              handleLoadingDone={handleEmpLoadingDone}
              leaves={empLeaves}
              employee={empDetails}
            />
          ) : value === "department" ? (
            <DepartmentReport
              loaded={deptLoaded}
              loading={deptLoading}
              handleLoadingDone={handleDeptLoadingDone}
              leaves={deptLeaves}
              dept={deptDetails}
              pieChartData={deptPieChartData}
              numEmp={numEmp}
            />
          ) : (
            <LeaveTypeReport
              loaded={leaveTypesLoaded}
              loading={leaveTypesLoading}
              handleLoadingDone={handleLeaveTypesLoadingDone}
              leaves={leaveTypesLeaves}
              pieChartData={leaveTypePieChartData}
              leaveType={leaveTypeDetails}
            />
          )}
        </Grid>
      </Grid>
    </div>
  );
}

export default ReportGeneration;
