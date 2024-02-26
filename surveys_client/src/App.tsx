import React from 'react';
import './App.css';
import CreateSurvey from "./Pages/CreateSurvey";
import MySurveys from "./Pages/MySurveys";
import {BrowserRouter, Routes, Route, Navigate, useLocation} from "react-router-dom";
import TakeSurvey from "./Pages/TakeSurvey";
import Authorization from "./Pages/Authorization";
import EditSurvey from "./Pages/EditSurvey";

const PrivateRoute = ({children}: any) => {
    const isAuthenticated = !!localStorage.getItem('user');
    let location = useLocation();
    if (!isAuthenticated) {
        return <Navigate to="/" state={{from: location}} replace/>
    } else {
        return children
    }
};

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>

                    <Route
                        path="/"
                        element={<Authorization/>}
                    />

                    <Route
                        path="/my_surveys"
                        element={
                            <PrivateRoute>
                                <MySurveys/>
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/create_survey"
                        element={
                            <PrivateRoute>
                                <CreateSurvey/>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/edit_survey/:id"
                        element={<EditSurvey/>}
                    />
                    <Route
                        path="/take_survey/:guid"
                        element={<TakeSurvey/>}
                    />

                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
export const baseUrl = "https://shr01.mgts.corp.net:8000";