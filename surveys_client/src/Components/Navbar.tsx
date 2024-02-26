import React from 'react';
import './Navbar.css'
import {Link} from "react-router-dom";
import Moment from "react-moment";
import 'moment/locale/ru';
import {logout} from "../Pages/Authorization";
interface NavbarProps {
    li_1?: string,
    li_2?: string,
    showLogout: boolean,
    showButtons: boolean
}

const Navbar: React.FC<NavbarProps> = ({li_1, li_2, showLogout, showButtons}) => {
    const user = localStorage.getItem('user');
    const username = user ? JSON.parse(user).fio : '';
    return (
        <div className="navbar-fixed">
            <nav>
                <div className="nav-wrapper navbar">
                    <div className="brand-logo center">Опросы</div>
                    {showButtons && <ul className="left hide-on-med-and-down">
                        <li className={li_1}><Link to='/create_survey'>Создать опрос</Link></li>
                        <li className={li_2}><Link to='/my_surveys'>Мои опросы</Link></li>
                    </ul>}
                    <ul className="right hide-on-med-and-down">
                        <li className="time">{username}</li>
                        <li className="time"><Moment format="HH:mm" interval={60000}/></li>
                        <li className="date"><Moment format="dddd, D MMMM YYYY" locale="ru"/></li>
                        {showLogout && <li><a href="#" onClick={logout}>Выйти</a></li>}
                    </ul>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;