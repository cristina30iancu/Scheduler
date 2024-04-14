import { useEffect, useState } from "react";
import { Form, Button, Image } from 'react-bootstrap';
import { toast } from "react-toastify";
import activitati from '../components/img/activitati.png';
import { useAuth } from "./AuthProvider";

function AddActivity({ activity, refresh }) {
    const { user } = useAuth();
    const [formData, setFormData] = useState(activity ? { ...activity } : {
        name: '',
        description: '',
        date: '',
        type: '',
        UserId: user.id
    });

    useEffect(() => {
        setFormData(activity ? { ...activity, date: activity.date.split('T')[0] } : {
            name: '',
            description: '',
            date: '',
            type: '',
            UserId: user.id
        })
    }, [activity]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const response = activity ? await fetch("http://localhost:8080/activity/" + activity.id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            }) : await fetch("http://localhost:8080/activity/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })
            const data = await response.json();
            if (!response.ok) {
                toast.error('Eroare la adăugare activitate: ' + data.message);
            } else {
                toast.success("Activitate " + (activity ? 'editată' : 'adăugată') + "!");
                if (refresh) {
                    refresh();
                }
            }
        } catch (error) {
            console.error('Eroare!', error);
        }
        setFormData({
            name: '',
            description: '',
            date: '',
            type: '',
            UserId: user.id
        });
    };

    return (
        <Form className="section-div text-center" onSubmit={handleSubmit}>
            <Image width="50px" src={activitati}></Image>
            <h2 className="text-center my-4">{activity ? 'Editează' : 'Adaugă'} activitate</h2>
            <Form.Group className="text-start mb-3">
                <Form.Label>Nume</Form.Label>
                <Form.Control type="text" name="name" placeholder="Nume" value={formData.name} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="text-start mb-3">
                <Form.Label>Descriere</Form.Label>
                <Form.Control type="text" name="description" placeholder="Descriere" value={formData.description} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="text-start mb-3">
                <Form.Label>Dată</Form.Label>
                <Form.Control type="date" min={new Date().toISOString().split('T')[0]} name="date" value={formData.date} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className='text-start mb-3'>
                <Form.Label>Tip</Form.Label>
                <Form.Select as="select" value={formData.type} name='type' required onChange={handleChange} >
                    <option value="">- Alege tip activitate - </option>
                    <option value="Academică">Academică</option>
                    <option value="Extra-curiculară">Extra-curiculară</option>
                </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit" className="btn-block my-3">
                Salvează
            </Button>
        </Form>
    );
}

export default AddActivity;