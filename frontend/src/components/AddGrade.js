import { useEffect, useState } from "react";
import { Form, Button, Image } from 'react-bootstrap';
import { toast } from "react-toastify";
import activitati from '../components/img/activitati.png';
import { useAuth } from "./AuthProvider";

function AddGrade({ grade, refresh , ActivityId}) {
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
        console.log(formData)
        if(!formData.ActivityId && !ActivityId){
            toast.error("Alege o activitate!");
            return;
        }
        try {
            const response = grade ? await fetch("http://localhost:8080/grade/" + grade.id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({...formData, ActivityId: ActivityId}),
            }) : await fetch("http://localhost:8080/grade/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({...formData, ActivityId: ActivityId}),
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
            console.error('Eroare!',error);
        }
        setFormData({
            ActivityId: '',
            credits: '',
            value: ''
        });
    };

    return (
        <Form className="section-div text-center" onSubmit={handleSubmit}>
            <Image width="50px" src={activitati}></Image>
            <h2 className="text-center my-4">{grade ? 'Editează' : 'Adaugă'} notă</h2>
               <Form.Group className="text-start mb-3">
                <Form.Label>Notă</Form.Label>
                <Form.Control type="number" name="value" placeholder="Notă" value={formData.value} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="text-start mb-3">
                <Form.Label>Credite</Form.Label>
                <Form.Control type="number" name="credits" value={formData.credits} placeholder="Credite" onChange={handleChange} required />
            </Form.Group>
            <Button variant="primary" type="submit" className="btn-block my-3">
                Salvează
            </Button>
        </Form>
    );
}

export default AddGrade;