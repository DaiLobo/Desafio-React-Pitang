import React from "react";
import { CalendarEvent, ClipboardList } from "tabler-icons-react";
import { ThemeIcon, UnstyledButton, Group, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";

function MainLink({ icon, color, label, path }) {

    const navigate = useNavigate(); //faz com que a página seja alterada, sem fazer reload

    return (
        <UnstyledButton
            onClick={() => navigate(path)}
            sx={(theme) => ({
            display: "block",
            width: "100%",
            padding: theme.spacing.xs,
            borderRadius: theme.radius.sm,
            color:
                theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

            "&:hover": {
                backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[6]
                    : theme.colors.gray[0],
            },
            })}
        >
            <Group>
            <ThemeIcon color={color} variant="light">
                {icon}
            </ThemeIcon>

            <Text size="sm">{label}</Text>
            </Group>
        </UnstyledButton>
    );
}

const routes = [
    {icon: <CalendarEvent size={16} />, color: "teal", label: "Patients Scheduling", path: "/"},
    {icon: <ClipboardList size={16} />, color: "violet", label: "Consultation of Schedules", path: "/appointment"},    
]

export default function MainLinks() {
    return (
        <div>
            {routes.map((route) => (
                <MainLink {...route} key={route.label} />
            ))}
        </div>
    );
}