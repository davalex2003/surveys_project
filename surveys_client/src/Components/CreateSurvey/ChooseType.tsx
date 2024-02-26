import React, {useState} from 'react';
import './ChooseType.css'

interface ChooseTypeProps {
    onChange: (value: string) => void
}

const ChooseType = (props: ChooseTypeProps) => {
    const [selectedValue, setSelectedValue] = useState("");
    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = event.target.value;
        setSelectedValue(newType);
        props.onChange(newType);
    };
    return (
        <div className="ChooseType">
            <select className="browser-default" defaultValue={selectedValue} onChange={handleSelectChange}>
                <option value="" disabled>Добавить участника</option>
                <option value="e-mail">По почте</option>
                <option value="address">По объекту</option>
                <option value="role" disabled>По роли</option>
                <option value="unit" disabled>По подразделению</option>
            </select>
        </div>
    );
};

export default ChooseType;