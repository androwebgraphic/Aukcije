import { Row, Col, Card } from "react-bootstrap";
import { APP_NAME } from "../constants";
import MenHighFive from "../components/MenHighFive";
import Heading from "../components/UI/Heading";
import { useState, useEffect } from "react";

import KategorijeServices from "../services/kategorije/KategorijeServices";
import PredmetiServices from "../services/predmeti/PredmetiServices";
import KorisniciService from "../services/korisnici/KorisniciService";
import OznakeServices from "../services/oznake/OznakeServices";
import { LordIcon } from "@lordicon/react";
import NadzornaPloca from "./NadzornaPloca";

// Inicijalizacija LordIcon elementa s Lottie engineom
// defineElement(lottie.loadAnimation);

export default function Home() {
  const [brojKategorija, setBrojKategorija] = useState(0);
  const [brojPredmeta, setBrojPredmeta] = useState(0);
  const [brojKorisnika, setBrojKorisnika] = useState(0);
  const [brojOznaka, setBrojOznaka] = useState(0);

  const [animatedKategorije, setAnimatedKategorije] = useState(0);
  const [animatedPredmeti, setAnimatedPredmeti] = useState(0);
  const [animatedKorisnici, setAnimatedKorisnici] = useState(0);
  const [animatedOznake, setAnimatedOznake] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kategorijeRezultat = await KategorijeServices.get();
        const predmetiRezultat = await PredmetiServices.get();
        const korisniciRezultat = await KorisniciService.get();
        const oznakeRezultat = await OznakeServices.get();

        setBrojKategorija(kategorijeRezultat?.data?.length ?? 0);
        setBrojPredmeta(predmetiRezultat?.data?.length ?? 0);
        setBrojKorisnika(korisniciRezultat?.data?.length ?? 0);
        setBrojOznaka(oznakeRezultat?.data?.length ?? 0);
      } catch (err) {
        console.error("Greška pri dohvaćanju podataka", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (animatedKategorije < brojKategorija) {
      const timer = setTimeout(() => {
        setAnimatedKategorije((prev) => Math.min(prev + 1, brojKategorija));
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [animatedKategorije, brojKategorija]);

  useEffect(() => {
    if (animatedPredmeti < brojPredmeta) {
      const timer = setTimeout(() => {
        setAnimatedPredmeti((prev) => Math.min(prev + 1, brojPredmeta));
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [animatedPredmeti, brojPredmeta]);

  useEffect(() => {
    if (animatedKorisnici < brojKorisnika) {
      const timer = setTimeout(() => {
        setAnimatedKorisnici((prev) => Math.min(prev + 1, brojKorisnika));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [animatedKorisnici, brojKorisnika]);

  useEffect(() => {
    if (animatedOznake < brojOznaka) {
      const timer = setTimeout(() => {
        setAnimatedOznake((prev) => Math.min(prev + 1, brojOznaka));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [animatedOznake, brojOznaka]);

  return (
    <>
      <Heading as="h1">Dobro došli na {APP_NAME}</Heading>

      <Heading as="h2">O nama</Heading>

      <Row>
        <Col xs={12} md={8}>
          <p>
            {APP_NAME} je aplikacija koja pomaže strastvenim kolekcionarima da
            mogu kupovati ili prodavati predmete. Mogu dodati, promijeniti ili
            obrisati određene predmete koje su postavili.
          </p>
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          <Card className="mb-3 shadow-lg border-0 info">
            <Heading as="h2">
              Info{" "}
              <LordIcon
                style={{ width: "2rem", height: "2rem" }}
                colors="primary:#ffffff,secondary:#333333"
                src="/lordicon/info.json"
                trigger="hover"
              />
            </Heading>

            <Card.Body className="text-center">
              <Row
                className="align-items-center"
                style={{ borderBottom: "1px solid azure" }}>
                <Col xs={6}>
                  <Heading as="h3">
                    Kategorije{" "}
                    <LordIcon
                      style={{ width: "2rem", height: "2rem" }}
                      colors="primary:#ff5733,secondary:#333333"
                      src="/lordicon/categories.json"
                      trigger="hover"
                    />
                  </Heading>
                </Col>
                <Col xs={6}>
                  <div className="entitet">
                    <p>{animatedKategorije}  kategorija</p>
                  </div>
                </Col>
              </Row>

              <Row
                className="align-items-center"
                style={{ borderBottom: "1px solid azure" }}>
                <Col xs={6}>
                  <Heading as="h3">
                    Predmeti{" "}
                    <LordIcon
                      style={{ width: "2rem", height: "2rem" }}
                      src="/lordicon/predmeti.json"
                      trigger="hover"
                    />
                  </Heading>
                </Col>
                <Col xs={6}>
                  <div className="entitet">
                    <p>{animatedPredmeti} predmeta</p>
                  </div>
                </Col>
              </Row>

              <Row
                className="align-items-center"
                style={{ borderBottom: "1px solid azure" }}>
                <Col xs={6}>
                  <Heading as="h3">
                    Korisnici{" "}
                    <LordIcon
                      style={{ width: "2rem", height: "2rem" }}
                      src="/lordicon/users.json"
                      trigger="hover"
                    />
                  </Heading>
                </Col>
                <Col xs={6}>
                  <div className="entitet">
                    <p>{animatedKorisnici} korisnika</p>
                  </div>
                </Col>
              </Row>

              <Row className="align-items-center">
                <Col xs={6}>
                  <Heading as="h3">
                    Oznake{" "}
                    <LordIcon
                      style={{ width: "2rem", height: "2rem" }}
                      src="/lordicon/bookmark.json"
                      trigger="hover"
                    />
                  </Heading>
                </Col>
                <Col xs={6}>
              
                  <div className="entitet">
                    <p>{animatedOznake} oznaka</p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <NadzornaPloca />
      </Row>

      <Row>
        <MenHighFive
          style={{
            width: "13rem",
            height: "13rem",
            margin: "-5.5rem 0 0 30%",
            padding: "0",
            textAlign: "center",
            zIndex: "9999",
          }}
        />

        <p className="text-center" style={{ margin: "2rem" }}>
          Sretno svima{" "}
          <LordIcon
            style={{ width: "4rem", height: "4rem" }}
            colors="primary:#00f900,secondary:#00ff00"
            src="/lordicon/shamrock.json"
            trigger="hover"
          />
        </p>
      </Row>
    </>
  );
}
