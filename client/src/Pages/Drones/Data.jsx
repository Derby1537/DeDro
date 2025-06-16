import React from "react";
import Plot from "../../components/Plot/Plot";
import { useSocket } from "../../Contexts/SocketContext";

const Data = () => {
    const { acc, gyro, mag } = useSocket();
    return (
        <div className="d-flex flex-column">
                <div>
                    <h2>Accelerometer data</h2>
                    <Plot dataToPlot={acc}/>
                </div>
                <div>
                    <h2>Gyroscope data</h2>
                    <Plot dataToPlot={gyro}/>
                </div>
                <div>
                    <h2>Magnetometer data</h2>
                    <Plot dataToPlot={mag}/>
                </div>

        </div>
    )
}

export default Data;
