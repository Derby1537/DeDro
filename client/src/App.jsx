import { useEffect, useState } from "react";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, HashRouter as Router, Routes } from "react-router-dom";
import Topbar from "./components/Topbar/TopBar";
import SidebarMenu from "./components/Sidebar/SidebarMenu";
import DroneView from "./Pages/Drones/DroneView";
import ControllerView from "./Pages/Controller/ControllerView";
import { SocketProvider } from "./Contexts/SocketContext";
import { ControllerProvider } from "./Contexts/ControllerContext";

const App = () => {
    useEffect(() => {
        document.title = "DeDro";
    })
    return (
        <SocketProvider>
            <ControllerProvider>
                <Router>
                    <div className="d-flex flex-column h-100">
                        <Topbar/>
                        <div className="flex-grow-1 d-flex h-100 overflow-y-hidden">
                            <SidebarMenu/>
                            <div className="w-100" style={{height: 'calc(100%)', overflowY: 'scroll'}}>
                                <Routes>
                                    <Route path="/" element={<DroneView/>}/>
                                    <Route path="/controller" element={<ControllerView/>}/>
                                </Routes>
                            </div>
                        </div>
                    </div>
                </Router>
            </ControllerProvider>
        </SocketProvider>
    )
}

export default App;

