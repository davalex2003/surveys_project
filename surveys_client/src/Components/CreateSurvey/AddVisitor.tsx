import React from 'react';
import {useDispatch} from "react-redux";
import {addVisitor} from "../../store/slices/visitorSlice";

const AddVisitor = () => {
    const [state, setState] = React.useState('');
    const dispatch = useDispatch();
    const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setState(e.target.value);
    }
    const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (state === '') {
            alert("Пустой логин!")
        } else {
            dispatch(addVisitor(state));
            setState('');
        }
    }
    return (
        <div className="AddQuestion">
            <form className="form">
                <div className="row">
                    <div className="input-field">
                        <input type="text" id="text" name="input" onChange={onChange} value={state}/>
                        <label htmlFor="input">Логин</label>
                    </div>
                </div>
                <div className="row">
                    <button className="waves-effect waves-light btn" onClick={onClick}>Добавить посетителя</button>
                </div>
            </form>
        </div>
    );
};

export default AddVisitor;