import React from 'react';
import './Question.css'
import {useDispatch} from "react-redux";
import {removeQuestion} from "../../store/slices/questionSlice";

interface QuestionProps {
    text: string;
    index: number;
}

export const Question: React.FC<QuestionProps> = ({text, index}) => {
    const dispatch = useDispatch();
    const onClick = () => {
        dispatch(removeQuestion(index));
    }
    return (
        <div className="Question">
            <div className="QuestionText">{text}</div>
            <button type="button" className="delete_button" onClick={onClick}>&#215;</button>
        </div>
    );
};
