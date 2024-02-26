import React, {useEffect, useState} from 'react';
import Navbar from "../Components/Navbar";
import {useParams} from "react-router-dom";
import {baseUrl} from "../App";
import axios from "axios";
import {Paper} from "@mui/material";
import './TakeSurvey.css'
import Question from "../Components/TakeSurvey/Question"

interface SurveyData {
    survey_name: string;
    questions: QuestionData[];
}

interface QuestionData {
    question_text: string;
    question_type: number;
    comment: number;
    variants: string[];
}


const TakeSurvey = () => {
    const {guid} = useParams();
    const [state, setState] = useState<SurveyData>({
        survey_name: '',
        questions: []
    });
    const [inputValues, setInputValues] = useState<{ [key: number]: string }>({});
    const [comments, setComments] = useState<{ [key: number]: string }>({});
    const handleInputChange = (questionId: number, value: string) => {
        setInputValues((prevValues) => ({
            ...prevValues,
            [questionId]: value,
        }));
    };

    const handleComment = (questionId: number, value: string) => {
        setComments((prevValues) => ({
            ...prevValues,
            [questionId]: value,
        }));
    };

    const handleSubmit = () => {
        // Проверяем, что на все вопросы были даны ответы
        // const allQuestionsAnswered = state.questions.every((_question, index) => {
        //     const answer = inputValues[index];
        //     return answer && answer.trim() !== ""; // Проверяем, что ответ не пустой
        // });

        const allQuestionsAnswered = true;

        if (allQuestionsAnswered) {
            let ok = window.confirm("Вы уверены, что хотите отправить ответы? Пожалуйста, проверьте" +
                " их и нажмите Ок")
            if (ok) {
                axios.post(baseUrl + `/answers/${guid}`, {"answers": inputValues, "comments": comments}).then(function (response) {
                    if (response.status === 200) {
                        alert("Спасибо за участие в опросе!")
                        window.location.reload()
                    } else {
                        alert("Ответы отправить не удалось, технические проблемы. Попробуйте " +
                            "позже или обратитесь в техническую поддержку")
                    }
                });
            }
        } else {
            window.alert("Пожалуйста, ответьте на все вопросы!")
        }
    };

    useEffect(() => {
        axios.get(baseUrl + `/get_questions/${guid}`).then((r) => {
            const surveyData: SurveyData = r.data;
            setState(surveyData);
        })
        // eslint-disable-next-line
    }, [guid])
    return (
        <React.Fragment>
            <div>
                <Navbar showButtons={false} showLogout={false}/>
                {state.survey_name === "already"
                    ?
                    <Paper elevation={10} className="main_paper">
                        Вы уже проходили этот опрос
                    </Paper>
                    :
                    state.survey_name === "recall" ?
                        <Paper elevation={10} className="main_paper">
                            Опрос был отозван
                        </Paper>
                        :
                        <Paper elevation={10} className="main_paper">
                            {state.survey_name}
                            {state.questions.map((question, index) => (
                                <Question
                                    key={index}
                                    variants={question.variants}
                                    question_text={question.question_text}
                                    question_type={question.question_type}
                                    questionId={index}
                                    onInputChange={handleInputChange}
                                    comment={question.comment}
                                    onCommentChange={handleComment}
                                />
                            ))}
                            <button className="waves-effect waves-light btn btn-large" onClick={handleSubmit}>Отправить
                            </button>
                        </Paper>}
            </div>
        </React.Fragment>
    );
};

export default TakeSurvey;