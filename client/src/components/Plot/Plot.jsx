import React, { useEffect, useRef, useState } from "react";
import "./plot.css"
//import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import LineChart from "./LineChart";

const Plot = ({ dataToPlot }) => {
    const [data, setData] = useState([]);
    const bufferRef = useRef([]);
    useEffect(() => {
        if(dataToPlot) {
            bufferRef.current.push(dataToPlot);
        }
    }, [dataToPlot])

    useEffect(() => {
        const interval = setInterval(() => {
            if (bufferRef.current.length > 0) {

                setData(prev => {
                    const newData = [...prev, ...bufferRef.current];
                    bufferRef.current = [];
                    return newData.slice(-100);
                });
            }
        }, 10);

        return () => clearInterval(interval);
    }, []);
    return (
        <div className="d-flex flex-wrap">
            <LineChart chartData={data}/>
        </div>
    )
}

export default Plot;
