import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthProvider";
import { Button, Row, Col, ListGroup, Modal, Form } from 'react-bootstrap';
import { toast } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faLinesLeaning, faStar, faFileDownload, faEye } from '@fortawesome/free-solid-svg-icons';
import AddNote from "../components/AddNote";

function Notes() {
    const { user } = useAuth();
    const [activities, setActivities] = useState([]);
    const [selected, setSelected] = useState();
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [showDelete, setShowDeleteModal] = useState(false);
    const [notes, setNotes] = useState([]);
    const [previewFileIndex, setPreviewFileIndex] = useState(null);

    const togglePreviewFile = (index) => {
        setPreviewFileIndex(previewFileIndex === index ? null : index);
    }

    useEffect(() => {
        fetchActivities();
    }, [selectedActivity]);

    const fetchActivities = async () => {
        try {
            const response = await fetch('http://localhost:8080/activity?UserId=' + user.id);
            const data = await response.json();
            if (response.ok) {
                setActivities(data);
                console.log(selectedActivity)
                if (selectedActivity) {
                    await fetchNotes();
                }
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.error('Eroare la obținerea activităților.', error);
            toast.error('Eroare la obținerea activităților.', error);
        }
    };

    const fetchNotes = async () => {
        try {
            const response = await fetch('http://localhost:8080/note?ActivityId=' + selectedActivity + "&UserId=" + user.id);
            const data = await response.json();
            if (response.ok) {
                setNotes(data);
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.error('Eroare la obținerea notițelor.', error);
            toast.error('Eroare la obținerea notițelor.', error);
        }
    };

    const base64IntoUrl = file => {
        const byteCharacters = atob(file.split(",")[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        return url;
    }

    function getFileExtension(base64String) {
        const match = /^data:(\w+)\/(\w+);base64,/.exec(base64String);
        if (match) {
            return match[2];
        }
        return null;
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
            const response = await fetch('http://localhost:8080/note/' + selected.id, {
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

    const renderFile = note => {
        const type = note.file;
        let content;
        if (type.includes("image")) {
            content = <img src={note.file} alt="Imagine" />;
        } else if (type.includes("video")) {
            content = (
                <video controls>
                    <source src={note.file} type={type}></source>
                    Your browser does not support the video tag.
                </video>
            );
        } else if (type.includes('pdf')) {
            console.log(type)
            content = <iframe src={note.file} type={type} width="100%" height="600px" />;
        } else {
            content = <p>Trebuie să încărcați o imagine, un videoclip sau un fișier PDF.</p>;
        }

        return <div>{content}</div>;
    }

    return (
        <div className="page-container" style={{ height: '100%' }}>
            <Row>
                <Col md={8} className="p-4">
                    <div className="section-div" style={{ height: '90vh' }}>
                        <h1 className="text-center mb-4">Notițe</h1>
                        <Form.Group>
                            <Form.Label>Activitate</Form.Label>
                            <Form.Control as="select" value={selectedActivity} name="ActivityId" onChange={e => setSelectedActivity(e.target.value)}>
                                <option>Selectează o activitate</option>
                                {activities.map(act => (
                                    <option key={act.id} value={act.id}>{act.name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        {notes.length > 0 && <ListGroup className="card shadow-lg my-3" style={{ height: '60vh', overflowY: 'scroll' }}>
                            {notes.map((note, index) => (
                                <ListGroup.Item className="m-2 shadow p-3" key={index}>
                                    <p style={{ fontWeight: "bold" }}><FontAwesomeIcon color="orange" icon={faStar} /> {note.title}</p>
                                    <p><FontAwesomeIcon color="darkblue" icon={faLinesLeaning} /> {note.description}</p>
                                    <p><FontAwesomeIcon color="blue" icon={faFileDownload} /> <a href={base64IntoUrl(note.file)} download={"notita." + getFileExtension(note.file)}>Descarcă fișierul</a></p>
                                    <p><FontAwesomeIcon color="green" icon={faEye} /> <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => togglePreviewFile(index)}>Preview fișier</span></p>
                                    {previewFileIndex === index && renderFile(note)}
                                    <Button className="mx-3" style={{ padding: '10px', height: "auto" }} onClick={() => setSelected(note)}><FontAwesomeIcon icon={faEdit} /></Button>
                                    <Button style={{ padding: '10px', height: "auto" }} onClick={() => handleDelete(note)} variant="danger"><FontAwesomeIcon icon={faTrash} /> </Button>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>}
                        {notes.length == 0 && <h3 className="mt-5">Nu ai notițe.</h3>}
                    </div>
                </Col>
                <Col md={4} className="p-4">
                    <AddNote ActivityId={selectedActivity} note={selected} refresh={fetchActivities} />
                </Col>
            </Row>
            <Modal show={showDelete} onHide={handleCloseDelete}>
                <Modal.Header closeButton>
                    <Modal.Title>Șterge notiță</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Chiar dorești să ștergi notița '{selected?.title}'?
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

export default Notes;