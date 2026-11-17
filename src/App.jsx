import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

import "./App.css";
import { Container } from "react-bootstrap";
import { RouteNames } from "./constants.js";
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const Home = lazy(() => import("./pages/Home.jsx"));
const Registracija = lazy(() => import("./pages/registracija/Registracija.jsx"));
const Logiranje = lazy(() => import("./pages/logiranje/Logiranje.jsx"));

const KategorijaList = lazy(() => import("./pages/kategorije/KategorijaList.jsx"));
const KategorijaNova = lazy(() => import("./pages/kategorije/KategorijaNova.jsx"));
const KategorijePromjena = lazy(() => import("./pages/kategorije/KategorijePromjena.jsx"));

const PredmetiLista = lazy(() => import("./pages/predmeti/PredmetiLista.jsx"));
const PredmetNovi = lazy(() => import("./pages/predmeti/PredmetNovi.jsx"));
const PredmetiPromjena = lazy(() => import("./pages/predmeti/PredmetiPromjena.jsx"));

const KorisniciLista = lazy(() => import("./pages/korisnici/KorisniciLista.jsx"));
const KorisniciPromijena = lazy(() => import("./pages/korisnici/KorisniciPromijena.jsx"));
const KorisniciPromijenaLozinke = lazy(() => import("./pages/korisnici/KorisniciPromijenaLozinke.jsx"));
const KorisniciNovi = lazy(() => import("./pages/registracija/Registracija.jsx"));

const GeneriranjePodataka = lazy(() => import("./pages/GeneriranjePodataka"));

const OznakeLista = lazy(() => import("./pages/oznake/OznakeLista.jsx"));
const OznakaNova = lazy(() => import("./pages/oznake/OznakaNova.jsx"));
const OznakePromjena = lazy(() => import("./pages/oznake/OznakePromjena.jsx"));

const Uvjeti = lazy(() => import("./pages/Uvjeti.jsx"));

function App() {
	return (
		<>
			<Container>
				<Header />

				<Suspense fallback={<div className="text-center py-5 text-white">Učitavanje…</div>}>
				<Routes>
					{/* Javno dostupno */}
					<Route path={RouteNames.HOME} element={<Home />} />
					<Route path={RouteNames.LOGIRANJE} element={<Logiranje />} />
					<Route path={RouteNames.REGISTRACIJA} element={<Registracija />} />
					<Route path={RouteNames.UVJETI} element={<Uvjeti />} />
					<Route path={RouteNames.KATEGORIJE} element={<KategorijaList />} />
					<Route path={RouteNames.OZNAKE} element={<OznakeLista />} />
					<Route path={RouteNames.PREDMETI} element={<PredmetiLista />} />
					<Route
						path={RouteNames.PREDMETI_KATEGORIJA}
						element={<PredmetiLista />}
					/>

					{/* Predmeti: svaki prijavljeni korisnik smije dodavati i mijenjati */}
					<Route
						path={RouteNames.PREDMET_NOVI}
						element={
							<ProtectedRoute>
								<PredmetNovi />
							</ProtectedRoute>
						}
					/>
					<Route
						path={RouteNames.PREDMETI_PROMJENA}
						element={
							<ProtectedRoute>
								<PredmetiPromjena />
							</ProtectedRoute>
						}
					/>

					{/* Kategorije, oznake i korisnici: samo administrator */}
					<Route
						path={RouteNames.KATEGORIJA_NOVA}
						element={
							<ProtectedRoute samoAdmin>
								<KategorijaNova />
							</ProtectedRoute>
						}
					/>
					<Route
						path={RouteNames.KATEGORIJE_PROMJENA}
						element={
							<ProtectedRoute samoAdmin>
								<KategorijePromjena />
							</ProtectedRoute>
						}
					/>
					<Route
						path={RouteNames.OZNAKA_NOVA}
						element={
							<ProtectedRoute samoAdmin>
								<OznakaNova />
							</ProtectedRoute>
						}
					/>
					<Route
						path={RouteNames.OZNAKE_PROMJENA}
						element={
							<ProtectedRoute samoAdmin>
								<OznakePromjena />
							</ProtectedRoute>
						}
					/>
					<Route
						path={RouteNames.KORISNICI}
						element={
							<ProtectedRoute samoAdmin>
								<KorisniciLista />
							</ProtectedRoute>
						}
					/>
					<Route
						path={RouteNames.KORISNIK_NOVI}
						element={
							<ProtectedRoute samoAdmin>
								<KorisniciNovi />
							</ProtectedRoute>
						}
					/>
					<Route
						path={RouteNames.KORISNIK_PROMJENA}
						element={
							<ProtectedRoute samoAdmin>
								<KorisniciPromijena />
							</ProtectedRoute>
						}
					/>
					<Route
						path={RouteNames.KORISNIK_PROMJENA_LOZINKE}
						element={
							<ProtectedRoute samoAdmin>
								<KorisniciPromijenaLozinke />
							</ProtectedRoute>
						}
					/>
					<Route
						path={RouteNames.GENERIRANJE_PODATAKA}
						element={
							<ProtectedRoute samoAdmin>
								<GeneriranjePodataka />
							</ProtectedRoute>
						}
					/>
				</Routes>
				</Suspense>

        			<Footer />
			</Container>

		</>
	);
}

export default App;
