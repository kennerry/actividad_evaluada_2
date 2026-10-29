import React, { useState, useEffect } from 'react';
import {
    Container,
    Navbar,
    NavbarBrand,
    Badge,
    UncontrolledAlert,
    Alert,
    Row,
    Col,
    Card,
    CardBody,
    CardTitle,
    CardText,
    Button,
    ListGroup,
    ListGroupItem,
    ButtonGroup
} from 'reactstrap';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const TIEMPO_INICIAL = 60; //Segundos

function App() {
    const [menu, setMenu] = useState([]);
    const [reserva, setReserva] = useState({ saldo: 0, itemsReservados: [], total: 0 });
    const [errorMsg, setErrorMsg] = useState('');

    // Estados para el Temporizador
    const [tiempo, setTiempo] = useState(TIEMPO_INICIAL);
    const [tiempoExpirado, setTiempoExpirado] = useState(false);

    // Formatear segundos a MM:SS
    const formatearTiempo = (seg) => {
        const min = Math.floor(seg / 60);
        const restante = seg % 60;
        return `${min < 10 ? '0' : ''}${min}:${restante < 10 ? '0' : ''}${restante}`;
    };

    // Hook para la cuenta regresiva
    useEffect(() => {
        if (tiempoExpirado) return;

        if (tiempo <= 0) {
            setTiempoExpirado(true);
            setErrorMsg('El tiempo para completar tu reserva ha expirado.');
            return;
        }

        const intervalo = setInterval(() => {
            setTiempo((prev) => prev - 1);
        }, 1000);

        // Limpieza del intervalo para evitar memory leaks
        return () => clearInterval(intervalo);
    }, [tiempo, tiempoExpirado]);

    const cargarDatos = async () => {
        try {
            setErrorMsg('');
            const [resMenu, resReserva] = await Promise.all([
                fetch(`${API_URL}/menu`),
                fetch(`${API_URL}/reserva`)
            ]);
            const dataMenu = await resMenu.json();
            const dataReserva = await resReserva.json();
            setMenu(dataMenu);
            setReserva(dataReserva);
        } catch (err) {
            setErrorMsg('Error al conectar con el servidor');
        }
    };

    const reiniciarReserva = async () => {
        // Vaciamos visualmente la reserva o llamamos a un reload de datos
        try {

            await fetch(`${API_URL}/reserva/reiniciar`, {
                method: "POST"
            })

            setTiempo(TIEMPO_INICIAL);
            setTiempoExpirado(false);
            setErrorMsg('');

            await cargarDatos();
        } catch (error) {
            setErrorMsg("Error al reiniciar la reserva en el servidor")
        }

    };

    const agregarPlato = async (alimentoId) => {
        if (tiempoExpirado) return;
        try {
            setErrorMsg('');
            const respuesta = await fetch(`${API_URL}/reserva/agregar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ alimentoId, cantidad: 1 })
            });
            const data = await respuesta.json();
            if (!respuesta.ok) throw new Error(data.error || data.mensaje || 'Stock insuficiente');
            await cargarDatos();
        } catch (err) {
            setErrorMsg(err.message);
        }
    };

    const actualizarPorciones = async (alimentoId, nuevaCantidad) => {
        if (tiempoExpirado) return;
        if (nuevaCantidad < 1) return eliminarPlato(alimentoId);
        try {
            setErrorMsg('');
            const respuesta = await fetch(`${API_URL}/reserva/actualizar-porciones/${alimentoId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cantidad: nuevaCantidad })
            });
            const data = await respuesta.json();
            if (!respuesta.ok) throw new Error(data.error || data.mensaje || 'Saldo insuficiente');
            await cargarDatos();
        } catch (err) {
            setErrorMsg(err.message);
        }
    };

    const eliminarPlato = async (alimentoId) => {
        if (tiempoExpirado) return;
        try {
            setErrorMsg('');
            const respuesta = await fetch(`${API_URL}/reserva/eliminar/${alimentoId}`, { method: 'DELETE' });
            const data = await respuesta.json();
            if (!respuesta.ok) throw new Error(data.error || 'Error al eliminar');
            await cargarDatos();
        } catch (err) {
            setErrorMsg(err.message);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const obtenerNombrePlato = (id) => {
        const plato = menu.find((p) => p.id === id);
        return plato ? plato.nombre : `Plato #${id}`;
    };

    return (
        <Container className="my-4">
            <Navbar color="dark" dark className="mb-4 p-3 rounded d-flex justify-content-between flex-wrap">
                <NavbarBrand href="#">Food DEI S.A. de R.L.</NavbarBrand>
                <div className="d-flex gap-3 align-items-center">
                    <span className="text-white">Saldo: <strong className="text-success">${Number(reserva.saldo).toFixed(2)}</strong></span>
                    <span className="text-white">Total: <Badge color="info" pill>${Number(reserva.total).toFixed(2)}</Badge></span>


                    <Badge color={tiempo < 60 ? "danger" : "warning"} pill className="fs-6 ms-2">
                        {formatearTiempo(tiempo)}
                    </Badge>
                </div>
            </Navbar>

            {tiempoExpirado && (
                <Alert color="danger" className="text-center mb-4">
                    <h5>Tiempo Agotado</h5>
                    <p>Se ha cerrado la sesión de reserva por límite de tiempo.</p>
                    <Button color="primary" size="sm" onClick={reiniciarReserva}>
                        Iniciar Nueva Reserva
                    </Button>
                </Alert>
            )}

            {errorMsg && !tiempoExpirado && <UncontrolledAlert color="warning">{errorMsg}</UncontrolledAlert>}

            <Row>
                <Col xs="12" md="8">
                    <h4>Menú del Día</h4>
                    <Row>
                        {menu.map((plato) => (
                            <Col xs="12" md="6" key={plato.id}>
                                <Card className="mb-3 shadow-sm">
                                    <CardBody>
                                        <CardTitle tag="h5">{plato.nombre} <Badge color="success">${Number(plato.precio).toFixed(2)}</Badge></CardTitle>
                                        <CardText>Stock: {plato.stock} porciones</CardText>
                                        <Button
                                            color="primary"
                                            block
                                            disabled={plato.stock === 0 || tiempoExpirado}
                                            onClick={() => agregarPlato(plato.id)}
                                        >
                                            {plato.stock === 0 ? 'Agotado' : 'Añadir a la Reserva'}
                                        </Button>
                                    </CardBody>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Col>

                <Col xs="12" md="4">
                    <h4>Tu Bandeja de Reserva</h4>
                    {(!reserva.itemsReservados || reserva.itemsReservados.length === 0) ? (
                        <p className="text-muted">No has agregado platos a tu reserva.</p>
                    ) : (
                        <ListGroup className="shadow-sm">
                            {reserva.itemsReservados.map((item) => (
                                <ListGroupItem key={item.id} className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>{obtenerNombrePlato(item.id)}</strong>
                                        <div><small className="text-muted">Cantidad: {item.cantidad}</small></div>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <ButtonGroup size="sm">
                                            <Button outline disabled={tiempoExpirado} onClick={() => actualizarPorciones(item.id, item.cantidad - 1)}>-</Button>
                                            <Button outline disabled={tiempoExpirado} onClick={() => actualizarPorciones(item.id, item.cantidad + 1)}>+</Button>
                                        </ButtonGroup>
                                        <Button color="danger" outline size="sm" disabled={tiempoExpirado} onClick={() => eliminarPlato(item.id)}>Quitar</Button>
                                    </div>
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default App;
