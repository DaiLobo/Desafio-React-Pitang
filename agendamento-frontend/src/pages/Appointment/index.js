import {Button, Space, Switch, Table, Title} from "@mantine/core";

const Appointment = () => {
   
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
                    {/* {users.map((user, index) => ( */}
                        <tr key={''}>
                            <td>{}</td>
                            <td>{}</td>
                            <td>{}</td>
                            <td>{}</td>
                            <td>{}</td>
                            <td>
                            <Switch 
                                label="Attended"
                                color="indigo"
                            />
                            </td>
                        </tr>
                    {/* ))} */}
                </tbody>
            </Table>

            <Space h="xl"/>
            <Button onClick={() => {}} 
                    variant="gradient" 
                    gradient={{ from: 'indigo', to: 'cyan' }} 
                    size="xs">
                Schedule
            </Button>

        </>
    );

}

export default Appointment;