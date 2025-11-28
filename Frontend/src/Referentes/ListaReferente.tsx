import React from "react";
import type { CSSProperties } from "react";

interface Club {
  id: number;
  nombre: string;
}

interface Referente {
  id: number;
  nombre: string;
  apellido: string;
  categoria: "Masculino" | "Femenino";
  dni: string;
  correo: string;
  telefono: string; // <--- AÑADIDO
  clubId: number;
  club: Club;
}

interface Props {
  referentes: Referente[];
  onVer: (referente: Referente) => void;
  onEditar?: (referente: Referente) => void;
  onEliminar?: (id: number) => void;
}

const tablaStyles: { [key: string]: CSSProperties } = {
  tableHeader: {
    backgroundColor: '#1f3c88',
    color: '#ffffff',
    fontWeight: '700',
    textTransform: 'uppercase',
    fontSize: '14px',
  },
  headerCell: {
    padding: '12px 16px',
    textAlign: 'left',
  },
  bodyRow: {
    borderBottom: '1px solid #e5e7eb',
    transition: 'background-color 0.3s ease',
    cursor: 'default',
  },
  bodyCell: {
    padding: '12px 16px',
    color: '#374151',
    fontSize: '15px',
  },
  actionsContainer: {
    display: 'flex',
    gap: '8px',
    padding: '12px 16px',
  },
  buttonBase: {
    padding: '6px 12px',
    borderRadius: '6px',
    fontWeight: '500',
    fontSize: '14px',
    border: 'none',
    cursor: 'pointer',
    transition: 'opacity 0.2s ease, transform 0.1s ease',
    whiteSpace: 'nowrap',
  },
  buttonVer: {
    backgroundColor: '#1f3c88',
    color: '#ffffff',
  },
  buttonEditar: {
    backgroundColor: '#1f3c88',
    color: '#ffffff',
  },
  buttonEliminar: {
    backgroundColor: '#ef4444',
    color: '#ffffff',
  },
};

const ListaReferente: React.FC<Props> = ({
  referentes,
  onVer,
  onEditar,
  onEliminar,
}) => {
  if (!referentes || referentes.length === 0) {
    return (
      <p style={{ color: "#6b7280", textAlign: "center", padding: "20px" }}>
        No hay referentes registrados.
      </p>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={tablaStyles.tableHeader}>
          <tr>
            <th style={{ ...tablaStyles.headerCell, borderTopLeftRadius: "10px" }}>
              Nombre
            </th>
            <th style={tablaStyles.headerCell}>Apellido</th>
            <th style={tablaStyles.headerCell}>Equipo</th>
            <th style={tablaStyles.headerCell}>Correo</th>
            <th style={tablaStyles.headerCell}>Teléfono</th> {/* <--- COLUMNA AÑADIDA */}
            <th style={{ ...tablaStyles.headerCell, borderTopRightRadius: "10px" }}>
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {referentes.map((ref, index) => (
            <tr
              key={ref.id}
              style={{
                ...tablaStyles.bodyRow,
                backgroundColor: index % 2 === 0 ? "#f9fafb" : "#ffffff",
                borderTop: index === 0 ? "none" : undefined,
              }}
            >
              <td style={tablaStyles.bodyCell}>{ref.nombre}</td>
              <td style={tablaStyles.bodyCell}>{ref.apellido}</td>
              <td style={tablaStyles.bodyCell}>
                {ref.club ? ref.club.nombre : "Sin club"}
              </td>
              <td style={tablaStyles.bodyCell}>{ref.correo}</td>
              <td style={tablaStyles.bodyCell}>{ref.telefono}</td> {/* <--- CELDA AÑADIDA */}
              <td style={tablaStyles.actionsContainer}>
                <button
                  onClick={() => onVer(ref)}
                  style={{ ...tablaStyles.buttonBase, ...tablaStyles.buttonVer }}
                >
                  Ver
                </button>
                {onEditar && (
                  <button
                    onClick={() => onEditar(ref)}
                    style={{
                      ...tablaStyles.buttonBase,
                      ...tablaStyles.buttonEditar,
                    }}
                  >
                    Editar
                  </button>
                )}
                {onEliminar && (
                  <button
                    onClick={() => onEliminar(ref.id)}
                    style={{
                      ...tablaStyles.buttonBase,
                      ...tablaStyles.buttonEliminar,
                    }}
                  >
                    Eliminar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaReferente;