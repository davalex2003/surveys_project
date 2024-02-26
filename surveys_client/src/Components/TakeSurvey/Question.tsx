import React from 'react';
import {Card, CardContent, CardHeader} from "@mui/material";
import './Question.css'

interface QuestionProps {
    question_text: string,
    question_type: number,
    variants: string[],
    questionId: number,
    onInputChange: (questionId: number, value: string) => void,
    onCommentChange: (questionId: number, value: string) => void,
    comment: number
}

const Question: React.FC<QuestionProps> = (props) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        props.onInputChange(props.questionId, value);
    };
    const handleCommentChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        props.onCommentChange(props.questionId, value)
    }
    return (
        <Card className="answer_for_question" elevation={0}>
            <CardHeader title={props.question_text}/>
            <CardContent>
                {props.question_type === 0 &&
                    <div className="input-field">
                        <input type="number" id={props.questionId.toString()} name="input" onChange={handleInputChange}/>
                        <label htmlFor="input">Введите число</label>
                    </div>}
                {props.question_type === 1 &&
                    <div className="input-field">
                        <input type="text" id={props.questionId.toString()} name="input" onChange={handleInputChange}/>
                        <label htmlFor="input">Введите ответ</label>
                    </div>}
                {props.question_type === 2 &&
                    <div className="variants">
                        <div className="buttons_1">
                            {props.variants.map((text, index) => (
                                <label style={{marginTop: 5}} key={index}>
                                    <input
                                        name={props.questionId.toString()}
                                        type="radio"
                                        className="blue-radio"
                                        value={text}
                                        onChange={handleInputChange}
                                    />
                                    <span style={{fontSize: 20}} className="variant">{text}</span>
                                </label>
                            ))}
                        </div>
                    </div>}
                {props.comment === 1 &&
                    <div className="input-field">
                        <input type="text" id={props.questionId.toString()} name="input" onChange={handleCommentChange}/>
                        <label htmlFor="input">Введите комментарий</label>
                    </div>
                }
            </CardContent>
        </Card>
    );
};

export default Question;