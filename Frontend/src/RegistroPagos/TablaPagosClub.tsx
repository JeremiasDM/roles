import React from "react";

type TipoPago = "cuota" | "arbitraje" | "multa" | "otro";

interface Pago {
    id: number;
    tipo: TipoPago;
    club: string;
    monto: number;
    estado: "pendiente" | "pagado" | "validado" | "invalido";
    fecha: string;
}

type Props = {
    clubes: string[];
    pagos: Pago[];
    onRealizarPago: (club: string, tipo: TipoPago) => void;
    canCreate: boolean; // 🔒 Permiso para crear
};

const estadosColor = {
    pendiente: "estado-pendiente",
    pagado: "estado-pagado",
    validado: "estado-pagado",
    invalido: "estado-invalido"
};

const styleConfig = {
    tableWrapper: "table-pagos-club-wrapper",
    table: "table-pagos-club",
    // ... (El resto de tus clases se mantienen igual que en tu archivo original)
    statusBadge: "status-badge",
    btnPagoBase: "btn-pago-base", 
};

// ... (Tus estilos CSS globales se mantienen igual) ...
const globalStyles = `
  /* ... TUS ESTILOS PREVIOS ... */
  .btn-pago-base { padding: 0.4rem 0.8rem; font-size: 0.75rem; border-radius: 0.375rem; cursor: pointer; border: none; background-color: #1f3c88; color: white; }
  .btn-pago-base:disabled { background-color: #e5e7eb; color: #6b7280; cursor: not-allowed; }
  /* ... */
`;

const tiposTabla: Array<{ tipo: TipoPago, label: string }> = [
    { tipo: "cuota", label: "Cuota Anual" },
    { tipo: "arbitraje", label: "Pago Arbitraje" },
];

const TablaPagosClub: React.FC<Props> = ({ clubes, pagos, onRealizarPago, canCreate }) => (
    <>
        <style>{globalStyles}</style>
        <div className={styleConfig.tableWrapper}>
            <table className={styleConfig.table}>
                <thead>
                    <tr>
                        <th style={{padding: '1rem', textAlign: 'left', backgroundColor: '#1f2937', color:'white'}}>Club</th>
                        {tiposTabla.map((t) => (
                            <th key={t.tipo} style={{padding: '1rem', textAlign: 'center', backgroundColor: '#1f2937', color:'white'}}>{t.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {clubes.map(club => (
                        <tr key={club}>
                            <td style={{padding: '1rem', fontWeight: 'bold'}}>{club}</td>
                            {tiposTabla.map((t) => {
                                const ultimoPago = pagos
                                    .filter(p => p.club === club && p.tipo === t.tipo)
                                    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())[0];

                                const estado = ultimoPago?.estado || "pendiente";
                                const estadoClass = estadosColor[estado as keyof typeof estadosColor] || estadosColor.pendiente;

                                return (
                                    <td key={t.tipo} style={{padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid #eee'}}>
                                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem'}}>
                                            <span className={`${styleConfig.statusBadge} ${estadoClass}`}>{estado.toUpperCase()}</span>
                                            
                                            {/* 🔒 BOTÓN PROTEGIDO */}
                                            {canCreate && (
                                                <button
                                                    className={styleConfig.btnPagoBase}
                                                    onClick={() => onRealizarPago(club, t.tipo)}
                                                >
                                                    Registrar Pago
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </>
);

export default TablaPagosClub;