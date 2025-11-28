import React, { useState } from "react";
import type { CSSProperties } from "react";

// (Asumimos que las interfaces Club, CreateEncuentroDto, CreateFixtureDto están definidas en el contexto)

interface Club {
    id: number;
    nombre: string;
}

interface CreateEncuentroDto {
    jornada: number;
    grupo?: string;
    fecha?: string;
    resultado: string;
    club1Id: number;
    club2Id: number;
}

interface CreateFixtureDto {
    fecha: string;
    lugar: string;
    partidos: CreateEncuentroDto[];
}

// Interfaz para pasar todos los estilos del padre
interface StyleProps {
    buttonBase: CSSProperties;
    buttonPrimary: CSSProperties;
    buttonSuccess: CSSProperties;
    buttonContainer: CSSProperties;
    errorMessage?: CSSProperties;
    successMessage?: CSSProperties;
}

type Props = {
    onAgregarFixture: (dto: CreateFixtureDto) => void;
    onGenerarAutomatico?: () => void;
    clubes: Club[]; // <-- Recibe clubes
    styles: StyleProps; 
};

// --- 👇 ESTILOS ESPECÍFICOS DEL FORMULARIO AQUÍ 👇 ---
const formStyles = {
    // Estilo base para Input y Select
    inputBase: {
        width: '100%',
        padding: '10px 12px',
        margin: '8px 0 16px 0',
        display: 'inline-block',
        border: '1px solid #ccc',
        borderRadius: '6px',
        boxSizing: 'border-box' as const,
        fontSize: '1rem',
        transition: 'border-color 0.3s, box-shadow 0.3s',
        backgroundColor: '#fff',
    },
    // Estilo para el contenedor de la información general
    infoGeneral: {
        display: 'flex',
        gap: '20px',
        marginBottom: '20px',
    },
    // Estilo de la cabecera (h3) de sección
    sectionHeader: {
        color: '#1f3c88',
        fontSize: '1.4rem',
        borderBottom: '2px solid #f0f0f0',
        paddingBottom: '10px',
        marginBottom: '20px',
        marginTop: '30px',
    },
    // Estilo para el contenedor del formulario de un solo partido (Grid)
    formPartidoGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '15px',
        alignItems: 'flex-start',
        padding: '15px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        border: '1px solid #eee',
    },
    // Estilo para los botones de acción dentro del grid (ej: Agregar Partido)
    gridButton: {
        marginTop: 'auto', 
        alignSelf: 'flex-end',
    },
    // Estilo para la lista de partidos
    partidoList: {
        listStyleType: 'none',
        padding: '10px 0',
        borderTop: '1px dashed #ddd',
        marginTop: '15px',
    },
    partidoListItem: {
        backgroundColor: '#fff',
        padding: '10px 15px',
        marginBottom: '5px',
        borderRadius: '4px',
        borderLeft: '4px solid #3498db',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        fontSize: '0.95rem',
    },
    // Estilos de Mensajes (Usando los colores del padre si están disponibles)
    successMessage: {
        color: "#28a745", // Verde
        backgroundColor: "#d4edda", // Fondo verde claro
        padding: "10px",
        borderRadius: "4px",
        textAlign: "center" as const,
        marginBottom: "1rem",
        border: "1px solid #c3e6cb",
    }
};
// --- 👆 FIN DE ESTILOS ESPECÍFICOS ---


const RegistrarFixture: React.FC<Props> = ({
    onAgregarFixture,
    onGenerarAutomatico,
    clubes,
    styles, // Recibe el objeto styles del padre
}) => {
    const [fixtureDto, setFixtureDto] = useState<CreateFixtureDto>({
        fecha: "",
        lugar: "",
        partidos: [],
    });
    const [partidoTemp, setPartidoTemp] = useState<CreateEncuentroDto>({
        jornada: 1,
        club1Id: 0,
        club2Id: 0,
        resultado: "-",
        fecha: new Date().toISOString().split('T')[0]
    });
    const [mensaje, setMensaje] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Combina estilos de botón con el estilo base
    // Usamos styles.buttonBase para obtener el padding, border, color, etc.
    const botonGuardarStyle = { ...styles.buttonBase }; 
    // Usamos styles.buttonPrimary que ya debe tener #1f3c88, o styles.buttonSuccess (Verde) para Automático
    // Asumiendo que el padre ya pasó el estilo correcto para Generar Automático
    const botonGenerarStyle = { ...styles.buttonBase, ...styles.buttonPrimary };
    
    // Estilo para el botón de agregar partido
    const botonAgregarPartidoStyle = { 
        ...styles.buttonBase, 
        ...formStyles.gridButton,
        marginRight: '0', // Anulamos el marginRight del buttonBase para que el botón ocupe todo su espacio en el grid
        backgroundColor: '#1f3c88', // ¡AZUL OSCURO SOLICITADO! 🟦
    };


    const handleChangeFixture = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        setFixtureDto({ ...fixtureDto, [e.target.name]: e.target.value });
    };

    const handleChangePartido = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setError(null);
        setPartidoTemp({
            ...partidoTemp,
            [name]:
                name === "jornada" || name === "club1Id" || name === "club2Id"
                    ? Number(value)
                    : value,
        });
    };

    const agregarPartido = () => {
        setError(null);
        setMensaje(null);

        // Validaciones (sin cambios)
        if (!partidoTemp.club1Id || !partidoTemp.club2Id) {
            setError("Debes seleccionar ambos clubes.");
            return;
        }
        if (partidoTemp.club1Id === partidoTemp.club2Id) {
            setError("No puedes seleccionar el mismo club para ambos equipos.");
            return;
        }
        if (!partidoTemp.resultado) {
            setError("El campo resultado es obligatorio (usa '-' si no se jugó).");
            return;
        }
        if (
            partidoTemp.resultado !== "-" &&
            !/^\d{1,2}-\d{1,2}$/.test(partidoTemp.resultado)
        ) {
            setError("Formato de resultado inválido (Ej: 25-21 o -).");
            return;
        }

        // Comprobar duplicados (sin cambios)
        const partidoDuplicado = fixtureDto.partidos.some(
            (p) =>
                p.jornada === partidoTemp.jornada &&
                p.grupo === partidoTemp.grupo && 
                ((p.club1Id === partidoTemp.club1Id && p.club2Id === partidoTemp.club2Id) ||
                    (p.club1Id === partidoTemp.club2Id && p.club2Id === partidoTemp.club1Id)),
        );
        if (partidoDuplicado) {
            setError("Este enfrentamiento ya está agregado para esta jornada y grupo.");
            return;
        }

        // Agregar partido al DTO del fixture (sin cambios)
        setFixtureDto({
            ...fixtureDto,
            partidos: [...fixtureDto.partidos, partidoTemp],
        });

        // Resetear formulario de partido (sin cambios)
        setPartidoTemp({
            jornada: partidoTemp.jornada, 
            club1Id: 0,
            club2Id: 0,
            resultado: "-",
            fecha: partidoTemp.fecha,
        });

        setMensaje("Partido agregado temporalmente.");
        setTimeout(() => setMensaje(null), 2000);
    };

    const guardarFixture = () => {
        setError(null);
        if (!fixtureDto.fecha || !fixtureDto.lugar) {
            setError("Completa la Fecha y el Lugar del fixture.");
            return;
        }
        if (fixtureDto.partidos.length === 0) {
            setError("Agrega al menos un partido al fixture.");
            return;
        }
        onAgregarFixture(fixtureDto); 
        setFixtureDto({ fecha: "", lugar: "", partidos: [] });
    };


    return (
        <div>
            {/* Título sin ícono */}
            <h2 style={{ color: '#1f3c88', fontSize: '1.8rem', marginBottom: '20px' }}>
                Registro Manual de Fixture
            </h2>

            {/* --- Información General del Fixture --- */}
            <h4 style={formStyles.sectionHeader}>Información General del Evento</h4>
            <div style={formStyles.infoGeneral}>
                {/* Contenedor de Fecha */}
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontWeight: 600, color: '#4a5568' }}>Fecha de Encuentros:</label>
                    <input
                        name="fecha"
                        type="date"
                        value={fixtureDto.fecha}
                        onChange={handleChangeFixture}
                        style={formStyles.inputBase}
                        required
                    />
                </div>
                {/* Contenedor de Lugar */}
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontWeight: 600, color: '#4a5568' }}>Lugar / Sede:</label>
                    <input
                        name="lugar"
                        placeholder="Ej: Polideportivo Central"
                        value={fixtureDto.lugar}
                        onChange={handleChangeFixture}
                        style={formStyles.inputBase}
                        required
                    />
                </div>
            </div>

            {/* --- Formulario de Agregación de Partido --- */}
            <h4 style={formStyles.sectionHeader}>Datos del Partido (Uno a la vez)</h4>
            <div style={formStyles.formPartidoGrid}>
                
                {/* Jornada */}
                <div>
                    <label style={{ display: 'block', fontWeight: 600, color: '#4a5568' }}>Jornada</label>
                    <input
                        name="jornada"
                        type="number"
                        min={1}
                        value={partidoTemp.jornada}
                        onChange={handleChangePartido}
                        style={{ ...formStyles.inputBase, maxWidth: '100px' }}
                        required
                    />
                </div>

                {/* Fecha Partido (Opcional) */}
                <div>
                    <label style={{ display: 'block', fontWeight: 600, color: '#4a5568' }}>Fecha Partido (Opcional)</label>
                    <input
                        name="fecha"
                        type="date"
                        value={partidoTemp.fecha}
                        onChange={handleChangePartido}
                        style={formStyles.inputBase}
                    />
                </div>

                {/* Club Local */}
                <div>
                    <label style={{ display: 'block', fontWeight: 600, color: '#4a5568' }}>Club Local *</label>
                    <select
                        name="club1Id"
                        value={partidoTemp.club1Id}
                        onChange={handleChangePartido}
                        style={formStyles.inputBase}
                        required
                    >
                        <option value={0} disabled>
                            Selecciona Club
                        </option>
                        {clubes.map((club) => (
                            <option key={club.id} value={club.id}>
                                {club.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Club Visitante */}
                <div>
                    <label style={{ display: 'block', fontWeight: 600, color: '#4a5568' }}>Club Visitante *</label>
                    <select
                        name="club2Id"
                        value={partidoTemp.club2Id}
                        onChange={handleChangePartido}
                        style={formStyles.inputBase}
                        required
                    >
                        <option value={0} disabled>
                            Selecciona Club
                        </option>
                        {clubes.map((club) => (
                            <option key={club.id} value={club.id}>
                                {club.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Resultado */}
                <div>
                    <label style={{ display: 'block', fontWeight: 600, color: '#4a5568' }}>Resultado *</label>
                    <input
                        name="resultado"
                        placeholder="Ej: 25-21 o -"
                        value={partidoTemp.resultado}
                        onChange={handleChangePartido}
                        style={formStyles.inputBase}
                        required
                    />
                </div>

                {/* Botón Agregar Partido (sin ícono) */}
                <button
                    style={botonAgregarPartidoStyle} // Usa el nuevo estilo base para el botón con el color #1f3c88
                    onClick={agregarPartido}
                    type="button"
                >
                    Agregar Partido
                </button>
            </div>

            {/* Mensajes de Alerta */}
            {error && <div style={styles.errorMessage || { color: "red" }}>{error}</div>}
            {mensaje && <div style={formStyles.successMessage || { color: "green" }}>{mensaje}</div>}

            {/* --- Lista de Partidos Agregados --- */}
            {fixtureDto.partidos.length > 0 && (
                <>
                    <h4 style={{ ...formStyles.sectionHeader, marginTop: '30px' }}>Partidos a Incluir ({fixtureDto.partidos.length})</h4>
                    <ul style={formStyles.partidoList}>
                        {fixtureDto.partidos.map((p, i) => {
                            const club1Name = clubes.find(c => c.id === p.club1Id)?.nombre || `ID: ${p.club1Id}`;
                            const club2Name = clubes.find(c => c.id === p.club2Id)?.nombre || `ID: ${p.club2Id}`;
                            return (
                                <li key={i} style={formStyles.partidoListItem}>
                                    <strong>J{p.jornada}</strong>: {club1Name} vs {club2Name} ({p.resultado}) {p.fecha ? `[${p.fecha}]` : ''}
                                </li>
                            );
                        })}
                    </ul>
                </>
            )}

            {/* --- Botones de Acción Final (sin iconos) --- */}
            <div style={styles.buttonContainer || { marginTop: 24, justifyContent: 'center' }}>
                <button
                    onClick={guardarFixture}
                    disabled={fixtureDto.partidos.length === 0 || !fixtureDto.fecha || !fixtureDto.lugar}
                    style={botonGuardarStyle} // Usa el nuevo estilo base (Azul Fuerte)
                >
                    Guardar Fixture Completo
                </button>
                {onGenerarAutomatico && (
                    <button
                        type="button"
                        onClick={onGenerarAutomatico}
                        style={botonGenerarStyle} // Usa el estilo Primary del padre (que tiene #1f3c88)
                    >
                        Generar Automático
                    </button>
                )}
            </div>
        </div>
    );
};

export default RegistrarFixture;
