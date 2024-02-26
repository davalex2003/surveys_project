import React from 'react';
import './Email.css'
import {useDispatch} from "react-redux";
import {removeVisitor} from "../../store/slices/visitorSlice";

interface VisitorProps {
    text: string,
    index: number
}

export const Visitor: React.FC<VisitorProps> = ({text, index}) => {
    const dispatch = useDispatch();
    const onClick = () => {
        dispatch(removeVisitor(index));
    }
    return (
        <div className="Email">
            <div className="EmailText">{text}</div>
            <button type="button" className="delete_button" onClick={onClick}>&#215;</button>
        </div>
    );
};
