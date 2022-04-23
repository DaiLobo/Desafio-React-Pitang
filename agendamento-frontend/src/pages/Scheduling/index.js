import * as yup from 'yup';
import dayjs from "dayjs";
import axios from "../../services/api";
import { Button, Title, Space, InputWrapper, Input, Text} from "@mantine/core";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AlertCircle, Vaccine } from 'tabler-icons-react';
import { showNotification } from '@mantine/notifications';
import { useEffect, useState } from "react";


const DATA_FORM_KEY = "data_form";

const voucher = [];
const day = [];
const limitDays = [];
const hour = [];
const limitHours = [];



// const hours = this.createRef();


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
            //minTime={setHours(setMinutes(new Date(), 0), 10)}
            placeholderText="Click to select a date"
            // label="Scheduling Date"
            minDate={new Date()}
            excludeDates={[]}
            excludeTimes={limitHours}
            withPortal // dropdownType="modal"
        />
         
    </>
    )
}


const Scheduling = () => {

    const [form, setForm] = useState(getSaveInfo);

    const chosenHour = form.schedulingDateTime.getTime();

    //Salvando no localStorage
    useEffect(() => {
        localStorage.setItem(DATA_FORM_KEY, JSON.stringify(form))
    }, [form])
    
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

        if(!form.name ) {
            return showNotification({
                icon: <AlertCircle />,
                title: "Error",
                message: `Empty ${!form.name} name field`,
                color: 'red',
            }); 
        }
       
    }

    //Validação
    async function validate(scheduling) {
        const schema = yup.object().shape({
            name: yup.string().required(),
            birthDate: yup.date().required("Required"),
            schedulingDateTime: yup.date().required("Required"),
        })

        try {
            notification();
            await schema.validate(scheduling);
            await axios.post("/schedule", scheduling);
            return true;
        } catch (error){
            errorNotification();
            return false;
        }
    }

    //Limite de 20 agendamentos por dia
    function limitSchedulesDay () {

        const chosenDay = form.schedulingDateTime.getDate();
        day.push(chosenDay);

        console.log(chosenDay)
        console.log("array que contem os dias escolhidos")
        console.log(day)
        
        const limitDay = day.filter(element => element === chosenDay)
        console.log("array com os dias iguais " + limitDay)

        if (limitDay.length >= 20 ){
            console.log("limite de agendamentos por dia alcançado")
            limitDays.push(limitDay[0])
            console.log(limitDays)

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

        //Array que vai conter as horas escolhidas em milisegundos
        hour.push(chosenHour);
        
        //array que vai filtrar as horas iguais
        const limitHour = hour.filter(element => element === chosenHour)
        console.log("array com os horas iguais " + limitHour)

        if (limitHour.length >= 3 ){
            console.log("limite de agendamentos por hora alcançado")
            limitHours.push(limitHour[0])
            console.log(limitHours)

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
               
        if (excludePastTimes()) return;
        if (limitSchedulesHour()) return;
        if (limitSchedulesDay()) return;

        voucher.push(scheduling); //passo o objeto com as informações do formulário para um array


        //Validação antes de enviar o formulário para o back
        if(!(await validate(scheduling))) return;



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