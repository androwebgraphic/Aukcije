import { useState } from "react";
import { Button, Form, Alert, Container, Row, Col } from "react-bootstrap";
import { Faker, hr, en } from "@faker-js/faker";
import KategorijeServices from "../services/kategorije/KategorijeServices";
import PredmetiServices from "../services/predmeti/PredmetiServices";

export default function GeneriranjePodataka() {
	const [brojKategorije, setBrojKategorije] = useState(5);
	const [brojPredmeta, setBrojPredmeta] = useState(20);

  
	const [poruka, setPoruka] = useState(null);
	const [loading, setLoading] = useState(false);

	// Postavi faker na hrvatski jezik s engleskim kao zamjenom
	const faker = new Faker({
		locale: [hr, en],
	});

	const generirajKategorije = async (broj) => {
		const nazivKategorijeList = [
			"Auti Oldtimers",
			"Računala",
			"Motocikli",
			"Nakit",
			"Umjetnine",
			"Satovi",
			"Filatelija",
			"Numizmatika",
			"Ploče",
			"Starinsko oružje",
			"Alati",
			"Beletristika",
			"Stari stripovi",
			"Stari filmovi",
		];
const ikoneList = [
      "auti", "racunala", "motori", "nakit", "umjetnine",
      "satovi", "filatelija", "numiamatika", "lp", "oruzje",
      "alati", "beletristika", "stripovi", "filmovi"
    ];
		for (let i = 0; i < broj; i++) {
			//debugger
			await KategorijeServices.dodaj({
				naziv:
					nazivKategorijeList[i % nazivKategorijeList.length] +
					(i >= nazivKategorijeList.length
						? ` ${Math.floor(i / nazivKategorijeList.length) + 1}`
            : ""),
        ikona:ikoneList[i],
		opis: faker.commerce.productDescription()
			});
		}
	};

	const generirajPredmete = async (broj) => {
		const kategorije = await KategorijeServices.get()//odgovorKategorije.data;

		if (!kategorije || kategorije.length === 0) {
			throw new Error(
				"Nema dostupnih kategorija u bazi. Prvo morate generirati kategorije!",
			);
		}

		// Popis ikona za predmete
		const ikoneList = [
			"auti",
			"satovi",
			"racunala",
			"alati",
			"beletristika",
			"numiamatika",
			"lp",
			"nakit",
			"filatelija",
			"umjetnine",
			"motori",
		];

		for (let i = 0; i < broj; i++) {
			// Nasumični odabir kategorije iz baze
			const odabranaKategorija =
				kategorije.data[faker.number.int({ min: 0, max: kategorije.data.length - 1 })];

			const predmet = {
        ikona: odabranaKategorija.ikona || 'default-icon',//ikoneList[i % ikoneList.length],
        opis: faker.commerce.productDescription(),
        naziv: faker.commerce.productName(),
  
				pocetnaCijena: faker.number.float({
					min: 10,
					max: 1000,
					fractionDigits: 2,
				}),
				
        dodano: faker.date.past().toISOString().split("T")[0],
        zavrsava: faker.date.soon().toISOString().split("T")[0],
				kategorija: odabranaKategorija.id, // ID kategorije
			};

			await PredmetiServices.dodaj(predmet);
		}
	};

	const handleGenerirajKategorije = async (e) => {
		e.preventDefault();
		setLoading(true);
		setPoruka(null);

		try {
			await generirajKategorije(brojKategorije);

			setPoruka({
				tip: "success",
				tekst: `Uspješno generirano ${brojKategorije} kategorija!`,
			});
		} catch (error) {
			setPoruka({
				tip: "danger",
				tekst: "Greška pri generiranju kategorija: " + error.message,
			});
		} finally {
			setLoading(false);
		}
	};

	const handleGenerirajPredmete = async (e) => {
		e.preventDefault();
		setLoading(true);
		setPoruka(null);

		try {
			await generirajPredmete(brojPredmeta);

			setPoruka({
				tip: "success",
				tekst: `Uspješno generirano ${brojPredmeta} predmeta!`,
			});
		} catch (error) {
			setPoruka({
				tip: "danger",
				tekst: "Greška pri generiranju predmeta: " + error.message,
			});
		} finally {
			setLoading(false);
		}
	};

	const handleObrisiKategorije = async () => {
		if (
			!window.confirm("Jeste li sigurni da želite obrisati sve kategorije?")
		) {
			return;
		}

		setLoading(true);
		setPoruka(null);

		try {
			const rezultat = await KategorijeServices.get();
			const kategorije = rezultat.data;

			for (const kategorija of kategorije) {
				await KategorijeServices.obrisi(kategorija.id);
			}

			setPoruka({
				tip: "success",
				tekst: `Uspješno obrisano ${kategorije.length} kategorija!`,
			});
		} catch (error) {
			setPoruka({
				tip: "danger",
				tekst: "Greška pri brisanju kategorija: " + error.message,
			});
		} finally {
			setLoading(false);
		}
	};

	const handleObrisiPredmete = async () => {
		if (!window.confirm("Jeste li sigurni da želite obrisati sve predmete?")) {
			return;
		}

		setLoading(true);
		setPoruka(null);

		try {
			const rezultat = await PredmetiServices.get();
			const predmeti = rezultat.data;

			for (const predmet of predmeti) {
				await PredmetiServices.obrisi(predmet.id);
			}

			setPoruka({
				tip: "success",
				tekst: `Uspješno obrisano ${predmeti.length} predmeta!`,
			});
		} catch (error) {
			setPoruka({
				tip: "danger",
				tekst: "Greška pri brisanju predmeta: " + error.message,
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<Container className="mt-4">
			<h1>Generiranje podataka</h1>
			<p className="text-muted">
				Koristite ovaj alat za generiranje testnih podataka s lažnim (fake)
				podacima na hrvatskom jeziku.
			</p>

			{poruka && (
				<Alert variant={poruka.tip} dismissible onClose={() => setPoruka(null)}>
					{poruka.tekst}
				</Alert>
			)}

			<Row>
				<Col md={6}>
					<Form onSubmit={handleGenerirajKategorije}>
						<Form.Group className="mb-3">
							<Form.Label>Broj kategorija</Form.Label>
							<Form.Control
								type="number"
								min="1"
								max="50"
								value={brojKategorije}
								onChange={(e) => setBrojKategorije(parseInt(e.target.value))}
								disabled={loading}
							/>
							<Form.Text className="text-muted">
								Unesite broj kategorija (1-50)
							</Form.Text>
						</Form.Group>
						<Button
							variant="primary"
							type="submit"
							disabled={loading}
							className="w-100">
							{loading ? "Generiranje..." : "Generiraj kategorije"}
						</Button>
					</Form>
				</Col>
				<Col md={6}>
					<Form onSubmit={handleGenerirajPredmete}>
						<Form.Group className="mb-3">
							<Form.Label>Broj predmeta</Form.Label>
							<Form.Control
								type="number"
								min="1"
								max="200"
								value={brojPredmeta}
								onChange={(e) => setBrojPredmeta(parseInt(e.target.value))}
								disabled={loading}
							/>
							<Form.Text className="text-muted">
								Unesite broj predmeta (1-200)
							</Form.Text>
						</Form.Group>
						<Button
							variant="primary"
							type="submit"
							disabled={loading}
							className="w-100">
							{loading ? "Generiranje..." : "Generiraj predmete"}
						</Button>
					</Form>
				</Col>
			</Row>

			<Alert variant="warning" className="mt-3">
				<strong>Upozorenje:</strong> Ove akcije će dodati nove podatke u
				postojeće. Najprije generirajte kategorije, a zatim predmete.
			</Alert>

			<hr className="my-4" />

			<h3>Brisanje podataka</h3>
			<p className="text-muted">
				Koristite ove opcije za brisanje svih podataka iz baze.
			</p>

			<Row className="mt-3">
				<Col md={6}>
					<Button
						variant="danger"
						onClick={handleObrisiKategorije}
						disabled={loading}
						className="w-100 mb-2">
						{loading ? "Brisanje..." : "Obriši sve kategorije"}
					</Button>
				</Col>
				<Col md={6}>
					<Button
						variant="danger"
						onClick={handleObrisiPredmete}
						disabled={loading}
						className="w-100 mb-2">
						{loading ? "Brisanje..." : "Obriši sve predmete"}
					</Button>
				</Col>
			</Row>

			<Alert variant="danger" className="mt-3">
				<strong>Oprez!</strong> Brisanje podataka je trajna akcija i ne može se
				poništiti.
			</Alert>
		</Container>
	);
}
