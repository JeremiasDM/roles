import React from "react";

type Noticia = {
  id: number;
  titulo: string;
  contenido: string;
  fecha: string;
  imagenUrl?: string;
};

type Props = {
  noticias: Noticia[];
};

// Estilos convertidos a objeto para su uso en línea
const styles = {
    carrouselContainer: {
        display: 'flex' as const,
        overflowX: 'auto' as const,
        gap: '1.5rem', 
        paddingTop: '1rem', 
        paddingBottom: '1rem', 
        paddingLeft: '0.5rem', 
        paddingRight: '0.5rem', 
        marginRight: '-0.5rem',
        marginLeft: '-0.5rem',
        // Añadir estilos de scroll si lo deseas
    },
    card: {
        minWidth: '280px',
        maxWidth: '280px',
        backgroundColor: '#fff',
        borderRadius: '0.75rem', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)', 
        transition: 'all 0.3s ease',
        overflow: 'hidden',
        border: '1px solid #e5e7eb', 
        cursor: 'pointer',
        flexShrink: 0, // Importante para el carrusel
    },
    image: {
        width: '100%',
        height: '10rem', 
        objectFit: 'cover' as const,
    },
    noImage: {
        width: '100%',
        height: '10rem', 
        backgroundColor: '#eef2ff', 
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        borderTopLeftRadius: '0.75rem',
        borderTopRightRadius: '0.75rem',
        color: '#4f46e5', 
        fontWeight: '600',
    },
    cardContent: {
        padding: '1rem', 
    },
    title: {
        marginTop: '0.25rem', 
        fontSize: '1.125rem', 
        fontWeight: '800', 
        color: '#111827', 
        lineHeight: '1.375',
        overflow: 'hidden',
        whiteSpace: 'nowrap' as const,
        textOverflow: 'ellipsis', 
    },
    date: {
        fontSize: '0.75rem', 
        color: '#6366f1', 
        fontWeight: '500', 
        marginTop: '0.25rem', 
    },
    content: {
        fontSize: '0.875rem', 
        color: '#4b5563', 
        marginTop: '0.5rem', 
        display: '-webkit-box',
        WebkitLineClamp: 3, 
        WebkitBoxOrient: 'vertical' as const,
        overflow: 'hidden',
    }
};

const CarrouselNoticias: React.FC<Props> = ({ noticias }) => {
  if (noticias.length === 0) return <p style={{ padding: '1rem', color: '#6b7280', fontStyle: 'italic' }}>No hay noticias recientes para mostrar en el carrusel.</p>;

  // Obtener y ordenar las últimas 5 noticias por fecha
  const ultimas = [...noticias]
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 5);

  return (
    <div style={styles.carrouselContainer}>
      {ultimas.map((n) => (
        <div 
            key={n.id} 
            style={styles.card}
        >
          {n.imagenUrl ? (
            <img 
                src={n.imagenUrl} 
                alt={n.titulo} 
                style={styles.image} 
            />
          ) : (
            <div style={styles.noImage}>
               [Imagen de Placeholder de Noticia]
            </div>
          )}
          <div style={styles.cardContent}>
            <p style={styles.date}>
                {new Date(n.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
            <h4 style={styles.title}>{n.titulo}</h4>
            <p style={styles.content}>
                {n.contenido}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CarrouselNoticias;
