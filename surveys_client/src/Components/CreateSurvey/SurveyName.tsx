import React from 'react';

interface SurveyNameProps {
    onNameChange: (newName: string) => void
}

const SurveyName = (props: SurveyNameProps) => {
    const [state, setState] = React.useState('');
    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newName = event.target.value;
        setState(newName);
        props.onNameChange(newName);
    };
    return (
        <div className="input-field">
            <input type="text" id="survey_name" onChange={handleNameChange} value={state}/>
            <label htmlFor="myInput">Введите название опроса</label>
        </div>
    );
};

export default SurveyName;