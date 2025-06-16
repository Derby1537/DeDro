import React, { useContext, useEffect, useState } from "react";
import './controller.css';
//import ControllerLayout from "./ControllerLayout";
//import WaitingForController from "./WaitingForController";
import { useController } from "../../Contexts/ControllerContext";
import ControllerLayout from "./ControllerLayout";
import WaitingForController from "./WaitingForController";
import ControllerConfig from "./ControllerConfig";

const ControllerView = () => {
    const { controllerConnected, pressedButtons, axes, throttle, pitch, roll, yaw, calibratePressed, armPressed, controllerName } = useController();
    const [throttleWidth, setThrottleWidth] = useState("0%");
    const [pitchWidth, setPitchWidth] = useState("50%");
    const [rollWidth, setRollWidth] = useState("50%");
    const [yawWidth, setYawWidth] = useState("50%");

    useEffect(() => {
        setThrottleWidth(throttle / 255 * 100 + "%");
    }, [throttle])
    useEffect(() => {
        setPitchWidth(pitch / 255 * 100 + "%");
    }, [pitch])
    useEffect(() => {
        setRollWidth(roll / 255 * 100 + "%");
    }, [roll])
    useEffect(() => {
        setYawWidth(yaw / 255 * 100 + "%");
    }, [yaw])

    return (
        <div className="w-100 h-100 d-flex">
            {controllerConnected ? (
                <div>
                    <h1 className="p-1 text-light">{controllerName}</h1>
                    <ControllerLayout pressedButtons={pressedButtons} axis={axes}/>
                    <div className="text-light p-2">
                        <h1>Commands</h1>
                        <h3>Throttle</h3>
                        <div className="bar">
                            <div className="fill-bar" id="throttle-bar" style={{width: throttleWidth}}></div><div className="fill-bar-after"></div>
                        </div>
                        <h3>Pitch</h3>
                        <div className="bar">
                            <div className="fill-bar" id="pitch-bar"style={{width: pitchWidth}}></div><div className="fill-bar-after"></div>
                        </div>
                        <h3>Roll</h3>
                        <div className="bar">
                            <div className="fill-bar" id="roll-bar"style={{width:rollWidth}}></div><div className="fill-bar-after"></div>
                        </div>
                        <h3>Yaw</h3>
                        <div className="bar">
                            <div className="fill-bar" id="yaw-bar"style={{width:yawWidth}}></div><div className="fill-bar-after"></div>
                        </div>
                    </div>
                    <ControllerConfig/>
                </div>
            ):(
                    <WaitingForController/>
            )}
        </div>
    );

}

export default ControllerView;
