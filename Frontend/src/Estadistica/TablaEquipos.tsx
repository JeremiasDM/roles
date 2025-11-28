import React from "react";
import EquipoItem from "./EquipoItem";

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

type Props = {
  equipos: Equipo[]; 
  onActualizar: (id: number, actualizado: Partial<Equipo>) => void; 
  onEliminar: (id: number) => void; 
  puedeEditar: boolean; // 🔒 Nueva prop
};

const TablaEquipos: React.FC<Props> = ({ equipos, onActualizar, onEliminar, puedeEditar }) => {
  // Ordenamiento
  const equiposOrdenados = [...equipos].sort((a, b) => {
      // Puntos (descendente)
      if (b.puntos !== a.puntos) return b.puntos - a.puntos;
      // Goles (descendente)
      if (b.goles !== a.goles) return b.goles - a.goles;
      // Nombre (ascendente)
      return a.nombre.localeCompare(b.nombre);
  });

  return (
    <div style={{ margin: "0 auto", maxWidth: "1000px" }}>

      {equiposOrdenados.length === 0 ? (
          <p style={{textAlign: 'center', color: '#6c757d', marginTop: '20px'}}>No hay equipos registrados para mostrar estadísticas.</p>
      ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "separate", 
              borderSpacing: 0,
              marginTop: "20px",
              backgroundColor: "#fff",
              borderRadius: "12px", 
              overflow: "hidden", 
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", 
            }}
          >
            <thead
              style={{
                backgroundColor: "#1f3c88", 
                color: "white",
                fontSize: "0.95em",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              <tr>
                <th style={{ padding: 12, textAlign: "left" }}>Equipo</th>
                <th style={{ padding: 12 }}>PG</th>
                <th style={{ padding: 12 }}>PE</th>
                <th style={{ padding: 12 }}>PP</th>
                <th style={{ padding: 12 }}>Goles</th> 
                <th style={{ padding: 12 }}>Puntos</th>
                {/* 🔒 Columna visible solo para Presidenta */}
                {puedeEditar && <th style={{ padding: 12 }}>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {equiposOrdenados.map((equipo, index) => (
                <EquipoItem
                  key={equipo.id}
                  equipo={equipo}
                  onActualizar={onActualizar} 
                  onEliminar={onEliminar} 
                  rowStyle={index % 2 === 1 ? { backgroundColor: "#f8f9fa" } : {}}
                  puedeEditar={puedeEditar} // 🔒 Pasar permiso al ítem
                />
              ))}
            </tbody>
          </table>
      )}
    </div>
  );
};

export default TablaEquipos;