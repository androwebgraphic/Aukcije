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
import CategoriesServices from "../../services/categories/CategoriesServices";
import { useEffect, useState } from "react";
import { categories } from "../../services/categories/CategoryData";
import MydModalWithGrid from "../../components/MyModalWithGrid";


export default function CategoryPromijena() {

  const navigate = useNavigate()
  const params = useParams()
  const [categories, setCategories  ] = useState( {})

  useEffect(() => {

    loadCategories()
  },[])
   async function loadCategories() {
     await CategoriesServices.getByID(params.id).then((odgovor) => {
       const s = odgovor.data
       s.datumMoj = s.datumMoj.substring(0,10)
setCategories(s)
     })
   }
  async function promijeni(category) {

    await CategoriesServices.promijeni(category).then(() => {
      navigate(RouteNames.KATEGORIJE)

    })
  }

  function handleSubmit(e) {
    debugger
    e.preventDefault()
    const dataNew = new FormData(e.target)

    promijeni({

      name: dataNew.get('name'),
      description: dataNew.get('description'),
      numItems: dataNew.get('numItems'),
      datumMoj: new Date(dataNew.get('datumMoj')).toISOString(),


    })
  }


  return (
    <>
      <h2>Promjena kategorije { categories.name}</h2>

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col sm={12} md={6}>
            <Form.Group controlId="name">
              <FormLabel>Naziv</FormLabel>
              <FormControl type="text" name="name" required
              defaultValue={categories.name }/>
            </Form.Group>
          </Col>

          <Col sm={12} md={6}>
            <Form.Group controlId="description">
              <FormLabel>Opis</FormLabel>
              <FormControl as="textarea" name="description" rows={3}
              defaultValue={categories.description}
              />
            </Form.Group>
          </Col>

          <Col sm={3} md={3}>
            <Form.Group controlId="datumMoj">
              <FormLabel>Datum objave</FormLabel>
              <FormControl type="date" name="datumMoj"
              defaultValue={categories.datumMoj}
              />
            </Form.Group>

                 <Form.Group controlId="numItems">
              <FormLabel>Broj oglasa</FormLabel>
              <FormControl type="number" name="numItems"
              defaultValue={categories.numItems}
              />
            </Form.Group>
          </Col>
        </Row>

        <hr />
        <Row>
       
          <Col>
            <Button type="submit" className="btn btn-success" small={12} >

              Promijeni
              <MydModalWithGrid />
            </Button>
          </Col>
             <Col>
            <Link to={RouteNames.KATEGORIJE} className="btn btn-danger" small={12} >Odustani</Link>

          </Col>
        </Row>
      </Form>
    </>

  );
}
