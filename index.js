const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const noble = require("@stoprocent/noble");
const fs = require("fs");

const configPath = path.join(app.getPath("userData"), "config.json");

let isBluetoothOn = false;
let win;
let droneBluetoothPeripheral = null;
let discoveredPeripheral = {};
let bluetoothPeripherals = {};
const commandsArray = [];
let commandsInterval;

const {
    HW_SERV_UUID,
    CONSOLE_SERV_UUID,
    ENVIRONMENTAL_CHAR_UUID,
    ACC_GYRO_MAG_CHAR_UUID,
    ACC_EVENT_CHAR_UUID,
    ARMING_CHAR_UUID,
    MAX_CHAR_UUID,
    TERM_CHAR_UUID,
    STDERR_CHAR_UUID,
} = require("./ble_defines");

const commands = {
    throttle: {
        axis: "RightTrigger",
        min: 0,
        max: 1,
        sensitivity: "0.5",
    },
    pitch: {
        axis: "LeftStickY",
        min: -1,
        max: 1,
        sensitivity: "0.5",
    },
    roll: {
        axis: "LeftStickX",
        min: -1,
        max: 1,
        sensitivity: "0.5",
    },
    yaw: {
        axis: "RightStickX",
        min: -1,
        max: 1,
        sensitivity: "0.5",
    },
};

const createWindow = () => {
    win = new BrowserWindow({
        width: 1600,
        height: 900,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        },
        icon: path.join(__dirname, "assets", "DeDro.png"),
    });

    if (process.argv.includes("--dev")) {
        win.loadURL("http://localhost:3000");
    } else {
        win.loadFile(path.join(__dirname, "client", "build", "index.html"));
    }

    win.on("closed", () => {
        win = null;
    });
};

const createConfigFile = async () => {
    try {
        if (!fs.existsSync(configPath)) {
            fs.writeFileSync(configPath, JSON.stringify(commands, null, 2), "utf8");
        }
    } catch (e) {
        console.log(e);
    }
};

app.whenReady().then(() => {
    createWindow();

    createConfigFile();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

    noble.on("stateChange", (state) => {
        isBluetoothOn = state === "poweredOn";
        win.webContents.send("bluetooth-status", isBluetoothOn);
    });
});

ipcMain.on("fetch-drones", () => {
    discoveredPeripheral = {};
    bluetoothPeripherals = {};
    if (!isBluetoothOn) {
        return;
    }
    noble.startScanning([], false);
    setTimeout(() => {
        noble.stopScanning();
    }, 5000);
});

ipcMain.handle("connect-to-drone", async (_event, drone) => {
    if (droneBluetoothPeripheral) {
        return;
    }
    if (!isBluetoothOn) return;
    if (!drone?.id) return;
    const peripheral = bluetoothPeripherals[drone.id];

    if (!peripheral) return;
    try {
        await peripheral.connectAsync();
        droneBluetoothPeripheral = peripheral;

        const services = await peripheral.discoverServicesAsync([
            //HW_SERV_UUID,
            //CONSOLE_SERV_UUID,
            //CONFIG_SERV_UUID
        ]);
        for (let i = 0; i < services.length; i++) {
            if (services[i].uuid === HW_SERV_UUID) {
                const characteristics = await services[i].discoverCharacteristicsAsync([
                    ENVIRONMENTAL_CHAR_UUID,
                    ACC_GYRO_MAG_CHAR_UUID,
                    ACC_EVENT_CHAR_UUID,
                    ARMING_CHAR_UUID,
                    MAX_CHAR_UUID,
                ]);
                for (let j = 0; j < characteristics.length; j++) {
                    if (characteristics[j].uuid === ENVIRONMENTAL_CHAR_UUID) {
                        droneBluetoothPeripheral.ENVIRONMENTAL_CHAR_UUID =
                            characteristics[j];
                        await characteristics[j].subscribeAsync();
                        characteristics[j].on("data", (data, _isNotification) => {
                            if (win) {
                                win.webContents.send("ENVIRONMENTAL_CHAR", data);
                            }
                        });
                    }
                    if (characteristics[j].uuid === ACC_GYRO_MAG_CHAR_UUID) {
                        droneBluetoothPeripheral.ACC_GYRO_MAG_CHAR_UUID =
                            characteristics[j];
                        await characteristics[j].subscribeAsync();
                        characteristics[j].on("data", (data, _isNotification) => {
                            if (win) {
                                win.webContents.send("ACC_GYRO_MAG_CHAR", data);
                            }
                        });
                    }
                    if (characteristics[j].uuid === ACC_EVENT_CHAR_UUID) {
                        droneBluetoothPeripheral.ACC_EVENT_CHAR_UUID = characteristics[j];
                        await characteristics[j].subscribeAsync();
                        characteristics[j].on("data", (data, _isNotification) => {
                            if (win) {
                                win.webContents.send("ACC_EVENT_CHAR", data);
                            }
                        });
                    }
                    if (characteristics[j].uuid === ARMING_CHAR_UUID) {
                        droneBluetoothPeripheral.ARMING_CHAR_UUID = characteristics[j];
                        await characteristics[j].subscribeAsync();
                        characteristics[j].on("data", (data, _isNotification) => {
                            if (win) {
                                win.webContents.send("ARMING_CHAR", data);
                            }
                        });
                    }
                    if (characteristics[j].uuid === MAX_CHAR_UUID) {
                        droneBluetoothPeripheral.MAX_CHAR_UUID = characteristics[j];
                    }
                }
            }
            if (services[i].uuid === CONSOLE_SERV_UUID && services.length < 4) {
                const characteristics = await services[i].discoverCharacteristicsAsync([
                    TERM_CHAR_UUID,
                    STDERR_CHAR_UUID,
                ]);
                for (let j = 0; j < characteristics.length; j++) {
                    if (characteristics[j].uuid === TERM_CHAR_UUID) {
                        droneBluetoothPeripheral.TERM_CHAR_UUID = characteristics[j];
                    }
                    if (characteristics[j].uuid === STDERR_CHAR_UUID) {
                        droneBluetoothPeripheral.STDERR_CHAR_UUID = characteristics[j];
                    }
                }
            }
        }

        if (!droneBluetoothPeripheral.MAX_CHAR_UUID) {
            /*Comment when you want to connect to anything*/
            await peripheral.disconnectAsync();
            droneBluetoothPeripheral = null;
            return { error: "Unsupported drone" };
        }

        //socket.emit('drone-status', peripheral.toString());
        if (win) {
            win.webContents.send("drone-status", peripheral.toString());
        }

        peripheral.on("disconnect", () => {
            droneBluetoothPeripheral = null;
            if (win) {
                win.webContents.send("drone-status", false);
            }
        });

        return { success: true };
    } catch (e) {
        console.log(e);
        await droneBluetoothPeripheral[drone.id]?.disconnectAsync();
        return { error: "Unsupported drone" };
    }
});

ipcMain.handle("send-command", async (_event, command) => {
    if (!droneBluetoothPeripheral) return;
    if (!droneBluetoothPeripheral.MAX_CHAR_UUID) return;

    let throttle = parseInt(command.throttle);
    if (throttle < 0) throttle = 0;
    if (throttle > 255) throttle = 255;

    let pitch = parseInt(command.pitch);
    if (pitch < 0) pitch = 0;
    if (pitch > 255) pitch = 255;

    let roll = parseInt(command.roll);
    if (roll < 0) roll = 0;
    if (roll > 255) roll = 255;

    let yaw = parseInt(command.yaw);
    if (yaw < 0) yaw = 0;
    if (yaw > 255) yaw = 255;

    let commandforCalibration = 0;
    if (command.calibrate === 1) {
        commandforCalibration = 2;
    }
    if (command.arm === 1) {
        commandforCalibration = 4;
    }

    const dataToSend = Buffer.from([
        0,
        yaw,
        throttle,
        roll,
        pitch,
        0,
        commandforCalibration,
    ]);
    commandsArray.push(dataToSend);
    return;
    try {
        droneBluetoothPeripheral.MAX_CHAR_UUID.write(dataToSend);
    } catch (e) {
        console.log(e);
    }
});

ipcMain.on("subscribe-to-terminal", async () => {
    if (!droneBluetoothPeripheral) return;
    if (!droneBluetoothPeripheral.TERM_CHAR_UUID) return;
    if (!droneBluetoothPeripheral.STDERR_CHAR_UUID) return;

    try {
        await droneBluetoothPeripheral.TERM_CHAR_UUID.subscribeAsync();
        droneBluetoothPeripheral.TERM_CHAR_UUID.on(
            "data",
            (data, _isNotification) => {
                if (win) {
                    win.webContents.send("TERM_CHAR", data);
                }
            },
        );

        await droneBluetoothPeripheral.STDERR_CHAR_UUID.subscribeAsync();
        droneBluetoothPeripheral.STDERR_CHAR_UUID.on(
            "data",
            (data, _isNotification) => {
                if (win) {
                    win.webContents.send("STDERR_CHAR", data);
                }
            },
        );
    } catch (e) {
        console.log(e);
    }
});

ipcMain.on("unsubscribe-to-terminal", async () => {
    if (!droneBluetoothPeripheral.TERM_CHAR_UUID) return;
    if (!droneBluetoothPeripheral.STDERR_CHAR_UUID) return;

    try {
        await droneBluetoothPeripheral.TERM_CHAR_UUID.unsubscribeAsync();
        await droneBluetoothPeripheral.STDERR_CHAR_UUID.unsubscribeAsync();
    } catch (e) {
        console.log(e);
    }
});

commandsInterval = setInterval(() => {
    if (!droneBluetoothPeripheral) return;
    if (!droneBluetoothPeripheral.MAX_CHAR_UUID) return;

    const commandToSend = commandsArray.shift();
    if (!commandToSend) return;

    droneBluetoothPeripheral.MAX_CHAR_UUID.write(commandToSend);
}, 20);

ipcMain.on("disconnect-from-drone", async () => {
    if (!droneBluetoothPeripheral) return;

    await droneBluetoothPeripheral.disconnect();
    droneBluetoothPeripheral = null;
});

noble.on("discover", async (peripheral) => {
    const id = peripheral.id;
    const advertisement = peripheral.advertisement;
    const localName = advertisement.localName;

    if (!localName) return;

    if (discoveredPeripheral[id]) {
        return;
    }

    bluetoothPeripherals[id] = peripheral;
    discoveredPeripheral[id] = {
        id: peripheral.id,
        name: localName,
        rssi: peripheral.rssi,
    };

    if (win) {
        win.webContents.send("available-drone", discoveredPeripheral);
    }
});

ipcMain.handle("get-bluetooth-status", () => {
    return isBluetoothOn;
});
ipcMain.handle("get-drone-status", () => {
    return droneBluetoothPeripheral?.toString();
});

ipcMain.handle("get-config", async () => {
    try {
        //const configPath = path.join(__dirname, "config.json");
        const data = fs.readFileSync(configPath, "utf8");
        const json = JSON.parse(data);
        return json;
    } catch (e) {
        console.log(e);
        return { error: "Unable to read config file" };
    }
});
ipcMain.handle("save-config", async (_event, newConfig) => {
    try {
        //const configPath = path.join(__dirname, "config.json");
        fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2), "utf8");
        return { success: true };
    } catch (e) {
        console.log(e);
        return { error: "Unable to save config file" };
    }
});

app.on("window-all-closed", () => {
    app.quit();
});
