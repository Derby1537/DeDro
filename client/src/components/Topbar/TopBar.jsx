import React from "react";
import Logo from "../../assets/logo.svg"
import "./topbar.css"

const Topbar = () => {
    const img = (<img src={Logo} alt="Logo" width={50}/>);
    return (
        <div className="top-bar">
             {img}DeDro
        </div>
    );
}

export default Topbar;
