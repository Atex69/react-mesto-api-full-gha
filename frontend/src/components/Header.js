import { Link } from "react-router-dom";
import headerLogo from "../images/mestoLogo.svg";
import React from "react";
function Header(props) {
    return (
<header className="header">
    <img
        alt="логотип"
        className="header__logo"
        src={headerLogo}
    />
    <nav className="header__auth">
        <p className="header__text">{props.mail}</p>
        <Link to={props.route} className="header__link" type="button" onClick={props.onClick}>{props.title}</Link>
    </nav>
</header>
    );
}

export default Header;