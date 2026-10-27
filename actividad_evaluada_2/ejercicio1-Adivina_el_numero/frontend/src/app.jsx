import React, { useState } from 'react';
import {
    Container,
    Card,
    CardBody,
    CardTitle,
    Form,
    FormGroup,
    Input,
    Button,
    Alert,
    ListGroup,
    ListGroupItem,
    Badge
} from 'reactstrap';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function App() {
    const [numeroInput, setNumeroInput] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [tipoAlerta, setTipoAlerta] = useState('info');
    const [historial, setHistorial] = useState([]);
    const [haGanado, setHaGanado] = useState(false);

    const manejarEnvio = async (e) => {
        e.preventDefault();

        const numero = Number(numeroInput);

        if (!numeroInput || isNaN(numero) || numero < 1 || numero > 100) {
            setMensaje('Por favor ingresa un número válido entre 1 y 100.');
            setTipoAlerta('warning');
            return;
        }

        try {
            const respuesta = await fetch(`${API_URL}/guess`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ numero: numero }),
            });

            const data = await respuesta.json();
            const nuevoIntento = {
                id: Date.now(),
                numero: numero,
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

    const manejarReiniciar = async () => {
        try {
            const respuesta = await fetch(`${API_URL}/reset`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await respuesta.json();

            setMensaje(data.mensaje);
            setTipoAlerta('info');
            setHistorial([]);
            setHaGanado(false);
            setNumeroInput('');
        } catch (error) {
            setMensaje('Error al reiniciar el juego');
            setTipoAlerta('danger');
        }
    };

    const manejarCambioInput = (e) => {
        let valor = e.target.value;

        valor = valor.replace(/-/g, '');

        if (valor.length > 3) {
            valor = valor.slice(0, 3);
        }

        setNumeroInput(valor);
    };

    const manejarKeyDown = (e) => {
        if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
            e.preventDefault();
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
                                onChange={manejarCambioInput}
                                onKeyDown={manejarKeyDown}
                                disabled={haGanado}
                                min="1"
                                max="100"
                                required
                            />
                        </FormGroup>
                        <Button color="primary" type="submit" disabled={haGanado} block>
                            Enviar Intento
                        </Button>

                        {/* Mostrar botón verde si ganó o botón de enlace si aún juega */}
                        {haGanado ? (
                            <Button color="success" block className="mt-2" onClick={manejarReiniciar}>
                                Jugar de Nuevo
                            </Button>
                        ) : (
                            <div className="text-end mt-2">
                                <Button color="link" size="sm" onClick={manejarReiniciar}>
                                    Reiniciar Juego
                                </Button>
                            </div>
                        )}
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