import dayjs from 'dayjs';
import { Button, Input , Title, Space, Select } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { AlertCircle, Calendar, Clock, Vaccine } from 'tabler-icons-react';
import { showNotification } from '@mantine/notifications';
import { useEffect, useState } from "react";


const voucher = [];

const time = Array(20).fill(0).map((_, index) => {
   return {name: `${index+4}:00h`, disabled: false, count: 0}
});

let isEmptyNameField = false;
let isEmptyTimeField = false;

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
    
    // useEffect(() => {
    //     if (!form.schedulingTime){
    //         isValidated = false;
    //     }
    // }, [])

    return (
    <>
        {!isEmptyNameField ?
            <Input
                id="name"
                mb={8}
                required
                label="Name"
                description="Your full name"
                name="name"
                value={form.name}
                onChange={onChange}
            /> :
            <Input
                invalid
                id="name"
                mb={8}
                required
                label="Name"
                description="Your full name"
                name="name"
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

    const [form, setForm] = useState({
       name: '',
       birthDate: new Date(),
       schedulingDate: new Date(),
       schedulingTime: '',
    });

    useEffect(() => {
     
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSubmit = async () => {

        const scheduling = {
            ...form,
            birthDate: form.birthDate.toISOString(),
            schedulingDate: form.schedulingDate.toISOString(),
        };

        voucher.push(scheduling); //passo o objeto com as informações do formulario para um array
        
        const selected = time.findIndex((select) => select.name === voucher[voucher.length-1].schedulingTime); //encontro o index do select escolhido
        // if (scheduling.name === ""){
            //     return console.log(scheduling.name)
            // }
            //<Select error="Pick a time" />
            //<Input error="Required field" />

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