import React, { useState, useEffect } from "react";
import RegistroJugador from "./RegistroJugador";
import ListaJugadores from "./ListaJugadores";
import FormularioDocumentacion from "./FormularioDocumentacion";
import BarraProgreso from "./BarraProgreso";
import EditarJugador from "./EditarJugador"; 
import VerJugadores from "./VerJugadores"; // Asegúrate de importar esto si lo usas
import { hasRole } from "../utils/auth"; // Importamos la utilidad

// --- TIPOS EXPORTABLES ---
export interface Club {
  id: number;
  nombre: string;
}

export interface Jugador {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  clubId: number;
  club: Club;
  categoria: string;
  telefono?: string;
  vencimiento?: string;
  carnetUrl?: string;
  fichaMedicaUrl?: string;
  estado?: string;
}

// DTO para Fase 1
interface CreateJugadorFase1Dto {
  nombre: string;
  apellido: string;
  dni: string;
  clubId: number;
  categoria: string;
  telefono?: string;
  vencimiento?: string;
  estado: string;
}

interface CreateJugadorDto extends CreateJugadorFase1Dto {
  carnetUrl?: string;
  fichaMedicaUrl?: string;
}

type Vista = "registro" | "lista" | "editar" | "detalle"; // Agregamos 'detalle'
const API_URL = "http://localhost:3001"; 

const JugadoresPage: React.FC = () => {
  // --- 🔒 SEGURIDAD: Definir permisos ---
  const puedeCrearEditar = hasRole(['presidenta', 'referente']);
  const puedeEliminar = hasRole(['presidenta']);

  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [clubes, setClubes] = useState<Club[]>([]);
  const [vista, setVista] = useState<Vista>("lista"); // Iniciamos en lista por defecto
  const [fase, setFase] = useState<1 | 2>(1);
  
  const [jugadorEnProceso, setJugadorEnProceso] = useState<CreateJugadorFase1Dto | null>(null);
  const [jugadorEditando, setJugadorEditando] = useState<Jugador | null>(null);
  const [jugadorVer, setJugadorVer] = useState<Jugador | null>(null); // Para ver detalle
  
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarJugadores();
    cargarClubes();
  }, []);

  const cargarJugadores = async () => {
    try {
      const res = await fetch(`${API_URL}/jugadores`);
      if (!res.ok) throw new Error("Error al cargar jugadores");
      const data = await res.json();
      setJugadores(data);
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

  // --- NAVEGACIÓN ---
  const irARegistro = () => {
    setJugadorEditando(null);
    setJugadorVer(null);
    setJugadorEnProceso(null);
    setFase(1);
    setVista("registro");
    setError(null);
  };

  const irALista = () => {
    setJugadorEditando(null);
    setJugadorVer(null);
    setJugadorEnProceso(null);
    setFase(1);
    setVista("lista");
    setError(null);
  };

  // --- CRUD CON TOKEN ---
  const registrarJugador = (fase1Dto: CreateJugadorFase1Dto) => {
    setJugadorEnProceso(fase1Dto);
    setFase(2);
  };

  const guardarDocumentacion = async (docs: { carnetUrl?: string; fichaMedicaUrl?: string }) => {
    if (!jugadorEnProceso) return;
    setError(null);

    const dtoCompleto: CreateJugadorDto = { ...jugadorEnProceso, ...docs };

    try {
      const res = await fetch(`${API_URL}/jugadores`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}` // 🔒 TOKEN
        },
        body: JSON.stringify(dtoCompleto),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al crear el jugador");
      }

      await cargarJugadores();
      irALista(); // Ir a lista al terminar
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const actualizarJugador = async (id: number, dto: Partial<Jugador>) => {
    setError(null);
    try {
      const res = await fetch(`${API_URL}/jugadores/${id}`, {
        method: "PATCH",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}` // 🔒 TOKEN
        },
        body: JSON.stringify(dto),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al actualizar");
      }
      await cargarJugadores();
      irALista();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const eliminarJugador = async (id: number) => {
    // 🔒 Verificación extra antes de llamar a la API
    if (!puedeEliminar) return; 

    if (window.confirm("¿Seguro que quieres eliminar este jugador?")) {
      setError(null);
      try {
        const res = await fetch(`${API_URL}/jugadores/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}` // 🔒 TOKEN
          }
        });
        if (!res.ok) throw new Error("Error al eliminar");
        await cargarJugadores();
        // Si estábamos viendo el detalle, volvemos a la lista
        if (vista === "detalle") irALista();
      } catch (err) {
        setError((err as Error).message);
      }
    }
  };

  // --- RENDERIZADO ---
  const renderContenidoPrincipal = () => {
    if (vista === "registro" && puedeCrearEditar) {
      return (
        <div className="form-card card">
          <BarraProgreso fase={fase} />
          {error && <div className="error-message">{error}</div>}

          {fase === 1 && (
            <RegistroJugador onRegistrar={registrarJugador} clubes={clubes} />
          )}

          {fase === 2 && jugadorEnProceso && (
            <FormularioDocumentacion
              jugadorInfo={{ nombre: jugadorEnProceso.nombre, apellido: jugadorEnProceso.apellido }}
              onGuardar={guardarDocumentacion}
              onCancelar={() => { setJugadorEnProceso(null); setFase(1); }}
            />
          )}
          <button onClick={irALista} className="action-button-switch">Cancelar</button>
        </div>
      );
    }

    if (vista === "lista") {
      return (
        <div className="list-card card">
          {error && <div className="error-message">{error}</div>}
          <h2 className="list-title">Listado de Jugadores</h2>
          
          <ListaJugadores
            jugadores={jugadores}
            onVer={(j) => { setJugadorVer(j); setVista("detalle"); }} // Nuevo manejador "Ver"
            onIniciarEdicion={(j) => { setJugadorEditando(j); setVista("editar"); setError(null); }}
            onEliminar={eliminarJugador}
            // 🔒 Pasamos los permisos
            permisoEditar={puedeCrearEditar}
            permisoEliminar={puedeEliminar}
          />
          
          {/* 🔒 Botón solo visible si tiene permiso */}
          {puedeCrearEditar && (
            <button onClick={irARegistro} className="action-button-switch">
                + Nuevo Jugador
            </button>
          )}
        </div>
      );
    }

    if (vista === "editar" && jugadorEditando && puedeCrearEditar) {
      return (
        <div className="card">
          {error && <div className="error-message">{error}</div>}
          <EditarJugador
            jugador={jugadorEditando}
            clubes={clubes}
            onActualizar={actualizarJugador}
            onCancelar={irALista}
            jugadores={jugadores}
          />
        </div>
      );
    }

    // Nueva vista de Detalle para usuarios con solo lectura
    if (vista === "detalle" && jugadorVer) {
        return (
            <div className="card">
                <VerJugadores 
                    jugador={jugadorVer} 
                    onActualizar={(updated) => actualizarJugador(updated.id, updated)} // Para edición in-place si se permite
                    onEliminar={eliminarJugador}
                    // 🔒 Pasamos permisos para ocultar botones internos
                    permisoEditar={puedeCrearEditar}
                    permisoEliminar={puedeEliminar}
                    onVolver={irALista}
                />
            </div>
        )
    }
    
    return <div className="loading-message">Cargando o acceso denegado...</div>;
  };

  return (
    <>
      {/* (Estilos CSS previos se mantienen igual, omitidos por brevedad pero deben estar aquí) */}
      <style>{`
        /* ... TUS ESTILOS CSS PREVIOS ... */
        .page-container { max-width: 1200px; margin: 2rem auto; padding: 0 1rem; }
        .page-title { text-align: center; color: #1f3c88; margin-bottom: 2rem; }
        .card { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .error-message { background-color: #fef2f2; color: #b91c1c; padding: 1rem; margin-bottom: 1rem; text-align: center; border-radius: 8px; }
        .action-button-switch { background-color: #1f3c88; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 20px; display: block; margin-left: auto; margin-right: auto; }
      `}</style>
      <div className="page-container">
        <h1 className="page-title">Gestión de Jugadores</h1>
        {renderContenidoPrincipal()}
      </div>
    </>
  );
};

export default JugadoresPage;