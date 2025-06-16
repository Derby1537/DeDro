import React, { createContext, useContext, useEffect, useState } from "react";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [isBluetoothOn, setIsBluetoothOn] = useState(null);
    const [isDroneConnected, setIsDroneConnected] = useState(false);
    const [availableDrones, setAvailableDrones] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [acc, setAcc] = useState([]);
    const [gyro, setGyro] = useState([]);
    const [mag, setMag] = useState([]);
    const [battery, setBattery] = useState(0);
    const [rssi, setRssi] = useState(0);
    const [pressure, setPressure] = useState(0);
    const [temperature, setTemperature] = useState(0);
    const [status, setStatus] = useState("");

    const fetchDrones = () => {
        if(!window.electron) return;
        setIsLoading(true);
        setAvailableDrones({});
        window.electron.fetchDrones();
        setTimeout(() => {
            setIsLoading(false);
        }, 5000);
    }

    const connectToDrone = (drone) => {
        if(!window.electron) return;
        window.electron.connectToDrone(drone).then(status => {
            if (status?.error) {
                alert(status.error);
                setAvailableDrones(prev => 
                    prev.map(droneElement => 
                        droneElement.id === drone.id ? 
                            { ...drone, connecting: false } : droneElement
                    )
                )
            }
        });
    }

    const disconnectFromDrone = () => {
        if(isDroneConnected === false) return;
        if (!window.electron)  return;
        window.electron.disconnectFromDrone();
        setIsDroneConnected(false);
        setAvailableDrones([]);
    }

    const markAsConnecting = (drone) => {
        setAvailableDrones(prev => 
            prev.map(droneElement => 
                droneElement.id === drone.id ? 
                    { ...drone, connecting: true } : droneElement
            )
        )
        setTimeout(() => {
            setAvailableDrones(prev => 
                prev.map(droneElement => 
                    droneElement.id === drone.id ? 
                        { ...drone, connecting: false } : droneElement
                )
            )
        }, 5000)
    }

    const sendCommand = (command) => {
        if(!window.electron) return;
        //console.log(command);
        window.electron.sendCommand(command);
    }

    useEffect(() => {
        if(!window.electron) return;

        window.electron.checkBluetoothStatus().then(status => {
            setIsBluetoothOn(status);
        });
        window.electron.checkDroneStatus().then(drone => {
            if(!drone) {
                setIsDroneConnected(false);
            }
            else {
                const obj = JSON.parse(drone);
                setIsDroneConnected(obj);
            }
        })

        window.electron.onBluetoothStatusChange((status) => {
            setIsBluetoothOn(status);
        });

        window.electron.onDronesUpdate((drones) => {
            const newDrones = [];
            const keys = Object.keys(drones);
            const objects = Object.values(drones);
            for(let i = 0; i < keys.length; i++) {
                newDrones.push(objects[i]);
            }
            setAvailableDrones(newDrones);
        })

        window.electron.onDroneStatusUpdate((drone) => {
            if(!drone) {
                setIsDroneConnected(false);
            }
            else {
                const obj = JSON.parse(drone);
                setIsDroneConnected(obj);
            }
        })

        window.electron.onENVIRONMENTAL_CHAR((data) => {
            const view = new Int16Array(data.buffer);

            const pressure = ((view[1] & 0xFFFF) | (view[2] << 16)) / 100;
            setPressure(pressure);

            const battery = view[3] / 10;
            setBattery(battery);

            const temperature = view[4];
            setTemperature(temperature);

            const rssi = view[5] / 10;
            setRssi(rssi);

        })
        window.electron.onACC_GYRO_MAG_CHAR((data) => {
            const view = new Int16Array(data.buffer);
            let timestamp = (new Uint16Array(data.buffer)[0] << 3) * 1.0 / 1000;
            
            const accX = view[1] / (Math.PI * 1000) * 180;
            const accY = view[2] / (Math.PI * 1000) * 180;
            const accZ = view[3] / (Math.PI * 1000) * 180;
            const newAccData = {
                timestamp: timestamp,
                x: accX,
                y: accY,
                z: accZ,
            }
            setAcc(newAccData);

            const gyrX = view[4];
            const gyrY = view[5];
            const gyrZ = view[6];
            const newGyroData = {
                timestamp: timestamp,
                x: gyrX,
                y: gyrY,
                z: gyrZ,
            }
            setGyro(newGyroData);

            const magX = view[7];
            const magY = view[8];
            const magZ = view[9];
            const newMagData = {
                timestamp: timestamp,
                x: magX,
                y: magY,
                z: magZ,
            }
            setMag(newMagData);
        });
        window.electron.onARMING_CHAR((data) => {
            const view = new Int8Array(data.buffer);
            const status = view[2];
            switch(status) {
                case 0:
                    setStatus("Connected");
                    break;
                case 1:
                    setStatus("Armed");
                    break;
                default:
                    setStatus("Unknown");
                    break;
            }
        })

    }, [])
    
    return (
    <SocketContext.Provider value={{ 
            isDroneConnected, 
            isBluetoothOn, 
            sendCommand, 
            availableDrones, 
            fetchDrones, 
            isLoading,
            connectToDrone,
            disconnectFromDrone,
            markAsConnecting,
            acc,
            gyro,
            mag,
            battery,
            rssi,
            temperature,
            pressure,
            status,
        }}>
        {children}
    </SocketContext.Provider>
    )
}

export const useSocket = () => useContext(SocketContext);

