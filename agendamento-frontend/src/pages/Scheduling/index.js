import dayjs from 'dayjs';
import { Button, InputWrapper, Input , Title, Space, Select } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { Calendar, Clock } from 'tabler-icons-react';
import { useState } from "react";


const SchedulingrForm = ({setForm, form}) => {

    const date = new Date();
    //const [schedulingDate, setSchedulingDate] = useState('');

    const time = Array(20).fill(0).map((_, index) => `${index+4}:00h`);
    const disabled = Array(20).fill(0).map(() => false);
    disabled[1] = true;

    
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
                {value: time[0], disabled: disabled[0]},
                {value: time[1], disabled: disabled[1]},
                {value: time[2], disabled: disabled[2]},
                {value: time[3], disabled: disabled[3]},
            ]}
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