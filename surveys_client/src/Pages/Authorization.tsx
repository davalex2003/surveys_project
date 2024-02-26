import React, {useState} from 'react';
import Navbar from "../Components/Navbar";
import {Paper} from "@mui/material";
import './Authorization.css'
import {baseUrl} from "../App";
import axios from "axios";
import {NavigateFunction, useNavigate} from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export const login = async (username: string, password: string, navigate: NavigateFunction, setPassword: Function) => {
    const response = await axios
        .post(`${baseUrl}/authorization`, {
            username,
            password,
        });
    if ("token" in response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
        navigate('/create_survey');
    } else {
        if (response.data.message === "Not a owner") {
            window.alert("У вас отсутствуют права для доступа к сервису.")
            window.location.reload();
        } else {
            window.alert("Неверный логин или пароль")
            setPassword('');
        }
    }
};

export const logout = () => {
    localStorage.removeItem("user");
};

const Authorization = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        login(username, password, navigate, setPassword);
    }
    return (
        <React.Fragment>
            <Navbar li_1={""} li_2={""} showLogout={false} showButtons={false}></Navbar>
            <div className="container">
                <Paper elevation={10} className="main_paper_auth">
                    Авторизация
                    <img src="favicon.ico" width={150} alt="logo"/>
                    <form className="form">
                        <div className="row">
                            <div className="input-field">
                                <input type="text" id="login" name="input" value={username}
                                       onChange={(e) => setUsername(e.target.value)}/>
                                <label htmlFor="input">Логин</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field">
                                <input type={showPassword ? "text" : "password"} id="password" name="input"
                                       value={password} onChange={(e) => setPassword(e.target.value)}/>
                                <label htmlFor="input">Пароль</label>
                                <span
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <VisibilityOffIcon/> : <VisibilityIcon/>}
                                </span>
                            </div>
                        </div>
                        <div className="row">
                            <button className="waves-effect waves-light btn" onClick={onClick}>Войти</button>
                        </div>
                    </form>
                </Paper>
            </div>
        </React.Fragment>
    );
};

export default Authorization;