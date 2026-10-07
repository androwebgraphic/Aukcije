import {
  Button,
  Col,
  Form,
  FormControl,
  FormLabel,
  Row,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import KategorijeServices from '../../services/kategorije/KategorijeServices'
import Heading from "../../components/UI/Heading";


export default function KategorijaNova() {

  const navigate = useNavigate()




    async function dodaj(kategorija) {
        await KategorijeServices.dodaj(kategorija).then(()=>{
            navigate(RouteNames.KATEGORIJE)
        })
    }
    function handleSubmit(e) {
     
      e.preventDefault()
      const dataNew = new FormData(e.target)

      dodaj({

        naziv: dataNew.get('naziv'),
        opis: dataNew.get('opis'),
        brojOglasa: dataNew.get('brojOglasa'),
        datumMoj: new Date(dataNew.get('datumMoj')).toISOString(),


      })
    }


    return (
      <>
             <Heading as='h2' color='azure' className="display-2" >Dodavanje nove  kategorije</Heading>
       

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col sm={12} md={6}>
              <Form.Group controlId="naziv">
                <FormLabel>Naziv</FormLabel>
                <FormControl type="text" name="naziv" required />
              </Form.Group>
            </Col>

            <Col sm={12} md={6}>
              <Form.Group controlId="opis">
                <FormLabel>Opis</FormLabel>
                <FormControl as="textarea" name="opis" rows={3} />
              </Form.Group>
            </Col>

            <Col sm={3} md={3}>
              <Form.Group controlId="datumMoj">
                <FormLabel>Datum objave</FormLabel>
                <FormControl type="date" name="datumMoj" />
              </Form.Group>

              <Form.Group controlId="numItems">
                <FormLabel>Broj oglasa</FormLabel>
                <FormControl type="number" name="brojOglasa" />
              </Form.Group>
            </Col>
          </Row>

          <hr />
          <Row>
       
            <Col>
              <Button type="submit" className="btn btn-success" sm={12} md={6} >

                Dodaj
              </Button>
            </Col>
            <Col>
              <Link to={RouteNames.KATEGORIJE} className="btn btn-danger" sm={12} md={6} >Odustani</Link>

            </Col>
          </Row>
        </Form>
      </>

    );
  }

