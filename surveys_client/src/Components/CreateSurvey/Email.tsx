import React from 'react';
import './Email.css'
import {useDispatch} from "react-redux";
import {removeEmail} from "../../store/slices/emailSlice";

interface EmailProps {
    text: string;
    index: number;
}

export const Email: React.FC<EmailProps> = ({text, index}) => {
    const dispatch = useDispatch();
    const onClick = () => {
        dispatch(removeEmail(index));
    }
    return (
        <div className="Email">
            <div className="EmailText">{text}</div>
            <button type="button" className="delete_button" onClick={onClick}>&#215;</button>
        </div>
    );
};

export default Email;