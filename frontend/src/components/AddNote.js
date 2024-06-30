import { useEffect, useState } from "react";
import { Form, Button, Image } from 'react-bootstrap';
import { toast } from "react-toastify";
import noteImage from '../components/img/note.png';
import { useAuth } from "./AuthProvider";

function AddNote({ note, refresh, ActivityId }) {
    const { user } = useAuth();
    const [url, setUrl] = useState();
    const [extension, setExtension] = useState();
    const [imageBase64, setImageBase64] = useState(null);
    const [formData, setFormData] = useState(note ? { ...note } : {
        title: '',
        description: '',
        file: '',
        UserId: user.id,
        ActivityId
    });

    useEffect(() => {
        setFormData(note ? { ...note } : {
            title: '',
            description: '',
            file: '',
            UserId: user.id,
            ActivityId
        });
        if (note && note.file) {
            setImageBase64(note.file);
            base64IntoUrl(note.file);
        }
    }, [note]);

    const base64IntoUrl = file => {
        const extension = getFileExtension(file);
        setExtension(extension);
        const byteCharacters = atob(file.split(",")[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        setUrl(url);
    }

    function getFileExtension(base64String) {
        const match = /^data:(\w+)\/(\w+);base64,/.exec(base64String);
        if (match) {
            return match[2];
        }
        return null;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name == 'file') {
            const selectedFile = e.target.files[0];
            if(!['image', 'video', 'pdf'].includes(selectedFile.type)){
                toast.error("Puteți adăuga doar imagini, clipuri și pdf-uri!");
                return;
            }
            console.log(selectedFile)
            if (selectedFile) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFormData({ ...formData, [name]: reader.result });
                    setImageBase64(reader.result);
                    base64IntoUrl(reader.result);
                };
                reader.readAsDataURL(selectedFile);
            }
        } else setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!formData.ActivityId && !ActivityId) {
            toast.error("Alege o activitate!");
            return;
        }
        if (!formData.file) {
            toast.error("Încarcă un fișier corect!");
            return;
        }
        try {
            const response = note ? await fetch("http://localhost:8080/note/" + note.id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...formData, ActivityId: ActivityId }),
            }) : await fetch("http://localhost:8080/note/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...formData, ActivityId: ActivityId }),
            });
            const data = await response.json();
            if (!response.ok) {
                toast.error('Eroare la adăugare notă: ' + data.message);
            } else {
                toast.success("Notiță " + (note ? 'editată' : 'adăugată') + "!");
                if (refresh) {
                    refresh();
                }
            }
        } catch (error) {
            console.error('Eroare!', error);
        }
        setFormData({
            title: '',
            description: '',
            file: '',
            UserId: user.id,
            ActivityId
        });
    };

    return (
        <Form className="section-div text-center" onSubmit={handleSubmit}>
            <Image width="50px" src={noteImage}></Image>
            <h2 className="text-center my-4">{note ? 'Editează' : 'Adaugă'} notiță</h2>
            <Form.Group className="text-start mb-3">
                <Form.Label>Titlu</Form.Label>
                <Form.Control type="text" name="title" placeholder="Titlu" value={formData.title} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="text-start mb-3">
                <Form.Label>Descriere</Form.Label>
                <Form.Control type="text" name="description" placeholder="Descriere" value={formData.description} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="text-start mb-3">
                <Form.Label>Fișier</Form.Label>
                <Form.Control type="file" name="file" placeholder="Fișier (base64)" onChange={handleChange} required={!note} />
            </Form.Group>
            {imageBase64 && url && <div style={{ textAlign: 'center' }}><a href={url} download={"notita." + extension}>Descarcă</a></div>}
            <Button variant="primary" type="submit" className="btn-block my-3">
                Salvează
            </Button>
        </Form>
    );
}

export default AddNote;