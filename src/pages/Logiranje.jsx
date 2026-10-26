import { Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Heading from '../components/UI/Heading';

export default function Login() {
  
  return (
    
    <>

   <Heading as='h2' >Logiranje</Heading>
     
          
     
          
           <Row>
             <Form>
                   <Row>
                     <Col sm={12}  md={6}>
                       <Form.Group className="mb-3" controlId="formBasicName">
                                     <Form.Label>Ime / korisničko ime</Form.Label>
                                     <Form.Control type="text" placeholder="Ime / korisničko ime" />
                                     </Form.Group>
                     </Col>
                                      <Col sm={12} md={6}>
                     <Form.Group className="mb-3" controlId="formBasicPassword">
                                   <Form.Label>Zaporka</Form.Label>
                                   <Form.Control type="password" placeholder="Zaporka" />
                                   </Form.Group>
                                      </Col>
                   </Row>
                  <Form.Group className="mb-3" controlId="formBasicCheckbox">
              {/* <Form.Check type="checkbox" label="Zapamti me" /> */}
                       </Form.Group>
              <Button variant="success" type="submit" size="sm">
                       Logiraj se
                       </Button>
              </Form>
           </Row>
      
     
  
    </>
  )

}