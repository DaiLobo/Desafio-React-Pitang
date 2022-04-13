import dayjs from 'dayjs';
import { Button, InputWrapper, Input , Title, Space, Select } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { Calendar, Clock, Vaccine } from 'tabler-icons-react';
import { showNotification } from '@mantine/notifications';
import { useState } from "react";


const voucher = [];
const time = Array(20).fill(0).map((_, index) => {
   return {name: `${index+4}:00h`, disabled: false, count: 0}
});


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

<       Select
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


    const onSubmit = async (form) => {

        if(!form.name || !form.schedulingTime) {
            return console.log("empty field");
        }

        const scheduling = {
            ...form,
            birthDate: form.birthDate.toISOString(),
            schedulingDate: form.schedulingDate.toISOString(),
        };

        // if (scheduling.name === ""){
        //     return console.log(scheduling.name)
        // }
        //<Select error="Pick a time" />
        //<Input error="Required field" />

        voucher.push(scheduling); //passo o objeto com as informações do formulario para um array

        const selected = time.findIndex((select) => select.name === voucher[voucher.length-1].schedulingTime); //encontro o index do select escolhido

        time[selected].count++;

        if (time[selected].count === 2){
            time[selected].disabled = true;
        }
        
        showNotification({
            icon: < Vaccine />,
            title: "Success",
            message: "Scheduling successful",
            color: 'ocean-blue',
        });
        

    };

    return (
        <div>

            <Title order={5}> Scheduling </Title>
            <Space h="xl"/> 

            <SchedulingForm setForm={setForm} form={form} />
            
            <Button onClick={() => onSubmit(form)}
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