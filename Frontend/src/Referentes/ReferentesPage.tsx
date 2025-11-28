import React, { useState, useEffect } from "react";
import type { CSSProperties } from "react";
import RegistrarReferente from "./RegistrarReferente";
import EditarReferente from "./EditarReferente";
import ListaReferente from "./ListaReferente";
import VistaReferente from "./VistaReferente";

// --- NUEVAS DEFINICIONES DE TIPOS ---
interface Club {
  id: number;
  nombre: string;
}

export interface Referente {
  id: number;
  nombre: string;
  apellido: string;
  categoria: "Masculino" | "Femenino";
  dni: string;
  correo: string;
  telefono: string; // <--- AÑADIDO: Teléfono obligatorio
  clubId: number;
  club: Club;
}

export interface CreateReferenteDto {
  nombre: string;
  apellido: string;
  categoria: "Masculino" | "Femenino";
  dni: string;
  correo: string;
  telefono: string; // <--- AÑADIDO
  clubId: number;
}

export type UpdateReferenteDto = Partial<CreateReferenteDto>;

// --- URL DE LA API ---
const API_URL = "http://localhost:3001";

// =========================================================
// 🎨 SECCIÓN DE ESTILOS (EXPORTADA) 🎨
// =========================================================
interface Styles {
  [key: string]: CSSProperties;
}

export const styles: Styles = {
  contenedorPrincipal: {
    padding: '32px',
    backgroundColor: '#eef2f6',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  titulo: {
    fontSize: '36px',
    fontWeight: '600',
    textAlign: 'center',
    color: '#1e40af',
    borderBottom: '3px solid #1e40af',
    paddingBottom: '5px',
    display: 'block',
    width: 'fit-content',
    margin: '0 auto 24px auto',
    letterSpacing: '0.02em',
  },
  formTitulo: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e40af',
    textAlign: 'center',
    marginBottom: '28px',
  },
  cardFormulario: {
    maxWidth: '52rem',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    boxShadow: '0 10px 15px rgba(0, 0, 0, 0.05), 0 4px 6px rgba(0, 0, 0, 0.05)',
    borderRadius: '16px',
    padding: '36px',
    marginBottom: '32px',
    border: '1px solid #e2e8f0',
  },
  cardLista: {
    maxWidth: '52rem',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    boxShadow: '0 10px 15px rgba(0, 0, 0, 0.05), 0 4px 6px rgba(0, 0, 0, 0.05)',
    borderRadius: '16px',
    padding: '32px',
    border: '1px solid #e2e8f0',
  },
  inputOscuro: {
    backgroundColor: '#374151',
    color: '#ffffff',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #4b5563',
    marginBottom: '16px',
    width: '100%',
    boxSizing: 'border-box',
    fontSize: '16px',
  } as CSSProperties,
  botonPrimario: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    padding: '12px 24px',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '16px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.1s ease, opacity 0.3s ease',
    boxShadow: '0 4px 10px rgba(59, 130, 246, 0.5)',
    width: '100%',
    marginTop: '20px',
  } as CSSProperties,
  botonSecundario: {
    backgroundColor: '#9ca3af',
    color: '#ffffff',
    padding: '10px 16px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.1s ease',
  } as CSSProperties,
  mensajeAlerta: {
    padding: '12px',
    borderRadius: '8px',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: '16px',
  } as CSSProperties,
  mensajeError: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    border: '1px solid #fca5a5',
  },
  mensajeExito: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
    border: '1px solid #a7f3d0',
  },
};

// --- VALIDACIÓN ---
function validarReferente(
  nuevo: CreateReferenteDto | UpdateReferenteDto,
  referentes: Referente[],
  editId: number | null = null,
): string | null {
  if (
    !nuevo.nombre?.trim() ||
    !nuevo.apellido?.trim() ||
    !nuevo.categoria ||
    !nuevo.dni?.trim() ||
    !nuevo.correo?.trim() ||
    !nuevo.telefono?.trim() || // <--- Validación de teléfono
    !nuevo.clubId
  ) {
    return "Todos los campos son obligatorios, incluido el teléfono.";
  }
  if (nuevo.dni && !/^\d{7,10}$/.test(nuevo.dni)) {
    return "El DNI debe tener entre 7 y 10 números.";
  }
  // Validación simple de teléfono (solo números, entre 7 y 15 caracteres)
  if (nuevo.telefono && !/^\d{7,15}$/.test(nuevo.telefono)) {
      return "El teléfono debe contener solo números (mínimo 7).";
  }

  if (
    nuevo.dni &&
    referentes.some((r) => r.dni === nuevo.dni && r.id !== editId)
  ) {
    return "El DNI ya está registrado.";
  }
  return null;
}

// =========================================================

const ReferentesPage: React.FC = () => {
  const [referentes, setReferentes] = useState<Referente[]>([]);
  const [clubes, setClubes] = useState<Club[]>([]);
  const [referenteSeleccionado, setReferenteSeleccionado] =
    useState<Referente | null>(null);
  const [editando, setEditando] = useState(false);
  const [mostrarRegistro, setMostrarRegistro] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarReferentes();
    cargarClubes();
  }, []);

  const cargarReferentes = async () => {
    try {
      const res = await fetch(`${API_URL}/referentes`);
      if (!res.ok) throw new Error("Error al cargar referentes");
      const data: Referente[] = await res.json();
      setReferentes(data);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const cargarClubes = async () => {
    try {
      const res = await fetch(`${API_URL}/clubes`);
      if (!res.ok) throw new Error("Error al cargar clubes");
      const data: Club[] = await res.json();
      setClubes(data);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const manejarVolver = () => {
    setReferenteSeleccionado(null);
    setEditando(false);
    setError(null);
  };

  const manejarIrRegistro = () => {
    setMostrarRegistro(true);
    manejarVolver();
  };

  const manejarIrLista = () => {
    setMostrarRegistro(false);
    manejarVolver();
  };

  const registrarReferente = async (dto: CreateReferenteDto) => {
    setError(null);
    const errorMsg = validarReferente(dto, referentes);
    if (errorMsg) {
      setError(errorMsg);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/referentes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al crear referente");
      }
      await cargarReferentes();
      manejarIrLista();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const actualizarReferente = async (id: number, dto: UpdateReferenteDto) => {
    setError(null);
    const errorMsg = validarReferente(dto, referentes, id);
    if (errorMsg) {
      setError(errorMsg);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/referentes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al actualizar referente");
      }
      await cargarReferentes();
      manejarIrLista();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const eliminarReferente = async (id: number) => {
    if (window.confirm("¿Seguro que quieres eliminar este referente?")) {
      setError(null);
      try {
        const res = await fetch(`${API_URL}/referentes/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          throw new Error("Error al eliminar referente");
        }
        await cargarReferentes();
        manejarVolver();
      } catch (err) {
        setError((err as Error).message);
      }
    }
  };

  const vistaDetalleActiva = referenteSeleccionado !== null;

  const estiloBotonNavegacion: CSSProperties = {
    padding: "0.5rem 1rem",
    borderRadius: "5px",
    backgroundColor: "#1f3c88",
    color: "white",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s ease, opacity 0.3s ease",
    fontWeight: "600",
    fontSize: "16px",
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: "auto",
    marginTop: 0,
  };

  return (
    <div style={styles.contenedorPrincipal}>
      <h2 style={styles.titulo}>Gestión de Referentes</h2>

      {referenteSeleccionado && !editando && (
        <VistaReferente
          referente={referenteSeleccionado}
          onVolver={manejarIrLista}
        />
      )}

      {referenteSeleccionado && editando && (
        <EditarReferente
          referente={referenteSeleccionado}
          clubes={clubes}
          onActualizar={actualizarReferente}
          onCancelar={manejarIrLista}
          error={error}
        />
      )}

      {!vistaDetalleActiva && (
        <div style={{ maxWidth: "52rem", margin: "0 auto", width: "100%", marginBottom: "-32px" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "32px" }}>
            <button
              onClick={manejarIrRegistro}
              style={{ ...estiloBotonNavegacion, opacity: mostrarRegistro ? 1 : 0.6 }}
            >
              Formulario de Registro
            </button>
            <button
              onClick={manejarIrLista}
              style={{ ...estiloBotonNavegacion, opacity: !mostrarRegistro ? 1 : 0.6 }}
            >
              Lista de Referentes ({referentes.length})
            </button>
          </div>

          {error && mostrarRegistro && (
            <div style={{ ...styles.mensajeAlerta, ...styles.mensajeError, maxWidth: "52rem", margin: "0 auto 16px auto" }}>
              {error}
            </div>
          )}

          {mostrarRegistro ? (
            <div style={styles.cardFormulario}>
              <RegistrarReferente onGuardar={registrarReferente} clubes={clubes} />
            </div>
          ) : (
            <div style={styles.cardLista}>
              <ListaReferente
                referentes={referentes}
                onVer={setReferenteSeleccionado}
                onEditar={(ref) => {
                  setReferenteSeleccionado(ref);
                  setEditando(true);
                }}
                onEliminar={eliminarReferente}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReferentesPage;