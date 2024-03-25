import React, {useEffect, useState} from 'react';
import Navbar from "../Components/Navbar";
import AddQuestion from "../Components/CreateSurvey/AddQuestion";
import AddEmail from "../Components/CreateSurvey/AddEmail";
import './CreateSurvey.css'
import {useSelector} from "react-redux";
import {RootState} from "../store/store";
import {Question} from "../Components/CreateSurvey/Question";
import Email from "../Components/CreateSurvey/Email";
import axios from "axios";
import {baseUrl} from "../App";
import AddVisitor from "../Components/CreateSurvey/AddVisitor";
import {Visitor} from "../Components/CreateSurvey/Visitor";
import DatePicker, {registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ru from 'date-fns/locale/ru';
import {useNavigate, useParams} from "react-router-dom";
import {addQuestion, removeQuestions} from "../store/slices/questionSlice";
import {useDispatch} from "react-redux";
import {addVisitor, removeVisitors} from "../store/slices/visitorSlice";
import {addEmail, removeEmails} from "../store/slices/emailSlice";
import SurveyName from "../Components/CreateSurvey/SurveyName";

registerLocale('ru', ru)

interface SurveyData {
    survey_name: string,
    survey_visitors: string[],
    survey_email: string[],
    survey_send_date: string,
    questions: string[]
}

const EditSurvey = () => {
    const dispatch = useDispatch();
    const user = localStorage.getItem('user');
    const username = user ? JSON.parse(user).username : '';
    const token = user ? JSON.parse(user).token : '';
    const {id} = useParams();
    const url = baseUrl + `/survey_info/${id}`
    const handleSurveyNameChange = (newName: string) => {
        setSurveyName(newName);
    };
    useEffect(() => {
        dispatch(removeQuestions())
        dispatch(removeVisitors())
        dispatch(removeEmails())
        axios.get(url, {headers: {"Authorization": token}}).then((r) => {
            const surveyData: SurveyData = r.data;
            if (surveyData.survey_send_date === null) {
                surveyData.survey_send_date = (new Date()).toString()
            }
            surveyData.survey_name = ''
            setSurveyName(surveyData.survey_name);
            setStartDate(new Date(surveyData.survey_send_date));
            surveyData.questions.forEach((question) => {
                dispatch(addQuestion(question))
            })
            surveyData.survey_email.forEach((email) => {
                dispatch(addEmail(email))
            })
            surveyData.survey_visitors.forEach((visitor) => {
                dispatch(addVisitor(visitor))
            })
        })

    }, [dispatch, token, url, username])
    const questions_data = useSelector((state: RootState) => state.question.questions);
    const emails_data = useSelector((state: RootState) => state.email.emails);
    const visitors_data = useSelector((state: RootState) => state.visitor.visitors);
    const [survey_name, setSurveyName] = useState('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const navigate = useNavigate();
    const onClick = () => {
        if (startDate === null) {
            alert("Выберите время отправки опроса!")
        } else {
            if (questions_data.length === 0) {
                alert("В опросе нет вопросов!")
            } else if (emails_data.length === 0) {
                alert("В опросе нет получателей!")
            } else if (survey_name === '') {
                alert("Нет названия опроса!")
            } else {
                let ok = window.confirm("Вы уверены, что хотите изменить опрос? Пожалуйста, проверьте" +
                    " вопросы и получателей и нажмите Ок")
                if (ok) {
                    startDate.setMilliseconds(3 * 60 * 60 * 1000)
                    const send_data = {
                        'name': survey_name,
                        'questions': questions_data,
                        'emails': emails_data,
                        'owner': 'ADavidenko',
                        'visitors': visitors_data,
                        'send_date': startDate
                    }
                    axios({
                        url: `${baseUrl}/delete_survey/${id}`,
                        method: 'DELETE',
                        headers: {
                            "Authorization": token
                        }
                    })
                    console.log(send_data)
                    axios.post(`${baseUrl}/create_survey`, send_data, {
                        headers: {
                            "Authorization": token
                        }
                    }).then(function (response) {
                        if (response.data.length === 0) {
                            alert("Опрос успешно обновлён!")
                            navigate('/my_surveys')
                        } else {
                            alert(`Неверные e-mail: ${response.data}`)
                        }
                    });
                }
            }
        }
    }
    return (
        <React.Fragment>
            <Navbar li_1={""} li_2={""} showLogout={false} showButtons={true}></Navbar>
            <div className="container">
                <div className="row">
                    <div className="col xl6">
                        <SurveyName onNameChange={handleSurveyNameChange}/>
                    </div>
                    <div className="col xl2 offset-xl1">
                        <AddEmail/>
                    </div>
                    <div className="col xl1 domen">
                        @mgts.ru
                    </div>
                    <div className="col xl2">
                        <AddVisitor/>
                    </div>
                </div>
                <div className="row">
                    <div className="col xl6">
                        <AddQuestion/>
                        {questions_data.map((text, i) => {
                            return <Question text={text} index={i} key={i}/>
                        })}
                    </div>
                    <div className="col xl2 offset-xl1">
                        {emails_data.map((text, i) => {
                            return <Email text={text} index={i} key={i}/>
                        })}
                    </div>
                    <div className="col xl2 offset-xl1">
                        {visitors_data.map((text, i) => {
                            return <Visitor text={text} index={i} key={i}/>
                        })}
                    </div>
                </div>
                <div className="fixed_bottom" style={{marginTop: '20px', fontSize: '20px'}}>
                    <DatePicker todayButton="Сегодня"
                                placeholderText="Выберите дату и время отправки опроса"
                                isClearable
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                showTimeSelect
                                locale="ru"
                                dateFormat="Pp"
                                className="custom-datepicker"
                                minDate={new Date()}
                                timeCaption="Время"
                    />
                    <button
                        className="waves-effect waves-light btn btn-large"
                        onClick={onClick}
                        style={{fontSize: '30px'}}
                    >Сохранить
                    </button>
                </div>
            </div>
        </React.Fragment>
    );
};

export default EditSurvey;