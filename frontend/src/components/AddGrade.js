import { useEffect, useState } from "react";
import { Form, Button, Image } from 'react-bootstrap';
import { toast } from "react-toastify";
import activitati from '../components/img/activitati.png';

function AddGrade({ grade, refresh, ActivityId }) {
    const [formData, setFormData] = useState(grade ? { ...grade } : {
        ActivityId,
        credits: '',
        value: ''
    });

    useEffect(() => {
        setFormData(grade ? { ...grade } : {
            ActivityId,
            credits: '',
            value: ''
        })
    }, [grade]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!formData.ActivityId && !ActivityId) {
            toast.error("Alege o activitate!");
            return;
        }
        try {
            const response = grade ? await fetch("http://localhost:8080/grade/" + grade.id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...formData, ActivityId: ActivityId }),
            }) : await fetch("http://localhost:8080/grade/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...formData, ActivityId: ActivityId }),
            })
            const data = await response.json();
            if (!response.ok) {
                toast.error('Eroare la adăugare notă: ' + data.message);
            } else {
                toast.success("Notă " + (grade ? 'editată' : 'adăugată') + "!");
                if (refresh) {
                    refresh();
                }
            }
        } catch (error) {
            console.error('Eroare!', error);
        }
        setFormData({
            ActivityId: '',
            credits: '',
            value: '', ActivityId
        });
    };

    return (
        <Form className="section-div text-center" onSubmit={handleSubmit}>
            <Image width="50px" src={activitati}></Image>
            <h2 className="text-center my-4">{grade ? 'Editează' : 'Adaugă'} notă</h2>
            <Form.Group className="text-start mb-3">
                <Form.Label>Notă</Form.Label>
                <Form.Control type="number" step="0.1" min="1" max="10" name="value" placeholder="Notă" value={formData.value} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="text-start mb-3">
                <Form.Label>Credite</Form.Label>
                <Form.Control min="1" max="15" type="number" name="credits" value={formData.credits} placeholder="Credite" onChange={handleChange} required />
            </Form.Group>
            {grade  && <Button variant="danger" type="button" onClick={()=> window.location.reload()} className="btn-block my-3 mx-3">
                Renunță
            </Button>}
            <Button variant="primary" type="submit" className="btn-block my-3">
                Salvează
            </Button>
        </Form>
    );
}

export default AddGrade;