import { Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';



export default function Register() {
  
  return (
    
    
    <>
    
      <h1>Registracija</h1>
      
      <Form>
             <Form.Group className="mb-3" controlId="formBasicName">
        <Form.Label>Ime / korisničko ime</Form.Label>
        <Form.Control type="text" placeholder="Ime / korisničko ime" />
        </Form.Group>
        
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email addresa</Form.Label>
        <Form.Control type="email" placeholder="Upiši email" />
        <Form.Text className="text-muted">
          <p className="warn">Nikome ne proslijeđujemo Vaš email.</p>
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Zaporka</Form.Label>
        <Form.Control type="password" placeholder="Zaporka" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="Zapamti me" />
      </Form.Group>
      <Button variant="primary" type="submit">
       Registriraj se
      </Button>
    </Form>

    </>
)

  
}