
import { useEffect, useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import RatesGraph from './components/RatesGraph/RatesGraph.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


function App() {
  const [ports, setPorts] = useState([]);
  const [selectedDestinationPort, setSelectedDestinationPort] = useState('');
  const [selectedOriginPort, setSelectedOriginPort] = useState('');

  useEffect(() => {
    const getPorts = async () => {
      try {
        const res = await fetch(`/prod/ports`).then(res => res.json());
        setPorts(res);
        if(res.length > 0) {
          setSelectedOriginPort(res[0].code);
          if(res.length > 1) {
            setSelectedDestinationPort(res[1].code);
          }
        }
      } catch(e) {
        console.error(e)
      }
    };

    getPorts();
  }, []);

  return (
    <Container className="App p-3 vh-100 d-flex flex-column">
      <Row>
        <Col xs={4}>
          {selectedOriginPort && (
            <Form.Group>
              <Form.Label>Origin: </Form.Label>
              <Form.Control
                as="select"
                size="lg"
                custom
                onChange={(e) => setSelectedOriginPort(e.target.value)}
                defaultValue={selectedOriginPort}>
                {ports.map(port => (
                  <option value={port.code} key={port.code}>
                    {port.name}
                  </option>
                ) )}
              </Form.Control>
            </Form.Group>
          )}
        </Col>
        <Col xs={4}>
          {selectedDestinationPort && (
            <Form.Group>
              <Form.Label>Destination:</Form.Label>
              <Form.Control
                as="select"
                size="lg"
                custom
                onChange={(e) => setSelectedDestinationPort(e.target.value)}
                defaultValue={selectedDestinationPort}>
                {ports.map(port => (
                  <option value={port.code} key={port.code}>
                    {port.name}
                  </option>
                ) )}
              </Form.Control>
            </Form.Group>
          )}
        </Col>
      </Row>
      <Row className="flex-fill">
        <Col xs={12} className="h-100 position-relative d-flex align-items-center justify-content-center">
          <RatesGraph origin={selectedOriginPort} destination={selectedDestinationPort}/>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
