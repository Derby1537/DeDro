import React, { useEffect, useState } from "react";

const Terminal = () => {
    const [terminalText, setTerminalText] = useState([]);

    const getTime = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const millis = String(now.getMilliseconds()).padStart(3, '0');

        return `${hours}:${minutes}:${seconds}:${millis}`;
    }

    useEffect(() => {
        if(!window.electron) return;
    }, []);

    return (
        <div className="d-flex flex-column gap-3">
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
