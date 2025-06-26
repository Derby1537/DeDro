import React, { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import magGlass from "../../assets/mag_glass.svg";
import { useSocket } from '../../Contexts/SocketContext';
import './droneView.css';
import ConnectedDrone from "./ConnectedDrone";
import FlightControlOverlay from "./FlightControlOverlay";
import Terminal from "./Terminal";
import Data from "./Data";
import { useController } from "../../Contexts/ControllerContext";

const DroneView = () => {
    const { isDroneConnected, isBluetoothOn, availableDrones, isLoading, fetchDrones, connectToDrone } = useSocket();
    const { calibrateDrone, armDrone } = useController();

    const initiateConnection = (drone) => {
        for(let i = 0; i < availableDrones.length; i++) {
            if(availableDrones[i].connecting === true) return;
        }
        connectToDrone(drone);
    }

    useEffect(() => {
        if(isDroneConnected === false) {
            calibrateDrone(0);
            armDrone(0);
        }
    }, [isDroneConnected]);

    return (
        <div className="text-white p-2 flex-grow-1 d-flex flex-column">
            {isBluetoothOn === null ? 
                (<div className="w-100 h-100 d-flex justify-content-center align-items-center">
                    <Spinner />

                </div>)
                :
                isBluetoothOn === false ? 
                    (<div className="w-100">
                        <h1>Bluetooth is not available</h1>

                    </div>)
                    :
                    isDroneConnected === false ? 
                        (<div className="w-100">
                            <div className="d-flex justify-content-between">
                                <h1>List of available drones</h1>
                                {!isLoading? (
                                    <Button 
                                        className="search-button" 
                                        onClick={() => fetchDrones()} 
                                    >
                                        <img src={magGlass} alt="magGlass" width={"25"}/>
                                    </Button>
                                ):(
                                        <Button className="search-button" disabled>
                                            <Spinner animation="border" size="sm"></Spinner>
                                        </Button>
                                    )} 
                            </div>
                            <div className="peripheral-list">
                                {availableDrones.map && availableDrones.map((drone) => (
                                    <li className="peripheral-in-list" key={drone.id}>
                                        {drone.name} 
                                        <Button disabled={drone.connecting} onClick={() => {initiateConnection(drone)}}>
                                            {drone.connecting?(<div>Connecting...</div>):(<div>Connect</div>)}
                                        </Button>
                                    </li>
                                ))}
                            </div>
                        </div>)
                    :
                        (<div className="d-flex flex-grow-1">
                            <ConnectedDrone drone={isDroneConnected}/>
                        </div>)
            }
        </div>
    );
}

export default DroneView;
