import React, { useState, useEffect } from "react";

type Noticia = {
  id: number;
  titulo: string;
  contenido: string;
  fecha: string;
  imagenUrl?: string;
};

// La noticiaAEditar no tiene id si es nueva, pero sí si viene de la lista.
type FormNoticia = Omit<Noticia, 'id'> & { id?: number };

type Props = {
  // --- CAMBIO 1 ---
  onGuardar: (noticia: FormNoticia) => void; // Ya no espera una Noticia completa
  // --- FIN CAMBIO 1 ---
  onActualizar: (noticia: Noticia) => void; 
  noticiaAEditar: Noticia | null; 
  onCancelEdit: () => void; 
};

const DARK_BLUE = "#1f3c88"; 

// Estilos convertidos a objeto para su uso en línea
const styles = {
    formContainer: {
        display: 'flex' as React.CSSProperties['display'],
        flexDirection: 'column' as React.CSSProperties['flexDirection'],
        gap: '1rem',
    } as React.CSSProperties,
    inputGroup: {
        marginBottom: '1rem',
    } as React.CSSProperties,
    label: {
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: '500',
        color: '#4b5563',
        marginBottom: '0.25rem',
    } as React.CSSProperties,
    inputBase: {
        width: '100%',
        padding: '0.75rem',
        border: '1px solid #d1d5db',
        borderRadius: '0.5rem',
        transition: 'border-color 0.15s ease-in-out',
    } as React.CSSProperties,
    textarea: {
        width: '100%',
        padding: '0.75rem',
        border: '1px solid #d1d5db',
        borderRadius: '0.5rem',
        transition: 'border-color 0.15s ease-in-out',
    } as React.CSSProperties,
    fileInput: {
        width: '100%',
        padding: '0.75rem',
        border: '1px solid #d1d5db',
        borderRadius: '0.5rem',
    } as React.CSSProperties,
    successText: {
        marginTop: '0.5rem',
        fontSize: '0.875rem',
        color: '#059669',
    } as React.CSSProperties,
    buttonBase: { // Nuevo estilo base para botones
        padding: '0.75rem 1rem',
        fontWeight: '700',
        borderRadius: '0.5rem',
        transition: 'background-color 0.2s ease',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        cursor: 'pointer',
        border: 'none',
        width: '100%',
    } as React.CSSProperties,
    // 🚨 ESTILO MODIFICADO: USA DARK_BLUE y padding/border-radius como solicitaste
    saveButton: {
        backgroundColor: DARK_BLUE, 
        color: 'white',
        padding: '0.75rem 1rem',
        borderRadius: '5px',
    } as React.CSSProperties,
    cancelButton: {
        backgroundColor: '#ef4444', // red-500
        color: 'white',
    } as React.CSSProperties,
    buttonGroup: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '0.5rem',
        marginTop: '1.5rem', // Aumento el margen superior del grupo
    }
};


const FormularioNoticia: React.FC<Props> = ({ onGuardar, onActualizar, noticiaAEditar, onCancelEdit }) => {
  const initialState: FormNoticia = {
    titulo: "",
    contenido: "",
    fecha: "",
    imagenUrl: "",
  };

  const [form, setForm] = useState<FormNoticia>(initialState);

  // Efecto para precargar los datos si estamos editando
  useEffect(() => {
    if (noticiaAEditar) {
        setForm(noticiaAEditar);
    } else {
        setForm(initialState);
    }
  }, [noticiaAEditar]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Función para manejar la carga de archivos
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setForm({ ...form, imagenUrl: form.imagenUrl || "" }); // Mantener la URL existente si cancela
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("La imagen debe ser un archivo válido (jpg, png, etc).");
      // Limpiar input de archivo sin borrar la imagenUrl existente
      e.target.value = ''; 
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen no debe superar los 5MB.");
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setForm({ ...form, imagenUrl: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  // Función de validación de formulario
  const validateForm = (data: FormNoticia): boolean => {
    if (!data.titulo || data.titulo.length < 5) {
      alert("El título debe tener al menos 5 caracteres.");
      return false;
    }
    if (!data.contenido) {
      alert("El contenido es obligatorio.");
      return false;
    }
    if (!data.fecha) {
      alert("Debe seleccionar una fecha.");
      return false;
    }
    return true;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm(form)) return;

    // --- CAMBIO 2 ---
    if (form.id) {
        // ACTUALIZAR (Sin cambios)
        onActualizar(form as Noticia);
    } else {
        // GUARDAR NUEVA (Se elimina la creación de ID)
        onGuardar(form); // Se envía el formulario sin ID
        alert(" Noticia guardada correctamente.");
    }
    // --- FIN CAMBIO 2 ---
    
    setForm(initialState);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.formContainer}>
      <div>
        <label htmlFor="titulo" style={styles.label}>Título</label>
        <input
            id="titulo"
            type="text"
            name="titulo"
            placeholder="Título de la Noticia (Mínimo 5 caracteres)"
            value={form.titulo}
            onChange={handleChange}
            style={styles.inputBase}
            required
        />
      </div>

      <div>
        <label htmlFor="contenido" style={styles.label}>Contenido</label>
        <textarea
            id="contenido"
            name="contenido"
            placeholder="Escribe el contenido completo de la noticia aquí..."
            value={form.contenido}
            onChange={handleChange}
            rows={5}
            style={styles.textarea}
            required
        />
      </div>
      
      <div>
        <label htmlFor="fecha" style={styles.label}>Fecha de Publicación</label>
        <input
            id="fecha"
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            style={styles.inputBase}
            required
        />
      </div>
      
      <div>
        <label htmlFor="archivo" style={styles.label}>Imagen Principal (Máx 5MB)</label>
        <input 
            id="archivo"
            type="file" 
            accept="image/*" 
            onChange={handleFileUpload} 
            style={styles.fileInput}
        />
        {form.imagenUrl && (
            <p style={styles.successText}>
                {form.id ? ' Imagen actual cargada/existente' : 'Archivo cargado:'} <span style={{fontWeight: '500'}}>{(form.imagenUrl.length / 1024).toFixed(1)} KB</span>
            </p>
        )}
      </div>

      <div style={styles.buttonGroup}>
        <button 
            type="submit" 
            style={{...styles.buttonBase, ...styles.saveButton}}
        >
            {form.id ? ' Actualizar Noticia' : ' Publicar Noticia'}
        </button>
        
        {form.id && ( // Botón de cancelar solo en modo edición
            <button
                type="button"
                onClick={onCancelEdit}
                style={{...styles.buttonBase, ...styles.cancelButton}}
            >
                 Cancelar Edición
            </button>
        )}
      </div>
    </form>
  );
};

export default FormularioNoticia;
