import React, { useEffect, useState } from 'react';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { toast } from 'react-toastify';
import { Button, Form, Col, Row } from 'react-bootstrap';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useAuth } from '../components/AuthProvider';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

function Statistici() {
    const { user } = useAuth();
    const [activities, setActivities] = useState([]);
    const [grades, setGrades] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [filteredGrades, setFilteredGrades] = useState([]);
    const [targetAverage, setTargetAverage] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [weightedAverage, setWeightedAverage] = useState(0);

    useEffect(() => {
        fetchActivities();
        fetchGrades();
    }, []);

    useEffect(() => {
        if (selectedActivity) {
            const filtered = grades.filter(grade => grade.ActivityId === selectedActivity);
            setFilteredGrades(filtered);
        }
    }, [selectedActivity, grades]);

    useEffect(() => {
        const avg = calculateWeightedAverage(grades);
        setWeightedAverage(avg);
    }, [grades]);

    const fetchActivities = async () => {
        try {
            const response = await fetch('http://localhost:8080/activity?UserId=' + user.id);
            const data = await response.json();
            if (response.ok) {
                setActivities(data);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Eroare la obținerea activităților.', error);
            toast.error('Eroare la obținerea activităților.');
        }
    };

    const fetchGrades = async () => {
        try {
            const response = await fetch('http://localhost:8080/grade/user/' + user.id);
            const data = await response.json();
            if (response.ok) {
                setGrades(data);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Eroare la obținerea notelor.', error);
            toast.error('Eroare la obținerea notelor.');
        }
    };

    const calculateWeightedAverage = (grades) => {
        if (grades.length === 0) {
            return 0;
        }
        const totalProduct = grades.reduce((accumulator, grade) => {
            return parseFloat(accumulator) + (parseFloat(grade.value) * parseInt(grade.credits));
        }, 0);

        const totalCredits = grades.reduce((accumulator, grade) => {
            return parseFloat(accumulator) + parseInt(grade.credits);
        }, 0);

        return totalProduct / totalCredits;
    };

    const calculateStatistics = (grades) => {
        if (!grades.length) return { min: 0, max: 0, avg: 0 };
        const values = grades.map(g => g.value);
        const min = Math.min(...values);
        const max = Math.max(...values);
        const avg = calculateWeightedAverage(grades).toFixed(2);
        return { min, max, avg };
    };

    const statsAll = calculateStatistics(grades);
    const statsSelected = calculateStatistics(filteredGrades);

    const exportCSV = () => {
        const data = grades.map(grade => ({
            id: grade.id,
            valoare: grade.value.toString(),
            credite: grade.credits.toString(),
            activitate: activities.find(act => act.id === grade.ActivityId)?.name,
        }));
        const csv = Papa.unparse(data);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'note.csv';
        link.click();
    };

    const exportPDF = () => {
        const doc = new jsPDF();
        const tableColumn = ["ID", "Valoare", "Credite", "Activitate"];
        const tableRows = [];

        grades.forEach(grade => {
            const gradeData = [
                grade.id,
                grade.value,
                grade.credits,
                activities.find(act => act.id === grade.ActivityId)?.name,
            ];
            tableRows.push(gradeData);
        });

        doc.autoTable(tableColumn, tableRows, { startY: 20 });
        doc.text("Raport Note", 14, 15);
        doc.save("raport_note.pdf");
    };

    const calculateSuggestions = () => {
        const desiredAvg = parseFloat(targetAverage);
        if (!desiredAvg || isNaN(desiredAvg)) {
            setSuggestions([]);
            toast.warning("Dați o medie validă!");
            return;
        }

        if (desiredAvg <= weightedAverage) {
            setSuggestions([]);
            toast.warning("Media este mai mică decât cea existentă!");
            return;
        }

        const currentTotalProduct = grades.reduce((accumulator, grade) => {
            return parseFloat(accumulator) + (parseFloat(grade.value) * parseInt(grade.credits));
        }, 0);

        const currentTotalCredits = grades.reduce((accumulator, grade) => {
            return parseFloat(accumulator) + parseInt(grade.credits);
        }, 0);

        const newSuggestions = [];
        for (let credits = 1; credits <= 10; credits++) {
            const requiredGrade = ((desiredAvg * (currentTotalCredits + credits)) - currentTotalProduct) / credits;
            if (requiredGrade <= 10) {
                newSuggestions.push({
                    grade: requiredGrade.toFixed(2),
                    credits,
                });
            }
        }
        setSuggestions(newSuggestions);
        if (newSuggestions.length == 0) {
            toast.warning("Nu s-au găsit sugestii!");
        }
    };

    const gradeDistributionData = {
        labels: ['1-2', '3-4', '5-6', '7-8', '9-10'],
        datasets: [{
            label: 'Distribuția notelor',
            data: [0, 0, 0, 0, 0], // Initial data
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
        }]
    };

    grades.forEach(grade => {
        if (grade.value >= 1 && grade.value <= 2) {
            gradeDistributionData.datasets[0].data[0] += 1;
        } else if (grade.value >= 3 && grade.value <= 4) {
            gradeDistributionData.datasets[0].data[1] += 1;
        } else if (grade.value >= 5 && grade.value <= 6) {
            gradeDistributionData.datasets[0].data[2] += 1;
        } else if (grade.value >= 7 && grade.value <= 8) {
            gradeDistributionData.datasets[0].data[3] += 1;
        } else if (grade.value >= 9 && grade.value <= 10) {
            gradeDistributionData.datasets[0].data[4] += 1;
        }
    });

    const aggregatedActivities = activities.reduce((acc, activity) => {
        if (!acc[activity.type]) {
            acc[activity.type] = 0;
        }
        acc[activity.type]++;
        return acc;
    }, {});

    const pieData = {
        labels: Object.keys(aggregatedActivities),
        datasets: [{
            label: 'Tipuri de activități',
            data: Object.values(aggregatedActivities),
            backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
            ]
        }]
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Statisticile mele</h1>
            <div className="row">
                <div className="col-md-6">
                    <h3>Tipuri de activități</h3>
                    <Pie data={pieData} />
                </div>
                <div className="col-md-6">
                    <Form.Group className='mb-4'>
                        <Form.Label>Activitate</Form.Label>
                        <Form.Control as="select" value={selectedActivity} onChange={e => setSelectedActivity(parseInt(e.target.value))}>
                            <option value="">Selectează o activitate</option>
                            {activities.map(act => (
                                <option key={act.id} value={act.id}>{act.name}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    {selectedActivity && (
                        <>
                            <h3>Note pentru activitatea selectată</h3>
                            <Line data={{
                                labels: filteredGrades.map(grade => grade.id),
                                datasets: [{
                                    label: 'Note',
                                    data: filteredGrades.map(grade => grade.value),
                                    backgroundColor: 'rgba(153, 102, 255, 0.6)',
                                    fill: false,
                                    borderColor: 'rgba(153, 102, 255, 1)'
                                }]
                            }} />
                            <div>
                                <p>Cea mai mică notă: {statsSelected.min}</p>
                                <p>Cea mai mare notă: {statsSelected.max}</p>
                                <p>Media activității: {statsSelected.avg}</p>
                            </div>
                        </>
                    )}
                    <h3>Distribuția notelor</h3>
                    <p>Modul în care notele sunt repartizate pe intervale pentru o imagine de ansamblu asupra performanței generale. Graficul afișează numărul de note pentru fiecare interval.</p>
                    <Bar data={gradeDistributionData} />
                    <h3>Statistici generale</h3>
                    <div>
                        <p>Cea mai mică notă: {statsAll.min}</p>
                        <p>Cea mai mare notă: {statsAll.max}</p>
                        <p>Medie pentru toate notele: {statsAll.avg}</p>
                    </div>
                </div>
                <div className="col-md-12 mt-5">
                    <Button variant="primary" onClick={exportCSV}>Export CSV</Button>
                    <Button variant="secondary" className="m-3" onClick={exportPDF}>Export PDF</Button>
                </div>
                <div className="col-md-12 mt-5">
                    <h3>Ajutor pentru îmbunătățirea mediei</h3>
                    <Form>
                        <Row>
                            <Col>
                                <Form.Control
                                    type="number"
                                    max="10"
                                    placeholder="Introduceți media dorită"
                                    value={targetAverage}
                                    onChange={(e) => {
                                        const v = e.target.value
                                        if (v > 10) {
                                            toast.error("Dați o medie între 1 și 10!")
                                        } else setTargetAverage(e.target.value)
                                    }}
                                />
                            </Col>
                            <Col>
                                <Button onClick={calculateSuggestions}>Calculează</Button>
                            </Col>
                        </Row>
                    </Form>
                    {suggestions.length > 0 && (
                        <div className="mt-4">
                            <h4>Variante de note și credite pentru a atinge media {targetAverage}</h4>
                            <ul>
                                {suggestions.map((suggestion, index) => (
                                    <li key={index}>Nota {suggestion.grade} cu {suggestion.credits} credite</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Statistici;