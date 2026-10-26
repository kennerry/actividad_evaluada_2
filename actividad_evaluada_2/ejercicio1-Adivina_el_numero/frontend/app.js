import React, { useState } from 'react';
import { Container, Card, CardBody, CardTitle, Form, FormGroup, Input, Button, Alert } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
//Importar los componentes de reactstrap
import { ListGroup, ListGroupItem, Badge } from 'reactstrap';
const API_URL = 'http://localhost:3000';

function App() {
    const [numeroInput, setNumeroInput] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [tipoAlerta, setTipoAlerta] = useState('info');
    const [historial, setHistorial] = useState([]);
    const [haGanado, setHaGanado] = useState(false);

    const manejarEnvio = async (e) => {
        e.preventDefault();
        if (!numeroInput) return;

        try {
            const respuesta = await fetch(`${API_URL}/guess`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ numero: Number(numeroInput) }),
            });

            const data = await respuesta.json();
            const nuevoIntento = {
                id: Date.now(),
                numero: Number(numeroInput),
                pista: data.resultado
            };
            setHistorial((prev) => [nuevoIntento, ...prev]);
            setMensaje(data.mensaje);

            if (data.resultado === 'Acierto') {
                setTipoAlerta('success');
                setHaGanado(true);
            } else {
                setTipoAlerta('warning');
            }

            setNumeroInput('');
        } catch (error) {
            setMensaje('Error de conexión con el servidor');
            setTipoAlerta('danger');
        }
    };

    return (
        <Container className="mt-5" style={{ maxWidth: '600px' }}>
            <Card className="shadow-sm">
                <CardBody>
                    <CardTitle tag="h2" className="text-center mb-4">
                        Adivina el Número
                    </CardTitle>

                    {mensaje && <Alert color={tipoAlerta}>{mensaje}</Alert>}

                    <Form onSubmit={manejarEnvio}>
                        <FormGroup>
                            <Input
                                type="number"
                                placeholder="Ingresa un número entre 1 y 100"
                                value={numeroInput}
                                onChange={(e) => setNumeroInput(e.target.value)}
                                disabled={haGanado}
                                required
                            />
                        </FormGroup>
                        <Button color="primary" type="submit" disabled={haGanado}>
                            Enviar Intento
                        </Button>
                    </Form>                    
                    <div className="mt-4">
                        <h5>Historial de Intentos ({historial.length})</h5>
                        <ListGroup style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            {historial.map((item) => (
                                <ListGroupItem key={item.id} className="d-flex justify-content-between align-items-center">
                                    <span>Número: <strong>{item.numero}</strong></span>
                                    <Badge color={item.pista === 'Acierto' ? 'success' : 'info'} pill>
                                        {item.pista}
                                    </Badge>
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                    </div>
                </CardBody>
            </Card>
        </Container>
    );
}

export default App;