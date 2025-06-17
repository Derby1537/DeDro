import React, { useEffect, useRef, useState } from "react";

const Terminal = () => {
    const [terminalText, setTerminalText] = useState([]);
    const inputRef = useRef(null);

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

        window.electron.subscribeToTerminal();
        const decoder = new TextDecoder("utf-8");

        window.electron.onTERM_CHAR((data) => {
            const view = new Int8Array(data.buffer)
            const str = decoder.decode(view);
            const timestamp = getTime();
            setTerminalText((prev) => [...prev, <div key={timestamp}>&lt;{timestamp}&gt;{str}</div>]);
        })
        window.electron.onSTDERR_CHAR((data) => {
            const view = new Int8Array(data.buffer)
            const str = decoder.decode(view);
            const timestamp = getTime();
            setTerminalText((prev) => [...prev, <div className="text-danger" key={timestamp}>&lt;{timestamp}&gt;{str}</div>]);
        })


        const timestamp = getTime();
        setTerminalText((prev) => [...prev, <div key={timestamp}>&lt;{timestamp}&gt;Connected to drone</div>]);

        return () => {
            window.electron.unsubscribeToTerminal();
        }
    }, []);

    useEffect(() => {
        inputRef.current?.scrollIntoView();
    }, [terminalText])

    return (
        <div className="d-flex flex-column gap-3">
            <div className="terminal">
                <div className="top-bar">BLE Terminal</div> 
                <div className="outer-terminal">
                    <div className="inner-terminal">
                        {terminalText}
                        <div ref={inputRef}></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Terminal;
