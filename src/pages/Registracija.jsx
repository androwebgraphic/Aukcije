import { Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';



export default function Register() {
  
  return (
    
    
    <>
    
      <Container>
        <h1>Registracija</h1>
        
        <Form>
               <Row>
                 <Col sm={12} md={6}>
                   <Form.Group className="mb-3" controlId="formBasicName">
                             <Form.Label>Ime / korisničko ime</Form.Label>
                             <Form.Control type="text" placeholder="Ime / korisničko ime" />
                             </Form.Group>
                 </Col>
                         
                         <Col sm={12} md={6}>
                           <Form.Group className="mb-3" controlId="formBasicEmail">
                             <Form.Label>Email addresa</Form.Label>
                             <Form.Control type="email" placeholder="Upiši email" />
                             <Form.Text className="text-muted">
                               <p className="warn">Nikome ne proslijeđujemo Vaš email.</p>
                             </Form.Text>
                           </Form.Group>
                         </Col>
               </Row>
        <Row>
          <Col sm={12} md={6}>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Zaporka</Form.Label>
              <Form.Control type="password" placeholder="Zaporka" />
            </Form.Group>
          </Col>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Zapamti me" />
          </Form.Group>
        </Row>
        <Button variant="primary" type="submit">
         Registriraj se
        </Button>
            </Form>
      </Container>

    </>
)

  
}