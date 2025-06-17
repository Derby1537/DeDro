const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld('electron', {
    checkBluetoothStatus: () => ipcRenderer.invoke("get-bluetooth-status"),
    checkDroneStatus: () => ipcRenderer.invoke("get-drone-status"),
    onBluetoothStatusChange: (callback) => {
        ipcRenderer.on('bluetooth-status', (_event, status) => callback(status));
    },
    onDronesUpdate: (callback) => {
        ipcRenderer.on('available-drone', (_event, drones) => callback(drones));
    },
    onDroneStatusUpdate: (callback) => {
        ipcRenderer.on('drone-status', (_event, status) => callback(status));
    },
    connectToDrone: (drone) => ipcRenderer.invoke('connect-to-drone', drone),
    disconnectFromDrone: () => ipcRenderer.send('disconnect-from-drone'),
    subscribeToTerminal: () => ipcRenderer.send('subscribe-to-terminal'),
    unsubscribeToTerminal: () => ipcRenderer.send('unsubscribe-to-terminal'),
    fetchDrones: () => ipcRenderer.send("fetch-drones"),
    sendCommand: (command) => ipcRenderer.invoke('send-command', command),
    getConfig: () => ipcRenderer.invoke("get-config"),
    saveConfig: (config) => ipcRenderer.invoke("save-config", config),
    onENVIRONMENTAL_CHAR: (callback) => {
        ipcRenderer.on('ENVIRONMENTAL_CHAR', (_event, data) => callback(data))
    },
    onACC_GYRO_MAG_CHAR: (callback) => {
        ipcRenderer.on('ACC_GYRO_MAG_CHAR', (_event, data) => callback(data))
    },
    onACC_EVENT_CHAR: (callback) => {
        ipcRenderer.on('ACC_EVENT_CHAR', (_event, data) => callback(data))
    },
    onARMING_CHAR: (callback) => {
        ipcRenderer.on('ARMING_CHAR', (_event, data) => callback(data))
    },
    onTERM_CHAR: (callback) => {
        ipcRenderer.on('TERM_CHAR', (_event, data) => callback(data))
    },
    onSTDERR_CHAR: (callback) => {
        ipcRenderer.on('STDERR_CHAR', (_event, data) => callback(data))
    }
})
