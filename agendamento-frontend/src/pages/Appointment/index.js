import {Button, Space, Switch, Table, Title} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../services/api";

const Appointment = () => {

    const [scheduling, setScheduling] = useState([]);
    const [checked, setChecked] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        
        axios.get("/schedule").then((response) => setScheduling(response.data));

    }, []);

    console.log(checked)

    function attended (checked){
        axios.put("/schedule", checked); //colocar id
    }

    // const scheduling = {
    //     id: 1,
    //     name: "Diana",
    //     birthdate: "09/06/1998",
    //     schedulingDate: "15/04/2022",
    //     schedulingTime: "16h"
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
                        <th>Scheduling Date</th>
                        <th>Time</th>
                        <th>Conclusion of the service</th>
                    </tr>
                </thead> 
                <tbody>
                    {/* {scheduling.map((schedule, index) => ( */}
                        <tr key={''}>
                            <td>{scheduling.id}</td>
                            <td>{scheduling.name}</td>
                            <td>{scheduling.birthdate}</td>
                            <td>{scheduling.schedulingDate}</td>
                            <td>{scheduling.schedulingTime}</td>
                            <td>
                            <Switch
                                onClick={() => attended()}
                                label="Attended"
                                color="indigo"
                                checked={checked}
                                onChange={(event) => setChecked(event.currentTarget.checked)}
                            />
                            </td>
                        </tr>
                    {/* ))} */}
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