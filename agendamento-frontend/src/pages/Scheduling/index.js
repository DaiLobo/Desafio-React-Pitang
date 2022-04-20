import dayjs from 'dayjs';
import * as yup from 'yup';
import axios from "../../services/api";
import { Button, Title, Space, Select, InputWrapper, Input } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { AlertCircle, Calendar, Clock, Vaccine } from 'tabler-icons-react';
import { showNotification } from '@mantine/notifications';
import { useEffect, useState } from "react";


const DATA_FORM_KEY = "data_form";

const voucher = [];
//let limit = [{name: '', birthDate: new Date(), schedulingDateTime: new Date(), schedulingTime: '',}]

const time = Array(24).fill(0).map((_, index) => {
   return {name: `${index}:00h`, disabled: false, count: 0}
});

// const hours = this.createRef();


//Pegando info do localStorage

function getSaveInfo () {
    const saveInfoStorage = localStorage.getItem(DATA_FORM_KEY)

    if(!saveInfoStorage) return {
        name: '',
        birthDate: new Date(),
        schedulingDateTime: new Date(),
        schedulingTime: '',
     };
    else {
        const data_saveInfoStorage = JSON.parse(saveInfoStorage);
        return {
            name: data_saveInfoStorage.name,
            birthDate: new Date(data_saveInfoStorage.birthDate),
            schedulingDateTime: new Date(data_saveInfoStorage.schedulingDateTime),
            schedulingTime: data_saveInfoStorage.schedulingTime,
        }
    }
}


const SchedulingForm = ({form, setForm}) => {
    
    const date = new Date();

    const onChange = (event) => {
        const {
        target: { name, value },
        } = event;

        setForm((prevForm) => ({
        ...prevForm,
        [name]: value,
        }));

    };
  
    // function handleDate(limit){
    //     if(limit.length >= 20){
    //         return true;
    //     }
    // }
    // useEffect(() => {
    //     if (!form.schedulingTime){
    //         isValidated = false;
    //     }
    // }, [])


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
         
        <DatePicker
            id="birthDate"
            name="birthDate"
            value={form.birthDate}
            onChange={(value) => onChange({target: {name: "birthDate", value}})}
            mb={8}
            required
            placeholder="Select Birthdate"
            label="Birthdate"
            icon={<Calendar size={16} />}
        />

        <DatePicker
            id="schedulingDateTime"
            name="schedulingDateTime"
            value={form.schedulingDateTime}
            onChange={(value) => onChange({target: {name: "schedulingDateTime", value}})}
            mb={8}
            required
            placeholder="Select Date"
            label="Scheduling Date"
            dropdownType="modal"
            minDate={dayjs(new Date()).startOf('month').add(date.getDate()-1, 'days').toDate()}
            //excludeDate={(value) => limit.length >= 20}
        />

        <Select
            id="schedulingTime"
            name="schedulingTime"
            value={form.schedulingTime}
            onChange={(value) => onChange({ target: { name: "schedulingTime", value } })}
            required
            label="Choose the time of scheduling"
            placeholder="Time"
            data={
                time.map((hour) => (
                {value: hour.name, label: hour.name, disabled: hour.disabled}
                ))
            }
            icon={<Clock size={16} />}
        />
         
    </>
    )
}

const Scheduling = () => {

    const [form, setForm] = useState(getSaveInfo);

    //Salvando no localStorage
    
    useEffect(() => {
        localStorage.setItem(DATA_FORM_KEY, JSON.stringify(form))
    }, [form])
    
    //Notificações
    
    function notification() {
        const selected = time.findIndex((select) => select.name === voucher[voucher.length-1].schedulingTime); //encontro o index do select escolhido

        if(selected >= 0) {
            
            time[selected].count++;
            
            if (time[selected].count === 2){
                time[selected].disabled = true;
            }
            
            if (time[selected].count >= 3){
                return showNotification({
                    icon: <AlertCircle />,
                    title: "Error",
                    message: "Unavailable hours" ,
                    color: 'red',
                });
            }    
        }
        return showNotification({
            icon: < Vaccine />,
            title: "Success",
            message: "Scheduling successful: write down the day and time of your appointment" ,
            color: 'ocean-blue',
        });  
    }

    function errorNotification() {

        if(!form.name || !form.schedulingTime) {
            return showNotification({
                icon: <AlertCircle />,
                title: "Error",
                message: `Empty ${(!form.name && !form.schedulingTime) ? "name and time fields" : 
                            `${!form.name ? "name": "time" } field` }`,
                color: 'red',
            }); 
        }
       
    }

    //Validação
    async function validate() {
        const schema = yup.object().shape({
            name: yup.string().required(),
            birthDate: yup.date().required(),
            schedulingDateTime: yup.date().required(),
            schedulingTime: yup.string().required(),
        })

        try {
            await schema.validate(form);
            await axios.post("/schedule", form);
            notification();
            return true;
        } catch (error){
            errorNotification();
            return false;
        }
    }

    const onSubmit = async () => {

        const scheduling = {
            ...form,
            birthDate: form.birthDate.toISOString(),
            schedulingDateTime: form.schedulingDateTime.toISOString(),
        };

        voucher.push(scheduling); //passo o objeto com as informações do formulário para um array
   
        //Limite de 20 agendamentos por dia
        // function dayLimit (data) {
        //     return data.schedulingDateTime === scheduling.schedulingDateTime;
        // }
        // limit = voucher.filter(dayLimit) //filtra todos os elementos que tem o mesmo dia que foi escolhido

        // console.log(limit.length)
        // console.log(voucher)   
        //console.log(hours.current)


        //Validação antes de enviar o formulário para o back
        if(!(await validate())) return;


        //FAZER A REQUISIÇÃO PARA O BACK
        // try {
        //     if(!(await validate())) {
        //         await axios.put(`/ticket/${form.id}`, form);
        //     }
        // } catch(error) {

        // }



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