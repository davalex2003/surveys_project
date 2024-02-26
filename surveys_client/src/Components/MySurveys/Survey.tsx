import React from 'react';
import {Card, CardContent, CardHeader} from "@mui/material";
import './Survey.css'
import axios from 'axios';
import {baseUrl} from "../../App";
import {useNavigate} from 'react-router-dom';

interface SurveyProps {
    name: string,
    id: number,
    completed: number,
    total: number,
    bd_id: number,
    date: string,
    recall: number,
    copy: number
}

const correct_date = (date: string) => {
    let correct = new Date(date);
    const day = correct.getDate().toString().padStart(2, '0');
    const month = (correct.getMonth() + 1).toString().padStart(2, '0');
    const year = correct.getFullYear();
    const hours = correct.getHours().toString().padStart(2, '0');
    const minutes = correct.getMinutes().toString().padStart(2, '0');

    return `${day}.${month}.${year} г. ${hours}:${minutes}`;
};

const downloadExcelFile = (name: string, bd_id: number) => {
    const user = localStorage.getItem('user');
    const username = user ? JSON.parse(user).username : '';
    const token = user ? JSON.parse(user).token : '';
    axios({
        url: `${baseUrl}/get_survey_file/${bd_id}`,
        method: 'GET',
        responseType: 'blob',
        headers: {
            "username": username, "token": token
        }
    })
        .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${name}.xlsx`);
            document.body.appendChild(link);
            link.click();
        })
        .catch((error) => {
            console.error('Ошибка при загрузке файла:', error);
        });

};

const deleteSurvey = (bd_id: number) => {
    let ok = window.confirm("Вы уверены, что хотите удалить опрос? Если да, нажмите Ок.")
    if (ok) {
        const user = localStorage.getItem('user');
        const username = user ? JSON.parse(user).username : '';
        const token = user ? JSON.parse(user).token : '';
        axios({
            url: `${baseUrl}/delete_front_survey/${bd_id}`,
            method: 'DELETE',
            headers: {
                "username": username, "token": token
            }
        })
        window.location.reload()
    }
}

const recallSurvey = (bd_id: number) => {
    let ok = window.confirm("Вы уверены, что хотите отозвать опрос? Если да, нажмите Ок.")
    if (ok) {
        const user = localStorage.getItem('user');
        const username = user ? JSON.parse(user).username : '';
        const token = user ? JSON.parse(user).token : '';
        axios({
            url: `${baseUrl}/recall_survey/${bd_id}`,
            method: 'POST',
            headers: {
                "username": username, "token": token
            }
        })
        window.location.reload()
    }
}

interface SurveyData {
    survey_name: string,
    survey_visitors: string[],
    survey_email: string[],
    survey_send_date: string,
    questions: string[]
}

const copySurvey = (bd_id: number) => {
    const url = baseUrl + `/survey_info/${bd_id}`
    const user = localStorage.getItem('user');
    const username = user ? JSON.parse(user).username : '';
    const token = user ? JSON.parse(user).token : '';
    axios.get(url, {headers: {"username": username, "token": token}}).then((r) => {
        const surveyData: SurveyData = r.data;
        const send_data = {
            'name': surveyData.survey_name + " (копия)",
            'questions': surveyData.questions,
            'emails': surveyData.survey_email,
            'owner': username,
            'visitors': surveyData.survey_visitors
        }
        axios.post(baseUrl + "/create_survey", send_data, {
            headers: {
                "username": username,
                "token": token
            }
        })
        window.location.reload()
    })
}

const Survey: React.FC<SurveyProps> = (props) => {
    let correct;
    let classname_1 = "waves-effect waves-light btn";
    let classname_2 = "waves-effect waves-light btn disabled";
    if (new Date() > new Date(props.date)) {
        classname_1 = "waves-effect waves-light btn disabled"
        classname_2 = "waves-effect waves-light btn";
    }
    const navigate = useNavigate();
    if (props.recall === 1) {
        correct = "Отозван";
        classname_2 = "waves-effect waves-light btn disabled";
        classname_1 = "waves-effect waves-light btn"
    } else if (props.copy === 1) {
        correct = "Скопирован"
        classname_1 = "waves-effect waves-light btn"
        classname_2 = "waves-effect waves-light btn disabled";
    } else {
        correct = correct_date(props.date);
    }
    return (
        <Card square className="my_survey" elevation={0}>
            <CardHeader title={`№${props.id + 1}. ${props.name}`} className="survey_title"/>
            <CardContent>{correct}</CardContent>
            <CardContent>Прошли: {props.completed}\{props.total}</CardContent>
            <div className="survey_buttons">
                <button className="waves-effect waves-light btn"
                        onClick={() => downloadExcelFile(props.name, props.bd_id)}>
                    Отчёт
                </button>
                <button className={classname_1} onClick={() => navigate(`/edit_survey/${props.bd_id}`)}>
                    Редактировать
                </button>
                <button className={classname_2} onClick={() => recallSurvey(props.bd_id)}>
                    Отозвать
                </button>
                <button className="waves-effect waves-light btn" onClick={() => copySurvey(props.bd_id)}>
                    Скопировать
                </button>
                <button className="waves-effect waves-light btn" onClick={() => deleteSurvey(props.bd_id)}>
                    Удалить
                </button>
            </div>
        </Card>
    );
};

export default Survey;