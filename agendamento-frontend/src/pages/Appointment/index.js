import {Button, Chip, Chips, Space, Table, Title} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../services/api";
import dayjs from "dayjs";


const Appointment = () => {

    const [scheduling, setScheduling] = useState([]);
    const [checked] = useState(true);

    const navigate = useNavigate();

    const onChange = ({target: {name, value}}) => {

        setScheduling({
            ...scheduling,
            [name]: value,
        });

    };

    useEffect(() => {
        
        axios.get("/schedule").then((response) => setScheduling(response.data));

    }, []);

    const isAttended = async (schedule) => {

        const scheduled = {
            ...schedule,
            attended: true,
        }

        try {
            
            await axios.put(`/schedule/${schedule.id}`, scheduled);

            showNotification({
                title: "Success",
                message: "Attended user",
            })

        } catch (error) {
            showNotification({
                title: "Error",
                message: error.response.data.message,
                color: "red"
            })
        }
    }

    function sortByDate (a, b) {
        a = dayjs(a.schedulingDateTime).toDate();
        b = dayjs(b.schedulingDateTime).toDate();
       
        return a.getTime() - b.getTime();
    }

    scheduling.sort(sortByDate) //ordenação por data e hora

    // const scheduling = {
    //     id: 1,
    //     name: "Diana",
    //     birthdate: "09/06/1998",
    //     schedulingDateTime: "15/04/2022 15:00",
    // }
   
    return (
        <>
            <Title order={5}>Scheduling</Title>
            <Table highlightOnHover>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Birthdate</th>
                        <th>Scheduling Date and Time</th>
                        <th>Conclusion of the service</th>
                    </tr>
                </thead> 
                <tbody>
                    {scheduling.map((schedule, index) => (
                        <tr key={index}>
                            <td>{schedule.id}</td>
                            <td>{schedule.name}</td>
                            <td>{schedule.birthDate}</td>
                            <td>{schedule.schedulingDateTime}</td>{console.log(schedule.attended)}
                            <td>
                            { schedule.attended ?
                                    <Chip
                                        color="indigo" variant="filled"
                                        checked={checked}
                                        value="attended"
                                    >
                                            Attended
                                    </Chip> 

                                    : 

                                <Chips color="indigo" variant="filled">

                                    <Chip color="indigo" variant="filled"
                                        name="attended"
                                        label="Attended"
                                        value={schedule.attended}
                                        onClick={() => isAttended(schedule)}
                                        onChange={(value) => onChange({target: {name: "attended", value}})}
                                    >
                                            Attended
                                    </Chip>
                                   
                                </Chips>
                            }
                            </td>
                        </tr>
                    ))
                    } 
                </tbody>
            </Table>

            <Space h="xl"/>
            <Button onClick={() => navigate("/scheduling")} 
                    variant="gradient" 
                    gradient={{ from: 'indigo', to: 'cyan' }} 
                    size="sm">
                Schedule
            </Button>

        </>
    );

}

export default Appointment;