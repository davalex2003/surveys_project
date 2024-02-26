import React, {useState} from 'react';
import Navbar from "../Components/Navbar";
import AddQuestion from "../Components/CreateSurvey/AddQuestion";
import AddEmail from "../Components/CreateSurvey/AddEmail";
import SurveyName from "../Components/CreateSurvey/SurveyName";
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
import ChooseType from "../Components/CreateSurvey/ChooseType";
import AddAddress from "../Components/CreateSurvey/AddAddress";

registerLocale('ru', ru)
const CreateSurvey = () => {
    const url = baseUrl + "/create_survey"
    const [loading, setLoading] = useState(false);
    const questions_data = useSelector((state: RootState) => state.question.questions);
    const emails_data = useSelector((state: RootState) => state.email.emails);
    const visitors_data = useSelector((state: RootState) => state.visitor.visitors);
    const [survey_name, setSurveyName] = useState('');
    const user = localStorage.getItem('user');
    const username = user ? JSON.parse(user).username : '';
    const token = user ? JSON.parse(user).token : '';
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [selected_type, setSelectedType] = useState('')

    const handleSurveyNameChange = (newName: string) => {
        setSurveyName(newName);
    };

    const handleSelectedValue = (value: string) => {
        setSelectedType(value);
    };
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
                let ok = window.confirm("Вы уверены, что хотите отправить опрос? Пожалуйста, проверьте" +
                    " вопросы и получателей и нажмите Ок")
                if (ok) {
                    setLoading(true);
                    startDate.setMilliseconds(3 * 60 * 60 * 1000)
                    const send_data = {
                        'name': survey_name,
                        'questions': questions_data,
                        'emails': emails_data,
                        'owner': username,
                        'visitors': visitors_data,
                        'send_date': startDate
                    }
                    axios.post(url, send_data, {
                        headers: {
                            "username": username,
                            "token": token
                        }
                    }).then(function (response) {
                        setLoading(false);
                        if (response.data.length === 0) {
                            alert("Опрос успешно создан!")
                            window.location.reload()
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
            <Navbar li_1={"active"} li_2={""} showLogout={true} showButtons={true}></Navbar>
            {loading ? <div style={{
                    marginTop: '20px',
                    fontSize: '30px', // Увеличиваем размер текста
                    backgroundColor: '#0083CA', // Устанавливаем синий фон
                    color: 'white', // Устанавливаем белый цвет текста
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100px', // Устанавливаем высоту блока
                }}>Ожидайте, идёт формирование опроса...</div> :
                <div className="container">
                    <div className="row">
                        <div className="col xl6">
                            <SurveyName onNameChange={handleSurveyNameChange}/>
                        </div>
                        <div className="col xl2 offset-xl1">
                            <ChooseType onChange={handleSelectedValue}/>
                        </div>
                        <div className="col xl2 offset-xl1">
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
                            {selected_type === "e-mail" && <AddEmail/>}
                            {selected_type === "address" && <AddAddress/>}
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
                        >Создать опрос
                        </button>
                    </div>
                </div>}
        </React.Fragment>
    );
};

export default CreateSurvey;