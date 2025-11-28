import React, { useState } from "react";
import FormularioDatos from "./FormularioDatos"; 
import FormularioDocumentacion from "./FormularioDocumentacion";

// Definición local
type Jugador = {
    estado?: string;
    id: number;
    nombre: string;
    apellido: string;
    dni: string;
    clubId: number;
    club: { id: number, nombre: string }; // Ajuste de tipo
    categoria: string;
    telefono?: string;
    vencimiento?: string;
    carnetUrl?: string;
    fichaMedicaUrl?: string;
};

type Props = {
    jugador: Jugador;
    onActualizar: (jugador: any) => void;
    onEliminar: (id: number) => void;
    // 🔒 Nuevos props
    permisoEditar: boolean;
    permisoEliminar: boolean;
    onVolver: () => void;
};

const VerJugadores: React.FC<Props> = ({ 
    jugador, onActualizar, onEliminar, 
    permisoEditar, permisoEliminar, onVolver 
}) => {
    const [editandoDatos, setEditandoDatos] = useState(false);
    const [editandoDocs, setEditandoDocs] = useState(false);

    const handleGuardarDatos = (j: any) => {
        onActualizar(j);
        setEditandoDatos(false);
    };
    
    const handleGuardarDocs = (j: any) => {
        onActualizar(j);
        setEditandoDocs(false);
    };

    const handleEliminar = () => {
        if (window.confirm(`¿Eliminar a ${jugador.nombre}?`)) {
            onEliminar(jugador.id);
        }
    };

    const getStatusClass = (estado?: string) => {
        return `status-pill status-${(estado || "activo").toLowerCase()}`;
    };

    return (
        <>
            <style>{`
                /* ... TUS ESTILOS CSS PREVIOS (VerJugadores) ... */
                .action-buttons-container { display: flex; gap: 10px; margin-top: 20px; border-top: 1px dashed #ccc; padding-top: 15px; }
                .btn-volver { background-color: #6c757d; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; }
                .player-card { padding: 20px; }
                .document-link { color: #007bff; display: block; margin-top: 5px; }
            `}</style>

            <div className="player-card">
                <button onClick={onVolver} className="btn-volver" style={{marginBottom: '15px'}}>← Volver</button>

                <h3 className="player-name">{jugador.nombre} {jugador.apellido}</h3>
                <p className="player-info"><strong>Club:</strong> {jugador.club?.nombre}</p>
                <p className="player-info"><strong>DNI:</strong> {jugador.dni}</p>
                <p className="player-info">
                    <strong>Estado:</strong> 
                    <span className={getStatusClass(jugador.estado)}>{jugador.estado || 'activo'}</span>
                </p>
                <p className="player-info"><strong>Categoría:</strong> {jugador.categoria}</p>
                {jugador.telefono && <p className="player-info"><strong>Teléfono:</strong> {jugador.telefono}</p>}
                {jugador.vencimiento && <p className="player-info"><strong>Vencimiento:</strong> {jugador.vencimiento}</p>}

                {jugador.carnetUrl && <img src={jugador.carnetUrl} alt="Carnet" style={{maxWidth: '200px', marginTop: '10px'}} />}
                {jugador.fichaMedicaUrl && <a href={jugador.fichaMedicaUrl} target="_blank" className="document-link">Ver Ficha Médica</a>}

                {/* 🔒 ACCIONES PROTEGIDAS */}
                {(permisoEditar || permisoEliminar) && (
                    <div className="action-buttons-container">
                        {permisoEditar && (
                            <>
                                <button onClick={() => {setEditandoDocs(false); setEditandoDatos(!editandoDatos);}} className="action-button btn-edit-data">
                                    {editandoDatos ? "Cancelar Edición" : "Editar Datos"}
                                </button>
                                <button onClick={() => {setEditandoDatos(false); setEditandoDocs(!editandoDocs);}} className="action-button btn-edit-docs">
                                    {editandoDocs ? "Cancelar Docs" : "Editar Docs"}
                                </button>
                            </>
                        )}
                        
                        {permisoEliminar && (
                            <button onClick={handleEliminar} className="action-button btn-delete">Eliminar</button>
                        )}
                    </div>
                )}

                {/* FORMULARIOS DE EDICIÓN */}
                {(editandoDatos || editandoDocs) && (
                    <div className="edit-form-container">
                        {editandoDatos && <FormularioDatos jugador={jugador as any} onGuardar={handleGuardarDatos} onCancelar={() => setEditandoDatos(false)} />}
                        {editandoDocs && <FormularioDocumentacion jugadorInfo={jugador} onGuardar={handleGuardarDocs} onCancelar={() => setEditandoDocs(false)} />}
                    </div>
                )}
            </div>
        </>
    );
};

export default VerJugadores;