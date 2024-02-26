import React, {useEffect, useState} from 'react';
import Navbar from "../Components/Navbar";
import axios from "axios";
import {baseUrl} from "../App";
import Survey from "../Components/MySurveys/Survey"

interface SurveyData {
    name: string,
    id: number,
    total: number,
    completed: number,
    date: string,
    recall: number,
    copy: number
}

const MySurveys = () => {
    const user = localStorage.getItem('user');
    const username = user ? JSON.parse(user).username : '';
    const token = user ? JSON.parse(user).token : '';
    const [state, setState] = useState<SurveyData[]>([]);
    useEffect(() => {
        axios.get(baseUrl + `/get_surveys/${username}`, {headers: {"username": username, "token": token}}).then((r) => {
            const surveysData: SurveyData[] = r.data;
            setState(surveysData);
        })
    }, [username, token])
    return (
        <React.Fragment>
            <div>
                <Navbar li_1={""} li_2={"active"} showLogout={true} showButtons={true}></Navbar>
                {state.map((survey, index) => (
                    <Survey key={index} id={index} name={survey.name} completed={survey.completed} total={survey.total}
                            bd_id={survey.id} date={survey.date} recall={survey.recall} copy={survey.copy}/>
                ))}
            </div>
        </React.Fragment>
    );
};

export default MySurveys;