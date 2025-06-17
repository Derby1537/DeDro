import React, { useEffect, useRef, useState } from "react";
import horizon from "./../../assets/horizon5.png"
import { useSocket } from "../../Contexts/SocketContext";

const FlightControlOverlay = () => {
    const { eul } = useSocket();
    const eulRef = useRef(eul);
    const [left, setLeft] = useState("0px");
    const [top, setTop] = useState("-550px");
    const [rotate, setRotate] = useState('0deg');

    useEffect(() => {
        eulRef.current = eul;
    }, [eul])

    useEffect(() => {
        const interval = setInterval(() => {
            const pitch = ((eulRef.current.x - 130) * 5) + 'px';
            setTop(pitch);

            const roll = (-(eulRef.current.y)) + 'deg';
            setRotate(roll);

            const yaw = ((eulRef.current.z) * 5) + 'px';
            setLeft(yaw);
        }, 16);
        return () => {
            clearInterval(interval);
        }
    }, [])

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
