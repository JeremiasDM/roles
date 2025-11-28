import React from "react";

// --- Definición local para evitar conflictos de importación ---
interface Club {
  id: number;
  nombre: string;
}
interface Jugador {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  clubId: number;
  club: Club;
  categoria: string;
  estado?: string;
}

type Props = {
  jugadores: Jugador[];
  onVer: (jugador: Jugador) => void; // Nuevo prop para ver detalle
  onIniciarEdicion: (jugador: Jugador) => void;
  onEliminar: (id: number) => void;
  // 🔒 Nuevos props de permisos
  permisoEditar: boolean;
  permisoEliminar: boolean;
};

// Iconos (Mantenidos)
const EyeIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg> );
const EditIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-1.414 7.07l-2.828 2.828-5.657-5.657 2.828-2.828 5.657 5.657zM8.414 17H5a2 2 0 01-2-2v-3.414l5.657-5.657 2.828 2.828-5.657 5.657z" /></svg> );
const DeleteIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 10-2 0v6a1 1 0 102 0V8z" clipRule="evenodd" /></svg> );

const ListaJugadores: React.FC<Props> = ({
  jugadores,
  onVer,
  onIniciarEdicion,
  onEliminar,
  permisoEditar,
  permisoEliminar,
}) => {
  const getStatusClass = (estado?: string) => {
    switch (estado?.toLowerCase()) {
      case "lesionado": return "status-lesionado";
      case "sancionado": return "status-sancionado";
      case "inactivo": return "status-inactivo";
      default: return "status-activo";
    }
  };

  if (!jugadores || jugadores.length === 0) {
    return <p className="empty-list-message">No hay jugadores cargados.</p>;
  }

  // Siempre mostramos acciones porque "Ver" es público
  const mostrarColumnaAcciones = true;

  return (
    <>
      <style>{`
        /* ... ESTILOS CSS DE TABLA PREVIOS ... */
        .icon { width: 1.2em; height: 1.2em; margin-right: 5px; }
        .action-button { padding: 6px 12px; border-radius: 6px; border: none; cursor: pointer; display: inline-flex; alignItems: center; margin-right: 5px; color: white; font-weight: 600; font-size: 0.9rem; }
        .btn-view { background-color: #17a2b8; } /* Color para ver */
        .btn-edit { background-color: #ffc107; color: #000; }
        .btn-delete { background-color: #dc3545; }
        .table-container { overflow-x: auto; }
        .player-table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
        .table-header th { background-color: #1f3c88; color: white; padding: 10px; text-align: left; }
        .table-row td { padding: 10px; border-bottom: 1px solid #ddd; }
        .status-activo { color: green; font-weight: bold; }
        .status-inactivo { color: gray; }
      `}</style>
      
      <div className="table-container">
        <table className="player-table">
          <thead className="table-header">
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Club</th>
              <th>DNI</th>
              <th>Estado</th>
              {mostrarColumnaAcciones && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {jugadores.map((j) => (
              <tr key={j.id} className="table-row">
                <td>{j.nombre}</td>
                <td>{j.apellido}</td>
                <td>{j.club ? j.club.nombre : "-"}</td>
                <td>{j.dni}</td>
                <td className={getStatusClass(j.estado)}>{j.estado || "Activo"}</td>
                
                {mostrarColumnaAcciones && (
                  <td className="action-cell">
                    {/* Botón VER (Siempre visible) */}
                    <button onClick={() => onVer(j)} className="action-button btn-view">
                      <EyeIcon /> Ver
                    </button>

                    {/* Botón EDITAR (Condicional) */}
                    {permisoEditar && (
                      <button onClick={() => onIniciarEdicion(j)} className="action-button btn-edit">
                        <EditIcon /> Editar
                      </button>
                    )}

                    {/* Botón ELIMINAR (Condicional) */}
                    {permisoEliminar && (
                      <button onClick={() => onEliminar(j.id)} className="action-button btn-delete">
                        <DeleteIcon /> Borrar
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ListaJugadores;