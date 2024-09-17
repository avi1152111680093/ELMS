import React, { useEffect } from "react";
import { TailSpin } from "react-loader-spinner";
import {
  Typography,
  Paper,
  Grid,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";
import { useState } from "react";
import { useMemo } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import EmployeeReportLeavesTable from "./EmployeeReportLeavesTable";

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

String.prototype.toRGB = function () {
  var hash = 0;
  if (this.length === 0) return hash;
  for (var i = 0; i < this.length; i++) {
    hash = this.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  var rgb = [0, 0, 0];
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 255;
    rgb[i] = value;
  }
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
};

function EmployeeReport({ loaded, loading, leaves, employee }) {
  const totalLeaves = useMemo(() => leaves.length, [leaves]);
  const totalLeavesByLeaveTypes = useMemo(() => {
    let ans = {};
    for (let i in leaves) {
      let leave = leaves[i];
      if (leave.leave_type in ans) ans[leave.leave_type] += 1;
      else ans[leave.leave_type] = 1;
    }
    return ans;
  }, [leaves]);
  const totalLeavesByStatus = useMemo(() => {
    let ans = {
      waiting_approval: 0,
      accepted: 0,
      rejected: 0,
    };
    for (let i in leaves) {
      let leave = leaves[i];
      if (leave.waiting_approval) ans["waiting_approval"] += 1;
      else if (!leave.admin_approved) ans["rejected"] += 1;
      else if (leave.manager_approved) ans["accepted"] += 1;
      else ans["rejected"] += 1;
    }
    return ans;
  }, [leaves]);

  useEffect(() => {}, [employee, loading]);

  return !loaded ? (
    <></>
  ) : loading ? (
    <div
      style={{
        marginLeft: "50%",
        marginTop: "25%",
      }}
    >
      <TailSpin color="gray" height="60" width="60" />
    </div>
  ) : (
    <Paper
      elevation={10}
      style={{
        marginTop: "10px",
      }}
    >
      <Grid container>
        <Grid item xs={3}>
          <Card>
            <CardHeader title="Employee Name" />
            <CardContent>
              <Typography>
                {employee.first_name + " " + employee.last_name}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={3}>
          <Card>
            <CardHeader title="Employee ID" />
            <CardContent>
              <Typography>{employee.employee_id}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={3}>
          <Card>
            <CardHeader title="Employee Type" />
            <CardContent>
              <Typography>
                {employee.contract_based ? "Contract Based" : "Regular Based"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} marginTop={5}>
          <div>
            <Pie
              data={{
                labels: Object.keys(totalLeavesByLeaveTypes),
                datasets: [
                  {
                    label: "# of Leaves applied in various Leave Types",
                    data: Object.values(totalLeavesByLeaveTypes),
                    backgroundColor: Object.keys(totalLeavesByLeaveTypes).map(
                      (str) => str.toRGB()
                    ),
                  },
                ],
              }}
            />
          </div>
        </Grid>
        <Grid item xs={6} marginTop={5}>
          <div>
            <Pie
              data={{
                labels: Object.keys(totalLeavesByStatus),
                datasets: [
                  {
                    label: "# of Leaves Accepted/Rejected",
                    data: Object.values(totalLeavesByStatus),
                    backgroundColor: Object.keys(totalLeavesByStatus).map(
                      (str) => str.toRGB()
                    ),
                  },
                ],
              }}
            />
          </div>
        </Grid>
        <Grid item xs={12} marginBottom={5}>
          <EmployeeReportLeavesTable
            leaves={leaves}
            name={employee.first_name + " " + employee.last_name}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}

export default EmployeeReport;
