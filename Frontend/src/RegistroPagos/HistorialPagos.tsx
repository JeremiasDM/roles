import React, { useState } from "react";

type TipoPago = "cuota" | "arbitraje" | "multa" | "otro";
interface Pago {
    id: number;
    tipo: TipoPago;
    club: string;
    monto: number;
    comprobante: string;
    fecha: string;
    estado: string;
    // ... otros campos
}

type Props = {
    pagos: Pago[];
    clubes: string[];
    onEditar: (pago: Pago) => void;
    onEliminar: (id: number) => void;
    canEdit: boolean;   // 🔒
    canDelete: boolean; // 🔒
};

// ... (Configuración de estilos igual que antes) ...
const styleConfig = {
    editButton: "historial-edit-button",
    deleteButton: "historial-delete-button",
    // ...
};

const globalStyles = `
  /* ... TUS ESTILOS PREVIOS ... */
  .historial-edit-button { background-color: #3b82f6; color: white; padding: 5px 10px; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px; }
  .historial-delete-button { background-color: #ef4444; color: white; padding: 5px 10px; border: none; border-radius: 4px; cursor: pointer; }
`;

const HistorialPagos: React.FC<Props> = ({ pagos, clubes, onEditar, onEliminar, canEdit, canDelete }) => {
    const [clubFiltro, setClubFiltro] = useState<string>("");
    // ... otros filtros ...

    const pagosFiltrados = pagos.filter(p => (!clubFiltro || p.club === clubFiltro)); // Filtro simple

    return (
        <>
            <style>{globalStyles}</style>
            <div>
                {/* ... Filtros ... */}
                <div style={{overflowX: 'auto'}}> 
                    <table style={{width: '100%', borderCollapse: 'collapse'}}>
                        <thead style={{backgroundColor: '#1f2937', color: 'white'}}>
                            <tr>
                                <th style={{padding: '10px'}}>Club</th>
                                <th style={{padding: '10px'}}>Tipo</th>
                                <th style={{padding: '10px'}}>Monto</th>
                                <th style={{padding: '10px'}}>Estado</th>
                                {(canEdit || canDelete) && <th style={{padding: '10px'}}>Acciones</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {pagosFiltrados.map(pago => (
                                <tr key={pago.id} style={{borderBottom: '1px solid #eee'}}>
                                    <td style={{padding: '10px'}}>{pago.club}</td>
                                    <td style={{padding: '10px'}}>{pago.tipo}</td>
                                    <td style={{padding: '10px'}}>${pago.monto}</td>
                                    <td style={{padding: '10px'}}>{pago.estado}</td>
                                    
                                    {(canEdit || canDelete) && (
                                        <td style={{padding: '10px', whiteSpace: 'nowrap'}}>
                                            {canEdit && (
                                                <button className={styleConfig.editButton} onClick={() => onEditar(pago)}>Editar</button>
                                            )}
                                            {canDelete && (
                                                <button className={styleConfig.deleteButton} onClick={() => onEliminar(pago.id)}>Eliminar</button>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default HistorialPagos;