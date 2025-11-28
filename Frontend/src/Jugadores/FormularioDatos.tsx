import React, { useState } from "react";

// Inlined Jugador type
type Jugador = {
  estado?: string;
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  club: string;
  categoria: string;
  telefono?: string;
  vencimiento?: string;
  carnetUrl?: string;
  fichaMedicaUrl?: string;
};

// Inlined validarJugador
function validarJugador(nuevo: Jugador, jugadores: Jugador[]): string | null {
  if (jugadores.some(j => j.dni === nuevo.dni && j.id !== nuevo.id)) {
    return "El DNI ingresado ya pertenece a otro jugador.";
  }

  if (nuevo.telefono && jugadores.some(j => j.telefono === nuevo.telefono && j.id !== nuevo.id)) {
    return "El teléfono ingresado ya pertenece a otro jugador.";
  }

  if (
    !nuevo.nombre.trim() ||
    !nuevo.apellido.trim() ||
    !nuevo.dni.trim() ||
    !nuevo.club.trim() ||
    !nuevo.categoria
  ) {
    return "Todos los campos son obligatorios.";
  }

  if (nuevo.nombre.trim().length < 2 || nuevo.apellido.trim().length < 2) {
    return "El nombre y apellido deben tener al menos 2 caracteres.";
    }

  if (!/^\d{7,8}$/.test(nuevo.dni)) {
    return "El DNI debe tener 7 u 8 dígitos numéricos.";
  }

  if (nuevo.telefono && !/^\d{7,15}$/.test(nuevo.telefono)) {
    return "El teléfono debe tener entre 7 y 15 dígitos numéricos.";
  }

  if (nuevo.vencimiento) {
    const fecha = new Date(nuevo.vencimiento);
    if (isNaN(fecha.getTime()) || fecha <= new Date()) {
      return "La fecha de vencimiento debe ser válida y posterior a hoy.";
    }
  }
  return null;
}

type Props = {
  jugador: Jugador;
  onGuardar: (jugador: Jugador) => void;
  onCancelar: () => void;
  jugadores?: Jugador[];
};

const FormularioDatos: React.FC<Props> = ({ jugador, onGuardar, onCancelar, jugadores = [] }) => {
  const [form, setForm] = useState<Jugador>({ ...jugador });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => { // Añadido HTMLSelectElement
    const { name, value } = e.target;
    // Permite letras y espacios en nombre/apellido
    if ((name === "nombre" || name === "apellido") && !/^[A-Za-z\s]*$/.test(value)) return;
    // Limita DNI a 8 dígitos
    if (name === "dni" && !/^\d{0,8}$/.test(value)) return;
    // Limita teléfono a 15 dígitos
    if (name === "telefono" && !/^\d{0,15}$/.test(value)) return;
      
    setForm({ ...form, [name]: value });
  };
    
  // NOTA: Asumo que en el componente padre tienes una lista de categorías válidas.
  // Aquí se usa un array simple para fines de demostración.
  const categorias = ["Infantil", "Cadete", "Juvenil", "Senior"];


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validarJugador(form, jugadores);
    if (error) {
      alert(error);
      return;
    }
    onGuardar(form);
    // No cancelamos automáticamente, ya que el componente padre (EditarJugador)
    // es quien decide si ir a la lista después de guardar.
  };

  return (
    <>
      <style>{`
        /* Importamos variables del componente padre (asumidas) */
        :root {
            --primary-blue: #1f3c88;
            --secondary-blue: #007bff;
            --accent-teal: #00bcd4;
            --bg-light-gray: #f9fafb;
            --text-dark-gray: #1f2937;
            --border-color: #e5e7eb;
            --radius: 12px;
            --transition: all 0.3s ease;
        }

        /* --- CONTENEDOR DE FORMULARIO MEJORADO --- */
        .form-container-edit {
            /* Eliminamos estilos de tarjeta duplicados, confiando en la clase 'card' del padre. */
            /* Usamos la clase form-grid si el padre la tiene, sino definimos un grid simple */
            display: flex;
            flex-direction: column;
            gap: 20px; /* Más espacio entre secciones */
            padding: 0; /* Limpiamos el padding ya que la clase 'card' lo maneja */
            background-color: transparent; /* No es una tarjeta, solo un contenedor */
        }
        
        .form-title-edit {
            margin-top: 0;
            margin-bottom: 1.5rem;
            color: var(--primary-blue);
            font-size: 1.75rem;
            font-weight: 700;
            border-bottom: 3px solid var(--accent-teal);
            padding-bottom: 0.75rem;
        }

        /* --- GRID PARA CAMPOS --- */
        .form-fields-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 25px; /* Separación horizontal y vertical */
            align-items: end; /* Asegura que todos los campos se alineen bien */
        }

        /* --- ESTILOS DE GRUPO DE CAMPO (Label + Input) --- */
        .form-group-edit {
            display: flex;
            flex-direction: column;
        }

        .form-group-edit label {
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: var(--text-dark-gray);
            font-size: 0.95rem;
        }

        /* --- ESTILOS DE INPUT/SELECT (Heredados del padre, pero refinados aquí si es necesario) --- */
        .form-container-edit input[type="text"], 
        .form-container-edit input[type="number"], 
        .form-container-edit input[type="tel"], 
        .form-container-edit input[type="date"],
        .form-container-edit select {
            width: 100%;
            padding: 0.75rem; /* Más padding interno */
            border: 1px solid var(--border-color);
            border-radius: 8px; /* Bordes más suaves */
            box-sizing: border-box;
            font-size: 1rem;
            transition: border-color 0.2s, box-shadow 0.2s;
            background-color: white;
            margin-bottom: 0; /* Reset */
        }

        .form-container-edit input:focus, 
        .form-container-edit select:focus {
            border-color: var(--accent-teal);
            outline: none;
            box-shadow: 0 0 0 3px rgba(0, 187, 212, 0.2);
        }

        /* --- GRUPO DE BOTONES --- */
        .button-group-edit {
            display: flex;
            gap: 15px;
            margin-top: 25px;
            padding-top: 15px;
            border-top: 1px solid var(--border-color); /* Separador visual */
        }

        .button-group-edit button {
            padding: 12px 25px; /* Más padding */
            border: none;
            border-radius: var(--radius);
            cursor: pointer;
            font-weight: 700;
            font-size: 1.05rem;
            transition: var(--transition);
        }

        .button-group-edit button[type="submit"] {
            background-color: var(--success-green, #10b981); /* Usamos verde para GUARDAR/ACTUALIZAR */
            color: white;
            flex-grow: 1; 
            box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.3);
        }

        .button-group-edit button[type="submit"]:hover {
            background-color: #0c9e6c;
            transform: translateY(-1px);
        }

        .button-group-edit button[type="button"] {
            background-color: #e5e7eb;
            color: var(--text-dark-gray);
            flex-grow: 0; /* El botón de cancelar no necesita estirarse tanto */
        }

        .button-group-edit button[type="button"]:hover {
            background-color: #d1d5db;
        }
      `}</style>
      
      <form onSubmit={handleSubmit} className="form-container-edit">
        <h4 className="form-title-edit"> Editar Datos del Jugador {form.id}</h4>

        <div className="form-fields-grid">
            
            {/* 1. Nombre y Apellido */}
            <div className="form-group-edit">
                <label htmlFor="nombre">Nombre</label>
                <input id="nombre" name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} type="text" />
            </div>
            <div className="form-group-edit">
                <label htmlFor="apellido">Apellido</label>
                <input id="apellido" name="apellido" placeholder="Apellido" value={form.apellido} onChange={handleChange} type="text" />
            </div>

            {/* 2. DNI y Categoría */}
            <div className="form-group-edit">
                <label htmlFor="dni">DNI</label>
                <input id="dni" name="dni" placeholder="DNI" value={form.dni} onChange={handleChange} type="tel" maxLength={8} />
            </div>
            <div className="form-group-edit">
                <label htmlFor="categoria">Categoría</label>
                <select id="categoria" name="categoria" value={form.categoria} onChange={handleChange}>
                    <option value="">Seleccione Categoría...</option>
                    {/* Renderiza opciones de categoría */}
                    {categorias.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>
            
            {/* 3. Club y Teléfono */}
            <div className="form-group-edit">
                <label htmlFor="club">Club</label>
                <input id="club" name="club" placeholder="Club" value={form.club} onChange={handleChange} type="text" />
            </div>
            <div className="form-group-edit">
                <label htmlFor="telefono">Teléfono (Opcional)</label>
                <input id="telefono" name="telefono" placeholder="Teléfono" value={form.telefono || ""} onChange={handleChange} type="tel" maxLength={15} />
            </div>
            
            {/* 4. Vencimiento (Fila separada para darle más espacio si es necesario) */}
            <div className="form-group-edit">
                <label htmlFor="vencimiento">Vencimiento Ficha Medica</label>
                {/* Aseguramos que el valor de la fecha sea una cadena vacía si es nulo, para evitar advertencias de React */}
                <input 
                    type="date" 
                    id="vencimiento" 
                    name="vencimiento" 
                    value={form.vencimiento ? form.vencimiento.split('T')[0] : ""} 
                    onChange={handleChange} 
                />
            </div>
            
            {/* Campo de estado (Podría ser un select si se manejan estados predefinidos) */}
            {/* Opcional: Agregar aquí un campo de estado si aplica */}
            
        </div>
        
        <div className="button-group-edit">
          <button type="submit"> Guardar Cambios</button>
          <button type="button" onClick={onCancelar}> Cancelar</button>
        </div>
      </form>
    </>
  );
};

export default FormularioDatos;
