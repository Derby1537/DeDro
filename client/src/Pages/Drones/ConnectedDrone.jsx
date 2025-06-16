import React, { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { useSocket } from "../../Contexts/SocketContext";
import FlightControlOverlay from "./FlightControlOverlay";
import Terminal from "./Terminal";
import Plot from "../../components/Plot/Plot";
import Data from "./Data";
import { useController } from "../../Contexts/ControllerContext";

const ConnectedDrone = ({ drone }) => {
    const { disconnectFromDrone, battery, rssi, temperature, pressure, status } = useSocket();
    const { commands, calibrateDrone, armDrone } = useController();
    const [calibrateButtonText, setCalibrateButtonText] = useState("Calibrate");
    const commandsRef = useRef(commands);

    const pressCalibrate = () => {
        setCalibrateButtonText("Calibrating")
        armDrone(0);
        calibrateDrone(1);
        setTimeout(() => {
            calibrateDrone(0);
        }, 1000);
        setTimeout(() => {
            setCalibrateButtonText("Calibrated") ;
        }, 4000);
    }
    const pressArm = () => {
        if(commands.arm === 1) {
            armDrone(0);
        }
        else {
            armDrone(1);
        }
    }

    useEffect(() => {
        commandsRef.current = commands;
    }, [commands]);

    return (
        <div className="flex-grow-1">
            <div className="d-flex justify-content-between">
                <h1>{drone.advertisement.localName}</h1>
                <div className="d-flex align-items-center">
                    <Button variant="danger" onClick={() => disconnectFromDrone()}>Disconnect</Button>
                </div>
            </div>
            <div className="d-flex justify-content-between">
                <div>
                    Status: {status}
                </div>
                <div>
                    <div>Battery: {battery}%</div>
                    <div>RSSI: {rssi} mdb</div>
                    <div>Temperature: {temperature} °C</div>
                    <div>Pressure: {pressure} mBar</div>
                </div>
            </div>
            <div className="d-flex justify-content-around">
                <Button
                    disabled={calibrateButtonText === "Calibrating"}
                    onClick={pressCalibrate}
                >
                    {calibrateButtonText}
                </Button>
                <Button 
                    disabled={calibrateButtonText === "Calibrating" || calibrateButtonText === "Calibrate"}
                    onClick={pressArm}
                >
                    {!commands.arm ? <div>Arm</div>:<div>Disarm</div>}
                </Button>
            </div>
            <div className="w-100 d-flex justify-content-center align-items-center">
                <FlightControlOverlay/>
            </div>
            <div style={{maxWidth: '800px'}}>
                <Data/>
            </div>
            <div className="d-flex flex-column">
                <h2>Bluetooth terminal</h2>
                <Terminal/>
            </div>
        </div>
    );
}

export default ConnectedDrone;
