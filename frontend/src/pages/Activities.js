import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthProvider";
import { Button, Row, Col, ListGroup, Modal } from 'react-bootstrap';
import { toast } from "react-toastify";
import AddActivity from "../components/AddActivity";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faTrash, faEdit, faTags, faLinesLeaning, faStar } from '@fortawesome/free-solid-svg-icons';

function Activities() {
    const { user } = useAuth();
    const [activities, setActivities] = useState([]);
    const [selected, setSelected] = useState();
    const [showDelete, setShowDeleteModal] = useState(false);

    useEffect(() => {
        fetchActivities();
    }, [user]);

    const fetchActivities = async () => {
        setSelected(null);
        try {
            const response = await fetch('http://localhost:8080/activity?UserId=' + user.id);
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

    const handleCloseDelete = () => {
        setShowDeleteModal(false);
    };

    const handleDelete = act => {
        setShowDeleteModal(true);
        setSelected(act);
    };

    const handleDeleteConfirmation = async () => {
        try {
            const response = await fetch('http://localhost:8080/activity/' + selected.id, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (!response.ok) {
                toast.error("Eroare ștergere!")
            } else {
                toast.success("Șters!");
                setShowDeleteModal(false);
                await fetchActivities();
            }
           
        } catch (error) {
            console.error('Eroare la ștergere:', error);
        }
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
                                    <p style={{ fontWeight: "bold" }}><FontAwesomeIcon color="orange" icon={faStar} /> {activity.name}</p>
                                    <p><FontAwesomeIcon color="darkblue" icon={faLinesLeaning} /> {activity.description}</p>
                                    <p><FontAwesomeIcon color="darkgreen" icon={faCalendar} /> Data: {formatDate(new Date(activity.date))} - {formatDate(new Date(activity.endDate))} </p>
                                    <p><FontAwesomeIcon color="darkred" icon={faTags} /> Tip: {activity.type}</p>
                                   {new Date(activity.date) >= new Date() && <Button className="mx-3" onClick={() => setSelected(activity)}><FontAwesomeIcon icon={faEdit} /></Button>}
                                    <Button onClick={() => handleDelete(activity)} variant="danger"><FontAwesomeIcon icon={faTrash} /> </Button>
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
            <Modal show={showDelete} onHide={handleCloseDelete}>
                <Modal.Header closeButton>
                    <Modal.Title>Șterge activitate</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Chiar dorești să ștergi activitatea '{selected?.name}'?
                </Modal.Body>
                <Modal.Footer>
                    <Button className='gradient-custom no' variant="secondary" onClick={handleCloseDelete}>
                        Nu
                    </Button>
                    <Button className='gradient-custom yes' variant="danger" onClick={handleDeleteConfirmation}>
                        Da
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Activities;