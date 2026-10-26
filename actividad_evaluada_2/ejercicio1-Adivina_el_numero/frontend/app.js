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
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = 'http://localhost:3000';

function App() {
  // 1. Estados requeridos
  const [numeroInput, setNumeroInput] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [tipoAlerta, setTipoAlerta] = useState('info');
  const [historial, setHistorial] = useState([]); // Arreglo para la lista dinámica
  const [haGanado, setHaGanado] = useState(false);
  const [cargando, setCargando] = useState(false);

  // 2. Enviar intento (POST /guess)
  const manejarEnvio = async (e) => {
    e.preventDefault();

    if (!numeroInput || isNaN(numeroInput)) {
      setMensaje('Por favor ingresa un número válido.');
      setTipoAlerta('warning');
      return;
    }

    setCargando(true);

    try {
      const respuesta = await fetch(`${API_URL}/guess`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numero: Number(numeroInput) }),
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(data.error || 'Error en la petición');
      }

      setMensaje(data.mensaje);

      // Registrar intento en el historial local (estructuras de arreglos)
      const nuevoIntento = {
        id: Date.now(),
        numero: Number(numeroInput),
        pista: data.resultado
      };
      setHistorial((prev) => [nuevoIntento, ...prev]);

      // Evaluar si acertó
      if (data.resultado === 'Acierto') {
        setTipoAlerta('success');
        setHaGanado(true);
      } else {
        setTipoAlerta('warning');
      }

      setNumeroInput('');
    } catch (error) {
      setMensaje(error.message);
      setTipoAlerta('danger');
    } finally {
      setCargando(false);
    }
  };

  // 3. Reiniciar juego (POST /reset)
  const manejarReiniciar = async () => {
    setCargando(true);
    try {
      const respuesta = await fetch(`${API_URL}/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await respuesta.json();

      if (respuesta.ok) {
        setMensaje(data.mensaje);
        setTipoAlerta('info');
        setHistorial([]);
        setHaGanado(false);
        setNumeroInput('');
      }
    } catch (error) {
      setMensaje('No se pudo conectar con el servidor.');
      setTipoAlerta('danger');
    } finally {
      setCargando(false);
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '600px' }}>
      <Card className="shadow-sm">
        <CardBody>
          <CardTitle tag="h2" className="text-center mb-4">
            🎯 Adivina el Número
          </CardTitle>

          {/* Alert para mostrar mensajes de retroalimentación del servidor */}
          {mensaje && <Alert color={tipoAlerta}>{mensaje}</Alert>}

          {/* Formulario de Intento */}
          <Form onSubmit={manejarEnvio}>
            <FormGroup>
              <Input
                type="number"
                placeholder="Ingresa un número entre 1 y 100"
                value={numeroInput}
                onChange={(e) => setNumeroInput(e.target.value)}
                disabled={haGanado || cargando}
                min="1"
                max="100"
                required
              />
            </FormGroup>

            <div className="d-grid gap-2 mt-3">
              <Button 
                color="primary" 
                type="submit" 
                disabled={haGanado || cargando}
              >
                {cargando ? 'Verificando...' : 'Enviar Intento'}
              </Button>

              {haGanado && (
                <Button color="success" onClick={manejarReiniciar} disabled={cargando}>
                  🎮 Jugar de Nuevo
                </Button>
              )}
            </div>
          </Form>

          {/* Botón secundario para reiniciar manualmente */}
          {!haGanado && (
            <div className="text-end mt-3">
              <Button color="link" size="sm" onClick={manejarReiniciar} disabled={cargando}>
                Reiniciar Juego
              </Button>
            </div>
          )}

          {/* Historial dinámico de intentos */}
          <div className="mt-4">
            <h5>Historial de Intentos ({historial.length})</h5>
            {historial.length === 0 ? (
              <p className="text-muted">Aún no has realizado ningún intento.</p>
            ) : (
              <ListGroup style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {historial.map((item) => (
                  <ListGroupItem 
                    key={item.id} 
                    className="d-flex justify-content-between align-items-center"
                  >
                    <span>Número intentado: <strong>{item.numero}</strong></span>
                    <Badge 
                      color={
                        item.pista === 'Acierto' 
                          ? 'success' 
                          : item.pista === 'Mayor' 
                          ? 'info' 
                          : 'warning'
                      } 
                      pill
                    >
                      {item.pista}
                    </Badge>
                  </ListGroupItem>
                ))}
              </ListGroup>
            )}
          </div>
        </CardBody>
      </Card>
    </Container>
  );
}

export default App;