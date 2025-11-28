import React, { useState, useEffect } from "react";
import TablaEquipos from "./TablaEquipos";
import { hasRole } from "../utils/auth"; // 🔒 Importar utilidad de roles

// --- 👇 DEFINICIÓN DE API_URL 👇 ---
const API_URL = "http://localhost:3001"; 

// --- Definición del tipo Equipo ---
export type Equipo = {
  id: number;
  nombre: string;
  pg: number;
  pe: number;
  pp: number;
  goles: number;
  puntos: number;
  activo?: boolean; 
};

const EstadisticasPage: React.FC = () => {
  // 🔒 Permisos: Solo la Presidenta puede modificar la tabla
  const puedeEditar = hasRole(['presidenta']);

  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Carga inicial de datos ---
  useEffect(() => {
    cargarEquipos();
  }, []);

  const cargarEquipos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/clubes`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudieron cargar los equipos.`);
      }
      const data: Equipo[] = await response.json();
      // Asegurar valores por defecto si vienen null
      const equiposConDefaults = data.map(eq => ({
          ...eq,
          pg: eq.pg ?? 0,
          pe: eq.pe ?? 0,
          pp: eq.pp ?? 0,
          goles: eq.goles ?? 0,
          puntos: eq.puntos ?? 0,
      }));
      setEquipos(equiposConDefaults.filter(eq => eq.activo !== false)); // Filtrar inactivos
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // --- Funciones para interactuar con la API (Protegidas) ---
  const actualizarEquipoAPI = async (id: number, datosActualizados: Partial<Equipo>) => {
    if (!puedeEditar) return; // 🔒 Bloqueo de seguridad

    setError(null);
    try {
      const response = await fetch(`${API_URL}/clubes/${id}`, {
        method: 'PATCH',
        headers: { 
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${localStorage.getItem('token')}` // 🔒 TOKEN
        },
        body: JSON.stringify(datosActualizados),
      });
      if (!response.ok) {
          const errorData = await response.json();
        throw new Error(`Error ${response.status}: ${errorData.message || 'No se pudo actualizar el equipo.'}`);
      }
        await cargarEquipos(); 
        alert("Estadísticas actualizadas.");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const eliminarEquipoAPI = async (id: number) => {
    if (!puedeEditar) return; // 🔒 Bloqueo de seguridad

    if (window.confirm("¿Estás seguro de quitar este equipo de la tabla (marcar como inactivo)?")) {
      setError(null);
      try {
        const response = await fetch(`${API_URL}/clubes/${id}`, {
            method: 'DELETE', 
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}` // 🔒 TOKEN
            }
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error ${response.status}: ${errorData.message || 'No se pudo quitar el equipo.'}`);
        }
        await cargarEquipos(); 
        alert("Equipo marcado como inactivo.");
      } catch (err) {
        setError((err as Error).message);
      }
    }
  };

  // --- Renderizado ---
  return (
    <div
      style={{
        padding: "40px 20px",
        backgroundColor: "#f4f7f6", 
        minHeight: "100vh",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2
        style={{
          color: "#1f3c88", 
          marginBottom: "30px",
          textAlign: "center",
          fontSize: "2.5em",
          fontWeight: 600,
          borderBottom: "3px solid #1f3c88", 
          display: "inline-block",
          paddingBottom: "5px",
          margin: "0 auto 30px auto", 
          display: "block",
          width: "fit-content"
        }}
      >
        Tabla de Posiciones
      </h2>

      {loading && <p style={{ textAlign: 'center', fontSize: '1.1em', color: '#555' }}>Cargando tabla...</p>}
      {error && <p style={{ color: 'red', textAlign: 'center', fontWeight: 'bold', background: '#ffebee', padding: '10px', borderRadius: '5px', border: '1px solid red' }}>Error: {error}</p>}

      {!loading && !error && (
        <TablaEquipos
          equipos={equipos}
          onActualizar={actualizarEquipoAPI}
          onEliminar={eliminarEquipoAPI}
          puedeEditar={puedeEditar} // 🔒 Pasar permiso al hijo
        />
      )}
    </div>
  );
};

export default EstadisticasPage;