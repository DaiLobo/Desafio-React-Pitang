import dayjs from 'dayjs';
import { Button, InputWrapper, Input , Title, Space } from "@mantine/core";
import { TimeInput, DatePicker } from "@mantine/dates";
import { Calendar, Clock } from 'tabler-icons-react';
import { useState } from "react";


const SchedulingrForm = ({setForm, form}) => {
    
    return (
    <>
        <InputWrapper
            mb={8}
            id="name"
            required
            label="Name"
            description="Your full name"
        >
        <Input
            id="name"
            name="name"
        />
        </InputWrapper>

        <DatePicker 
            mb={8}
            required
            placeholder="Select Birthdate"
            label="Birthdate"
            icon={<Calendar size={16} />}
        />

        <DatePicker
            mb={8}
            required
            placeholder="Select Date"
            label="Scheduling Date"
            dropdownType="modal"
            minDate={dayjs(new Date()).startOf('month').add(12, 'days').toDate()}
        />

        <TimeInput
            required
            defaultValue={new Date()}
            label="Time"
            icon={<Clock size={16} />}
        />


    </>
    )
}

const Scheduling = () => {

    const [form, setForm] = useState({
       name: '',
       birthDate: new Date(),
       schedulingDate: new Date(),
       schedulingTime: new Date(),
    });


    const onSubmit = async () => {

    };

    return (
        <div>

            <Title order={5}> Scheduling </Title>
            <Space h="xl"/> 

            <SchedulingrForm setForm={setForm} form={form} />
            
            <Button onClick={onSubmit}
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