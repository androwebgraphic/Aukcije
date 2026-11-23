
import { useEffect, useState } from "react";
import { Row, Col, Button, Form, ListGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import Heading from "../../components/UI/Heading";
import { motion } from "framer-motion";
import OznakeServices from "../../services/oznake/OznakeServices";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import useLoading from "../../hooks/useLoading";
import useModal from "../../hooks/useModal";

export default function OznakeList() {
  const [oznake, setOznake] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { showLoading, hideLoading,postaviNaslov } = useLoading();
  const { showModal } = useModal();
 
  useEffect(() => {
    ucitajOznake();
    postaviNaslov('Oznake-Lista')
  }, []);

  async function ucitajOznake() {
    try {
      const odgovor = await OznakeServices.get();
      setOznake(odgovor.data);
    } catch (error) {
      console.error("Greška pri dohvaćanju oznaka:", error);
    }
  }

  async function obrisi(id) {
    showModal("Želite li obrisati ovu oznaku?", async () => {
      showLoading();
      try {
        await OznakeServices.obrisi(id);
        await ucitajOznake();
      } catch (error) {
        console.error("Greška prilikom brisanja oznake:", error);
        alert("Brisanje oznake nije uspjelo. Provjerite konzolu za detalje.");
      } finally {
        hideLoading();
      }
    });
  }

  // Filtriranje oznaka prema upisanom tekstu
  const filtriraneOznake = oznake.filter((o) =>
    o.naziv.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Heading as="h2" color="azure" className="mb-2 mt-0">
          Lista oznaka ({filtriraneOznake.length})
        </Heading>

        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <Link to={RouteNames.OZNAKA_NOVA}>
            <Button variant="success">
              <FaPlus className="me-2" aria-hidden="true" />
              Dodaj oznaku
            </Button>
          </Link>

          <Form.Control
            type="text"
            aria-label="Pretraži oznake"
            placeholder="Pretraži oznake..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: '300px' }}
            size="sm"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ListGroup>
          {filtriraneOznake &&
            filtriraneOznake.map((o) => (
              <ListGroup.Item
                key={o.id}
                className="d-flex justify-content-between align-items-center"
              >
                <span className="fw-bold" style={{ color: '#1a3580' }}>
                  {o.naziv}
                </span>

                <div className="d-flex gap-2">
                  <Button
                    variant="outline-warning"
                    size="sm"
                    onClick={() => navigate(`/oznake/${o.id}`)}
                    title="Promjena oznake"
                    aria-label={`Promjena oznake: ${o.naziv}`}
                  >
                    <FaEdit aria-hidden="true" />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => obrisi(o.id)}
                    title="Brisanje oznake"
                    aria-label={`Brisanje oznake: ${o.naziv}`}
                  >
                    <FaTrash aria-hidden="true" />
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
        </ListGroup>
      </motion.div>
</>

  );
}