import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


export default function AddItem() {
  
  return (
    
    <>
      <h1>Dodaj predmet</h1>
    
    <Form>
      <Form.Group className="mb-3" controlId="formBasicName">
        <Form.Label>Naziv predmeta</Form.Label>
        <Form.Control type="text" placeholder="Naziv predmeta" />
       
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label> Kategorija</Form.Label>
          <Form.Control type="text" placeholder="Kategorija" />
          <select name="category" id="category">
              <option value="|">računala</option>
<option value="">stari auti i motocikli</option>
<option value="">satovi</option>
<option value="">numizmatika</option>
<option value="">filatelija</option>
<option value="">nakit</option>
<option value="">umjetnine</option>
<option value="">Ploče(vinil)</option>
<option value="">starinsko oružje</option>
<option value="">alati</option>
<option value="">knjige i časopisi</option>

          </select>
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Opis predmeta</Form.Label>
        <Form.Control as="textarea" rows={3} />
      </Form.Group>
      <Button variant="primary" type="submit">
      Dodaj predmet
      </Button>
    </Form>
    </>
  )
}