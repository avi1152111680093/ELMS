import React, { useEffect } from "react";
import { TailSpin } from "react-loader-spinner";
import {
  Paper,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
} from "@mui/material";
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

function LeaveTypeReport({ loaded, loading, leaveType, pieChartData }) {
  useEffect(() => {}, [loading]);
  return (
    <div>
      {!loaded ? (
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
                <CardHeader title="Leave Type Name" />
                <CardContent>
                  <Typography>{leaveType.leave_type_name}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={3}>
              <Card>
                <CardHeader title="Leave Type Code" />
                <CardContent>
                  <Typography>{leaveType.leave_type_code}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={3}>
              <Card>
                <CardHeader title="Leave Type Limit" />
                <CardContent>
                  <Typography>{leaveType.limit}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={3}></Grid>
            <Grid item xs={6} marginTop={5}>
              <div>
                <Pie
                  data={{
                    labels: Object.keys(pieChartData),
                    datasets: [
                      {
                        label: "# of Leaves Accepted/Rejected",
                        data: Object.values(pieChartData),
                        backgroundColor: Object.keys(pieChartData).map((str) =>
                          str.toRGB()
                        ),
                      },
                    ],
                  }}
                />
              </div>
            </Grid>
            <Grid item xs={3}></Grid>
          </Grid>
        </Paper>
      )}
    </div>
  );
}

export default LeaveTypeReport;
