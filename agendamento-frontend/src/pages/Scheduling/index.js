import * as yup from 'yup';
import dayjs from "dayjs";
import axios from "../../services/api";
import { useNavigate } from "react-router-dom";
import { Button, Title, Space, InputWrapper, Input, Text} from "@mantine/core";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AlertCircle, Vaccine } from 'tabler-icons-react';
import { showNotification } from '@mantine/notifications';
import { useEffect, useState } from "react";


const DATA_FORM_KEY = "data_form";

//Pegando info do localStorage
function getSaveInfo () {
    const saveInfoStorage = localStorage.getItem(DATA_FORM_KEY)

    if(!saveInfoStorage) return {
        name: '',
        birthDate: new Date(),
        schedulingDateTime: new Date(),
     };
    else {
        const data_saveInfoStorage = JSON.parse(saveInfoStorage);
        return {
            name: data_saveInfoStorage.name,
            birthDate: new Date(data_saveInfoStorage.birthDate),
            schedulingDateTime: new Date(data_saveInfoStorage.schedulingDateTime),
        }
    }
}


const SchedulingForm = ({form, setForm}) => {  

    const onChange = (event) => {
        const {
        target: { name, value },
        } = event;

        setForm((prevForm) => ({
        ...prevForm,
        [name]: value,
        }));

    };


    return (
    <>
        
        <InputWrapper
            id="name"
            mb={8}
            required
            label="Name"
            description="Your full name"
        >
            <Input
                id="name"
                name="name"
                value={form.name}
                onChange={onChange}
            />
        </InputWrapper>
         
        <Text mb={2} weight={500} size="sm">Select Birthdate</Text>
        <DatePicker
            id="birthDate"
            name="birthDate"
            value={form.birthDate}
            selected={form.birthDate}
            dateFormat="yyyy/MM/dd"
            onChange={(value) => onChange({target: {name: "birthDate", value}})}
            showYearDropdown
            showMonthDropdown
            dropdownMode="select"
            mb={8}
            required={true}
            placeholderText="Select Birthdate"
            label="Birthdate"
        />

        <Text mb={2} mt={8} weight={500} size="sm">Scheduling Date and Time</Text>
        <DatePicker
            id="schedulingDateTime"
            name="schedulingDateTime"
            selected={form.schedulingDateTime}
            value={form.schedulingDateTime}
            onChange={(value) => onChange({target: {name: "schedulingDateTime", value}})}
            required
            timeCaption={<Text>Time</Text>}
            dateFormat="yyyy/MM/dd h:mm aa"
            showTimeSelect
            timeIntervals={60}
            placeholderText="Click to select a date"
            minDate={new Date()}
            withPortal 
        />
         
    </>
    )
}


const Scheduling = () => {

    const [form, setForm] = useState(getSaveInfo);
    const [saveData, setSaveData] = useState([]);

    const time = saveData.map(element => `${element.schedulingDateTime}`) //datas salvas no backend

    const navigate = useNavigate();

    //Salvando no localStorage
    useEffect(() => {
        localStorage.setItem(DATA_FORM_KEY, JSON.stringify(form))
    }, [form])

    //Pegando as informações do backend
    useEffect(() => {    
        axios.get("/schedule").then((response) => setSaveData(response.data));
    }, []);

    //Notificações
    function notification() {
        showNotification({
            icon: < Vaccine />,
            title: "Success",
            message: "Scheduling successful: write down the day and time of your appointment" ,
            color: 'ocean-blue',
        });  
    }

    function errorNotification() {

        return showNotification({
            icon: <AlertCircle />,
            title: "Error",
            message: `Something is wrong`,
            color: 'red',
        }); 
    
    }

    //Validação
    async function validate(scheduling) {
        const schema = yup.object().shape({
            name: yup.string().required(),
            birthDate: yup.date().required("Required"),
            schedulingDateTime: yup.date().required("Required"),
        })

        try {
            await schema.validate(scheduling);
            await axios.post("/schedule", scheduling);
            notification();
            return true;
        } catch (error){
            errorNotification();
            return false;
        }
    }

    //Limite de 20 agendamentos por dia
    function limitSchedulesDay () {

        const chosenDay = dayjs(form.schedulingDateTime).format('YYYY/M/D'); //formatando data que foi escolhida no formulário
        
        const dateString = time.map(element => element.split(" ")) //separando as datas das horas dos agendamentos já realizados
        const dayString = dateString.map(element => element[0]) //pegando somente as datas
        const dayMonthYear = dayString.map(element => element.split('/')) //separando dia, mês e ano
        const date = dayMonthYear.map(element => new Date(element[0], element[1]-1, element[2])) //transformado para date
        const dateFormated = date.map(element => dayjs(element).format('YYYY/M/D')) //formatando data para ser compativel com a escolhida
     
        const limitDay = dateFormated.filter(element => element === chosenDay)

        if (limitDay.length >= 20 ){

            showNotification({
                icon: <AlertCircle />,
                title: "Error",
                message: "Unavailable day" ,
                color: 'red',
            });

            return true;
        }

    }

    //Limite de dois agendamentos por hora
    function limitSchedulesHour () {

        const timeFormated = time.map(element => Date.parse(element)) //convertendo para getTime

        const limitHour = timeFormated.filter(element => { //filtrando os valores que são iguais a data escolhida
            if (element === ((form.schedulingDateTime).getTime())){
                return element;
            }
        })        

        if (limitHour.length >= 2 ){

            showNotification({
                icon: <AlertCircle />,
                title: "Error",
                message: "Unavailable hour" ,
                color: 'red',
            });

            return true;
        }

    }

    //Hora q já passou do dia atual
    function excludePastTimes () {
        
        const currentTime = new Date().getTime();
        const chosenHour = form.schedulingDateTime.getTime();

        if (chosenHour <= currentTime){
            showNotification({
                icon: <AlertCircle />,
                title: "Error",
                message: "That time has already passed" ,
                color: 'red',
            });

            return true;
        }

    }


    const onSubmit = async () => {

        const scheduling = {
            ...form,
            birthDate: dayjs(form.birthDate).format('YYYY/MM/DD'),
            schedulingDateTime: dayjs(form.schedulingDateTime).format('YYYY/M/D HH:mm'),
        };

        if(!form.name ) {
            return showNotification({
                icon: <AlertCircle />,
                title: "Error",
                message: `Empty name field`,
                color: 'red',
            }); 
        }
               
        if (excludePastTimes()) return;
        if (limitSchedulesHour()) return;
        if (limitSchedulesDay()) return;

        //Validação antes de enviar o formulário para o back
        if(!(await validate(scheduling))) return;

        navigate("/appointment")

    };

    return (
        <div>

            <Title order={5}> Scheduling </Title>
            <Space h="xl"/> 

            <SchedulingForm setForm={setForm} form={form} />
            
            <Button onClick={() => onSubmit()}
                    fullWidth
                    variant="gradient" 
                    gradient={{ from: 'indigo', to: 'cyan' }}
                    mt={16}>
                Scheduling Done
            </Button>

        </div>
      );
};

export default Scheduling;