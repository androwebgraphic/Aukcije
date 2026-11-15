import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

import "./App.css";
import { Container } from "react-bootstrap";
import { RouteNames } from "./constants.js";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home.jsx";
import Registracija from "./pages/registracija/Registracija.jsx";
import Logiranje from "./pages/logiranje/Logiranje.jsx";

import KategorijaList from "./pages/kategorije/KategorijaList.jsx";
import KategorijaNova from "./pages/kategorije/KategorijaNova.jsx";
import KategorijePromjena from "./pages/kategorije/KategorijePromjena.jsx";

import PredmetiLista from "./pages/predmeti/PredmetiLista.jsx";
import PredmetNovi from "./pages/predmeti/PredmetNovi.jsx";
import PredmetiPromjena from "./pages/predmeti/PredmetiPromjena.jsx";

import KorisniciLista from "./pages/korisnici/KorisniciLista.jsx";
import KorisniciPromijena from "./pages/korisnici/KorisniciPromijena.jsx";
import KorisniciPromijenaLozinke from "./pages/korisnici/KorisniciPromijenaLozinke.jsx";
import KorisniciNovi from "./pages/korisnici/KorisniciNovi.jsx";

import GeneriranjePodataka from "./pages/GeneriranjePodataka";

import OznakeLista from "./pages/oznake/OznakeLista.jsx";
import OznakaNova from "./pages/oznake/OznakaNova.jsx";
import OznakePromjena from "./pages/oznake/OznakePromjena.jsx";

import Uvjeti from "./pages/Uvjeti.jsx";

function App() {
	return (
		<>
			<Container>
				<Header />

				<Routes>
					<Route path={RouteNames.HOME} element={<Home />} />
					<Route path={RouteNames.LOGIRANJE} element={<Logiranje />} />
					<Route path={RouteNames.REGISTRACIJA} element={<Registracija />} />

					<Route path={RouteNames.KATEGORIJE} element={<KategorijaList />} />
					<Route
						path={RouteNames.KATEGORIJA_NOVA}
						element={<KategorijaNova />}
					/>
					<Route
						path={RouteNames.KATEGORIJE_PROMJENA}
						element={<KategorijePromjena />}
					/>

					<Route
						path={RouteNames.PREDMETI_PROMJENA}
						element={<PredmetiPromjena />}
					/>
					<Route path={RouteNames.PREDMET_NOVI} element={<PredmetNovi />} />
					<Route
						path={RouteNames.PREDMETI_KATEGORIJA}
						element={<PredmetiLista />}
					/>
					<Route path={RouteNames.PREDMETI} element={<PredmetiLista />} />

					<Route path={RouteNames.KORISNICI} element={<KorisniciLista />} />
					<Route path={RouteNames.KORISNIK_NOVI} element={<KorisniciNovi />} />
					<Route
						path={RouteNames.KORISNIK_PROMJENA}
						element={<KorisniciPromijena />}
					/>
					<Route
						path={RouteNames.KORISNIK_PROMJENA_LOZINKE}
						element={<KorisniciPromijenaLozinke />}
					/>

					<Route
						path={RouteNames.GENERIRANJE_PODATAKA}
						element={<GeneriranjePodataka />}
					/>

					<Route path={RouteNames.OZNAKE} element={<OznakeLista />} />
					<Route path={RouteNames.OZNAKA_NOVA} element={<OznakaNova />} />
					<Route
						path={RouteNames.OZNAKE_PROMJENA}
						element={<OznakePromjena />}
					/>

					<Route path={RouteNames.UVJETI} element={<Uvjeti />} />
				</Routes>

				<ToastContainer
					position="top"
					className="fixed top-50 start-50 translate-middle-x"
        />
        			<Footer />
			</Container>

		</>
	);
}

export default App;
