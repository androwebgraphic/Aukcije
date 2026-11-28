import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

import "./App.css";
import { Container,Spinner } from "react-bootstrap";
import { RouteNames } from "./constants.js";
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import ZasticenaRuta from "./components/ZasticenaRuta.jsx";
import LoadingSpinner from './components/LoadingSpinner'

const Home = lazy(() => import("./pages/Home.jsx"));
// Highcharts (u Nadzornoj ploči) je ~293 kB; učitava se samo na toj ruti.
const NadzornaPloca = lazy(() => import("./pages/NadzornaPloca.jsx"));
const Registracija = lazy(() => import("./pages/registracija/Registracija.jsx"));
const Logiranje = lazy(() => import("./pages/logiranje/Logiranje.jsx"));

const KategorijaList = lazy(() => import("./pages/kategorije/KategorijaList.jsx"));
const KategorijaNova = lazy(() => import("./pages/kategorije/KategorijaNova.jsx"));
const KategorijePromjena = lazy(() => import("./pages/kategorije/KategorijePromjena.jsx"));

const PredmetiLista = lazy(() => import("./pages/predmeti/PredmetiLista.jsx"));
const PredmetNovi = lazy(() => import("./pages/predmeti/PredmetNovi.jsx"));
const PredmetiPromjena = lazy(() => import("./pages/predmeti/PredmetiPromjena.jsx"));
const PredmetOmiljeni = lazy(() => import("./pages/predmeti/PredmetOmiljeni.jsx"));

const KorisniciLista = lazy(() => import("./pages/korisnici/KorisniciLista.jsx"));
const KorisniciPromijena = lazy(() => import("./pages/korisnici/KorisniciPromijena.jsx"));
const KorisniciPromijenaLozinke = lazy(() => import("./pages/korisnici/KorisniciPromijenaLozinke.jsx"));
const KorisniciNovi = lazy(() => import("./pages/korisnici/KorisniciNovi.jsx"));

const GeneriranjePodataka = lazy(() => import("./pages/GeneriranjePodataka"));

const OznakeLista = lazy(() => import("./pages/oznake/OznakeLista.jsx"));
const OznakaNova = lazy(() => import("./pages/oznake/OznakaNova.jsx"));
const OznakePromjena = lazy(() => import("./pages/oznake/OznakePromjena.jsx"));


const Uvjeti = lazy(() => import("./pages/Uvjeti.jsx"));

function App() {
	return (
    <>
      <LoadingSpinner />
			<Container>
				<Header />

				<Suspense fallback={<div className="text-center py-5 text-white">Učitavanje…</div>}>
          <Routes>
            {/* <LoadingSpinner /> */}
					<Route path={RouteNames.HOME} element={<Home />} />
					<Route path={RouteNames.LOGIRANJE} element={<Logiranje />} />
					<Route path={RouteNames.REGISTRACIJA} element={<Registracija />} />

					<Route
						path={RouteNames.KATEGORIJE}
						element={<ZasticenaRuta adminOnly><KategorijaList /></ZasticenaRuta>}
					/>
					<Route
						path={RouteNames.KATEGORIJA_NOVA}
						element={<ZasticenaRuta adminOnly><KategorijaNova /></ZasticenaRuta>}
					/>
					<Route
						path={RouteNames.KATEGORIJE_PROMJENA}
						element={<ZasticenaRuta adminOnly><KategorijePromjena /></ZasticenaRuta>}
					/>

					<Route
						path={RouteNames.PREDMETI_PROMJENA}
						element={<ZasticenaRuta><PredmetiPromjena /></ZasticenaRuta>}
					/>
					<Route
						path={RouteNames.PREDMET_NOVI}
						element={<ZasticenaRuta><PredmetNovi /></ZasticenaRuta>}
					/>
					<Route
						path={RouteNames.PREDMETI_KATEGORIJA}
						element={<PredmetiLista />}
					/>
					<Route path={RouteNames.PREDMETI} element={<PredmetiLista />} />
					<Route
						path={RouteNames.PREDMETI_OMILJENI}
						element={<ZasticenaRuta><PredmetOmiljeni /></ZasticenaRuta>}
					/>

					<Route
						path={RouteNames.KORISNICI}
						element={<ZasticenaRuta adminOnly><KorisniciLista /></ZasticenaRuta>}
					/>
					<Route
						path={RouteNames.KORISNIK_NOVI}
						element={<ZasticenaRuta adminOnly><KorisniciNovi /></ZasticenaRuta>}
					/>
					<Route
						path={RouteNames.KORISNIK_PROMJENA}
						element={<ZasticenaRuta adminOnly><KorisniciPromijena /></ZasticenaRuta>}
					/>
					<Route
						path={RouteNames.KORISNIK_PROMJENA_LOZINKE}
						element={<ZasticenaRuta adminOnly><KorisniciPromijenaLozinke /></ZasticenaRuta>}
					/>

					<Route
						path={RouteNames.GENERIRANJE_PODATAKA}
						element={<ZasticenaRuta adminOnly><GeneriranjePodataka /></ZasticenaRuta>}
					/>
            <Route
						path={RouteNames.NADZORNA_PLOCA}
						element={<ZasticenaRuta adminOnly><NadzornaPloca /></ZasticenaRuta>}
					/>

					<Route
						path={RouteNames.OZNAKE}
						element={<ZasticenaRuta adminOnly><OznakeLista /></ZasticenaRuta>}
					/>
					<Route
						path={RouteNames.OZNAKA_NOVA}
						element={<ZasticenaRuta adminOnly><OznakaNova /></ZasticenaRuta>}
					/>
					<Route
						path={RouteNames.OZNAKE_PROMJENA}
						element={<ZasticenaRuta adminOnly><OznakePromjena /></ZasticenaRuta>}
					/>

					<Route path={RouteNames.UVJETI} element={<Uvjeti />} />
				</Routes>
				</Suspense>

        			<Footer />
			</Container>

		</>
	);
}

export default App;
