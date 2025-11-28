import React, { useState, useEffect } from "react";
import TablaPagosClub from "./TablaPagosClub";
import FormularioPago from "./FormularioPago";
import HistorialPagos from "./HistorialPagos";
import EditarPago from "./EditarPago";
import type { CSSProperties } from "react";
import { hasRole } from "../utils/auth"; // 🔒 Importar utilidad de roles

// ============================================
// CONFIGURACIÓN DE ESTILOS (Mantenida)
// ============================================
const styleConfig = {
    container: "pagos-container",
    contentWrapper: "content-wrapper",
    modalBackdrop: "modal-backdrop",
    sancionesSectionWrapper: "sanciones-section-wrapper",
    sancionesHeader: "sanciones-header",
    sancionesTitle: "sanciones-title",
    sancionesBody: "sanciones-body",
    sancionesList: "sanciones-list",
    sancionItem: "sancion-item",
    sancionIcon: "sancion-icon",
    sancionClub: "sancion-club",
    sancionDescription: "sancion-description",
    sancionTypeBadge: "sancion-type-badge",
    sancionMetadata: "sancion-metadata",
    noSancionesMessage: "no-sanciones-message",
    apiStatusAlert: "api-status-alert",
};

const baseNavButtonStyle: CSSProperties = {
    padding: "0.5rem 1rem",
    borderRadius: "5px",
    background: "#1f3c88",
    color: "white",
    border: "none",
    cursor: "pointer",
    marginRight: "0.5rem",
    fontWeight: '600',
    transition: 'background-color 0.2s, opacity 0.2s'
};

const activeNavButtonStyle: CSSProperties = {
    background: "#0f2357", 
    boxShadow: '0 0 10px rgba(31, 60, 136, 0.5)'
};

const globalStyles = `
/* ... (Mismos estilos que tenías antes, omitidos para brevedad) ... */
.pagos-container { min-height: 100vh; background-color: #f3f4f6; padding: 1rem; }
@media (min-width: 768px) { .pagos-container { padding: 2rem; } }
.content-wrapper { max-width: 80rem; margin: 0 auto; background-color: white; border-radius: 0.5rem; padding: 1.5rem; display: flex; flex-direction: column; gap: 2rem; }
.modal-backdrop { position: fixed; top: 0; right: 0; bottom: 0; left: 0; background-color: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 50; }
.api-status-alert { padding: 0.75rem; margin-bottom: 1rem; border-radius: 0.375rem; font-weight: 500; }
.api-status-alert.error { background-color: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
.api-status-alert.loading { background-color: #f0f9ff; color: #0c4a6e; border: 1px solid #7dd3fc; }
.content-section { padding-top: 1rem; }
`;

// --- TIPOS ---
interface ClubAPI { id: number; nombre: string; activo?: boolean; }
type TipoPago = "cuota" | "arbitraje" | "multa" | "otro";

interface Pago {
    id: number;
    tipo: TipoPago;
    club: string; 
    monto: number;
    comprobante: string;
    comprobanteArchivo?: string;
    fecha: string;
    estado: "pendiente" | "pagado" | "validado" | "invalido";
    categoria?: "Masculino" | "Femenino" | "Ambos";
    partidoId?: number;
    cantidadJugadores?: number;
    motivo?: string;
}

const API_URL = "http://localhost:3001";
const montoMinimoCuota = 10000;
const montoMinimoArbitraje = 35000;
const montoMinimoOtro = 5000;

const PagosPage: React.FC = () => {
    // --- 🔒 SEGURIDAD: Definir permisos ---
    // Crear: Presidenta, Tesorero, Referente
    const canCreate = hasRole(['presidenta', 'tesorero', 'referente']);
    // Editar/Validar: Presidenta, Tesorero (Referente NO edita)
    const canEdit = hasRole(['presidenta', 'tesorero']);
    // Eliminar: Solo Presidenta
    const canDelete = hasRole(['presidenta']);

    const [pagos, setPagos] = useState<Pago[]>([]);
    const [clubesConId, setClubesConId] = useState<ClubAPI[]>([]);
    const [clubNombres, setClubNombres] = useState<string[]>([]);
    const [partidos, setPartidos] = useState<any[]>([]); // Placeholder
    
    const [activeSection, setActiveSection] = useState<'tablaClubes' | 'historialPagos' | 'sanciones'>('tablaClubes');

    const [modal, setModal] = useState<{ tipo: TipoPago; club: string } | null>(null);
    const [pagoEditando, setPagoEditando] = useState<Pago | null>(null);
    
    const [loadingClubes, setLoadingClubes] = useState(true);
    const [errorClubes, setErrorClubes] = useState<string | null>(null);
    const [loadingPagos, setLoadingPagos] = useState(false);
    const [errorPagos, setErrorPagos] = useState<string | null>(null);

    useEffect(() => {
        cargarClubes();
        cargarPagos();
    }, []);

    const cargarClubes = async () => {
        setLoadingClubes(true);
        try {
            const response = await fetch(`${API_URL}/clubes`);
            if (!response.ok) throw new Error("No se pudieron cargar los clubes.");
            const data: ClubAPI[] = await response.json();
            const activos = data.filter(club => club.activo !== false);
            setClubesConId(activos);
            setClubNombres(activos.map(club => club.nombre).sort());
        } catch (err) {
            setErrorClubes((err as Error).message);
        } finally {
            setLoadingClubes(false);
        }
    };

    const cargarPagos = async () => {
        setLoadingPagos(true);
        try {
            const res = await fetch(`${API_URL}/pagos`, {
                // 🔒 Header opcional si el GET es público, obligatorio si es privado
                headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` } 
            });
            if (!res.ok) throw new Error("Error al cargar pagos.");
            const data = await res.json(); 

            const pagosAdaptados: Pago[] = data.map((p: any) => ({
                ...p,
                club: typeof p.club === 'object' && p.club !== null
                    ? p.club.nombre
                    : clubesConId.find(c => c.id === p.clubId)?.nombre || `ID: ${p.clubId}`,
                fecha: new Date(p.fecha).toISOString(),
            }));

            setPagos(pagosAdaptados);
        } catch (err) {
            setErrorPagos((err as Error).message);
        } finally {
            setLoadingPagos(false);
        }
    };

    const handleRealizarPago = (club: string, tipo: TipoPago) => {
        if (!canCreate) return; // 🔒 Bloqueo extra
        setErrorPagos(null);
        setModal({ tipo, club });
    };

    const handleIniciarEdicion = (pago: Pago) => {
        if (!canEdit) return; // 🔒 Bloqueo extra
        setErrorPagos(null);
        setPagoEditando(pago);
    };

    const handleCerrarModal = () => {
        setModal(null);
        setPagoEditando(null);
    };

    const obtenerClubIdPorNombre = (nombre: string): number | null => {
        const clubEncontrado = clubesConId.find(c => c.nombre === nombre);
        return clubEncontrado ? clubEncontrado.id : null;
    };

    // --- GUARDAR PAGO (POST) ---
    const handleGuardarPago = async (pagoFormData: any) => {
        setErrorPagos(null);
        setLoadingPagos(true);

        const clubId = obtenerClubIdPorNombre(pagoFormData.club);
        if (!clubId) {
            setErrorPagos(`Error: ID de club no encontrado.`);
            setLoadingPagos(false);
            return;
        }

        try {
            const payload = { ...pagoFormData, clubId };
            delete payload.club; // Enviamos clubId, no el nombre string

            const response = await fetch(`${API_URL}/pagos`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('token')}` // 🔒 TOKEN
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || "Error al registrar.");
            }

            await cargarPagos();
            handleCerrarModal();
            alert(`Pago registrado exitosamente.`);
        } catch (err) {
            setErrorPagos((err as Error).message);
        } finally {
            setLoadingPagos(false);
        }
    };

    // --- ACTUALIZAR PAGO (PATCH) ---
    const handleActualizarPago = async (pagoActualizado: Pago) => {
        if (!canEdit) return; // 🔒
        setErrorPagos(null);
        setLoadingPagos(true);

        try {
            const response = await fetch(`${API_URL}/pagos/${pagoActualizado.id}`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('token')}` // 🔒 TOKEN
                },
                body: JSON.stringify(pagoActualizado),
            });

            if (!response.ok) throw new Error("Error al actualizar pago.");

            await cargarPagos();
            handleCerrarModal();
            alert(`Pago actualizado.`);
        } catch (err) {
            setErrorPagos((err as Error).message);
        } finally {
            setLoadingPagos(false);
        }
    };

    // --- ELIMINAR PAGO (DELETE) ---
    const handleEliminarPago = async (id: number) => {
        if (!canDelete) return; // 🔒
        if (!window.confirm(`¿Eliminar pago ID ${id}?`)) return;

        setErrorPagos(null);
        setLoadingPagos(true);
        try {
            const response = await fetch(`${API_URL}/pagos/${id}`, {
                method: 'DELETE',
                headers: { 
                    "Authorization": `Bearer ${localStorage.getItem('token')}` // 🔒 TOKEN
                },
            });
            if (!response.ok) throw new Error("Error al eliminar.");
            await cargarPagos();
            alert(`Pago eliminado.`);
        } catch (err) {
            setErrorPagos((err as Error).message);
        } finally {
            setLoadingPagos(false);
        }
    };
    
    return (
        <>
            <style>{globalStyles}</style>
            <div className={styleConfig.container}>
                <div className={styleConfig.contentWrapper}>
                    
                    <h2 style={{ color: "#1f3c88", marginBottom: "30px", textAlign: "center", fontSize: "2.5em", fontWeight: 600, borderBottom: "3px solid #1f3c88", display: "block", width: "fit-content", margin: "0 auto 30px auto" }}>
                        Gestión de Pagos de Clubes
                    </h2>

                    <nav style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
                        <button style={{ ...baseNavButtonStyle, ...(activeSection === 'tablaClubes' ? activeNavButtonStyle : {}), opacity: activeSection === 'tablaClubes' ? 1 : 0.8 }} onClick={() => setActiveSection('tablaClubes')}>
                            Resumen por Club
                        </button>
                        <button style={{ ...baseNavButtonStyle, ...(activeSection === 'historialPagos' ? activeNavButtonStyle : {}), opacity: activeSection === 'historialPagos' ? 1 : 0.8 }} onClick={() => setActiveSection('historialPagos')}>
                            Historial de Pagos
                        </button>
                    </nav>

                    <div className="content-section">
                        {loadingClubes && <p className={`${styleConfig.apiStatusAlert} loading`}>Cargando...</p>}
                        {loadingPagos && <p className={`${styleConfig.apiStatusAlert} loading`}>Procesando...</p>}
                        {(errorPagos && !modal && !pagoEditando) && <p className={`${styleConfig.apiStatusAlert} error`}>{errorPagos}</p>}

                        {activeSection === 'tablaClubes' && !loadingClubes && (
                            <TablaPagosClub
                                clubes={clubNombres}
                                pagos={pagos}
                                onRealizarPago={handleRealizarPago}
                                canCreate={canCreate} // 🔒 Pasamos permiso
                            />
                        )}

                        {activeSection === 'historialPagos' && !loadingClubes && (
                            <HistorialPagos
                                pagos={pagos}
                                clubes={clubNombres}
                                onEditar={handleIniciarEdicion}
                                onEliminar={handleEliminarPago}
                                canEdit={canEdit}     // 🔒 Pasamos permiso
                                canDelete={canDelete} // 🔒 Pasamos permiso
                            />
                        )}
                    </div>

                    {modal && canCreate && (
                        <div className={styleConfig.modalBackdrop}>
                            <FormularioPago
                                tipo={modal.tipo}
                                club={modal.club}
                                montoMinimo={modal.tipo === "cuota" ? montoMinimoCuota : modal.tipo === "arbitraje" ? montoMinimoArbitraje : montoMinimoOtro}
                                partidos={partidos}
                                onGuardar={handleGuardarPago}
                                onCerrar={handleCerrarModal}
                            />
                            {errorPagos && <p className={`${styleConfig.apiStatusAlert} error`} style={{ marginTop: '1rem', textAlign: 'center' }}>{errorPagos}</p>}
                        </div>
                    )}

                    {pagoEditando && canEdit && (
                        <div className={styleConfig.modalBackdrop}>
                            <EditarPago
                                pago={pagoEditando}
                                montoMinimo={pagoEditando.tipo === "cuota" ? montoMinimoCuota : pagoEditando.tipo === "arbitraje" ? montoMinimoArbitraje : montoMinimoOtro}
                                partidos={partidos}
                                onGuardar={handleActualizarPago}
                                onCancelar={handleCerrarModal}
                            />
                            {errorPagos && <p className={`${styleConfig.apiStatusAlert} error`} style={{ marginTop: '1rem', textAlign: 'center' }}>{errorPagos}</p>}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default PagosPage;