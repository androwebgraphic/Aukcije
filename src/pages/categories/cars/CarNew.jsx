import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../../constants";
import CarsServices from "../../../services/categories/CarsServices";

export default function CarNew() {
    const navigate = useNavigate();

    async function add(car) {
        const response = await CarsServices.add(car);
        if (response) {
            navigate(RouteNames.CARS); // Preusmjeravanje na listu auta
        }
    }

    function handleSubmit(e) {
    e.preventDefault();
    const podatci = new FormData(e.target);

    // Sigurno dohvaćanje ili zadani datum
    const datumOd = podatci.get('datumObjavljeno');
    const datumDo = podatci.get('datumZavrsetak');

    const dateAdded = datumOd ? new Date(datumOd).toISOString() : new Date().toISOString();
    const dateEnds = datumDo ? new Date(datumDo).toISOString() : new Date().toISOString();

    add({
        name: podatci.get('naziv') || '',
        description: podatci.get('opis') || '',
        productionYear: parseInt(podatci.get('godinaProizvodnje')) || 0,
        condition: podatci.get('stanje') || 'očuvan',
        startPrice: parseFloat(podatci.get('cijena')) || 0,
        dateAdded: dateAdded,
        dateEnds: dateEnds,
    });
}

    return (
        <>
            <h3>Unos novog automobila</h3>

            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="naziv">
                    <Form.Label>Naziv</Form.Label>
                    <Form.Control type="text" name="naziv" required />
                </Form.Group>

                <Form.Group controlId="opis" className="mt-2">
                    <Form.Label>Opis</Form.Label>
                    <Form.Control as="textarea" rows={3} name="opis" placeholder="Unesite kratki opis vozila..." />
                </Form.Group>

                <Form.Group controlId="godinaProizvodnje" className="mt-2">
                    <Form.Label>Godina proizvodnje</Form.Label>
                    <Form.Control type="number" name="godinaProizvodnje" step={1} required />
                </Form.Group>

                <Form.Group controlId="stanje" className="mt-2">
                    <Form.Label>Stanje</Form.Label>
                    <Form.Control type="text" name="stanje" placeholder="npr. očuvan, treba restauraciju..." />
                </Form.Group>

                <Form.Group controlId="cijena" className="mt-2">
                    <Form.Label>Početna cijena (€)</Form.Label>
                    <Form.Control type="number" name="cijena" step={0.01} required />
                </Form.Group>

                <Form.Group controlId="datumObjavljeno" className="mt-2">
                    <Form.Label>Datum objave</Form.Label>
                    <Form.Control type="date" name="datumObjavljeno" required />
                </Form.Group>

                <Form.Group controlId="datumZavrsetak" className="mt-2">
                    <Form.Label>Datum završetka aukcije</Form.Label>
                    <Form.Control type="date" name="datumZavrsetak" required />
                </Form.Group>

                <Row className="mt-4">
                    <Col>
                        <Link to={RouteNames.CARS} className="btn btn-danger w-100">
                            Odustani
                        </Link>
                    </Col>
                    <Col>
                        <Button type="submit" variant="success" className="w-100">
                            Dodaj
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    );
}