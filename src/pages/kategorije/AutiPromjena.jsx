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
import AutiServices from "../../services/kategorije/AutiServices";
import { auti } from "../../services/kategorije/AutiData";




export default function KategorijePromijena() {

  const navigate = useNavigate()
  const params = useParams()
  const [auto, setAuto ] = useState( {})

  useEffect(() => {

    ucitajAuti()
  }, [])
  
   async function ucitajAuti() {
     await AutiServices.getByID(params.id).then((odgovor) => {
       const s = odgovor.data
       
       s.datumMoj = s.datumMoj.substring(0,10)
       
       
       setAuti(s)
     })
   }
  async function promijeni(auto) {

    await AutiServices.promijeni(params.id, auto).then(() => {
      navigate(RouteNames.AUTI)

    })
  }

  function handleSubmit(e) {
    debugger
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
      <h2>Promjena auto { auti.naziv}</h2>

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col sm={12} md={6}>
            <Form.Group controlId="naziv">
              <FormLabel>Naziv</FormLabel>
              <FormControl type="text" name="naziv" required
              defaultValue={auti.naziv }/>
            </Form.Group>
          </Col>

          <Col sm={12} md={6}>
            <Form.Group controlId="opis">
              <FormLabel>Opis</FormLabel>
              <FormControl as="textarea" name="opis" rows={3}
                defaultValue={auti.opis}
              />
            </Form.Group>
          </Col>

       
            <Form.Group controlId="datumMoj">
              <FormLabel>Datum objave</FormLabel>
              <FormControl type="date" name="datumMoj"
              defaultValue={auti.datumMoj}
              />
            </Form.Group> 

                 <Form.Group controlId="brojOglasa">
              <FormLabel>Broj oglasa</FormLabel>
              <FormControl type="number" name="brojOglasa"
              defaultValue={auti.brojOglasa}
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
            <Link to={RouteNames.AUTI} className="btn btn-danger" >Odustani</Link>

          </Col>
        </Row>
      </Form>
    </>

  );
}
