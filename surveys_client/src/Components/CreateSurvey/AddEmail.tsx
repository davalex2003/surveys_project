import React from 'react';
import {useDispatch} from "react-redux";
import {addEmail} from "../../store/slices/emailSlice";

const AddEmail = () => {
    const [state, setState] = React.useState('');
    const dispatch = useDispatch();
    const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setState(e.target.value);
    }
    const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (state === '') {
            alert("Пустой e-mail!")
        } else {
            dispatch(addEmail(state));
            setState('');
        }
    }
    return (
        <div className="AddQuestion">
            <form className="form">
                <div className="row">
                    <div className="input-field">
                        <input type="text" id="text" name="input" onChange={onChange} value={state}/>
                        <label htmlFor="input">Почта</label>
                    </div>
                </div>
                <div className="row">
                    <button className="waves-effect waves-light btn" onClick={onClick}>Добавить адресата</button>
                </div>
            </form>
        </div>
    );
};

export default AddEmail;