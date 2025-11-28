import React, { useState } from "react";

type Props = {
    club: string;
    onGuardar: (pago: Pago) => void;
    montoMinimo: number;
    onCerrar: () => void; // Nuevo prop para cerrar el modal
};

const categorias = ["Masculino", "Femenino", "Ambos"];

const styleConfig = {
    modalContainer: "modal-form-container",
    closeButton: "modal-close-btn",
    title: "form-title-cuota",
    form: "form-body",
    label: "form-label",
    input: "form-input-control",
    fileInput: "form-file-input",
    submitButton: "btn-submit-cuota"
};

// ============================================
// SECCIÓN DE ESTILOS CSS PLANOS INYECTADOS
// ============================================
const globalStyles = `
/* Contenedor Principal del Modal (La tarjeta del formulario) */
.modal-form-container {
    position: relative;
    width: 90%;
    max-width: 450px;
    padding: 2rem;
    background-color: #ffffff; /* bg-white */
    border-radius: 0.75rem; /* rounded-xl */
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); /* shadow-2xl */
    z-index: 60; /* Superior al backdrop (z-50) */
}

/* Botón de Cerrar Modal */
.modal-close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 2rem;
    color: #9ca3af; /* text-gray-400 */
    cursor: pointer;
    transition: color 0.2s;
}

.modal-close-btn:hover {
    color: #4b5563; /* hover:text-gray-600 */
}

/* Título del Formulario (Cuota) */
.form-title-cuota {
    font-size: 1.5rem; /* text-2xl */
    font-weight: 700; /* font-bold */
    color: #1f2937; /* text-gray-800 */
    text-align: center;
    border-bottom: 2px solid #f3f4f6;
    padding-bottom: 1rem;
    margin-bottom: 1.5rem;
}

/* Cuerpo del Formulario */
.form-body {
    display: flex;
    flex-direction: column;
    gap: 1.25rem; /* space-y-5 */
}

/* Etiqueta del Formulario */
.form-label {
    display: block;
    font-size: 0.875rem; /* text-sm */
    font-weight: 600; /* font-medium */
    color: #374151; /* text-gray-700 */
    margin-bottom: 0.25rem;
}

/* Input/Select Control */
.form-input-control, .form-file-input {
    display: block;
    width: 100%;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    color: #1f2937; /* text-gray-900 */
    background-color: #f9fafb; /* bg-gray-50 */
    border: 1px solid #d1d5db; /* border-gray-300 */
    border-radius: 0.5rem; /* rounded-lg */
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    appearance: none; /* Reset para selects */
}

.form-input-control:focus, .form-file-input:focus {
    border-color: #10b981; /* focus:ring-emerald-500 */
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.5); /* focus:ring */
    outline: none;
    background-color: #ffffff;
}

/* Estilo específico para input de archivo */
.form-file-input {
    padding: 0.5rem 1rem;
}

/* Botón de Enviar (Submit - Cuota) */
.btn-submit-cuota {
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
    margin-top: 0.5rem;
}

.btn-submit-cuota:hover {
    background-color: #059669; /* hover:bg-emerald-600 */
}
`;
// ============================================

const FormularioCuota: React.FC<Props> = ({ club, onGuardar, montoMinimo, onCerrar }) => {
    const [categoria, setCategoria] = useState("Masculino");
    const [cantidadJugadores, setCantidadJugadores] = useState<number>(0);
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
        if (!categoria || !comprobante || monto < montoMinimo || cantidadJugadores < 1) {
            alert("Completa todos los campos y verifica el monto y cantidad de jugadores.");
            return;
        }
        const pago: Pago = {
            id: Date.now(),
            tipo: "cuota",
            club,
            categoria: categoria as any,
            monto,
            comprobante,
            comprobanteArchivo,
            fecha: new Date().toISOString(),
            estado: "pendiente",
            cantidadJugadores
        };
        onGuardar(pago);
    };

    return (
        <>
            {/* ⚠️ INYECCIÓN DE ESTILOS CSS PLANOS ⚠️ */}
            <style>{globalStyles}</style>

            <div className={styleConfig.modalContainer}>
                <button
                    type="button"
                    onClick={onCerrar} 
                    className={styleConfig.closeButton}
                    aria-label="Cerrar formulario"
                >
                    &times;
                </button>
                <h2 className={styleConfig.title}>
                     Pago de Cuota Anual: {club}
                </h2>
                <form onSubmit={handleSubmit} className={styleConfig.form}>
                    
                    {/* Categoría */}
                    <div>
                        <label className={styleConfig.label} htmlFor="categoria">Categoría</label>
                        <select 
                            id="categoria"
                            value={categoria} 
                            onChange={e => setCategoria(e.target.value)} 
                            className={styleConfig.input} 
                            required
                        >
                            {categorias.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    
                    {/* Cantidad de Jugadores */}
                    <div>
                        <label className={styleConfig.label} htmlFor="jugadores">Cantidad de Jugadores</label>
                        <input
                            id="jugadores"
                            type="number"
                            min={1}
                            value={cantidadJugadores}
                            onChange={e => setCantidadJugadores(Number(e.target.value))}
                            placeholder="Cantidad de jugadores"
                            className={styleConfig.input}
                            required
                        />
                    </div>
                    
                    {/* Monto */}
                    <div>
                        <label className={styleConfig.label} htmlFor="monto">Monto</label>
                        <input
                            id="monto"
                            type="number"
                            min={montoMinimo}
                            value={monto}
                            onChange={e => setMonto(Number(e.target.value))}
                            placeholder={`Monto mínimo: $${montoMinimo.toLocaleString()}`}
                            className={styleConfig.input}
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">Monto mínimo requerido: ${montoMinimo.toLocaleString()}</p>
                    </div>
                    
                    {/* Comprobante */}
                    <div>
                        <label className={styleConfig.label} htmlFor="comprobante">Número de Comprobante</label>
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
                    
                    {/* Archivo */}
                    <div>
                        <label className={styleConfig.label} htmlFor="archivo">Adjuntar Comprobante (Opcional)</label>
                        <input
                            id="archivo"
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={handleFileUpload}
                            className={styleConfig.fileInput}
                        />
                        {comprobanteArchivo && (
                            <p className="text-xs text-gray-500 mt-1 text-center">Archivo cargado.</p>
                        )}
                    </div>

                    <button type="submit" className={styleConfig.submitButton}>
                        Registrar Pago de Cuota
                    </button>
                </form>
            </div>
        </>
    );
};

export default FormularioCuota;
