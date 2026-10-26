import React, { useState, useEffect } from 'react';
import { Container, Navbar, NavbarBrand, Badge, UncontrolledAlert, Row, Col } from 'reactstrap';

const API_URL = 'http://localhost:3000/api';

function App() {
  const [menu, setMenu] = useState([]);
  const [reserva, setReserva] = useState({ saldo: 0, itemsReservados: [], total: 0 });
  const [errorMsg, setErrorMsg] = useState('');

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

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <Container className="my-4">
      <Navbar color="dark" dark className="mb-4 p-3 rounded d-flex justify-content-between">
        <NavbarBrand href="#">Food DEI S.A. de R.L.</NavbarBrand>
        <div className="d-flex gap-3 align-items-center">
          <span className="text-white">Saldo: <strong className="text-success">${Number(reserva.saldo).toFixed(2)}</strong></span>
          <span className="text-white">Total: <Badge color="info" pill>${Number(reserva.total).toFixed(2)}</Badge></span>
        </div>
      </Navbar>

      {errorMsg && <UncontrolledAlert color="warning">{errorMsg}</UncontrolledAlert>}
      <h2>Cargando menú...</h2>
    </Container>
  );
}

export default App;