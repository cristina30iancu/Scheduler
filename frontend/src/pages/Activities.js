import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthProvider";
import { Button, Row, Col, ListGroup } from 'react-bootstrap';
import { toast } from "react-toastify";
import AddActivity from "../components/AddActivity";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faTrash, faEdit, faTags, faLinesLeaning, faStar } from '@fortawesome/free-solid-svg-icons';

function Activities() {
    const { user } = useAuth();
    const [activities, setActivities] = useState([]);
    const [selected, setSelected] = useState();

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        setSelected(null);
        try {
            const response = await fetch('http://localhost:8080/activity?UserId' + user.id);
            const data = await response.json();
            if (response.ok) {
                setActivities(data);
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.error('Eroare la obținerea activităților.', error);
            toast.error('Eroare la obținerea activităților.', error);
        }
    };

    function formatDate(date) {
        const options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            weekday: 'long'
        };

        const formattedDate = date.toLocaleDateString('ro-RO', options);
        return formattedDate.replace(/\//g, '.');
    }

    return (
        <div className="page-container" style={{ height: '100%' }}>
            <Row>
                <Col md={8} className="p-4">
                    <div className="section-div" style={{ height: '90vh' }}>
                        <h1 className="text-center mb-4">Activități</h1>
                        {activities.length > 0 && <ListGroup className="card shadow-lg my-3" style={{ height: '75vh', overflowY: 'scroll' }}>
                            {activities.map(activity => (
                                <ListGroup.Item className="m-2 shadow p-3" key={activity.id}>
                                    <p style={{fontWeight: "bold"}}><FontAwesomeIcon color="orange" icon={faStar} /> {activity.name}</p>
                                    <p><FontAwesomeIcon color="darkblue" icon={faLinesLeaning} /> {activity.description}</p>
                                    <p><FontAwesomeIcon color="darkgreen" icon={faCalendar} /> Data: {formatDate(new Date(activity.date))}</p>
                                    <p><FontAwesomeIcon color="darkred" icon={faTags} /> Tip: {activity.type}</p>
                                    <Button className="mx-3" onClick={() => setSelected(activity)}><FontAwesomeIcon icon={faEdit} /></Button>
                                    <Button variant="danger"><FontAwesomeIcon icon={faTrash} /> </Button>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>}
                        {activities.length == 0 && <h3>Nu ai activități.</h3>}
                    </div>
                </Col>
                <Col md={4} className="p-4">
                    <AddActivity activity={selected} refresh={fetchActivities} />
                </Col>
            </Row>
        </div>
    );
}

export default Activities;