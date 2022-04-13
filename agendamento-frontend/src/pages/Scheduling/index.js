import dayjs from 'dayjs';
import { Button, InputWrapper, Input , Title, Space, Select } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { Calendar, Clock } from 'tabler-icons-react';
import { useState } from "react";


const SchedulingrForm = ({setForm, form}) => {

    const date = new Date();

    const time = new Date();
    
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
            minDate={dayjs(new Date()).startOf('month').add(date.getDate(), 'days').toDate()}
        />

<       Select
            required
            label="Choose the time of scheduling"
            placeholder="Time"
            data={[
                { value: '4:00', label: '4:00'},
                { value: '5:00', label: '5:00'},
                { value: '6:00', label: '6:00'},
                { value: '7:00', label: '7:00'},
                { value: '8:00', label: '8:00'},
                { value: '9:00', label: '9:00'},
                { value: '10:00', label: '10:00'},
                { value: '11:00', label: '11:00'},
                { value: '12:00', label: '12:00'},
                { value: '13:00', label: '13:00'},
                { value: '14:00', label: '14:00'},
            ]}
            icon={<Clock size={16} />}
        />
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