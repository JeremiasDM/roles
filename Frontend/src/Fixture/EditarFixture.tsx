import React, { useState, useEffect, type ChangeEvent, type CSSProperties } from "react";

// Definiciones de interfaces (Necesarias para el componente)
interface Club {
    id: number;
    nombre: string;
}

interface EncuentroAPI {
    id: number;
    jornada: number;
    grupo?: string;
    fecha?: string;
    resultado: string;
    club1Id: number;
    club2Id: number;
    club1?: Club; // Hacemos opcional para evitar errores si viene nulo
    club2?: Club;
}

interface FixtureAPI {
    id: number;
    fecha: string;
    lugar: string;
    partidos: EncuentroAPI[];
}

interface CreateFixtureDto {
    fecha: string;
    lugar: string;
    partidos: any[]; // Simplificado
}

// REMOVIDA: import FormularioPartido from "./FormularioPartido"; // Asumiendo que existe y se adapta

type Props = {
    fixture: FixtureAPI; // Recibe el fixture de la API
    clubes: Club[]; // Recibe la lista de clubes
    onGuardar: (id: number, dto: Partial<CreateFixtureDto>) => void; // Envía DTO parcial
    onCancelar: () => void;
};

// 🎯 Estilo base reutilizable para los botones 🎯
const buttonBaseStyle: CSSProperties = {
    padding: "0.5rem 1rem", // Relleno interno vertical y horizontal.
    borderRadius: "5px", // Bordes ligeramente redondeados.
    border: "none", // Sin borde.
    cursor: "pointer", // Indica que es un elemento interactivo.
    marginRight: "0.5rem", // Margen derecho.
    fontWeight: 'bold',
    transition: 'background-color 0.3s, transform 0.1s',
};

// 🎯 Estilo para los inputs con fondo negro y letra blanca 🎯
const inputStylesNegro: CSSProperties = {
    color: 'white', // Color del texto (letras) en blanco
    backgroundColor: '#333', // Fondo gris oscuro/negro
    border: '1px solid #555', // Borde gris más oscuro
    padding: '12px',
    borderRadius: '8px',
    fontSize: '1em',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s, box-shadow 0.3s',
};

const customStyles: { [key: string]: CSSProperties } = {
    // Estilos principales (basados en los estilos proporcionados)
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    heading: {
        color: '#1a4e8d',
        borderBottom: '4px solid #007bff',
        paddingBottom: '15px',
        marginBottom: '35px',
        textAlign: 'left',
        fontSize: '2.2em',
    },
    subHeading: {
        color: '#333',
        marginTop: '10px',
        marginBottom: '25px',
        borderLeft: '5px solid #007bff',
        paddingLeft: '15px',
        fontWeight: '600',
        fontSize: '1.4em',
        letterSpacing: '0.5px',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        // Quitar gap, el margen lo maneja buttonBase ahora
        marginTop: '40px',
        paddingTop: '20px',
        borderTop: '1px solid #e0e0e0',
    },
    // Estilos de Elementos del Formulario
    fieldGroup: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        fontWeight: 700,
        color: '#4a5568',
        marginBottom: '5px',
        fontSize: '1em',
    },
    partidoItem: {
        border: '1px solid #e0e0e0',
        backgroundColor: '#f9f9f9',
        padding: '10px 15px',
        marginBottom: '8px',
        borderRadius: '6px',
        fontSize: '0.95em',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    partidoInfo: {
        flexGrow: 1,
        color: '#333',
    },
    // 🚨 BOTONES ACTUALIZADOS 🚨
    buttonPrimary: {
        ...buttonBaseStyle,
        backgroundColor: '#1f3c88', // Fondo Azul Fuerte (Guardar)
        color: 'white', // Texto blanco
        marginRight: '0', // Quitar el margen derecho del último botón en el contenedor
    },
    buttonSecondary: {
        ...buttonBaseStyle,
        backgroundColor: '#dc3545', // ¡FONDO ROJO PARA CANCELAR! 🚨
        color: 'white', // Texto blanco
    },
};

const EditarFixture: React.FC<Props> = ({ fixture, clubes, onGuardar, onCancelar }) => {
    const [formData, setFormData] = useState({
        fecha: fixture.fecha,
        lugar: fixture.lugar
    });

    useEffect(() => {
        setFormData({ fecha: fixture.fecha, lugar: fixture.lugar });
    }, [fixture]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onGuardar(fixture.id, { fecha: formData.fecha, lugar: formData.lugar });
    };

    // Usamos los estilos actualizados
    const saveButtonStyle = customStyles.buttonPrimary;
    const cancelButtonStyle = customStyles.buttonSecondary;


    return (
        <div>
            <h3 style={customStyles.heading}>
                Edición de Fixture (ID: {fixture.id})
            </h3>

            <form onSubmit={handleSubmit} style={customStyles.form}>
                
                {/* --- Campos de Edición General --- */}
                <div style={{ display: 'flex', gap: '20px' }}>
                    
                    {/* Campo Fecha */}
                    <div style={{ ...customStyles.fieldGroup, flex: 1 }}>
                        <label style={customStyles.label}>Fecha General del Evento:</label>
                        <input
                            name="fecha"
                            type="date"
                            value={formData.fecha}
                            onChange={handleChange}
                            style={inputStylesNegro} // Aplicación del estilo negro
                            required
                        />
                    </div>
                    
                    {/* Campo Lugar */}
                    <div style={{ ...customStyles.fieldGroup, flex: 1 }}>
                        <label style={customStyles.label}>Lugar / Sede:</label>
                        <input
                            name="lugar"
                            value={formData.lugar}
                            onChange={handleChange}
                            style={inputStylesNegro} // Aplicación del estilo negro
                            required
                        />
                    </div>
                </div>

                {/* --- Listado de Partidos (Solo Lectura) --- */}
                <h4 style={customStyles.subHeading}>
                    Partidos Registrados (Lectura y Resultados)
                </h4>
                
                <div style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '10px' }}>
                    {fixture.partidos.map((partido: EncuentroAPI, i: number) => (
                        <div key={partido.id || i} style={customStyles.partidoItem}>
                            <span style={customStyles.partidoInfo}>
                                **J{partido.jornada}** {partido.grupo ? `| G.${partido.grupo}` : ''}: 
                                **{partido.club1?.nombre || 'N/A'}** vs **{partido.club2?.nombre || 'N/A'}**
                            </span>
                            <span style={{ fontWeight: 'bold', color: '#1a4e8d', minWidth: '80px', textAlign: 'right' }}>
                                Resultado: {partido.resultado}
                            </span>
                        </div>
                    ))}
                </div>

                {/* --- Botones de Acción --- */}
                <div style={customStyles.buttonContainer}>
                    <button type="button" onClick={onCancelar} style={cancelButtonStyle}>
                        Cancelar
                    </button>
                    <button type="submit" style={saveButtonStyle}>
                        Guardar Cambios (Fecha/Lugar)
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditarFixture;
