import React from "react";
import { NavLink } from "react-router-dom";

const SidebarLink = ({ label, to, icon }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
        >
            <img src={icon} alt="icon" width={"30"} />
            <span className="sidebar-link-label">{label}</span> 
        </NavLink>
    );
}

export default SidebarLink;
