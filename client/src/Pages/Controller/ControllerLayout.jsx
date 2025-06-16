import React, { useEffect, useState } from "react";
import controller from "./../../assets/controller.png";

const ControllerLayout = ({ pressedButtons, axis }) => {
    const [leftStickPosition, setLeftStickPosition] = useState({
        left: "50%",
        top: "50%",
    })
    const [rightStickPosition, setRightStickPosition] = useState({
        left: "50%",
        top: "50%",
    })
    const [leftTriggerSize, setLeftTriggerSize] = useState({
        height: "0%"
    })
    const [rightTriggerSize, setRightTriggerSize] = useState({
        height: "0%"
    })

    useEffect(() => {
        const { LeftStickX, LeftStickY} = axis; 
        setLeftStickPosition({
            left: (LeftStickX * 50) + 50 + "%",
            top: (LeftStickY * 50) + 50 + "%",
        })

        const { RightStickX, RightStickY} = axis; 
        setRightStickPosition({
            left: (RightStickX * 50) + 50 + "%",
            top: (RightStickY * 50) + 50 + "%",
        })

        const { LeftTrigger } = axis;
        setLeftTriggerSize({
            height: LeftTrigger * 100 + "%"
        })

        const { RightTrigger } = axis;
        setRightTriggerSize({
            height: RightTrigger * 100 + "%"
        })

    }, [axis]);
    return (
        <div className="controller-outer-container w-100 d-flex align-items-center">
            <div className="controller-inner-container">
                <img src={controller} className="w-100" alt="Controller"/ >

                <div id="south-button" className="button face-button" style={{ display: pressedButtons.includes("South") ? "block":"none" }}></div>
                <div id="north-button" className="button face-button"style={{ display: pressedButtons.includes("North") ? "block":"none" }}></div>
                <div id="west-button" className="button face-button"style={{ display: pressedButtons.includes("West") ? "block":"none" }}></div>
                <div id="east-button" className="button face-button"style={{ display: pressedButtons.includes("East") ? "block":"none" }}></div>

                <div id="south-d-pad" className="button d-pad-button"style={{ display: pressedButtons.includes("DPadDown") ? "block":"none" }}></div>
                <div id="north-d-pad" className="button d-pad-button"style={{ display: pressedButtons.includes("DPadUp") ? "block":"none" }}></div>
                <div id="west-d-pad" className="button d-pad-button"style={{ display: pressedButtons.includes("DPadLeft") ? "block":"none" }}></div>
                <div id="east-d-pad" className="button d-pad-button"style={{ display: pressedButtons.includes("DPadRight") ? "block":"none" }}></div>

                <div id="left-shoulder" className="button shoulder-button"style={{ display: pressedButtons.includes("LeftShoulder") ? "block":"none" }}></div>
                <div id="right-shoulder" className="button shoulder-button"style={{ display: pressedButtons.includes("RightShoulder") ? "block":"none" }}></div>
                <div id="left-shoulder2" className="button shoulder2-button"style={{ display: "block", backgroundColor: pressedButtons.includes("LeftTrigger") ? "rgba(0,0,0,0.2)":"transparent" }}>
                    <div className="trigger2-bar">
                        <div className="trigger2-bar-fill" style={leftTriggerSize}></div>
                    </div>
                </div>
                <div id="right-shoulder2" className="button shoulder2-button" style={{ display: "block", backgroundColor: pressedButtons.includes("RightTrigger") ? "rgba(0,0,0,0.2)":"transparent" }}>
                    <div className="trigger2-bar">
                        <div className="trigger2-bar-fill" style={rightTriggerSize}></div>
                    </div>

                </div>


                <div id="start-button" className="button front-button"style={{ display: pressedButtons.includes("Start") ? "block":"none" }}></div>
                <div id="select-button" className="button front-button"style={{ display: pressedButtons.includes("Select") ? "block":"none" }}></div>

                <div id="left-stick" className="button stick" style={{ display: "block",backgroundColor: pressedButtons.includes("LeftThumb") ? "rgba(0,0,0,0.2)":"transparent" }}>
                    <div className="red-circle" style={leftStickPosition}></div>
                </div>
                <div id="right-stick" className="button stick" style={{ display: "block", backgroundColor: pressedButtons.includes("RightThumb") ? "rgba(0,0,0,0.2)":"transparent" }}>
                    <div className="red-circle" style={rightStickPosition}></div>
                </div>

            </div>
        </div>
    );
}

export default ControllerLayout;
