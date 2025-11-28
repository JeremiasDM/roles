import React, { useState } from "react";

// Inlined Pago type (used by this file)
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

// Inlined Fixture type (minimal shape used here)
type Fixture = {
    fecha: string;
    lugar: string;
    partidos: any[];
};
import { usePagos } from "../hooks/usePagos";

// Definición de tipos para las props (invariante)
type Props = {
    clubes: string[];
    partidos: Fixture[]; 
    montoMinimo: number;
};

const styleConfig = {
    form: "form-container",
    title: "form-title",
    label: "form-label",
    input: "form-input-select",
    numberInput: "form-input-number",
    fileInput: "form-input-file",
    button: "btn-submit",
    fileAttachedMessage: "file-attached-message"
};

// ============================================
// SECCIÓN DE ESTILOS CSS PLANOS INYECTADOS
// ============================================
const globalStyles = `
/* Estilos del Formulario */
.form-container {
    max-width: 400px;
    margin: 2rem auto;
    padding: 2rem;
    background-color: #ffffff; /* bg-white */
    border-radius: 0.75rem; /* rounded-xl */
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-xl */
    display: flex;
    flex-direction: column;
    gap: 1.5rem; /* space-y-6 */
    border: 1px solid #e5e7eb;
}

.form-title {
    font-size: 1.5rem; /* text-2xl */
    font-weight: 700; /* font-bold */
    color: #1f2937; /* text-gray-800 */
    text-align: center;
    border-bottom: 2px solid #f3f4f6;
    padding-bottom: 1rem;
    margin-bottom: 0.5rem;
}

.form-label {
    display: block;
    font-size: 0.875rem; /* text-sm */
    font-weight: 600; /* font-medium */
    color: #374151; /* text-gray-700 */
    margin-bottom: 0.5rem;
}

/* Estilos comunes para select e input de texto */
.form-input-select, .form-input-number, .form-input-file {
    display: block;
    width: 100%;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    line-height: 1.5;
    color: #1f2937; /* text-gray-900 */
    background-color: #f9fafb; /* bg-gray-50 */
    border: 1px solid #d1d5db; /* border-gray-300 */
    border-radius: 0.5rem; /* rounded-lg */
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-input-select:focus, .form-input-number:focus, .form-input-file:focus {
    border-color: #3b82f6; /* focus:ring-blue-500 */
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5); /* focus:ring */
    outline: none;
    background-color: #ffffff;
}

/* Estilo específico para input de número */
.form-input-number {
    /* Mantiene el estilo base */
}

/* Estilo para input de tipo file (generalmente más difícil de estilizar de forma nativa) */
.form-input-file {
    /* Aquí se requiere override nativo o un componente personalizado para un estilo perfecto */
    padding: 0.5rem;
}

.btn-submit {
    width: 100%;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    font-weight: 600; /* font-semibold */
    text-align: center;
    color: #ffffff; /* text-white */
    background-color: #10b981; /* bg-emerald-500 */
    border-radius: 0.5rem; /* rounded-lg */
    cursor: pointer;
    transition: background-color 0.2s;
    border: none;
}

.btn-submit:hover {
    background-color: #059669; /* hover:bg-emerald-600 */
}

.btn-submit:disabled {
    background-color: #a7f3d0; /* disabled:bg-emerald-200 */
    cursor: not-allowed;
}

.file-attached-message {
    margin-top: 0.5rem;
    font-size: 0.75rem; /* text-xs */
    color: #047857; /* text-emerald-700 */
    background-color: #ecfdf5; /* bg-emerald-50 */
    padding: 0.5rem;
    border-radius: 0.375rem; /* rounded-md */
    border: 1px dashed #34d399; /* border-emerald-300 */
}
`;
// ============================================


const RegistroPago: React.FC<Props> = ({ clubes, partidos, montoMinimo }) => {
    const { agregar } = usePagos();
    
    // Estados del formulario
    const [club, setClub] = useState("");
    const [partidoId, setPartidoId] = useState<number | "">(""); 
    const [monto, setMonto] = useState<number>(montoMinimo);
    const [comprobante, setComprobante] = useState("");
    const [comprobanteArchivo, setComprobanteArchivo] = useState<string | undefined>(undefined);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === "string") setComprobanteArchivo(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // **Validaciones básicas**
        if (!club || !partidoId || !comprobante || monto < montoMinimo) {
            alert(` Completa todos los campos obligatorios y verifica que el monto sea de al menos $${montoMinimo.toLocaleString()}.`);
            return;
        }
        
        // **Creación del objeto Pago**
        const pago: Pago = {
            id: Date.now(),
            // Asumiendo 'arbitraje'. Idealmente, el tipo debería ser un campo del formulario.
            tipo: "arbitraje" as any,
            club,
            // Convertir a número al crear el objeto Pago
            partidoId: Number(partidoId),
            monto,
            comprobante,
            comprobanteArchivo,
            fecha: new Date().toISOString(),
            estado: "pendiente",
            categoria: "Masculino",
            motivo: ""
        };
        
        agregar(pago);
        
        // **Limpiar formulario**
        setClub("");
        setPartidoId("");
        setMonto(montoMinimo);
        setComprobante("");
        setComprobanteArchivo(undefined);
        alert("✅ Pago registrado correctamente.");
    };

    return (
        <>
            {/* ⚠️ INYECCIÓN DE ESTILOS CSS PLANOS ⚠️ */}
            <style>{globalStyles}</style>
            
            <form onSubmit={handleSubmit} className={styleConfig.form}>
                <h2 className={styleConfig.title}>
                     Registro de Pago de Arbitraje
                </h2>

                {/* Club Selector */}
                <div>
                    <label htmlFor="club" className={styleConfig.label}>Club</label>
                    <select 
                        id="club"
                        value={club} 
                        onChange={e => setClub(e.target.value)} 
                        className={styleConfig.input}
                        required
                    >
                        <option value="" disabled>Seleccione el Club</option>
                        {clubes.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                {/* Partido Selector */}
                <div>
                    <label htmlFor="partidoId" className={styleConfig.label}>Partido / Jornada</label>
                    <select 
                        id="partidoId"
                        value={partidoId} 
                        onChange={e => setPartidoId(e.target.value === "" ? "" : Number(e.target.value))} 
                        className={styleConfig.input} 
                        required
                    >
                        <option value="" disabled>Seleccione Partido</option>
                        {/* Generar opciones de partidos */}
                        {partidos.flatMap(f =>
                            f.partidos.map((p, index) => (
                                <option key={`${f.fecha}-${p.jornada}-${index}`} value={p.jornada}>
                                    Jornada {p.jornada} - {p.club1} vs {p.club2} ({f.lugar})
                                </option>
                            ))
                        )}
                    </select>
                </div>
                
                {/* Monto Input */}
                <div>
                    <label htmlFor="monto" className={styleConfig.label}>Monto ($)</label>
                    <input
                        id="monto"
                        type="number"
                        min={montoMinimo}
                        value={monto}
                        onChange={e => setMonto(Number(e.target.value))}
                        placeholder={`Monto mínimo: $${montoMinimo.toLocaleString()}`}
                        className={styleConfig.numberInput} 
                        required
                    />
                    <p className="text-xs text-gray-500 mt-1">Monto mínimo requerido: ${montoMinimo.toLocaleString()}</p>
                </div>
                
                {/* Comprobante Input */}
                <div>
                    <label htmlFor="comprobante" className={styleConfig.label}>Número de Comprobante</label>
                    <input
                        id="comprobante"
                        type="text"
                        value={comprobante}
                        onChange={e => setComprobante(e.target.value)}
                        placeholder="Nº Comprobante de transferencia/depósito"
                        className={styleConfig.input}
                        required
                    />
                </div>
                
                {/* File Upload */}
                <div>
                    <label htmlFor="archivo" className={styleConfig.label}>Adjuntar Comprobante (Opcional)</label>
                    <input
                        id="archivo"
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleFileUpload}
                        className={styleConfig.fileInput}
                    />
                    {comprobanteArchivo && (
                        <p className={styleConfig.fileAttachedMessage}>
                            Archivo adjunto: {comprobanteArchivo.substring(0, 30)}...
                        </p>
                    )}
                </div>

                <button 
                    type="submit" 
                    className={styleConfig.button}
                >
                     Registrar Pago
                </button>
            </form>
        </>
    );
};

export default RegistroPago;
