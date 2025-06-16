import React, { useEffect, useState } from "react";
import { useController } from "../../Contexts/ControllerContext";
import { Button, Form, InputGroup } from "react-bootstrap";

const ControllerConfig = () => {
    const { controllerConfig, defaultConfig, setNewControllerConfig } = useController();
    const [currentConfig, setCurrentConfig] = useState(controllerConfig);
    const [axesOptions, setAxesOptions] = useState([]);
    const axisNames = {
        0: 'LeftStickX',
        1: 'LeftStickY',
        2: 'RightStickX',
        3: 'RightStickY'
    };

    useEffect(() => {
        const getGamepadAxes = () => {
            const gamepads = navigator.getGamepads();
            const connectedGamepad = gamepads[0]; // Prendiamo il primo gamepad connesso

            if (connectedGamepad) {
                const axes = connectedGamepad.axes.map((_, index) => ({
                    value: axisNames[index] || `Axis${index}`,
                    label: axisNames[index] || `Axis ${index}`
                }));
                const LeftTrigger = {
                    value: "LeftTrigger",
                    label: "LeftTrigger"
                }
                const RightTrigger = {
                    value: "RightTrigger",
                    label: "RightTrigger"
                }
                axes.push(LeftTrigger);
                axes.push(RightTrigger);
                setAxesOptions(axes);
            }
        };

        window.addEventListener("gamepadconnected", getGamepadAxes);
        window.addEventListener("gamepaddisconnected", getGamepadAxes);

        // Prima lettura manuale (senza aspettare l'evento)
        getGamepadAxes();

        // Cleanup eventi
        return () => {
            window.removeEventListener("gamepadconnected", getGamepadAxes);
            window.removeEventListener("gamepaddisconnected", getGamepadAxes);
        };
    }, []);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        setNewControllerConfig(currentConfig);
    }

    const resetValues = () => {
        setCurrentConfig(defaultConfig);
    }

    return (
        <div className="text-white p-2 my-5" style={{maxWidth: "600px"}}>
            <h1>Set new Commands</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="throttle">
                    <h2>Throttle</h2>
                    <Form.Label>Throttle Axis</Form.Label>
                    <Form.Select 
                        value={currentConfig.throttle.axis} 
                        aria-label="Select Throttle Axis"
                        onChange={(e) => setCurrentConfig(prevState => ({
                            ...prevState,
                            throttle: { ...prevState.throttle, axis: e.target.value }
                        }))}     
                    >
                        {axesOptions.length > 0 ? (
                            axesOptions.map((axis) => (
                                <option key={axis.value} value={axis.value}>
                                    {axis.label}
                                </option>
                            ))
                        ) : (
                            <option>No gamepad connected</option>
                        )}
                    </Form.Select>
                    <div className="mt-2">
                        <div className="d-flex justify-content-between my-2">
                            <span className="d-flex w-100 justify-content-end align-items-center gap-2">
                                Min: 
                                <span className="bg-light p-2 text-dark rounded">{currentConfig.throttle.min}</span>
                                <Button
                                    onClick={() => {
                                        const gamepad = navigator.getGamepads()[0];
                                        console.log(gamepad);
                                        let newValue;
                                        switch(currentConfig.throttle.axis) {
                                            case "LeftStickX":
                                                newValue = gamepad.axes[0];
                                                break;
                                            case "LeftStickY":
                                                newValue = gamepad.axes[1];
                                                break;
                                            case "RightStickX":
                                                newValue = gamepad.axes[2];
                                                break;
                                            case "RightStickY":
                                                newValue = gamepad.axes[3];
                                                break;
                                            case "LeftTrigger":
                                                newValue = gamepad.buttons[6].value;
                                                break;
                                            case "RightTrigger":
                                                newValue = gamepad.buttons[7].value;
                                                break;
                                            default:
                                                break;
                                        }
                                        setCurrentConfig(prevState => ({
                                            ...prevState,
                                            throttle: { ...prevState.throttle, min: newValue }
                                        }))
                                    }}
                                >
                                    Set new minimum value
                                </Button>
                            </span>
                        </div>
                        <p className="d-flex justify-content-between">
                            <span className="d-flex w-100 justify-content-end align-items-center gap-2">
                                Max: 
                                <span className="bg-light p-2 text-dark rounded">{currentConfig.throttle.max}</span>
                                <Button
                                    onClick={() => {
                                        const gamepad = navigator.getGamepads()[0];
                                        console.log(gamepad);
                                        let newValue;
                                        switch(currentConfig.throttle.axis) {
                                            case "LeftStickX":
                                                newValue = gamepad.axes[0];
                                                break;
                                            case "LeftStickY":
                                                newValue = gamepad.axes[1];
                                                break;
                                            case "RightStickX":
                                                newValue = gamepad.axes[2];
                                                break;
                                            case "RightStickY":
                                                newValue = gamepad.axes[3];
                                                break;
                                            case "LeftTrigger":
                                                newValue = gamepad.buttons[6].value;
                                                break;
                                            case "RightTrigger":
                                                newValue = gamepad.buttons[7].value;
                                                break;
                                            default:
                                                break;
                                        }
                                        setCurrentConfig(prevState => ({
                                            ...prevState,
                                            throttle: { ...prevState.throttle, max: newValue }
                                        }))
                                    }}
                                >
                                    Set new maximum value
                                </Button>
                            </span>
                        </p>

                        <p>Sensitivity:
                            <input
                                className="form-control"
                                type="number"
                                value={currentConfig.throttle.sensitivity}
                                min="0"
                                max="1"
                                step="0.01"
                                onChange={(e) => setCurrentConfig(prevState => ({
                                    ...prevState,
                                    throttle: { ...prevState.throttle, sensitivity: e.target.value }
                                }))}
                            />
                            <Form.Range 
                                value={currentConfig.throttle.sensitivity}
                                min="0"
                                max="1"
                                step="0.01"
                                onChange={(e) => setCurrentConfig(prevState => ({
                                    ...prevState,
                                    throttle: { ...prevState.throttle, sensitivity: e.target.value }
                                }))} 
                            />
                        </p>
                    </div>
                </Form.Group>
                <Form.Group controlId="pitch">
                    <h2>Pitch</h2>
                    <Form.Label>Pitch Axis</Form.Label>
                    <Form.Select 
                        value={currentConfig.pitch.axis} 
                        aria-label="Select Pitch Axis"
                        onChange={(e) => setCurrentConfig(prevState => ({
                            ...prevState,
                            pitch: { ...prevState.pitch, axis: e.target.value }
                        }))}     
                    >
                        {axesOptions.length > 0 ? (
                            axesOptions.map((axis) => (
                                <option key={axis.value} value={axis.value}>
                                    {axis.label}
                                </option>
                            ))
                        ) : (
                            <option>No gamepad connected</option>
                        )}
                    </Form.Select>
                    <div className="mt-2">
                        <div className="d-flex justify-content-between my-2">
                            <span className="d-flex w-100 justify-content-end align-items-center gap-2">
                                Min: 
                                <span className="bg-light p-2 text-dark rounded">{currentConfig.pitch.min}</span>
                                <Button
                                    onClick={() => {
                                        const gamepad = navigator.getGamepads()[0];
                                        console.log(gamepad);
                                        let newValue;
                                        switch(currentConfig.pitch.axis) {
                                            case "LeftStickX":
                                                newValue = gamepad.axes[0];
                                                break;
                                            case "LeftStickY":
                                                newValue = gamepad.axes[1];
                                                break;
                                            case "RightStickX":
                                                newValue = gamepad.axes[2];
                                                break;
                                            case "RightStickY":
                                                newValue = gamepad.axes[3];
                                                break;
                                            case "LeftTrigger":
                                                newValue = gamepad.buttons[6].value;
                                                break;
                                            case "RightTrigger":
                                                newValue = gamepad.buttons[7].value;
                                                break;
                                            default:
                                                break;
                                        }
                                        setCurrentConfig(prevState => ({
                                            ...prevState,
                                            pitch: { ...prevState.pitch, min: -newValue }
                                        }))
                                    }}
                                >
                                    Set new minimum value
                                </Button>
                            </span>
                        </div>
                        <p className="d-flex justify-content-between">
                            <span className="d-flex w-100 justify-content-end align-items-center gap-2">
                                Max: 
                                <span className="bg-light p-2 text-dark rounded">{currentConfig.pitch.max}</span>
                                <Button
                                    onClick={() => {
                                        const gamepad = navigator.getGamepads()[0];
                                        console.log(gamepad);
                                        let newValue;
                                        switch(currentConfig.pitch.axis) {
                                            case "LeftStickX":
                                                newValue = gamepad.axes[0];
                                                break;
                                            case "LeftStickY":
                                                newValue = gamepad.axes[1];
                                                break;
                                            case "RightStickX":
                                                newValue = gamepad.axes[2];
                                                break;
                                            case "RightStickY":
                                                newValue = gamepad.axes[3];
                                                break;
                                            case "LeftTrigger":
                                                newValue = gamepad.buttons[6].value;
                                                break;
                                            case "RightTrigger":
                                                newValue = gamepad.buttons[7].value;
                                                break;
                                            default:
                                                break;
                                        }
                                        setCurrentConfig(prevState => ({
                                            ...prevState,
                                            pitch: { ...prevState.pitch, max: -newValue }
                                        }))
                                    }}
                                >
                                    Set new maximum value
                                </Button>
                            </span>
                        </p>

                        <p>Sensitivity:
                            <input
                                className="form-control"
                                type="number"
                                value={currentConfig.pitch.sensitivity}
                                min="0"
                                max="1"
                                step="0.01"
                                onChange={(e) => setCurrentConfig(prevState => ({
                                    ...prevState,
                                    pitch: { ...prevState.pitch, sensitivity: e.target.value }
                                }))}
                            />
                            <Form.Range 
                                value={currentConfig.pitch.sensitivity}
                                min="0"
                                max="1"
                                step="0.01"
                                onChange={(e) => setCurrentConfig(prevState => ({
                                    ...prevState,
                                    pitch: { ...prevState.pitch, sensitivity: e.target.value }
                                }))} 
                            />
                        </p>
                    </div>
                </Form.Group>
                <Form.Group controlId="roll">
                    <h2>Roll</h2>
                    <Form.Label>Roll Axis</Form.Label>
                    <Form.Select 
                        value={currentConfig.roll.axis} 
                        aria-label="Select Roll Axis"
                        onChange={(e) => setCurrentConfig(prevState => ({
                            ...prevState,
                            roll: { ...prevState.roll, axis: e.target.value }
                        }))}     
                    >
                        {axesOptions.length > 0 ? (
                            axesOptions.map((axis) => (
                                <option key={axis.value} value={axis.value}>
                                    {axis.label}
                                </option>
                            ))
                        ) : (
                            <option>No gamepad connected</option>
                        )}
                    </Form.Select>
                    <div className="mt-2">
                        <div className="d-flex justify-content-between my-2">
                            <span className="d-flex w-100 justify-content-end align-items-center gap-2">
                                Min: 
                                <span className="bg-light p-2 text-dark rounded">{currentConfig.roll.min}</span>
                                <Button
                                    onClick={() => {
                                        const gamepad = navigator.getGamepads()[0];
                                        console.log(gamepad);
                                        let newValue;
                                        switch(currentConfig.roll.axis) {
                                            case "LeftStickX":
                                                newValue = gamepad.axes[0];
                                                break;
                                            case "LeftStickY":
                                                newValue = gamepad.axes[1];
                                                break;
                                            case "RightStickX":
                                                newValue = gamepad.axes[2];
                                                break;
                                            case "RightStickY":
                                                newValue = gamepad.axes[3];
                                                break;
                                            case "LeftTrigger":
                                                newValue = gamepad.buttons[6].value;
                                                break;
                                            case "RightTrigger":
                                                newValue = gamepad.buttons[7].value;
                                                break;
                                            default:
                                                break;
                                        }
                                        setCurrentConfig(prevState => ({
                                            ...prevState,
                                            roll: { ...prevState.roll, min: newValue }
                                        }))
                                    }}
                                >
                                    Set new minimum value
                                </Button>
                            </span>
                        </div>
                        <p className="d-flex justify-content-between">
                            <span className="d-flex w-100 justify-content-end align-items-center gap-2">
                                Max: 
                                <span className="bg-light p-2 text-dark rounded">{currentConfig.roll.max}</span>
                                <Button
                                    onClick={() => {
                                        const gamepad = navigator.getGamepads()[0];
                                        console.log(gamepad);
                                        let newValue;
                                        switch(currentConfig.roll.axis) {
                                            case "LeftStickX":
                                                newValue = gamepad.axes[0];
                                                break;
                                            case "LeftStickY":
                                                newValue = gamepad.axes[1];
                                                break;
                                            case "RightStickX":
                                                newValue = gamepad.axes[2];
                                                break;
                                            case "RightStickY":
                                                newValue = gamepad.axes[3];
                                                break;
                                            case "LeftTrigger":
                                                newValue = gamepad.buttons[6].value;
                                                break;
                                            case "RightTrigger":
                                                newValue = gamepad.buttons[7].value;
                                                break;
                                            default:
                                                break;
                                        }
                                        setCurrentConfig(prevState => ({
                                            ...prevState,
                                            roll: { ...prevState.roll, max: newValue }
                                        }))
                                    }}
                                >
                                    Set new maximum value
                                </Button>
                            </span>
                        </p>

                        <p>Sensitivity:
                            <input
                                className="form-control"
                                type="number"
                                value={currentConfig.roll.sensitivity}
                                min="0"
                                max="1"
                                step="0.01"
                                onChange={(e) => setCurrentConfig(prevState => ({
                                    ...prevState,
                                    roll: { ...prevState.roll, sensitivity: e.target.value }
                                }))}
                            />
                            <Form.Range 
                                value={currentConfig.roll.sensitivity}
                                min="0"
                                max="1"
                                step="0.01"
                                onChange={(e) => setCurrentConfig(prevState => ({
                                    ...prevState,
                                    roll: { ...prevState.roll, sensitivity: e.target.value }
                                }))} 
                            />
                        </p>
                    </div>
                </Form.Group>
                <Form.Group controlId="yaw">
                    <h2>Yaw</h2>
                    <Form.Label>Yaw Axis</Form.Label>
                    <Form.Select 
                        value={currentConfig.yaw.axis} 
                        aria-label="Select Yaw Axis"
                        onChange={(e) => setCurrentConfig(prevState => ({
                            ...prevState,
                            yaw: { ...prevState.yaw, axis: e.target.value }
                        }))}     
                    >
                        {axesOptions.length > 0 ? (
                            axesOptions.map((axis) => (
                                <option key={axis.value} value={axis.value}>
                                    {axis.label}
                                </option>
                            ))
                        ) : (
                            <option>No gamepad connected</option>
                        )}
                    </Form.Select>
                    <div className="mt-2">
                        <div className="d-flex justify-content-between my-2">
                            <span className="d-flex w-100 justify-content-end align-items-center gap-2">
                                Min: 
                                <span className="bg-light p-2 text-dark rounded">{currentConfig.yaw.min}</span>
                                <Button
                                    onClick={() => {
                                        const gamepad = navigator.getGamepads()[0];
                                        console.log(gamepad);
                                        let newValue;
                                        switch(currentConfig.yaw.axis) {
                                            case "LeftStickX":
                                                newValue = gamepad.axes[0];
                                                break;
                                            case "LeftStickY":
                                                newValue = gamepad.axes[1];
                                                break;
                                            case "RightStickX":
                                                newValue = gamepad.axes[2];
                                                break;
                                            case "RightStickY":
                                                newValue = gamepad.axes[3];
                                                break;
                                            case "LeftTrigger":
                                                newValue = gamepad.buttons[6].value;
                                                break;
                                            case "RightTrigger":
                                                newValue = gamepad.buttons[7].value;
                                                break;
                                            default:
                                                break;
                                        }
                                        setCurrentConfig(prevState => ({
                                            ...prevState,
                                            yaw: { ...prevState.yaw, min: newValue }
                                        }))
                                    }}
                                >
                                    Set new minimum value
                                </Button>
                            </span>
                        </div>
                        <p className="d-flex justify-content-between">
                            <span className="d-flex w-100 justify-content-end align-items-center gap-2">
                                Max: 
                                <span className="bg-light p-2 text-dark rounded">{currentConfig.yaw.max}</span>
                                <Button
                                    onClick={() => {
                                        const gamepad = navigator.getGamepads()[0];
                                        console.log(gamepad);
                                        let newValue;
                                        switch(currentConfig.yaw.axis) {
                                            case "LeftStickX":
                                                newValue = gamepad.axes[0];
                                                break;
                                            case "LeftStickY":
                                                newValue = gamepad.axes[1];
                                                break;
                                            case "RightStickX":
                                                newValue = gamepad.axes[2];
                                                break;
                                            case "RightStickY":
                                                newValue = gamepad.axes[3];
                                                break;
                                            case "LeftTrigger":
                                                newValue = gamepad.buttons[6].value;
                                                break;
                                            case "RightTrigger":
                                                newValue = gamepad.buttons[7].value;
                                                break;
                                            default:
                                                break;
                                        }
                                        setCurrentConfig(prevState => ({
                                            ...prevState,
                                            yaw: { ...prevState.yaw, max: newValue }
                                        }))
                                    }}
                                >
                                    Set new maximum value
                                </Button>
                            </span>
                        </p>

                        <p>Sensitivity:
                            <input
                                className="form-control"
                                type="number"
                                value={currentConfig.yaw.sensitivity}
                                min="0"
                                max="1"
                                step="0.01"
                                onChange={(e) => setCurrentConfig(prevState => ({
                                    ...prevState,
                                    yaw: { ...prevState.yaw, sensitivity: e.target.value }
                                }))}
                            />
                            <Form.Range 
                                value={currentConfig.yaw.sensitivity}
                                min="0"
                                max="1"
                                step="0.01"
                                onChange={(e) => setCurrentConfig(prevState => ({
                                    ...prevState,
                                    yaw: { ...prevState.yaw, sensitivity: e.target.value }
                                }))} 
                            />
                        </p>
                    </div>
                </Form.Group>
                <div className="d-flex justify-content-end p-2 gap-2">
                    <Button onClick={resetValues} variant="secondary">Default values</Button>
                    <Button type="submit">Save config</Button>
                </div>
            </Form>
        </div>
    )
}

export default ControllerConfig;
