import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
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
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            const response = await fetch('http://localhost:8080/activity?UserId=' + user.id);
            const data = await response.json();
            if (response.ok) {
                const arr = data.map(act => ({
                    start: new Date(act.date),
                    end: new Date(act.endDate),
                    title: act.name,
                    id: act.id,
                    allDay: 'true'
                }));
                setEvents(arr);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Eroare la obținerea activităților.', error);
            toast.error('Eroare la obținerea activităților.');
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
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Eroare la actualizarea activităților.', error);
            toast.error('Eroare la actualizarea activităților.');
        }
    };

    const onEventResize = async ({ start, end, event }) => {
        await updateActivity(event.id, { date: start, endDate: end });
    };

    const onEventDrop = async ({ start, end, event }) => {
        await updateActivity(event.id, { date: start, endDate: end });
    };

    return (
        <div className="App">
            <DnDCalendar
                selectable
                defaultDate={moment().toDate()}
                defaultView={Views.MONTH}
                events={events}
                localizer={localizer}
                onEventDrop={onEventDrop}
                onEventResize={onEventResize}
                resizable onView={(e) => console.log(e, events)}
                style={{ height: "100vh", padding: '20px' }}
            />
        </div>
    );
}

export default CalendarPage;