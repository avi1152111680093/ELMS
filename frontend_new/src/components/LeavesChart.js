import React, { useEffect, useState } from "react";
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
import { Bar, Pie } from "react-chartjs-2";
import { TailSpin } from "react-loader-spinner";

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const labels = ["January", "February", "March", "April", "May", "June", "July"];

const data = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: [12, 34, 56, 78, 90, 10, 20],
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Dataset 2",
      data: [98, 76, 54, 32, 21, 76, 54],
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

const data2 = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: [12, 34, 56, 78, 90, 10, 20],
      backgroundColor: [
        "rgba(255, 99, 132, 0.5",
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ],
      borderColor: [
        "rgba(53, 162, 235, 0.5)",
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ],
    },
  ],
};

function LeavesChart({ loaded, loading, handleLoadingDone }) {
  useEffect(() => {
    setTimeout(() => {
      handleLoadingDone();
    }, 2000);
  }, [loaded, loading]);

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
        <Bar data={data} />
      )}
    </div>
  );
}

export default LeavesChart;
