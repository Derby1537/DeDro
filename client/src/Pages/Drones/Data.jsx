import React, { useState } from "react";
import Plot from "../../components/Plot/Plot";
import { useSocket } from "../../Contexts/SocketContext";
import { Button } from "react-bootstrap";

const Data = () => {
    const { acc, gyro, eul } = useSocket();
    const [eulDisp, setEulDisp] = useState(false);
    const [accDisp, setAccDisp] = useState(false);
    const [gyrDisp, setGyrDisp] = useState(false);

    return (
        <div className="d-flex flex-column">
            <div>
                <h2>
                    Euler's angle
                    <Button className="m-2" onClick={() => setEulDisp(prev => !prev)}>{eulDisp ? "Hide" : "Show"}</Button>
                </h2>
                {eulDisp && <Plot dataToPlot={eul}/>}
            </div>
            <div>
                <h2>
                    Accelerometer Data
                    <Button className="m-2" onClick={() => setAccDisp(prev => !prev)}>{accDisp ? "Hide" : "Show"}</Button>
                </h2>
                {accDisp && <Plot dataToPlot={acc}/>}
            </div>
            <div>
                <h2>
                    Gyroscope Data
                    <Button className="m-2" onClick={() => setGyrDisp(prev => !prev)}>{gyrDisp ? "Hide" : "Show"}</Button>
                </h2>
                {gyrDisp && <Plot dataToPlot={gyro}/>}
            </div>

        </div>
    )
}

export default Data;
