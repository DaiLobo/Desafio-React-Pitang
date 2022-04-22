import * as yup from 'yup';
import dayjs from "dayjs";
import axios from "../../services/api";
import { Button, Title, Space, InputWrapper, Input, Text} from "@mantine/core";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AlertCircle, Calendar, Vaccine } from 'tabler-icons-react';
import { showNotification } from '@mantine/notifications';
import { useEffect, useState } from "react";


const DATA_FORM_KEY = "data_form";

const voucher = [];
//let limit = [{name: '', birthDate: new Date(), schedulingDateTime: new Date(), schedulingTime: '',}]
const day = [];
const limitDays = [];


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
    
    // const date = new Date();
    // const now = dayjs().toDate();    

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
            //scrollableMonthYearDropdown
            mb={8}
            required={true}
            placeholderText="Select Birthdate"
            label="Birthdate"
            icon={<Calendar size={16} />}
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
            //minTime={new Date(new Date().setHours(new Date().getHours(), new Date().getMinutes())}
            //minTime={setHours(setMinutes(new Date(), 0), 17)}
            placeholderText="Click to select a date"
            // label="Scheduling Date"
            minDate={new Date()}
            excludeDates={[]}
            // excludeTimes={[
            //     setHours(setMinutes(new Date(), 0), 17),
            //     setHours(setMinutes(new Date(), 30), 18),
            //     setHours(setMinutes(new Date(), 30), 19),
            //     setHours(setMinutes(new Date(), 30), 17),
            //   ]}
            withPortal // dropdownType="modal"
        />
        
        {/* <Select
            id="schedulingTime"
            name="schedulingTime"
            icon={<Clock size={16} />}
            mt={8}
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
        /> */}
         
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


    //limite de 20 agendamentos por dia
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

            return showNotification({
                icon: <AlertCircle />,
                title: "Error",
                message: "Unavailable day" ,
                color: 'red',
            });
        }

    }

    const onSubmit = async () => {

        const scheduling = {
            ...form,
            birthDate: dayjs(form.birthDate).format('YYYY/MM/DD'),
            schedulingDateTime: dayjs(form.schedulingDateTime).format('YYYY/M/D HH:mm'),
        };

                    

        limitSchedulesDay();

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
        if(!(await validate(scheduling))) return;


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