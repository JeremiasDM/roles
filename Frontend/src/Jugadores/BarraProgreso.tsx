import { FaUser, FaFileAlt, FaCheckCircle } from 'react-icons/fa';

interface BarraProgresoProps {
  fase: number;
}

// --- Definición de Colores y Estilos Base ---
const COLOR_PRIMARIO = '#1f3c88'; // Azul oscuro (Activo - Datos Personales)
const COLOR_SECUNDARIO = '#059669'; // Verde oscuro (Completado)
const COLOR_AZUL_SECUNDARIO = '#3b82f6'; // Azul claro (Activo - Documentación)
const COLOR_GRIS_BASE = '#9ca3af'; // Gris medio para inactivo
const COLOR_GRIS_FONDO = '#e5e7eb'; // Gris muy claro para la barra base

// --- Componente de Separador (Conector) ---
const Separador = ({ completado }: { completado: boolean }) => (
  <div style={{
    flexGrow: 1,
    height: '3px',
    margin: '0 1rem',
    backgroundColor: completado ? COLOR_SECUNDARIO : COLOR_GRIS_FONDO,
    transition: 'background-color 0.5s ease',
    alignSelf: 'center',
  }} />
);

const BarraProgreso = ({ fase }: BarraProgresoProps) => {

  // --- Estilos Dinámicos para los pasos ---
  const estiloPaso = (pasoActual: 1 | 2) => {
    const estaCompletado = fase > pasoActual;
    const estaActivo = fase === pasoActual;

    let colorFondo;
    if (estaCompletado) {
      colorFondo = COLOR_SECUNDARIO;
    } else if (estaActivo) {
      // Usa un color diferente para cada fase activa para diferenciarlas mejor
      colorFondo = (pasoActual === 1) ? COLOR_PRIMARIO : COLOR_AZUL_SECUNDARIO;
    } else {
      colorFondo = COLOR_GRIS_BASE;
    }
    
    return {
      padding: '0.75rem 1.5rem', // Un poco más de padding
      borderRadius: '9999px',
      backgroundColor: colorFondo,
      color: '#FFFFFF', // Texto siempre blanco para mayor contraste
      fontWeight: estaActivo ? '700' : '500',
      fontSize: '1rem', // Un poco más grande
      display: 'flex',
      alignItems: 'center',
      transition: 'all 0.4s ease',
      cursor: 'default',
      boxShadow: estaActivo ? '0 6px 10px rgba(0, 0, 0, 0.2)' : '0 2px 4px rgba(0, 0, 0, 0.1)', // Sombra más prominente para el paso activo
      transform: estaActivo ? 'scale(1.03)' : 'scale(1)',
    };
  };

  // 50% para fase 1, 100% para fase 2
  const porcentaje = fase === 1 ? 50 : 100;
  
  return (
    <div style={{ 
        maxWidth: '800px', // Un poco más ancho
        margin: '2rem auto', 
        padding: '1.5rem',
        borderRadius: '1rem',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', // Sombra más suave
    }}>
        
      {/* Indicadores de Fase (Con Pastillas) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
        {/* Paso 1: Datos personales */}
        <div style={estiloPaso(1)}>
          {fase > 1 ? (
            <FaCheckCircle style={{ marginRight: '8px' }} />
          ) : (
            <FaUser style={{ marginRight: '8px' }} />
          )}
          Datos personales
        </div>

        {/* Separador entre Paso 1 y Paso 2 */}
        <Separador completado={fase > 1} />
        
        {/* Paso 2: Documentación */}
        <div style={estiloPaso(2)}>
          {/* Lógica de Icono: Check si completado, FileAlt si no */}
          {fase > 2 ? (
            <FaCheckCircle style={{ marginRight: '8px' }} />
          ) : (
            <FaFileAlt style={{ marginRight: '8px' }} />
          )}
          Documentación
        </div>
      </div>
      
      {/* Barra de Progreso Visual - Debajo de las pastillas */}
      <div style={{
        width: '100%',
        backgroundColor: COLOR_GRIS_FONDO,
        height: '8px', // Más delgada
        borderRadius: '4px',
        overflow: 'hidden',
        marginTop: '1rem',
      }}>
        <div style={{
          backgroundColor: COLOR_SECUNDARIO, 
          width: `${porcentaje}%`,
          height: '100%',
          transition: 'width 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)', 
        }} />
      </div>
    </div>
  );
};

export default BarraProgreso;
