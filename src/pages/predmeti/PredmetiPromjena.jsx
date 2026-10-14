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
import { useEffect, useState } from "react";
import PredmetiServices from "../../services/predmeti/PredmetiServices";
import Heading from "../../components/UI/Heading";

export default function PredmetiPromijena() {
	const navigate = useNavigate();
	const params = useParams();
	const [predmet, setPredmet] = useState(null);

	useEffect(() => {
		ucitajPredmeti();
	}, []);

	async function ucitajPredmeti() {
		await PredmetiServices.getByID(params.id).then((odgovor) => {
			const s = odgovor.data || {};

			// Pretvaramo ISO datume u YYYY-MM-DD za type="date" inpute
			if (s && s.datumMoj) {
				s.datumMoj = s.datumMoj.substring(0, 10);
			}
			if (s.zavrsava) {
				s.zavrsava = s.zavrsava.substring(0, 10);
			}

			setPredmet(s);
		});
	}

	async function promijeni(predmetPodaci) {
		await PredmetiServices.promijeni(params.id, predmetPodaci).then(() => {
			navigate(RouteNames.PREDMETI);
		});
	}

	function handleSubmit(e) {
		e.preventDefault();
		const dataNew = new FormData(e.currentTarget);

		const formatDatum = (d) => (d ? new Date(d).toISOString() : null);

		promijeni({
			naziv: dataNew.get("naziv"),
			opis: dataNew.get("opis"),
			godinaNastanka: Number(dataNew.get("godinaNastanka")),
			stanje: dataNew.get("stanje"),
			datumMoj: formatDatum(dataNew.get("datumMoj")),
			pocetnaCijena: Number(dataNew.get("pocetnaCijena")),
			zavrsava: formatDatum(dataNew.get("zavrsava")),
		});
	}

	// Dok se podaci ne učitaju, prikazujemo poruku učitavanja
	if (!predmet) {
		return <div>Učitavanje...</div>;
	}

	return (
		<>
			<Heading as="h2" color="azure" className="display-2">
				Promjena predmeta: {predmet.naziv}
			</Heading>

			<Form onSubmit={handleSubmit}>
				<Row>
					<Col sm={12} md={6}>
						<Form.Group controlId="naziv">
							<FormLabel>Naziv</FormLabel>
							<FormControl
								type="text"
								name="naziv"
								required
								defaultValue={predmet.naziv}
							/>
						</Form.Group>
					</Col>

					<Col sm={12} md={6}>
						<Form.Group controlId="opis">
							<FormLabel>Opis</FormLabel>
							<FormControl
								as="textarea"
								name="opis"
								rows={3}
								defaultValue={predmet.opis}
							/>
						</Form.Group>
					</Col>

					<Col sm={12} md={6}>
						<Form.Group controlId="godinaNastanka">
							<FormLabel>Godina nastanka</FormLabel>
							<FormControl
								type="number"
								name="godinaNastanka"
								defaultValue={predmet.godinaNastanka}
							/>
						</Form.Group>
					</Col>

					<Col sm={12} md={6}>
						<Form.Group controlId="stanje">
							<FormLabel>Stanje</FormLabel>
							<FormControl
								type="text"
								name="stanje"
								defaultValue={predmet.stanje}
							/>
						</Form.Group>
					</Col>

					<Col sm={12} md={6}>
						<Form.Group controlId="pocetnaCijena">
							<FormLabel>Pocetna cijena</FormLabel>
							<FormControl
								type="number"
								name="pocetnaCijena"
								defaultValue={predmet.pocetnaCijena}
							/>
						</Form.Group>
					</Col>

					<Col sm={12} md={6}>
						<Form.Group controlId="zavrsava">
							<FormLabel>Zavrsava</FormLabel>
							<FormControl
								type="date"
								name="zavrsava"
								defaultValue={predmet.zavrsava}
							/>
						</Form.Group>
					</Col>
				</Row>

				<hr />
				<Row>
					<Col sm={12} md={6}>
						<Button type="submit" className="btn btn-warning">
							Promijeni
						</Button>
					</Col>
					<Col sm={12} md={6}>
						<Link to={RouteNames.PREDMETI} className="btn btn-danger">
							Odustani
						</Link>
					</Col>
				</Row>
			</Form>
		</>
	);
}
