import {
  Button,
  Col,
  Form,
  FormControl,
  FormLabel,
  Row,
} from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import KategorijeServices from "../../services/kategorije/KategorijeServices";
import { useEffect, useState } from "react";
import Heading from "../../components/UI/Heading";




export default function KategorijePromijena() {

  const navigate = useNavigate()
  const params = useParams()
  const [kategorija, setKategorija  ] = useState( {})

  useEffect(() => {

    ucitajKategorije()
  }, [])
  
   async function ucitajKategorije() {
     await KategorijeServices.getByID(params.id).then((odgovor) => {
       const s = odgovor.data
       
       s.datumMoj = s.datumMoj.substring(0,10)
       
       
       setKategorija(s)
     })
   }
  async function promijeni(kategorija) {

    await KategorijeServices.promijeni(params.id, kategorija).then(() => {
      navigate(RouteNames.KATEGORIJE)

    })
  }

  function handleSubmit(e) {
    
    e.preventDefault()
    const dataNew = new FormData(e.target)

    promijeni({

      naziv: dataNew.get('naziv'),
      opis: dataNew.get('opis'),
      brojOglasa: dataNew.get('brojOglasa'),
      datumMoj: new Date(dataNew.get('datumMoj')).toISOString(),


    })
  }


  return (
    <>
 <Heading as='h1' className='display-2'>Promjeni kategoriju { kategorija.naziv}</Heading>

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col sm={12} md={6}>
            <Form.Group controlId="naziv">
              <FormLabel>Naziv</FormLabel>
              <FormControl type="text" name="naziv" required
              defaultValue={kategorija.naziv }/>
            </Form.Group>
          </Col>

          <Col sm={12} md={6}>
            <Form.Group controlId="opis">
              <FormLabel>Opis</FormLabel>
              <FormControl as="textarea" name="opis" rows={3}
                defaultValue={kategorija.opis}
              />
            </Form.Group>
          </Col>

       
            <Form.Group controlId="datumMoj">
              <FormLabel>Datum objave</FormLabel>
              <FormControl type="date" name="datumMoj"
              defaultValue={kategorija.datumMoj}
              />
            </Form.Group> 

                 <Form.Group controlId="brojOglasa">
              <FormLabel>Broj oglasa</FormLabel>
              <FormControl type="number" name="brojOglasa"
              defaultValue={kategorija.brojOglasa}
              />
            </Form.Group>
          {/* </Col> */}
        </Row>

        <hr />
        <Row>
       
          <Col sm={12} md={6}>
            <Button type="submit" className="btn btn-success" small={12} md={6}>

              Promijeni
       
            </Button>
          </Col>
             <Col sm={12} md={6}>
            <Link to={RouteNames.KATEGORIJE} className="btn btn-danger" >Odustani</Link>

          </Col>
        </Row>
      </Form>
    </>

  );
}
