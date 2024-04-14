import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthProvider";
import { Button, Row, Col, ListGroup, Modal, Form } from 'react-bootstrap';
import { toast } from "react-toastify";
import AddGrade from "../components/AddGrade";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

function CalculatorPage() {
    const { user } = useAuth();
    const [selected, setSelected] = useState();
    const [showDelete, setShowDeleteModal] = useState(false);
    const [grades, setGrades] = useState([]);
    const [activities, setActivities] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [weightedAverage, setWeightedAverage] = useState('');

    useEffect(() => {
        fetchActivities();
    }, [selectedActivity]);

    const fetchActivities = async () => {
        try {
            const response = await fetch('http://localhost:8080/activity?UserId' + user.id);
            const data = await response.json();
            if (response.ok) {
                setActivities(data);
                console.log(selectedActivity)
                if (selectedActivity) {
                    await fetchGrades();
                }
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.error('Eroare la obținerea activităților.', error);
            toast.error('Eroare la obținerea activităților.', error);
        }
    };

    const fetchGrades = async () => {
        try {
            const response = await fetch('http://localhost:8080/grade?ActivityId=' + selectedActivity);
            const data = await response.json();
            if (response.ok) {
                setGrades(data);
                calculateWeightedAverage(data);
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.error('Eroare la obținerea notelor.', error);
            toast.error('Eroare la obținerea notelor.', error);
        }
    };

    const calculateWeightedAverage = grades => {
        if (grades.length === 0) {
            setWeightedAverage('');
            return;
        }
        const totalProduct = grades.reduce((accumulator, grade) => {
            return parseFloat(accumulator) + (parseFloat(grade.value) * parseInt(grade.credits));
        }, 0);

        const totalCredits = grades.reduce((accumulator, grade) => {
            return parseFloat(accumulator) + parseInt(grade.credits);
        }, 0);

        const weightedAverage = totalProduct / totalCredits;
        setWeightedAverage(weightedAverage.toFixed(2));
    };

    const handleCloseDelete = () => {
        setShowDeleteModal(false);
    };

    const handleDelete = act => {
        setShowDeleteModal(true);
        setSelected(act);
    };

    const handleDeleteConfirmation = async () => {
        try {
            const response = await fetch('http://localhost:8080/grade/' + selected.id, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (!response.ok) {
                toast.error("Eroare ștergere!")
            } else toast.success("Șters!");
            await fetchActivities();
        } catch (error) {
            console.error('Eroare la ștergere:', error);
        }
    }

    return (
        <div className="page-container" style={{ height: '100%' }}>
            <Row>
                <Col md={4} className="p-4">
                    <div className="section-div" style={{ height: '90vh' }}>
                        <h1 className="text-center mb-4">Note</h1>
                        <Form.Group>
                            <Form.Label>Activitate</Form.Label>
                            <Form.Control as="select" value={selectedActivity} name="ActivityId" onChange={e => setSelectedActivity(e.target.value)}>
                                <option>Selectează o activitate</option>
                                {activities.map(act => (
                                    <option key={act.id} value={act.id}>{act.name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        {grades.length > 0 && <ListGroup className="card shadow-lg my-3" style={{ height: '60vh', overflowY: 'scroll' }}>
                            {grades.map((grade, index) => (
                                <ListGroup.Item className="m-2 shadow p-3" key={index}>Notă: {grade.value}, Credite: {grade.credits}
                                    <Button className="mx-3" style={{padding:'10px', height:"auto"}} onClick={() => setSelected(grade)}><FontAwesomeIcon icon={faEdit} /></Button>
                                    <Button style={{padding:'10px', height:"auto"}} onClick={() => handleDelete(grade)} variant="danger"><FontAwesomeIcon icon={faTrash} /> </Button>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>}
                        {grades.length == 0 && <h3 className="mt-5">Nu ai note.</h3>}
                    </div>
                </Col>
                <Col md={4} className="p-4">
                    <div className="section-div" style={{ height: '90vh' }}>
                        <h1 className="text-center mb-4">Medie</h1>
                        <div class="container">
                            <div class="calculator">
                                <input type="text" class="calc-numbers" value={weightedAverage} readOnly></input>
                                <div class="calculator-buttons">
                                    <button class="btn is-clear span-2 orange operator">C</button>
                                    <button class="btn orange operator">&larr;</button>
                                    <button class="btn orange operator">&divide;</button>
                                    <button class="btn">7</button>
                                    <button class="btn">8</button>
                                    <button class="btn">9</button>
                                    <button class="btn orange operator">x</button>
                                    <button class="btn">4</button>
                                    <button class="btn">5</button>
                                    <button class="btn">6</button>
                                    <button class="btn orange">-</button>
                                    <button class="btn">1</button>
                                    <button class="btn">2</button>
                                    <button class="btn">3</button>
                                    <button class="btn orange operator">+</button>
                                    <button class="btn span-3">0</button>
                                    <button class="btn orange operator">=</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
                <Col md={4} className="p-4">
                    <AddGrade ActivityId={selectedActivity} onSelect={act => setSelectedActivity(act)} grade={selected} refresh={fetchActivities} />
                </Col>
            </Row>
            <Modal show={showDelete} onHide={handleCloseDelete}>
                <Modal.Header closeButton>
                    <Modal.Title>Șterge notă</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Chiar dorești să ștergi nota de {selected?.value}?
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

export default CalculatorPage;