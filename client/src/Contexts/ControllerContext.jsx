import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useSocket } from "./SocketContext";

const ControllerContext = createContext();

export const ControllerProvider = ({ children }) => {
    const { sendCommand, isDroneConnected } = useSocket();
    const [gamepad, setGamepad] = useState(null);
    const [controllerName, setControllerName] = useState("");
    const [controllerConnected, setControllerConnected] = useState(false);
    const [pressedButtons, setPressedButtons] = useState([]);
    const [axes, setAxes] = useState({});
    const [throttle, setThrottle] = useState(0);
    const [pitch, setPitch] = useState(127);
    const [roll, setRoll] = useState(127);
    const [yaw, setYaw] = useState(127);
    const defaultConfig = {
        throttle: {
            axis: "RightTrigger",
            min: 0,
            max: 1,
            sensitivity: 1,
        },
        pitch: {
            axis: "LeftStickY",
            min: -1,
            max: 1,
            sensitivity: 1,
        },
        roll: {
            axis: "LeftStickX",
            min: -1,
            max: 1,
            sensitivity: 1,
        },
        yaw: {
            axis: "RightStickX",
            min: -1,
            max: 1,
            sensitivity: 1,
        },
    }
    const [controllerConfig, setControllerConfig] = useState(defaultConfig);
    const buttonMapping = {
        0: 'South',
        1: 'East',
        2: 'West',
        3: 'North',
        4: 'LeftShoulder',
        5: 'RightShoulder',
        6: 'LeftTrigger',
        7: 'RightTrigger',
        8: 'Select',
        9: 'Start',
        10: 'LeftThumb',
        11: 'RightThumb',
        12: 'DPadUp',
        13: 'DPadDown',
        14: 'DPadLeft',
        15: 'DPadRight',
    };
    const [commands, setCommands] = useState({
        throttle: 0,
        pitch: 127.5,
        roll: 127.5,
        yaw: 127.5,
        calibrate: 0,
        arm: 0,
    })
    const commandsRef = useRef(commands);

    const calibrateDrone = (value) => {
        setCommands((prev) => ({
            ...prev,
            calibrate: value
        }))
    }
    const armDrone = (value) => {
        setCommands((prev) => ({
            ...prev,
            arm: value
        }))
    }

    const shallowEqual = (obj1, obj2) => {
        // Controlla che abbiano lo stesso numero di chiavi
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        if (keys1.length !== keys2.length) return false;

        // Confronta chiave per chiave
        for (let key of keys1) {
            if (obj1[key] !== obj2[key]) {
                return false;
            }
        }

        return true;
    };

    const setNewControllerConfig = async (config) => {
        try {
            const response = await window.electron.saveConfig(config);

            if (!response.success) {
                throw new Error(response.error || "Unknown error");
            }

            setControllerConfig(config);
            alert("Commands set successfully");
        } catch (e) {
            console.log('Error sending config:', e);
        }
    }

    useEffect(() => {
        if(isDroneConnected === false) {
            setCommands({});
        }
    }, [isDroneConnected])

    // Listening for controllers
    useEffect(() => {
        const addGamepad = (event) => {
            setGamepad(event.gamepad);
            setControllerName(event.gamepad.id);
            setControllerConnected(true);
        }
        const removeGamepad = (_event) => {
            const gamepads = Array.from(navigator.getGamepads()).filter(gp => gp);
            if(gamepads.length === 0) {
                setGamepad(null);
                setControllerName("");
                setControllerConnected(false);
            }
            else {
                setGamepad(gamepads[0]);
            }
        }
        window.addEventListener('gamepadconnected', addGamepad)
        window.addEventListener('gamepaddisconnected', removeGamepad);

        return () => {
            window.removeEventListener('gamepadconnected', addGamepad);
            window.removeEventListener('gamepaddisconnected', removeGamepad);
        }
    },[]);

    // Measuring gamepad
    useEffect(() => {
        if (!gamepad) return;

        const interval = setInterval(() => {
            const gp = navigator.getGamepads()[gamepad.index];
            if (!gp) return;
            const newPressedButtons = [];

            gp.buttons.forEach((button, index) => {
                if (button.pressed) {
                    newPressedButtons.push(buttonMapping[index]);
                }
            });
            if(!shallowEqual(newPressedButtons, pressedButtons)) {
                setPressedButtons(newPressedButtons);
            }

            const axesMapping = ["LeftStickX", "LeftStickY", "RightStickX", "RightStickY"];
            const axesObject = {};
            gp.axes.forEach((value, index) => {
                const axisName = axesMapping[index] || `axis${index}`;
                //axesObject[axisName] = Number(value.toFixed(2));
                axesObject[axisName] = Math.abs(value) > 0.08 ? Number(value.toFixed(2)) : 0;
            });

            axesObject["LeftTrigger"] = gp.buttons[6]?.value ?? 0;
            axesObject["RightTrigger"] = gp.buttons[7]?.value ?? 0;
            if(!shallowEqual(axes, axesObject)) {
                setAxes(axesObject)
            }
        }, 16);

        return () => clearInterval(interval);
    }, [gamepad, pressedButtons, axes]);

    useEffect(() => {
        const sensitivity = controllerConfig.throttle.sensitivity;
        const min = controllerConfig.throttle.min;
        const max = controllerConfig.throttle.max;
        const axis = controllerConfig.throttle.axis;
        const value = axes[axis];
        const throttle = ((value - min) / (max - min) * sensitivity) * 255;
        setThrottle(throttle);
        setCommands((prev) => ({
            ...prev,
            throttle: throttle
        }));
    }, [axes[controllerConfig.throttle.axis]])

    useEffect(() => {
        const sensitivity = controllerConfig.pitch.sensitivity;
        const min = controllerConfig.pitch.min;
        const max = controllerConfig.pitch.max;
        const axis = controllerConfig.pitch.axis;
        const value = -axes[axis];
        const pitch = ((0.5 - (sensitivity * 0.5)) + (value - min) / (max - min) * sensitivity) * 255;
        setPitch(pitch);
        setCommands((prev) => ({
            ...prev,
            pitch: pitch
        }));
    }, [axes[controllerConfig.pitch.axis]])

    useEffect(() => {
        const sensitivity = controllerConfig.roll.sensitivity;
        const min = controllerConfig.roll.min;
        const max = controllerConfig.roll.max;
        const axis = controllerConfig.roll.axis;
        const value = axes[axis];
        const roll = ((0.5 - (sensitivity * 0.5)) + (value - min) / (max - min) * sensitivity) * 255;
        setRoll(roll);
        setCommands((prev) => ({
            ...prev,
            roll: roll
        }));
    }, [axes[controllerConfig.roll.axis]]);

    useEffect(() => {
        const sensitivity = controllerConfig.yaw.sensitivity;
        const min = controllerConfig.yaw.min;
        const max = controllerConfig.yaw.max;
        const axis = controllerConfig.yaw.axis;
        const value = axes[axis];
        const yaw = ((0.5 - (sensitivity * 0.5)) + (value - min) / (max - min) * sensitivity) * 255;
        setYaw(yaw);
        setCommands((prev) => ({
            ...prev,
            yaw: yaw
        }));
    }, [axes[controllerConfig.yaw.axis]]);

    // Fetching commands
    useEffect(() => {
        if(!window.electron) return;
        window.electron.getConfig().then((data) => {
            setControllerConfig(data);
        });
    }, [])

    useEffect(() => {
        commandsRef.current = commands;
    }, [commands])

    // Sending commands
    useEffect(() => {
        const interval = setInterval(() => {
            sendCommand(commandsRef.current);
        }, 50);        
        return () => clearInterval(interval);
    }, [])

    return (
    <ControllerContext.Provider value={{ 
            controllerConnected,
            pressedButtons,
            controllerConfig,
            controllerName,
            defaultConfig,
            setNewControllerConfig,
            calibrateDrone,
            armDrone,
            commands,
            axes,
            throttle,
            pitch,
            roll,
            yaw,
        }}>
        {children}
    </ControllerContext.Provider>
    )
}

export const useController = () => useContext(ControllerContext);

