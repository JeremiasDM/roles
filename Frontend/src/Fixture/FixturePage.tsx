import React, { useState, useEffect } from "react";
import RegistrarFixture from "./RegistrarFixture";
import EditarFixture from "./EditarFixture";
import ListaFixture from "./ListaFixture";
import type { CSSProperties } from "react";
import { hasRole } from "../utils/auth"; // 🔒 Importar seguridad

// --- Tipos de la API ---
interface Club {
  id: number;
  nombre: string;
}

interface EncuentroAPI {
  id: number;
  jornada: number;
  grupo?: string;
  fecha?: string;
  resultado: string;
  club1Id: number;
  club2Id: number;
  club1: Club;
  club2: Club;
}

interface FixtureAPI {
  id: number;
  fecha: string;
  lugar: string;
  partidos: EncuentroAPI[];
}

// --- DTOs para enviar ---
interface CreateEncuentroDto {
  jornada: number;
  grupo?: string;
  fecha?: string;
  resultado: string;
  club1Id: number;
  club2Id: number;
}

interface CreateFixtureDto {
  fecha: string;
  lugar: string;
  partidos: CreateEncuentroDto[];
}

const API_URL = "http://localhost:3001"; 

// --- ESTILOS ---
interface Styles {
  [key: string]: CSSProperties;
}
const styles: Styles = {
  pageContainer: {
    padding: '30px 20px',
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: '#eef2f6',
    minHeight: '100vh', 
  },
  fixtureCard: {
    width: '100%',
    maxWidth: '1100px', 
    margin: '0 auto', 
    fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
    backgroundColor: '#ffffff',
    borderRadius: '12px', 
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)', 
    padding: '40px', 
    boxSizing: 'border-box',
  },
  title: {
    textAlign: 'center',
    color: '#1f3c88', 
    borderBottom: '3px solid #1f3c88', 
    paddingBottom: '15px',
    marginBottom: '30px',
    fontSize: '2.2rem', 
    fontWeight: 700,
    letterSpacing: '0.5px',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #e0e0e0', 
    margin: '30px 0' 
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-start', 
    marginTop: '20px',
    marginBottom: '10px',
  },
  buttonBase: { 
    padding: "0.5rem 1rem", 
    border: "none", 
    borderRadius: "5px", 
    cursor: "pointer", 
    marginRight: "0.5rem", 
    fontWeight: "bold",
    transition: "background-color 0.3s, transform 0.1s",
    whiteSpace: "nowrap" as const, 
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    backgroundColor: "#1f3c88", 
    color: "white", 
  },
  buttonPrimary: {
    backgroundColor: "#1f3c88", 
    color: "#fff",
  },
  errorMessage: { 
      color: "#dc3545", 
      backgroundColor: "#f8d7da", 
      padding: "10px",
      borderRadius: "4px",
      textAlign: "center" as const,
      marginBottom: "1rem",
      border: "1px solid #f5c6cb", 
  },
  loadingMessage: { 
      textAlign: "center" as const,
      color: "#6c757d", 
      fontSize: "1.1em",
      margin: "20px 0",
  }
};

const FixturePage: React.FC = () => {
  // 🔒 Permisos: Solo la Presidenta edita/crea
  const esPresidenta = hasRole(['presidenta']);

  const [fixtures, setFixtures] = useState<FixtureAPI[]>([]);
  const [clubes, setClubes] = useState<Club[]>([]);
  const [fixtureEditando, setFixtureEditando] = useState<FixtureAPI | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarFixtures();
    cargarClubes();
  }, []);

  const cargarFixtures = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/fixtures`);
      if (!res.ok) throw new Error("Error al cargar fixtures");
      const data: FixtureAPI[] = await res.json();
      setFixtures(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const cargarClubes = async () => {
    try {
      const res = await fetch(`${API_URL}/clubes`);
      if (!res.ok) throw new Error("Error al cargar clubes");
      const data: Club[] = await res.json();
      setClubes(data);
    } catch (err) {
      console.error("Error cargando clubes:", err);
    }
  };

  // --- Funciones CRUD (Protegidas con Token) ---
  const agregarFixture = async (dto: CreateFixtureDto) => {
    if (!esPresidenta) return; // 🔒 Bloqueo extra

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/fixtures`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}` // 🔒 Token
        },
        body: JSON.stringify(dto),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al crear fixture");
      }
      await cargarFixtures(); 
      alert("Fixture guardado exitosamente!"); 
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const iniciarEdicion = (fixture: FixtureAPI) => {
    if (!esPresidenta) return; // 🔒
    setFixtureEditando(fixture);
    setError(null);
  };

  const guardarEdicion = async (id: number, dto: Partial<CreateFixtureDto>) => {
    if (!esPresidenta) return; // 🔒

    setLoading(true);
    setError(null);
    try {
      const payload = { fecha: dto.fecha, lugar: dto.lugar };

      const res = await fetch(`${API_URL}/fixtures/${id}`, {
        method: "PATCH",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}` // 🔒 Token
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al actualizar fixture");
      }
      await cargarFixtures();
      cancelarEdicion(); 
      alert("Fixture actualizado exitosamente!"); 
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const cancelarEdicion = () => {
    setFixtureEditando(null);
    setError(null);
  };

  const generarFixtureAutomatico = async () => {
    if (!esPresidenta) return; // 🔒

    if (clubes.length < 2) { 
      setError("Se necesitan al menos 2 clubes registrados para generar un fixture.");
      return;
    }
    const jornada = fixtures.length + 1;
    const fechaHoy = new Date().toISOString().split("T")[0];
    const partidosDto: CreateEncuentroDto[] = [];

    const clubesParaGenerar = [...clubes]; 
    if (clubesParaGenerar.length % 2 !== 0) {
        clubesParaGenerar.push({ id: -1, nombre: "BYE" });
    }
    const numRondas = clubesParaGenerar.length - 1;
    const mitad = clubesParaGenerar.length / 2;

    for (let r = 0; r < numRondas; r++) {
      for (let i = 0; i < mitad; i++) {
        const club1 = clubesParaGenerar[i];
        const club2 = clubesParaGenerar[clubesParaGenerar.length - 1 - i];

        if (club1.id !== -1 && club2.id !== -1) {
            const esLocalClub1 = r % 2 === 0 || i === 0; 
             partidosDto.push({
                jornada: jornada + r, 
                club1Id: esLocalClub1 ? club1.id : club2.id,
                club2Id: esLocalClub1 ? club2.id : club1.id,
                resultado: "-",
                fecha: fechaHoy 
            });
        }
      }
      const ultimo = clubesParaGenerar.pop();
      if(ultimo) clubesParaGenerar.splice(1, 0, ultimo);
    }

    if (partidosDto.length === 0) {
        setError("No se pudieron generar partidos.");
        return;
    }

    const fixtureGeneradoDto: CreateFixtureDto = {
      fecha: fechaHoy, 
      lugar: `Generado Autom. ${numRondas} Jornadas`,
      partidos: partidosDto,
    };

    await agregarFixture(fixtureGeneradoDto);
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.fixtureCard}>
        <h2 style={styles.title}>Gestión y Registro de Fixture</h2>

        {error && <div style={styles.errorMessage}>{error}</div>}
        {loading && <p style={styles.loadingMessage}>Cargando...</p>}

        {/* 🔒 SECCIÓN DE EDICIÓN (SOLO PRESIDENTA) */}
        {fixtureEditando && esPresidenta ? (
          <EditarFixture
            fixture={fixtureEditando}
            clubes={clubes}
            onGuardar={(id, actualizado) => guardarEdicion(id, actualizado)}
            onCancelar={cancelarEdicion}
          />
        ) : (
          /* 🔒 SECCIÓN DE REGISTRO (SOLO PRESIDENTA) */
          esPresidenta && (
            <>
              <RegistrarFixture
                onAgregarFixture={agregarFixture}
                onGenerarAutomatico={generarFixtureAutomatico}
                clubes={clubes}
                styles={{...styles} as any} 
              />
              <hr style={styles.divider} />
            </>
          )
        )}

        <h3 style={{ color: '#2c3e50', fontSize: '1.5rem', marginBottom: '20px' }}>
          Fixtures Existentes
        </h3>

        <ListaFixture
          fixtures={fixtures}
          onEdit={iniciarEdicion}
          canEdit={esPresidenta} // 🔒 Pasamos el permiso al componente hijo
        />
      </div>
    </div>
  );
};

export default FixturePage;