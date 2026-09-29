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
import { categories } from "../../services/categories/CategoryData";
import CategoriesServices from "../../services/categories/CategoriesServices";


export default function CategoryNew() {

  const navigate = useNavigate()

  async function add(categories) {
    
    await CategoriesServices.add('category').then(() => {
   navigate(RouteNames.KATEGORIJE)

})
  }

  function handleSubmit(e) {
  
    e.preventDefault()
    const dataNew = new FormData(e.target)

    add({

    name: categories.get('name'),
    description: categories.get('description'),
    numItems: parseInt(categories.get('numItems')),
    datumMoj: new Date(categories.get('datumMoj')).toISOString(),
 

    })
}


	return (
		<>
			<h2>Unos nove kategorije</h2>

			<Form onSubmit={handleSubmit}>
				<Row>
          <Col sm={12} md={6}>
            <Form.Group controlId="name">
              <FormLabel>Naziv</FormLabel>
              <FormControl type="text" name="name" required  />
                    </Form.Group>
          </Col>
                  
                    <Col sm={12} md={6}>
                      <Form.Group controlId="descripption">
                                  <FormLabel>Opis</FormLabel>
                      <FormControl as="textarea" rows={3} />
                                        </Form.Group>
                    </Col>
                  
                    <Col sm={3} md={3}>
                      <Form.Group controlId="datumMoj">
                                  <FormLabel>Datum objave</FormLabel>
                                  <FormControl type="date" name="datumMoj"  />
                                </Form.Group>
                    </Col>
        </Row>
    
      <hr />
			<Row>
				<Col>
          <Link to={RouteNames.KATEGORIJE}>Odustani</Link>
     
				</Col>
        <Link>
          <Button type="submit">
            
            Dodaj novu kategoriju
        </Button>
        </Link>
        <Col>
        
        </Col>
        </Row>
          </Form>
      </>
      
	);
}
