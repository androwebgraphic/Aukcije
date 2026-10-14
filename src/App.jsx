import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

import "./App.css";
import { Container } from "react-bootstrap";
import { RouteNames } from "./constants.js";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Registracija from "./pages/korisnici/Registracija.jsx";
import Logiranje from "./pages/Logiranje.jsx";

import KategorijaList from ".//pages/KategorijaList.jsx";
import KategorijaNova from "./pages/kategorije/KategorijaNova.jsx";
import KategorijePromijena from "././pages/kategorije/KategorijePromjena.jsx";

import PredmetiList from "./pages/predmeti/PredmetiLista.jsx";
import PredmetNovi from "./pages/predmeti/PredmetNovi.jsx";
import PredmetiPromjena from "./pages/predmeti/PredmetiPromjena.jsx";



import KorisniciLista from "./pages/korisnici/KorisniciLista.jsx";
import KorisniciPromijena from "./pages/korisnici/KorisniciPromjena.jsx";
import KorisnikoNovi from "./pages/korisnici/Registracija.jsx";

import Uvjeti from "./pages/Uvjeti.jsx";
import KorisniciList from "./pages/korisnici/KorisniciLista.jsx";

function App() {
	return (
		<>
			<Header />

			<Container>
				<Routes>
					<Route path={RouteNames.HOME} element={<Home />} />
					<Route path={RouteNames.KATEGORIJE} element={<KategorijaList />} />
					<Route path={RouteNames.KATEGORIJA_NOVA} element={<KategorijaNova />}
					/>
		
					<Route path={RouteNames.LOGIRANJE} element={<Logiranje />} />
					<Route path={RouteNames.PREDMETI} element={<PredmetiList />} />
					<Route path={RouteNames.PREDMET_NOVI} element={<PredmetNovi />} />
					<Route path={RouteNames.PREDMETI_PROMJENA} element={<PredmetiPromjena />} />
					<Route
						path={RouteNames.KATEGORIJE_PROMJENA}
						element={<KategorijePromijena />}
					/>

				
          
          <Route path={RouteNames.KORISNICI} element={<KorisniciLista />} />
          <Route path={RouteNames.KORISNIK_NOVI} element={<Registracija />} />
          <Route path={RouteNames.KORISNIK_PROMJENA} element={ <KorisniciPromijena />} />


          

					<Route path={RouteNames.UVJETI} element={<Uvjeti />} />
				</Routes>

				{/* <Carousel></Carousel> */}
			</Container>

			<Footer></Footer>
		</>
	);
}

export default App;
