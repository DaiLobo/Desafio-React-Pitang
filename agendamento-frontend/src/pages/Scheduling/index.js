import dayjs from 'dayjs';
import { Button, Title, Space, Select, InputWrapper, Input } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { AlertCircle, Calendar, Clock, Vaccine } from 'tabler-icons-react';
import { showNotification } from '@mantine/notifications';
import { useEffect, useState } from "react";


const DATA_FORM_KEY = "data_form";

const voucher = [];
let limit = [{name: '', birthDate: new Date(), schedulingDate: new Date(), schedulingTime: '',}]

const time = Array(24).fill(0).map((_, index) => {
   return {name: `${index}:00h`, disabled: false, count: 0}
});

// const hours = this.createRef();

let isEmptyNameField = false;
let isEmptyTimeField = false;



//Pegando info do localStorage

function getSaveInfo () {
    const saveInfoStorage = localStorage.getItem(DATA_FORM_KEY)

    if(!saveInfoStorage) return {
        name: ' ',
        birthDate: new Date(),
        schedulingDate: new Date(),
        schedulingTime: '',
     };
    else {
        const data_saveInfoStorage = JSON.parse(saveInfoStorage);
        return {
            name: data_saveInfoStorage.name,
            birthDate: new Date(data_saveInfoStorage.birthDate),
            schedulingDate: new Date(data_saveInfoStorage.schedulingDate),
            schedulingTime: data_saveInfoStorage.schedulingTime,
        }
    }
    
     //return JSON.parse(saveInfoStorage);

}



const SchedulingForm = ({form, setForm}) => {
    
    const date = new Date();
    //const [schedulingDate, setSchedulingDate] = useState('');
    
    // const disabled = Array(20).fill(0).map(() => false);
    // disabled[1] = true;

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
        {!isEmptyNameField ?
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
            :
            <InputWrapper
                invalid
                id="name"
                mb={8}
                required
                label="Name"
                description="Your full name"
                value={form.name}
                onChange={onChange}
            />
        }

        <DatePicker
            id="birthDate"
            value={form.birthDate}
            onChange={(value) => onChange({target: {name: "birthDate", value}})}
            mb={8}
            required
            placeholder="Select Birthdate"
            label="Birthdate"
            icon={<Calendar size={16} />}
        />

        <DatePicker
            id="schedulingDate"
            value={form.schedulingDate}
            onChange={(value) => onChange({target: {name: "schedulingDate", value}})}
            mb={8}
            required
            placeholder="Select Date"
            label="Scheduling Date"
            dropdownType="modal"
            minDate={dayjs(new Date()).startOf('month').add(date.getDate()-1, 'days').toDate()}
            //excludeDate={(value) => limit.length >= 20}
        />

        {
            !isEmptyTimeField ? 
                <Select
                    id="schedulingTime"
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
                /> :
                <Select
                    error
                    id="schedulingTime"
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
         }
         {/* <NumberInput
            label="Choose the time of scheduling"
            placeholder="Time" 
            // min={4}
            // max={23}
            icon={<Clock size={18} />}
            /> */}
        {/* <TimeInput
            required
            defaultValue={new Date()}
            label="Time"
            icon={<Clock size={16} />}
            min="04:00"
        /> */}

    </>
    )
}

const Scheduling = () => {

    const [form, setForm] = useState(getSaveInfo);

    // eslint-disable-next-line no-unused-vars
    // const [date, setDate] = useState(new Date())

    // useEffect(() => {
 
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);



    //Salvando no localStorage

    useEffect(() => {
        localStorage.setItem(DATA_FORM_KEY, JSON.stringify(form))
    }, [form])
  


    const onSubmit = async () => {

        const scheduling = {
            ...form,
            birthDate: form.birthDate.toISOString(),
            schedulingDate: form.schedulingDate.toISOString(),
        };

        voucher.push(scheduling); //passo o objeto com as informações do formulario para um array

        function dayLimit (data) {
            return data.schedulingDate === scheduling.schedulingDate;
        }
        
        limit = voucher.filter(dayLimit) //filtra todos os elementos que tem o mesmo dia que foi escolhido

        console.log(limit.length)
        console.log(voucher)
        
        //console.log(hours.current)
        
        const selected = time.findIndex((select) => select.name === voucher[voucher.length-1].schedulingTime); //encontro o index do select escolhido

        try {
            
            if(!form.name || !form.schedulingTime) {
                
                return showNotification({
                    icon: <AlertCircle />,
                    title: "Error",
                    message: `Empty ${(!form.name && !form.schedulingTime) ? "name and time fields" : 
                                   `${!form.name ? "name": "time" } field` }`,
                    color: 'red',
                });
            }
            
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
                
                showNotification({
                    icon: < Vaccine />,
                    title: "Success",
                    message: "Scheduling successful: write down the day and time of your appointment" ,
                    color: 'ocean-blue',
                });   
                
            }


        } catch (error){
            console.log(error)
        }
        

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