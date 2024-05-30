import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { toast } from "react-toastify";
import { useAuth } from "../components/AuthProvider";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

function CalendarPage() {
    const { user } = useAuth();
    const [events, setEvents] = useState();

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            const response = await fetch('http://localhost:8080/activity?UserId=' + user.id);
            const data = await response.json();
            if (response.ok) {
                const arr = [];
                for (let act of data) {
                    arr.push({ start: moment(act.date), end: moment(act.endDate), title: act.name, id: act.id });
                }
                setEvents(arr);
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.error('Eroare la obținerea activităților.', error);
            toast.error('Eroare la obținerea activităților.', error);
        }
    };

    const updateActivity = async (id, body) => {
        try {
            const response = await fetch('http://localhost:8080/activity/' + id, {
                method: 'PUT',
                body: JSON.stringify(body),
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const data = await response.json();
            if (response.ok) {
                await fetchActivities();
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.error('Eroare la obținerea activităților.', error);
            toast.error('Eroare la obținerea activităților.', error);
        }
    };

    const onEventResize = async data => {
        const { start, end, event } = data;
        await updateActivity(event.id, { date: start, endDate: end });
    };

    const onEventDrop = async data => {
        const { start, end, event } = data;
        await updateActivity(event.id, { date: start, endDate: end });
    };

    return (
        <div className="App">
            <DnDCalendar
                defaultDate={moment().toDate()}
                defaultView="month"
                events={events}
                localizer={localizer}
                onEventDrop={onEventDrop}
                onEventResize={onEventResize}
                resizable
                style={{ height: "100vh", padding: '20px' }}
            />
        </div>
    );
}

export default CalendarPage;