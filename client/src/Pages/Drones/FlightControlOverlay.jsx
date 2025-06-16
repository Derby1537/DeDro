import React, { useEffect, useState } from "react";
import horizon from "./../../assets/horizon2.png"
import { useController } from "../../Contexts/ControllerContext";

const FlightControlOverlay = () => {
    const { pitch, roll, yaw } = useController();
    const [left, setLeft] = useState("0px");
    const [top, setTop] = useState("-550px");
    const [rotate, setRotate] = useState('0deg');

    useEffect(() => {
        const interval = setInterval(() => {
            if(yaw && yaw !== 127.5) {
                const valueToAdd = (yaw - 127.5) * 0.2;
                const newValue = parseInt(left) - valueToAdd + 'px';
                setLeft(newValue);
            }
        }, 16);
        return () => {
            clearInterval(interval);
        }
    }, [yaw, left])

    useEffect(() => {
        const interval = setInterval(() => {
            if(pitch && pitch !== 127.5) {
                const valueToAdd = (pitch - 127.5) * 0.2;
                const newValue = parseInt(top) - valueToAdd + 'px';
                if(parseInt(newValue) < -250 && parseInt(newValue) > -750) {
                    setTop(newValue);
                }
            }
            if(pitch && pitch === 127.5) {
                let newValue;
                if(parseInt(top) > -540) {
                    newValue = parseInt(top) - 10 + 'px';
                }
                else if (parseInt(top) < -560) {
                    newValue = parseInt(top) + 10 + 'px';
                }
                else return;
                setTop(newValue);
            }
        }, 16);
        return () => {
            clearInterval(interval);
        }
    }, [pitch, top])

    useEffect(() => {
        const interval = setInterval(() => {
            if(roll && roll !== 127.5) {
                const valueToAdd = (roll - 127.5) * 0.05;
                const newValue = (parseInt(rotate) - valueToAdd) + 'deg';
                if(parseInt(newValue) > -30 && parseInt(newValue) < 30) {
                    setRotate(newValue);
                }
            }
            if(roll && roll === 127.5) {
                let newValue;
                if(parseInt(rotate) > 0) {
                    newValue = (parseInt(rotate) - 0.2) + 'deg';
                }
                else {
                    newValue = (parseInt(rotate) + 0.2) + 'deg';
                }
                setRotate(newValue);
            }
        }, 16);
        return () => {
            clearInterval(interval);
        }
    }, [roll, rotate])

    return (
        <div className="flight-control-overlay">
            <div className="horizon" 
                style={{ backgroundImage: `url(${horizon})`, backgroundPositionX: left, backgroundPositionY: top, rotate: rotate }}></div>
            <div className="plane"></div>
            <div className="plane-triangle"></div>
        </div>
    )
}

export default FlightControlOverlay;
