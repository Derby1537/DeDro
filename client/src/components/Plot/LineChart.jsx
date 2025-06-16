import React from "react";
import {
    Line
} from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
);

const LineChart = ({ chartData }) => {
    const data = {
        labels: chartData.map((d) => d.timestamp),
        datasets: [
            {
                label: "X",
                data: chartData.map((d) => d.x),
                borderColor: "rgb(75, 192, 192)",
                tension: 0.1,
            },
            {
                label: "Y",
                data: chartData.map((d) => d.y),
                borderColor: "rgb(255, 99, 132)",
                tension: 0.1,
            },
            {
                label: "Z",
                data: chartData.map((d) => d.z),
                borderColor: "rgb(54, 162, 235)",
                tension: 0.1,
            },
        ],
    };

    const options = {
        responsive: true,
        animation: false,
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Timestamp (Seconds)",
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Value",
                },
            },
        },
    };

    return <Line data={data} options={options} redraw={false} updateMode="default" />;
};

export default LineChart;
