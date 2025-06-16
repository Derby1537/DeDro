import React from "react";
import "./sidebarMenu.css"
import SidebarLink from "./SidebarLink";
import controller from "../../assets/controller.svg"
import drone from "../../assets/drone.svg"

const SidebarMenu = () => {
    return (
        <div className="sidebar">
            <SidebarLink
                label="Drone"
                to="/"
                icon={drone}
            />
            <SidebarLink
                label="Controller"
                to="/controller"
                icon={controller}
            />
        </div>
    );
}

export default SidebarMenu;
