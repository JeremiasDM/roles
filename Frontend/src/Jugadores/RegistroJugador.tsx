import React, { useState } from "react";

// NOTA: Se asume que la función 'validarJugador' completa está implementada
// en el componente padre o se usará una validación más robusta antes de la API.

// --- Tipos ---
interface Club {
  id: number;
  nombre: string;
}

// DTO para Fase 1
interface CreateJugadorFase1Dto {
  nombre: string;
  apellido: string;
  dni: string;
  clubId: number;
  categoria: string;
  telefono?: string;
  fechaNacimiento: string;
  estado: string;
}

// Props que recibe
type Props = {
  onRegistrar: (dto: CreateJugadorFase1Dto) => void;
  clubes: Club[];
};

const RegistroJugador: React.FC<Props> = ({ onRegistrar, clubes }) => {
  const [form, setForm] = useState<CreateJugadorFase1Dto>({
    nombre: "",
    apellido: "",
    dni: "",
    clubId: 0,
    categoria: "",
    telefono: "",
    fechaNacimiento: "",
    estado: "activo",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setError(null);

    // Validación de entrada en tiempo real para evitar caracteres no deseados
    if ((name === "nombre" || name === "apellido") && !/^[A-Za-z\s]*$/.test(value)) return;
    if (name === "dni" && !/^\d{0,8}$/.test(value)) return;
    if (name === "telefono" && !/^\d{0,15}$/.test(value)) return;

    // Máscara para fecha de nacimiento dd/mm/yyyy
    if (name === "fechaNacimiento") {
      let valorLimpio = value.replace(/\D/g, '');
      if (valorLimpio.length > 8) valorLimpio = valorLimpio.slice(0, 8);
      let valorFormateado = '';
      for (let i = 0; i < valorLimpio.length; i++) {
        if (i === 2 || i === 4) valorFormateado += '/';
        valorFormateado += valorLimpio[i];
      }
      setForm({ ...form, [name]: valorFormateado });
      return;
    }

    setForm({
      ...form,
      [name]: name === "clubId" ? Number(value) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Validación de campos obligatorios
    if (
      !form.nombre.trim() || !form.apellido.trim() || !form.dni.trim() ||
      !form.clubId || form.clubId === 0 || !form.categoria
    ) {
      setError("⚠️ Todos los campos marcados con * son obligatorios.");
      return;
    }

    // 2. Validación de formato de DNI
    if (!/^\d{7,8}$/.test(form.dni.trim())) {
      setError("El DNI debe tener 7 u 8 dígitos numéricos.");
      return;
    }

    // 3. Validación de formato de Teléfono (si existe)
    if (form.telefono && form.telefono.trim() !== "" && !/^\d{7,15}$/.test(form.telefono)) {
      setError("El teléfono debe tener entre 7 y 15 dígitos numéricos.");
      return;
    }

    // 4. Validación de fecha de nacimiento
    if (!form.fechaNacimiento || form.fechaNacimiento.trim() === "") {
      setError("La fecha de nacimiento es obligatoria.");
      return;
    }
    const partesFecha = form.fechaNacimiento.split('/');
    if (partesFecha.length !== 3) {
      setError("La fecha de nacimiento debe tener formato dd/mm/yyyy.");
      return;
    }
    const [dia, mes, anio] = partesFecha.map(Number);
    const fechaNac = new Date(anio, mes - 1, dia);
    if (isNaN(fechaNac.getTime())) {
      setError("La fecha de nacimiento no es válida.");
      return;
    }
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNac.getFullYear() - (hoy < new Date(hoy.getFullYear(), fechaNac.getMonth(), fechaNac.getDate()) ? 1 : 0);
    if (edad < 16) {
      setError("El jugador debe tener al menos 16 años.");
      return;
    }
    
    // Si pasa todas las validaciones locales
    onRegistrar(form); // Pasa el DTO de Fase 1 al padre
  };

  return (
    <>
      <style>{`
        /* Definiciones de color y variables */
        :root {
          /* Heredadas del componente padre */
          --primary-blue: #1f3c88;
          --accent-teal: #00bcd4;
          --bg-light-gray: #f9fafb;
          --text-dark-gray: #1f2937;
          --border-color: #e5e7eb;
          --radius: 12px;
          --transition: all 0.3s ease;
          --error-red: #b91c1c; /* Color de texto para errores */
        }

        /* --- CONTENEDOR Y TÍTULO --- */
        .card-container {
          padding: 0; 
        }

        .form-title {
          font-size: 1.75rem; /* Un poco más grande */
          font-weight: 700;
          margin-top: 0;
          margin-bottom: 2rem; 
          text-align: center;
          color: var(--primary-blue);
          padding-bottom: 0.75rem; /* Más espacio */
          border-bottom: 3px solid var(--accent-teal); /* Línea de acento */
          grid-column: 1 / -1; 
        }

        /* --- Formulario y GRID de dos columnas MEJORADO --- */
        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr); 
          gap: 1.8rem 2.5rem; /* Mayor separación entre campos */
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-label {
          font-size: 0.95rem; /* Ligeramente más grande */
          font-weight: 600;
          color: var(--text-dark-gray); /* Usamos la variable principal */
          margin-bottom: 0.5rem;
        }

        /* --- Estilo de Inputs y Selects MEJORADO --- */
        .form-input, .form-select {
          width: 100%;
          padding: 0.9rem; /* Más padding */
          border: 1px solid var(--border-color); /* Borde más sutil */
          border-radius: 0.75rem; /* Bordes más redondeados */
          transition: var(--transition);
          box-sizing: border-box;
          font-size: 1rem;
          background-color: white; /* Fondo blanco */
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.06); /* Sombra interna sutil */
        }

        .form-input:focus, .form-select:focus {
          outline: none;
          border-color: var(--primary-blue);
          box-shadow: 0 0 0 4px rgba(31, 60, 136, 0.2); /* Sombra de foco limpia */
          background-color: var(--bg-light-gray); /* Color de fondo sutil al enfocarse */
        }
        
        /* Estilo específico para el error (más coherente) */
        .error-message {
          background-color: #fef2f2; 
          border: 1px solid #fca5a5; 
          color: var(--error-red); 
          padding: 1rem;
          border-radius: var(--radius);
          text-align: center; 
          margin-bottom: 1rem;
          grid-column: 1 / -1;
          font-weight: 600;
        }

        /* --- Botón de Enviar (Actualizado según solicitud) --- */
        .btn-submit {
          background-color: var(--primary-blue); /* Solicitado: #1f3c88 */
          color: white; /* Solicitado: white */
          padding: 0.5rem 1rem; /* CAMBIO: Relleno solicitado (0.5rem 1rem) */
          border-radius: 5px; /* CAMBIO: Bordes solicitados (5) */
          font-weight: 600; /* Ligeramente más ligero para un botón compacto */
          cursor: pointer; /* Solicitado: pointer */
          border: none; /* Solicitado: none */
          transition: var(--transition);
          box-shadow: 0 4px 8px rgba(31, 60, 136, 0.3); /* Sombra ajustada */
          margin-top: 2rem; /* Separación superior */
          /* width: auto; Eliminado para que se ajuste al contenido */
          font-size: 1rem; /* Texto más pequeño */
          grid-column: 1 / -1; /* Mantiene el span de dos columnas */
          justify-self: center; /* Centrado en el span de dos columnas */
          /* Se omite 'marginRight: 0.5rem' ya que el botón está centrado en el span */
        }

        .btn-submit:hover {
          background-color: #2e57b4; /* Tono de hover */
          transform: translateY(-1px); /* Menos movimiento */
          box-shadow: 0 6px 12px rgba(31, 60, 136, 0.4);
        }

        .btn-submit:active {
          transform: scale(0.98); /* Menos contracción */
          box-shadow: 0 1px 3px rgba(31, 60, 136, 0.2);
        }
        
        /* Media Query: En pantallas pequeñas, volvemos a una sola columna */
        @media (max-width: 768px) {
            .form-grid {
              grid-template-columns: 1fr;
              gap: 1.5rem;
            }
        }
      `}</style>

      <div className="card-container">
        <form onSubmit={handleSubmit} className="form-grid">
          
          <h2 className="form-title">
            Paso 1: Datos del Jugador 
          </h2>

          {error && <div className="error-message">{error}</div>}

          {/* Nombre */}
          <div className="form-group">
            <label htmlFor="nombre" className="form-label">
              Nombre <span style={{ color: "red" }}>*</span>
            </label>
            <input
              id="nombre"
              name="nombre"
              placeholder="Ej: Lionel"
              value={form.nombre}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          {/* Apellido */}
          <div className="form-group">
            <label htmlFor="apellido" className="form-label">
              Apellido <span style={{ color: "red" }}>*</span>
            </label>
            <input
              id="apellido"
              name="apellido"
              placeholder="Ej: Messi"
              value={form.apellido}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          
          {/* DNI */}
          <div className="form-group">
            <label htmlFor="dni" className="form-label">
              DNI <span style={{ color: "red" }}>*</span>
            </label>
            <input
              id="dni"
              name="dni"
              type="number"
              placeholder="Ej: 99999999 (7 u 8 dígitos)"
              value={form.dni}
              onChange={handleChange}
              className="form-input"
              required
              // MaxLength en number type no funciona bien, pero lo dejamos por consistencia con la validación de entrada
              maxLength={8}
            />
          </div>

          {/* Club Select */}
          <div className="form-group">
            <label htmlFor="clubId" className="form-label">
              Club <span style={{ color: "red" }}>*</span>
            </label>
            <select
              id="clubId"
              name="clubId"
              value={form.clubId}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value={0} disabled>
                --- Seleccione un club ---
              </option>
              {clubes.map((club) => (
                <option key={club.id} value={club.id}>
                  {club.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Categoría Select */}
          <div className="form-group">
            <label htmlFor="categoria" className="form-label">
              Categoría <span style={{ color: "red" }}>*</span>
            </label>
            <select
              id="categoria"
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">--- Seleccione una categoría ---</option>
              <option value="Femenino">Femenino</option>
              <option value="Masculino">Masculino</option>
            </select>
          </div>
          
          {/* Teléfono */}
          <div className="form-group">
            <label htmlFor="telefono" className="form-label">
              Teléfono (Opcional)
            </label>
            <input
              id="telefono"
              name="telefono"
              type="number"
              placeholder="Solo números (Ej: 1155555555)"
              value={form.telefono}
              onChange={handleChange}
              className="form-input"
              maxLength={15}
            />
          </div>
          
          {/* Fecha de Nacimiento */}
          <div className="form-group">
            <label htmlFor="fechaNacimiento" className="form-label">
              Fecha de Nacimiento <span style={{ color: "red" }}>*</span>
            </label>
            <input
              id="fechaNacimiento"
              type="text"
              name="fechaNacimiento"
              placeholder="dd/mm/yyyy"
              value={form.fechaNacimiento}
              onChange={handleChange}
              className="form-input"
              maxLength={10}
              required
            />
          </div>

          {/* Campo vacío para mantener la estructura de grid si es necesario */}
          <div>{/* Espacio vacío */}</div>


          <button
            type="submit"
            className="btn-submit"
          >
            Continuar a Fase 2 (Documentación) 
          </button>
        </form>
      </div>
    </>
  );
};

export default RegistroJugador;    
