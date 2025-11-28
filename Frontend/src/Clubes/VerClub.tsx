import { useEffect, useState } from "react";
import { hasRole } from "../utils/auth"; 

const API_URL = "http://localhost:3001";

// --- CAMBIO 1: Corregir la interfaz para reflejar que localidad es un OBJETO ---
interface Club {
  id: number;
  nombre: string;
  categoria: "masculino" | "femenino";
  correo: string;
  telefono: string;
  // Antes era string, ahora es un objeto o null
  localidad: { id: number; nombre: string } | null; 
  fechaRegistro: string;
  activo: boolean;
  logoUrl?: string;
  localidadId?: number; 
}

interface Localidad {
  id: number;
  nombre: string;
}

interface ClubPayload {
  nombre?: string;
  categoria?: "masculino" | "femenino";
  correo?: string;
  telefono?: string;
  localidadId?: number; 
  fechaRegistro?: string;
  logoUrl?: string;
}

const LOCALIDADES_FIJAS: Localidad[] = [
  { id: 1, nombre: 'Bialet Masse' },
  { id: 2, nombre: 'Capilla del Monte' },
  { id: 3, nombre: 'Cosquin (cabecera)' },
  { id: 4, nombre: 'Huerta Grande' },
  { id: 5, nombre: 'La Cumbre' },
  { id: 6, nombre: 'La Falda' },
  { id: 7, nombre: 'Los Cocos' },
  { id: 8, nombre: 'San Antonio de Arredondo' },
  { id: 9, nombre: 'San Esteban' },
  { id: 10, nombre: 'Santa Maria' },
  { id: 11, nombre: 'Tanti' },
  { id: 12, nombre: 'Valle Hermoso' },
  { id: 13, nombre: 'Villa Carlos Paz' },
  { id: 14, nombre: 'Villa Giardino' },
  { id: 15, nombre: 'Villa Icho Cruz' },
  { id: 16, nombre: 'Villa Santa Cruz del Lago' },
  { id: 17, nombre: 'Cabalango' },
  { id: 18, nombre: 'Casa Grande' },
  { id: 19, nombre: 'Charbonier' },
  { id: 20, nombre: 'Cuesta Blanca' },
  { id: 21, nombre: 'Estancia Vieja' },
  { id: 22, nombre: 'Mayu Sumaj' },
  { id: 23, nombre: 'San Roque' },
  { id: 24, nombre: 'Tala Huasi' },
  { id: 25, nombre: 'Villa Parque Siquiman' },
  { id: 26, nombre: 'Malagueño' },
  { id: 27, nombre: 'Cordoba Capital' },
  { id: 28, nombre: 'Villa Saldan' }
];

export default function VerClubes() {
  const esPresidenta = hasRole([]); 

  const [clubes, setClubes] = useState<Club[]>([]);
  const [localidades, setLocalidades] = useState<Localidad[]>(LOCALIDADES_FIJAS);
  
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState<"" | "masculino" | "femenino">("");
  
  const [editando, setEditando] = useState<Club | null>(null);
  const [editandoForm, setEditandoForm] = useState<ClubPayload>({});
  const [nuevoClub, setNuevoClub] = useState<ClubPayload>({}); 
  
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/clubes`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error del servidor: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setClubes(data);
        } else {
          console.error("La API no devolvió un array:", data);
          setClubes([]);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("No se pudieron cargar los clubes.");
        setClubes([]);
      });
  }, []);

  const clubesFiltrados = clubes.filter(
    club =>
      club.activo &&
      club.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
      (categoriaFiltro ? club.categoria === categoriaFiltro : true)
  );

  function validarClub(club: ClubPayload) {
    if (!club.nombre || !club.categoria || !club.correo || !club.telefono || !club.localidadId || !club.fechaRegistro) {
      return "Todos los campos son obligatorios.";
    }
    if (!/^\S+@\S+\.\S+$/.test(club.correo)) return "Correo inválido.";
    if (!/^\d{7,}$/.test(club.telefono)) return "Teléfono inválido. Solo números, mínimo 7 dígitos.";
    const hoy = new Date().toISOString().split("T")[0];
    if (club.fechaRegistro && club.fechaRegistro > hoy) return "La fecha no puede ser posterior a hoy.";
    return "";
  }

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<ClubPayload>>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("El logo debe ser un archivo de imagen válido.");
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
        setState((prevState: ClubPayload) => ({ ...prevState, logoUrl: reader.result }));
      }
    };
    reader.readAsDataURL(file);
  };

  async function handleAddClub(e: React.FormEvent) {
    e.preventDefault();
    if (!esPresidenta) return; 

    const err = validarClub(nuevoClub);
    if (err) return setError(err);

    try {
      const res = await fetch(`${API_URL}/clubes`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ ...nuevoClub, activo: true }),
      });
      
      if (res.ok) {
        const clubCreado = await res.json();
        setClubes([...clubes, clubCreado]);
        setNuevoClub({});
        setMostrarFormulario(false);
        setError("");
      } else {
        const errData = await res.json();
        setError(errData.message || "Error al registrar el club.");
      }
    } catch (e) {
      setError("Error de conexión al registrar.");
    }
  }
  
  const handleAbrirEdicion = (club: Club) => {
    if (!esPresidenta) return;
    setEditando(club); 
    
    // --- CAMBIO 2: Obtener el ID directamente del objeto localidad ---
    const localidadId = club.localidad?.id;

    setEditandoForm({
      ...club, 
      localidadId: localidadId || undefined,
    });
    setError("");
    setMostrarFormulario(false); 
  };

  async function handleEditClub(e: React.FormEvent) {
    e.preventDefault();
    if (!editando || !esPresidenta) return;

    const err = validarClub(editandoForm);
    if (err) return setError(err);

    try {
      const res = await fetch(`${API_URL}/clubes/${editando.id}`, {
        method: "PATCH",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editandoForm),
      });
      
      if (res.ok) {
        const clubActualizado = await res.json();
        setClubes(clubes.map(c => (c.id === clubActualizado.id ? clubActualizado : c)));
        setEditando(null); 
        setEditandoForm({}); 
        setError("");
      } else {
        setError("Error al editar el club.");
      }
    } catch (e) {
      setError("Error de conexión al editar.");
    }
  }

  async function handleDeleteClub(id: number) {
    if (!esPresidenta) return;
    if (!window.confirm("¿Seguro que deseas eliminar este club?")) return;

    try {
      const res = await fetch(`${API_URL}/clubes/${id}`, { 
          method: "DELETE",
          headers: {
              "Authorization": `Bearer ${localStorage.getItem('token')}`
          }
      });
      if (res.ok) {
        setClubes(clubes.map(c => (c.id === id ? { ...c, activo: false } : c)));
      } else {
        alert("Error al eliminar el club.");
      }
    } catch (e) {
      alert("Error de conexión al eliminar.");
    }
  }

  const inputStyle = { width: "100%", padding: "0.5rem", marginBottom: "0.5rem", borderRadius: 5, border: "1px solid #ccc" };
  const btnStyle = { padding: "0.5rem 1rem", borderRadius: 5, background: "#1f3c88", color: "white", border: "none", cursor: "pointer", marginRight: "0.5rem" };
  const btnCancelStyle = { padding: "0.5rem 1rem", borderRadius: 5, background: "#aaa", color: "white", border: "none", cursor: "pointer" };
  const cardStyle = { background: "#f7f7f7", padding: "1rem", borderRadius: "8px", marginBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" };
  const logoListStyle = { width: "80px", height: "80px", objectFit: "contain", borderRadius: "4px", background: "#e0e0e0", flexShrink: 0 } as React.CSSProperties;

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto", fontFamily: "Arial, sans-serif" }}>
      <div style={{ background: "linear-gradient(90deg, #1f3c88, #3a6ea5)", color: "white", padding: "1.5rem", borderRadius: "8px", marginBottom: "1.5rem", textAlign: "center", boxShadow: "0 3px 8px rgba(0,0,0,0.2)" }}>
        <h1 style={{ margin: 0, fontSize: "2rem" }}>Gestión de Clubes</h1>
        <p style={{ margin: "0.5rem 0 0", fontSize: "1rem" }}> Administra y consulta los clubes registrados </p>
      </div>

      {error && !mostrarFormulario && !editando && (
        <div style={{ color: "red", background: "#fee", padding: "1rem", borderRadius: "8px", marginBottom: "1rem", textAlign: "center" }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", padding: "1rem", background: "#f9f9f9", borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
        <input type="text" placeholder="Buscar..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
          style={{ flex: 1, padding: "0.6rem", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <select value={categoriaFiltro} onChange={(e) => setCategoriaFiltro(e.target.value as any)}
          style={{ flex: "0.4", padding: "0.6rem", borderRadius: "5px", border: "1px solid #ccc" }}
        >
          <option value="">Todas</option>
          <option value="masculino">Masculino</option>
          <option value="femenino">Femenino</option>
        </select>
      </div>

      {clubesFiltrados.map(club => (
        <div key={club.id} style={cardStyle}>
          <img
            src={club.logoUrl || 'https://via.placeholder.com/80?text=Logo'}
            alt="Logo"
            style={logoListStyle}
          />
          <div style={{ flexGrow: 1 }}>
            <h4>{club.nombre}</h4>
            
            {/* --- CAMBIO 3: Renderizar correctamente el objeto Localidad --- */}
            <p style={{ margin: '0.2rem 0' }}> 
                {/* Accedemos a .nombre de forma segura con ? */}
                {club.localidad?.nombre || 'Sin localidad'} | {club.categoria} 
            </p>
            
            <p style={{ margin: '0.2rem 0' }}> {club.correo} | {club.telefono} </p>
            <p style={{ margin: '0.2rem 0', fontSize: '0.9rem' }}>Registrado: {club.fechaRegistro}</p>
          </div>
          
          {esPresidenta && (
            <div style={{ flexShrink: 0 }}>
                <button style={btnStyle} onClick={() => handleAbrirEdicion(club)}>
                Modificar
                </button>
                <button style={btnCancelStyle} onClick={() => handleDeleteClub(club.id)}>
                Borrar
                </button>
            </div>
          )}
        </div>
      ))}

      {esPresidenta && (
        <button style={btnStyle} onClick={() => { setMostrarFormulario(true); setEditando(null); setError(""); }}>
            Añadir Club
        </button>
      )}

      {/* Formulario Añadir */}
      {mostrarFormulario && esPresidenta && (
        <form onSubmit={handleAddClub} style={{ marginTop: "1rem", padding: "1rem", background: "#f0f0f0", borderRadius: 8 }}>
          {error && <div style={{ color: "red", marginBottom: "0.5rem" }}>{error}</div>}
          <input type="text" placeholder="Nombre" value={nuevoClub.nombre || ""} onChange={e => setNuevoClub({ ...nuevoClub, nombre: e.target.value })} style={inputStyle} required />
          <select value={nuevoClub.categoria || ""} onChange={e => setNuevoClub({ ...nuevoClub, categoria: e.target.value as any })} style={inputStyle} required>
            <option value="">Seleccionar</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
          </select>
          <input type="email" placeholder="Correo" value={nuevoClub.correo || ""} onChange={e => setNuevoClub({ ...nuevoClub, correo: e.target.value })} style={inputStyle} required />
          <input type="tel" placeholder="Teléfono" value={nuevoClub.telefono || ""} onChange={e => setNuevoClub({ ...nuevoClub, telefono: e.target.value })} style={inputStyle} required />
          
          <select
            value={nuevoClub.localidadId || ""} 
            onChange={e => setNuevoClub({
              ...nuevoClub,
              localidadId: parseInt(e.target.value) 
            })}
            style={inputStyle} required
          >
            <option value="">Seleccionar Localidad</option>
            {localidades.map(loc => <option key={loc.id} value={loc.id}>{loc.nombre}</option>)}
          </select>
          
          <input type="date" value={nuevoClub.fechaRegistro || ""} onChange={e => setNuevoClub({ ...nuevoClub, fechaRegistro: e.target.value })} style={inputStyle} required />

          <label style={{ display: 'block', margin: '0.5rem 0 0.2rem' }}>Logo del Club (Max 5MB)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, setNuevoClub)}
            style={inputStyle}
          />
          {nuevoClub.logoUrl && <img src={nuevoClub.logoUrl} alt="Preview" style={{ width: 100, height: 100, objectFit: 'contain' }} />}

          <div style={{ marginTop: "0.5rem" }}>
            <button type="submit" style={btnStyle}>Registrar</button>
            <button type="button" style={btnCancelStyle} onClick={() => setMostrarFormulario(false)}>Cancelar</button>
          </div>
        </form>
      )}

      {/* Formulario Editar */}
      {editando && esPresidenta && (
        <form onSubmit={handleEditClub} style={{ marginTop: "1rem", padding: "1rem", background: "#f0f0f0", borderRadius: 8 }}>
          {error && <div style={{ color: "red", marginBottom: "0.5rem" }}>{error}</div>}
          
          <input type="text" value={editandoForm.nombre || ""} onChange={e => setEditandoForm({ ...editandoForm, nombre: e.target.value })} style={inputStyle} required />
          <select value={editandoForm.categoria || ""} onChange={e => setEditandoForm({ ...editandoForm, categoria: e.target.value as any })} style={inputStyle} required>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
          </select>
          <input type="email" value={editandoForm.correo || ""} onChange={e => setEditandoForm({ ...editandoForm, correo: e.target.value })} style={inputStyle} required />
          <input type="tel" value={editandoForm.telefono || ""} onChange={e => setEditandoForm({ ...editandoForm, telefono: e.target.value })} style={inputStyle} required />
          
          <select
            value={editandoForm.localidadId || ""} 
            onChange={e => setEditandoForm({
              ...editandoForm,
              localidadId: parseInt(e.target.value) 
            })}
            style={inputStyle} required
          >
            <option value="">Seleccionar Localidad</option>
            {localidades.map(loc => <option key={loc.id} value={loc.id}>{loc.nombre}</option>)}
          </select>
          
          <input type="date" value={editandoForm.fechaRegistro || ""} onChange={e => setEditandoForm({ ...editandoForm, fechaRegistro: e.target.value })} style={inputStyle} required />

          <label style={{ display: 'block', margin: '0.5rem 0 0.2rem' }}>Logo del Club (Max 5MB)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, setEditandoForm)}
            style={inputStyle}
          />
          {editandoForm.logoUrl && <img src={editandoForm.logoUrl} alt="Preview" style={{ width: 100, height: 100, objectFit: 'contain' }} />}

          <div style={{ marginTop: "0.5rem" }}>
            <button type="submit" style={btnStyle}>Guardar</button>
            <button type="button" style={btnCancelStyle} onClick={() => { setEditando(null); setEditandoForm({}); }}>Cancelar</button>
          </div>
        </form>
      )}
    </div>
  );
}