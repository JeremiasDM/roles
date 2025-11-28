import React, { useEffect, useState } from "react";
import FormularioNoticia from "./FormularioNoticia";
import NoticiasLista from "./NoticiasLista";
import CarrouselNoticias from "./CarruselNoticias";
import { hasRole } from "../utils/auth"; // 🔒 Importar

// Tipos
type Noticia = {
  id: number;
  titulo: string;
  contenido: string;
  fecha: string;
  imagenUrl?: string;
};

// Tipo para el formulario
type FormNoticia = Omit<Noticia, 'id'> & { id?: number };

// Estilos
const DARK_BLUE = "#1f3c88"; 

const styles = {
  pageContainer: {
      padding: '1.5rem', 
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '2rem', 
      backgroundColor: '#f9fafb', 
      minHeight: '100vh',
      minwidth: '400px',
      fontFamily: 'sans-serif' 
  },
  contentWrapper: {
      maxWidth: '800px', 
      margin: '0 auto', 
      width: '100%', 
  },
  mainTitle: {
    color: DARK_BLUE, 
    marginBottom: "30px",
    textAlign: "center" as const,
    fontSize: "2.5em",
    fontWeight: 600,
    borderBottom: `3px solid ${DARK_BLUE}`, 
    paddingBottom: "5px",
    margin: "0 auto 30px auto", 
    display: "block",
    width: "fit-content",
  },
  carrouselSection: {
      marginBottom: '2rem', 
      padding: '1.5rem', 
      backgroundColor: 'white', 
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', 
      borderRadius: '1rem', 
      border: '1px solid #e0e7ff', 
  },
  carrouselTitle: {
      color: DARK_BLUE, 
      marginBottom: '1.5rem', 
      textAlign: 'center' as const, 
      fontSize: '1.8em', 
      fontWeight: 600,
      borderBottom: `3px solid ${DARK_BLUE}`, 
      paddingBottom: '5px', 
      margin: '0 auto 1.5rem auto', 
      display: 'block',
      width: 'fit-content',
  },
  managementSection: {
      padding: '2rem', 
      backgroundColor: 'white', 
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', 
      borderRadius: '1.5rem', 
      border: '1px solid #d1fae5', 
      width: '100%', 
      margin: '0 auto', 
  },
  formTitle: {
      color: DARK_BLUE, 
      marginBottom: '1.5rem', 
      textAlign: 'center' as const, 
      fontSize: '1.8em', 
      fontWeight: 600,
      borderBottom: `3px solid ${DARK_BLUE}`, 
      paddingBottom: '5px', 
      margin: '0 auto 1.5rem auto', 
      display: 'block',
      width: 'fit-content',
  },
  listTitle: {
      color: DARK_BLUE, 
      marginBottom: '1.5rem', 
      textAlign: 'center' as const, 
      fontSize: '1.8em', 
      fontWeight: 600,
      borderBottom: `3px solid ${DARK_BLUE}`, 
      paddingBottom: '5px', 
      margin: '0 auto 1.5rem auto', 
      display: 'block',
      width: 'fit-content',
  },
  toggleButtonContainer: {
      display: 'flex', 
      gap: '0.5rem', 
      marginBottom: '2rem', 
      width: '100%',
      maxWidth: '800px', 
      margin: '0 auto 2rem auto', 
      justifyContent: 'center' // Centrar botones
  },
  toggleButton: {
    padding: '0.5rem 1rem', 
    borderRadius: '5px', 
    fontWeight: '600',
    cursor: 'pointer',
    border: 'none', 
    transition: 'all 0.2s',
    flex: 1, 
    minWidth: '150px',
    textAlign: 'center' as const,
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    marginRight: '0.5rem', 
  },
  activeButton: {
    backgroundColor: DARK_BLUE, 
    color: 'white', 
    border: `1px solid ${DARK_BLUE}`, 
  },
  inactiveButton: {
    backgroundColor: 'white',
    color: DARK_BLUE, 
    border: `1px solid ${DARK_BLUE}`, 
  },
};

type View = 'formulario' | 'lista' | 'novedades';
const API_URL = 'http://localhost:3001/noticias';

const NoticiasPage: React.FC = () => {
  // 🔒 Permisos
  const esPresidenta = hasRole(['presidenta']);

  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [noticiaAEditar, setNoticiaAEditar] = useState<Noticia | null>(null);
  
  // Vista por defecto: Novedades para todos, Formulario si es Presidenta (opcional)
  const [activeView, setActiveView] = useState<View>('novedades');

  useEffect(() => {
    const cargarNoticias = async () => {
      try {
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) throw new Error('Error al cargar noticias');
        const data = await respuesta.json();
        setNoticias(data);
      } catch (error) {
        console.error(error);
        alert('No se pudo conectar al servidor de noticias.');
      }
    };
    cargarNoticias();
  }, []);

  // --- CRUD CON TOKEN (Solo Presidenta debería poder llamar esto) ---
  const handleGuardar = async (nueva: FormNoticia) => {
    if (!esPresidenta) return; 

    try {
      const respuesta = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${localStorage.getItem('token')}` // 🔒 TOKEN
        },
        body: JSON.stringify(nueva),
      });

      if (!respuesta.ok) throw new Error('Error al guardar la noticia');

      const noticiaGuardada = await respuesta.json();
      setNoticias([noticiaGuardada, ...noticias]);
      setActiveView('lista');
      setNoticiaAEditar(null); 
    } catch (error) {
      console.error(error);
      alert('Error al guardar la noticia.');
    }
  };

  const handleActualizar = async (noticiaActualizada: Noticia) => {
    if (!esPresidenta) return;

    try {
      const respuesta = await fetch(`${API_URL}/${noticiaActualizada.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${localStorage.getItem('token')}` // 🔒 TOKEN
        },
        body: JSON.stringify(noticiaActualizada),
      });

      if (!respuesta.ok) throw new Error('Error al actualizar la noticia');

      const noticiaGuardada = await respuesta.json();
      setNoticias(noticias.map(n => n.id === noticiaGuardada.id ? noticiaGuardada : n));
      setNoticiaAEditar(null); 
      setActiveView('lista'); 
      alert("Noticia actualizada correctamente.");
    } catch (error) {
      console.error(error);
      alert('Error al actualizar la noticia.');
    }
  };

  const handleEliminar = async (id: number) => {
    if (!esPresidenta) return;
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta noticia?")) return;

    try {
      const respuesta = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` } // 🔒 TOKEN
      });

      if (!respuesta.ok) throw new Error('Error al eliminar la noticia');

      setNoticias(noticias.filter((n) => n.id !== id));
      if (noticiaAEditar && noticiaAEditar.id === id) {
          setNoticiaAEditar(null);
      }
    } catch (error) {
      console.error(error);
      alert('Error al eliminar la noticia.');
    }
  };

  const handleEditar = (noticia: Noticia) => {
    setNoticiaAEditar(noticia);
    setActiveView('formulario'); 
  };

  const handleVistaToggle = (view: View) => {
    if (view !== 'formulario') setNoticiaAEditar(null);
    setActiveView(view);
  };

  const handleCancelEdit = () => {
    setNoticiaAEditar(null);
    setActiveView('formulario'); 
  };

  return (
    <div style={styles.pageContainer as React.CSSProperties}>
      <div style={styles.contentWrapper}>
        <h2 style={styles.mainTitle as React.CSSProperties}>
            Portal de Noticias y Anuncios
        </h2>

        <div style={styles.toggleButtonContainer}>
            {/* Botón visible para todos */}
            <button
                onClick={() => handleVistaToggle('novedades')} 
                style={{
                    ...styles.toggleButton,
                    ...(activeView === 'novedades' ? styles.activeButton : styles.inactiveButton)
                }}
            >
                Últimas Novedades
            </button>

            {/* 🔒 Botones SOLO para Presidenta */}
            {esPresidenta && (
                <>
                    <button
                        onClick={() => handleVistaToggle('formulario')}
                        style={{
                            ...styles.toggleButton,
                            ...(activeView === 'formulario' ? styles.activeButton : styles.inactiveButton)
                        }}
                    >
                        Gestión de Noticias
                    </button>
                    <button
                        onClick={() => handleVistaToggle('lista')}
                        style={{
                            ...styles.toggleButton,
                            ...(activeView === 'lista' ? styles.activeButton : styles.inactiveButton)
                        }}
                    >
                        Ver Listado
                    </button>
                </>
            )}
        </div>

        {activeView === 'novedades' && (
          <section style={styles.carrouselSection}>
            <h3 style={styles.carrouselTitle as React.CSSProperties}>
              Últimas Novedades
            </h3>
            <CarrouselNoticias noticias={noticias} />
          </section>
        )}

        {/* 🔒 Sección de gestión solo si es Presidenta */}
        {activeView !== 'novedades' && esPresidenta && (
            <section style={styles.managementSection}> 
                
                {activeView === 'formulario' && (
                    <div>
                        <h3 style={styles.formTitle as React.CSSProperties}>
                            {noticiaAEditar ? 'Editar Noticia Existente' : 'Crear Nueva Noticia'}
                        </h3>
                        <FormularioNoticia 
                            onGuardar={handleGuardar} 
                            onActualizar={handleActualizar}
                            noticiaAEditar={noticiaAEditar}
                            onCancelEdit={handleCancelEdit}
                        />
                    </div>
                )}

                {activeView === 'lista' && (
                    <div>
                        <h3 style={styles.listTitle as React.CSSProperties}>
                            Noticias Publicadas
                        </h3>
                        <NoticiasLista 
                            noticias={noticias} 
                            onEliminar={handleEliminar} 
                            onEditar={handleEditar}
                        />
                    </div>
                )}
            </section>
        )}
      </div>
    </div>
  );
};

export default NoticiasPage;