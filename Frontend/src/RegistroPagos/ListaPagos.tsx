import React from "react";

// Inlined Pago type
type Pago = {
    motivo: string;
    id: number;
    tipo: "cuota" | "arbitraje";
    club: string;
    categoria: "Masculino" | "Femenino" | "Ambos";
    partidoId?: number;
    monto: number;
    comprobante: string;
    comprobanteArchivo?: string;
    fecha: string;
    estado: "pendiente" | "pagado" | "invalido";
    cantidadJugadores?: number;
    sancion?: string;
};

type Props = {
    pagos: Pago[];
    onEliminar?: (id: number) => void;
    onEditar?: (pago: Pago) => void;
};

const styleConfig = {
    noPaymentsMessage: "no-payments-message",
    tableWrapper: "table-wrapper",
    table: "payments-table",
    tableHeader: "table-header-bg",
    tableHeaderCell: "table-cell",
    tableRow: "table-row-item",
    tableDataCell: "table-cell",
    actionsContainer: "table-actions-container",
    editButton: "btn-edit",
    deleteButton: "btn-delete"
};

// ============================================
// SECCIÓN DE ESTILOS CSS PLANOS INYECTADOS
// ============================================
const globalStyles = `
/* Mensaje de no pagos */
.no-payments-message {
    text-align: center;
    padding: 1rem;
    font-size: 1rem;
    color: #4b5563; /* text-gray-600 */
    background-color: #f3f4f6; /* bg-gray-100 */
    border-radius: 0.5rem;
    margin-top: 1rem;
}

/* Contenedor de la Tabla */
.table-wrapper {
    overflow-x: auto; /* Permite desplazamiento horizontal en pantallas pequeñas */
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06); /* shadow-md */
    border-radius: 0.5rem;
}

/* Estilo de la tabla */
.payments-table {
    width: 100%;
    min-width: 600px; /* Asegura un mínimo de ancho para evitar colapsos */
    border-collapse: separate;
    border-spacing: 0;
    font-size: 0.875rem; /* text-sm */
    line-height: 1.25rem;
    background-color: #ffffff;
    border-radius: 0.5rem;
    overflow: hidden; /* Necesario para que el border-radius se aplique */
}

/* Cabecera de la tabla */
.table-header-bg {
    background-color: #3b82f6; /* bg-blue-500 */
    color: #ffffff; /* text-white */
    text-transform: uppercase;
}

/* Celdas de la cabecera y datos */
.table-cell {
    padding: 0.75rem 1rem; /* px-4 py-3 */
    text-align: left;
    white-space: nowrap; /* Evita que el texto se rompa en la cabecera */
    border-bottom: 1px solid #e5e7eb; /* border-gray-200 */
}

.table-header-bg .table-cell {
    font-weight: 600; /* font-semibold */
}

/* Filas de datos */
.table-row-item:nth-child(even) {
    background-color: #f9fafb; /* odd:bg-white */
}

.table-row-item:hover {
    background-color: #eff6ff; /* hover:bg-blue-50 */
    transition: background-color 0.15s ease-in-out;
}

/* Contenedor de Acciones */
.table-actions-container {
    display: flex;
    gap: 0.5rem; /* space-x-2 */
    align-items: center;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #e5e7eb;
}

/* Botón Editar */
.btn-edit {
    padding: 0.375rem 0.75rem; /* px-3 py-1.5 */
    font-size: 0.75rem; /* text-xs */
    font-weight: 500;
    color: #1d4ed8; /* text-blue-700 */
    background-color: #bfdbfe; /* bg-blue-200 */
    border: none;
    border-radius: 0.375rem; /* rounded-md */
    cursor: pointer;
    transition: background-color 0.2s;
}

.btn-edit:hover {
    background-color: #93c5fd; /* hover:bg-blue-300 */
}

/* Botón Eliminar */
.btn-delete {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: #b91c1c; /* text-red-700 */
    background-color: #fecaca; /* bg-red-200 */
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: background-color 0.2s;
}

.btn-delete:hover {
    background-color: #fca5a5; /* hover:bg-red-300 */
}
`;
// ============================================

const ListaPagos: React.FC<Props> = ({ pagos, onEliminar, onEditar }) => {
    if (!pagos || pagos.length === 0) {
        return (
            <>
                {/* ⚠️ INYECCIÓN DE ESTILOS CSS PLANOS ⚠️ */}
                <style>{globalStyles}</style>
                <p className={styleConfig.noPaymentsMessage}>No hay pagos registrados.</p>
            </>
        );
    }

    return (
        <>
            {/* ⚠️ INYECCIÓN DE ESTILOS CSS PLANOS ⚠️ */}
            <style>{globalStyles}</style>

            <div className={styleConfig.tableWrapper}>
                <table className={styleConfig.table}>
                    <thead className={styleConfig.tableHeader}>
                        <tr>
                            <th className={styleConfig.tableHeaderCell}>Club</th>
                            <th className={styleConfig.tableHeaderCell}>Partido</th>
                            <th className={styleConfig.tableHeaderCell}>Monto</th>
                            <th className={styleConfig.tableHeaderCell}>Comprobante</th>
                            <th className={styleConfig.tableHeaderCell}>Fecha</th>
                            <th className={styleConfig.tableHeaderCell}>Estado</th>
                            <th className={styleConfig.tableHeaderCell}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pagos.map((pago) => (
                            <tr key={pago.id} className={styleConfig.tableRow}>
                                <td className={styleConfig.tableDataCell}>{pago.club}</td>
                                <td className={styleConfig.tableDataCell}>{pago.partidoId}</td>
                                <td className={styleConfig.tableDataCell}>${pago.monto.toLocaleString('es-CL')}</td>
                                <td className={styleConfig.tableDataCell}>{pago.comprobante}</td>
                                <td className={styleConfig.tableDataCell}>{new Date(pago.fecha).toLocaleDateString()}</td>
                                <td className={styleConfig.tableDataCell}>{pago.estado}</td>
                                <td className={styleConfig.actionsContainer}>
                                    {onEditar && (
                                        <button
                                            onClick={() => onEditar(pago)}
                                            className={styleConfig.editButton}
                                        >
                                            Editar
                                        </button>
                                    )}
                                    {onEliminar && (
                                        <button
                                            onClick={() => onEliminar(pago.id)}
                                            className={styleConfig.deleteButton}
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
        </>
    );
};

export default ListaPagos;
