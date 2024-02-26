import React, {useState} from 'react';
import './buttons.css'
import {addQuestion} from "../../store/slices/questionSlice";
import {useDispatch} from "react-redux";
import './AddQuestion.css'

const AddQuestion = () => {
        const dispatch = useDispatch();
        const [variants, setvariants] = React.useState('');
        const [question, setquestion] = React.useState('');
        const [selectedOption, setSelectedOption] = useState('');
        const [comment, setComment] = useState(false)
        const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            setSelectedOption(event.target.value);
        };
        const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            setComment(event.target.checked);
        };
        const onChangeVariant: React.ChangeEventHandler<HTMLInputElement> = (e) => {
            setvariants(e.target.value);
        }
        const onChangeQuestion: React.ChangeEventHandler<HTMLInputElement> = (e) => {
            setquestion(e.target.value);
        }
        const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            if (question.length === 0) {
                alert("Пустой вопрос!")
            } else {
                if (selectedOption === 'number') {
                    if (comment) {
                        dispatch(addQuestion(question + "$0$1"))
                    } else {
                        dispatch(addQuestion(question + "$0$0"))
                    }
                } else if (selectedOption === 'word') {
                    if (comment) {
                        dispatch(addQuestion(question + "$1$1"))
                    } else {
                        dispatch(addQuestion(question + "$1$0"))
                    }
                } else {
                    if (variants.length === 0) {
                        alert("Пустые варианты ответа!")
                    } else {
                        if (comment) {
                            dispatch(addQuestion(question + "$(" + variants + ")$1"))
                        } else {
                            dispatch(addQuestion(question + "$(" + variants + ")$0"))
                        }
                    }
                }
                setquestion('');
                setvariants('');
            }
        }
        return (
            <div className="AddQuestion">
                <form className="form">
                    <div className="row">
                        <div className="input-field">
                            <input type="text" id="text" name="input" onChange={onChangeQuestion} value={question}/>
                            <label htmlFor="input">Вопрос</label>
                        </div>
                    </div>
                    <div className="row buttons">
                        <button className="waves-effect waves-light btn" onClick={onClick}>Добавить вопрос</button>
                        <label style={{marginTop: 5}}>
                            <input
                                name="group1"
                                type="radio"
                                className="blue-radio"
                                value="number"
                                checked={selectedOption === "number"}
                                onChange={handleOptionChange}
                            />
                            <span>Ответ - число</span>
                        </label>
                        <label style={{marginTop: 5}}>
                            <input
                                name="group1"
                                type="radio"
                                className="blue-radio"
                                value="word"
                                checked={selectedOption === "word"}
                                onChange={handleOptionChange}
                            />
                            <span>Своими словами</span>
                        </label>
                        <label style={{marginTop: 5}}>
                            <input
                                name="group1"
                                type="radio"
                                className="blue-radio"
                                value="variants"
                                checked={selectedOption === "variants"}
                                onChange={handleOptionChange}
                            />
                            <span>Варианты ответа</span>
                        </label>
                        <label style={{marginTop: 5}}>
                            <input
                                type="checkbox"
                                className="blue-radio"
                                checked={comment}
                                onChange={handleCheckboxChange}
                            />
                            <span>Комментарий</span>
                        </label>
                    </div>
                </form>
                {selectedOption === "variants" && (
                    <div className="row">
                        <div className="col xl3 offset-xl9">
                            <input
                                type="text"
                                id="text"
                                name="input"
                                placeholder="Через запятую"
                                onChange={onChangeVariant}
                                value={variants}
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    }
;

export default AddQuestion;