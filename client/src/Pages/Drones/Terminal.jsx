import React, { useEffect, useState } from "react";
import { useSocket } from "../../Contexts/SocketContext"; 
import { Button } from "react-bootstrap";

const Terminal = () => {
    const { socket } = useSocket();
    const [terminalText, setTerminalText] = useState([]);

    const subscribeToTerminal = () => {
        if(!socket) {
            return;
        }
        socket.emit('subscribe-to-terminal');
    }

    const getTime = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const millis = String(now.getMilliseconds()).padStart(3, '0');

        return `${hours}:${minutes}:${seconds}:${millis}`;
    }

    useEffect(() => {
        if(!socket) return;
        const handleTermChar = (data) => {
            const newElement = (<div>{getTime()}:{data}</div>)
            setTerminalText(currentText => [
                ...currentText,
                newElement
            ]);
        }
        const handleStderrChar = (data) => {
            const newElement = (<div className="text-danger">{getTime()}:{data}</div>)
            setTerminalText(currentText => [
                ...currentText,
                newElement
            ]);
        }
        setTerminalText(currentText => [
            ...currentText,
            <div key={getTime()}>{getTime()}: Connected to drone</div>
        ]);
        setTerminalText(currentText => [
            ...currentText,
        ]);

        socket.on('TERM_CHAR', handleTermChar)
        socket.on('STDERR_CHAR', handleStderrChar)

        return () => {
            socket.off('TERM_CHAR', handleTermChar);
            socket.off('STDERR_CHAR', handleStderrChar);
        }
    }, [socket]);

    return (
        <div className="d-flex flex-column gap-3">
            <div>
                <Button onClick={subscribeToTerminal}>Open Terminal</Button>
            </div>
            <div className="terminal">
                <div className="top-bar">BLE Terminal</div> 
                <div className="outer-terminal">
                    <div className="inner-terminal">
                        {terminalText}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Terminal;
