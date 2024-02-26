import React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import './AddAddress.css'
import {useDispatch} from "react-redux";
import {addEmail} from "../../store/slices/emailSlice";
const AddAddress = () => {
    const dispatch = useDispatch();
    const addresses = [
        "г. Москва, 2-я Тверская-Ямская ул., д.16",
        "МО, г. Балашиха, Крупешина улица, д.1",
        "Московская область, г. Жуковский, ул. Амет-Хан Султана, д. 5а, корп. 3",
        "Московская область, г. Жуковский, ул. Амет-Хан Султана, д. 7а",
        "Московская область, г. Лобня, ул. Победы, д.3",
        "Московская область, г. Сергиев Посад, ул. Вознесенская, д.46",
        "Московская область, г.Чехов, ул. Чехова, д.2А",
        "Московская область, Одинцовский район, дер. Барвиха, здание почты",
        "Московская область, Солнечногорский район, д. Голиково, дом 128",
        "г. Москва, 1-я Энтузиастов улица, д. 6",
        "г. Москва, 26 Бакинских комиссаров улица, д. 5",
        "г. Москва, 4-й Лихачевский переулок, д. 1",
        "г. Москва, 4-й Лихачевский переулок, д. 1, стр. 2",
        "г. Москва, 9-я Парковая улица, д. 31, стр. 1",
        "г. Москва, 9-я Соколиной горы улица, д. 6",
        "г. Москва, Авиационная улица, д. 57, стр. 1",
        "г. Москва, Багратионовский проезд, д. 18, стр. 1",
        "г. Москва, Байкальская улица, д. 35А",
        "г. Москва, Бирюлевская улица, д. 53, корп. 2",
        "г. Москва, Бусиновская горка улица, д.11, стр.1",
        "г. Москва, Вавилова улица, д. 68, корп. 2",
        "г. Москва, Вернадского проспект, д. 21, корп. 3",
        "г. Москва, Вернадского проспект, д. 43, стр. 1",
        "г. Москва, Винницкая улица, д. 4",
        "г. Москва, Звездный бульвар, д. 44",
        "г. Москва, Земледельческий переулок, д. 15",
        "г. Москва, Знаменская улица, д. 4",
        "г. Москва, Зорге улица, д. 27",
        "г. Москва, Кленовый бульвар, д. 23",
        "г. Москва, Красностуденческий проезд, д. 2Б",
        "г. Москва, Ломоносовский проспект, д.20",
        "г. Москва, Малая Полянка улица, д. 3",
        "г. Москва, Милютинский переулок, д. 5, стр. 2",
        "г. Москва, Митинская улица, д. 40, корп. 2",
        "г. Москва, Можайское шоссе, д. 38, корп. 1",
        "г. Москва, Нежинская улица, д. 17, корп. 4",
        "г. Москва, Новочеремушкинская улица, д. 25",
        "г. Москва, Осенний бульвар, д. 4",
        "г. Москва, Профсоюзная улица, д. 112",
        "г. Москва, Профсоюзная улица, д. 27, корп. 2",
        "г. Москва, Сайкина улица, д. 13, корп. 1",
        "г. Москва, Сельскохозяйственная улица, д. 5",
        "г. Москва, Скобелевская улица, д.22",
        "г. Москва, Старокачаловская улица, д. 1Д",
        "г. Москва, Тимирязевская улица, д. 1А, стр. 1",
        "г. Москва, Тушинская улица, д. 11, корп. 3",
        "г. Москва, Хорошевское шоссе, д. 42",
        "г. Москва, Чертановская улица, д. 1А, корп.2",
        "г. Москва, Чертановская улица, д. 23А",
        "г. Москва, Шипиловская улица, д. 34, корп. 1",
        "г. Москва, Каменная слобода переулок, д. 7",
        "г. Москва, Малая Дмитровка улица, д.5/9",
        "г. Москва, Столярный переулок, д. 5, стр. 1",
        "г. Москва, Щепкина улица, д. 51/4, стр. 2",
        "г. Москва, 1-й Дорожный проезд, д.3Б",
        "г. Москва, 1-я Дубровская улица, д.1, стр.1",
        "г. Москва, 1-я Дубровская улица, д.1, стр.2",
        "г. Москва, 1-я Дубровская улица, д.1, стр.3",
        "г. Москва, 3-й квартал Капотня, д. 13, корп. 2",
        "г. Москва, 40 лет Октября проспект, д. 21",
        "г. Москва, 5-й Новоподмосковный переулок, д. 6",
        "г. Москва, 9-я Северная линия, д. 1а",
        "г. Москва, Академика Понтрягина улица, д.21, корп.1",
        "г. Москва, Алтуфьевское шоссе, д. 60, корп. 2",
        "г. Москва, Ангарская улица, д. 26",
        "г. Москва, Большая Косинская улица, д. 14, стр. 1",
        "г. Москва, Большая Марфинская улица, д. 1, корп. 4",
        "г. Москва, Городецкая улица, д. 8А",
        "г. Москва, Докукина улица, д. 4",
        "г. Москва, Докучаев переулок, д. 9, стр. 1",
        "г. Москва, Дубнинская улица, д. 30а",
        "г. Москва, Живописная улица, д. 8, корп. 1",
        "г. Москва, Западная улица, д. 4А",
        "г. Москва, Зеленоградский окр., корп. 928",
        "г. Москва, Зеленый проспект, д. 7",
        "г. Москва, Кленовый бульвар, д. 3",
        "г. Москва, Лётчика Бабушкина улица, д. 17, корп.1",
        "г. Москва, Луговой проезд, д. 5",
        "г. Москва, Лукинская улица, д. 14",
        "г. Москва, Маршала Катукова улица, д. 22, корп. 2",
        "г. Москва, Можайский вал, д. 12",
        "г. Москва, Москворечье улица, д. 14, стр. 2",
        "г. Москва, Народного Ополчения улица, д. 33 Б",
        "г. Москва, Новослободская улица, д. 29, стр. 2",
        "г. Москва, Паромная улица, д. 5, корп. 1",
        "г. Москва, Петровский б-р, д.12, стр.1",
        "г. Москва, Петровский б-р, д.12, стр.3",
        "г. Москва, Полянка Малая улица, д. 3, стр. 3",
        "г. Москва, посёлок Воскресенское, Чечёрский проезд, д. 126, корп.1",
        "г. Москва, Санникова улица, д. 11, корп. 2",
        "г. Москва, Саратовская улица, д. 9, стр. 1",
        "г. Москва, Саратовская улица, д. 9, стр. 2",
        "г. Москва, Саянская улица, д. 7",
        "г. Москва, Сторожевая улица, д. 23, стр. 1",
        "г. Москва, Сторожевая улица, д. 23, стр. 2",
        "г. Москва, Ташкентская улица, д. 15, корп. 2",
        "г. Москва, улица Большие Каменщики, д. 7",
        "г. Москва, улица Речников, д. 28, корп. 1, стр. 2",
        "г. Москва, улица Речников, д. 28, корп. 1, стр. 3",
        "г. Москва, улица Речников, д. 28, корп. 1, стр. 4",
        "г. Москва, Фабрициуса улица, д. 56, корп. 2",
        "г. Москва, Флотская улица, д. 62",
        "г. Москва, Флотская улица, д. 62, стр. 2",
        "г. Москва, Хачатуряна улица, д. 5",
        "г. Москва, Центральная улица (пос. Внуково), д.19",
        "г. Москва, Черняховского улица, д. 18",
        "г. Москва, Широкая улица, д. 12А",
        "г. Москва, Электрозаводская улица, д. 58",
        "г. Москва, Яблочкова улица, д. 19А",
        "г. Москва, Ясногорская улица, д. 5",
        "Красногоский район, пос.Мечниково, д.2, пом.14",
        "Московская область, Одинцовский район, пос.Горки-Х, д.3",
        "Московская область, Одинцовский район, Успенский с.о., пос.Горки-10, д.3",
        "МО, Раменский р-н, п. Ильинский, ул. Пролетарская, д. 49/1а",
        "г. Москва, Боровское шоссе, д.43",
        "г. Москва, Дубнинская улица, д.12А",
        "Тетеринский переулок, д.8",
        "г. Москва, проспект Андропова, д.18, корп.6",
        "г. Москва, 2-й Вязовский проезд, д.6, стр.1",
        "г. Москва, 3-я Карачаровская ул, д. 18А, стр. 2",
        "г. Москва, г. Зеленоград, Панфиловский пр-т, корп. 1101А",
        "г. Москва, Смоленская-Сенная пл., д. 27, стр. 2",
        "г.Москва, ул. Магнитогорская, д.9, стр.1",
        "Московская область, г. Подольск, ул. Комсомольская, д. 1",
        "Московская область, г. Сергиев Посад, Северный пр-д, д.2",
        "Московская область, Пушкинский р-н, с. Пушкино, Ярославское шоссе, д. 7а"
    ];
    const [value, setValue] = React.useState<string | null>('');
    const [inputValue, setInputValue] = React.useState('');
    const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (inputValue === '') {
            alert("Пустой адрес!")
        } else {
            dispatch(addEmail(inputValue));
            setInputValue('');
            setValue('')
        }
    }

    return (
        <div className="AddQuestion">
            <Autocomplete
                disablePortal
                value={value}
                onChange={(_event: any, newValue: string | null) => {
                    setValue(newValue);
                }}
                inputValue={inputValue}
                onInputChange={(_event, newInputValue) => {
                    setInputValue(newInputValue);
                }}
                options={addresses}
                renderInput={(params) => <TextField {...params} label="Введите адрес" variant="standard"/>}
            />
            <button className="waves-effect waves-light btn add_address" onClick={onClick} >Добавить адрес</button>
        </div>
    );
};

export default AddAddress;