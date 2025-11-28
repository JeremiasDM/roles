import React, { useState } from "react";

// --- Interfaz de Props ---
interface LoginModalProps {
  onLoginSuccess: () => void;
  onClose: () => void;
}

// --- Componente ---
export default function LoginModal({ onLoginSuccess, onClose }: LoginModalProps) {
  // Estado para controlar la vista actual del modal
  const [view, setView] = useState<'login' | 'forgot' | 'sent'>('login');
  
  // Estados para los formularios
  const [username, setUsername] = useState(""); // Se usa para login (correo) y para email de recuperación
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // URL del Backend (puedes mover esto a una variable de entorno después)
  const API_URL = "http://localhost:3001";

  /**
   * Valida un string de email.
   */
  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  /**
   * Maneja el envío del formulario de Login.
   */
  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Limpia errores previos

    // --- Validación de Login ---
    if (!username || !password) {
      setError("El usuario y la contraseña son obligatorios.");
      return;
    }

    setLoading(true);

    try {
      // 1. Llamada real al Backend
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // El backend espera 'correo', pero el estado se llama 'username'
        body: JSON.stringify({ correo: username, password: password }), 
      });

      const data = await response.json();

      if (!response.ok) {
        // Si el backend devuelve error (ej: 401 Unauthorized)
        throw new Error(data.message || "Credenciales incorrectas.");
      }

      // 2. Guardar Token y Usuario en LocalStorage
      // Esto permite que la sesión persista si recargas la página
      localStorage.setItem("token", data.access_token);
      if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
      }

      setLoading(false);
      onLoginSuccess(); // Cierra el modal y actualiza el estado 'isLoggedIn' del padre

    } catch (err) {
      setLoading(false);
      setError((err as Error).message);
    }
  };

  /**
   * Maneja el envío del formulario de Recuperación.
   */
  const handleSubmitForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Limpia errores previos

    // --- Validación de Email ---
    if (!username) {
      setError("El email es obligatorio.");
      return;
    }
    if (!validateEmail(username)) {
      setError("Por favor, ingresa un formato de email válido.");
      return;
    }

    setLoading(true);

    try {
      // Llamada al endpoint de recuperación (si ya lo tienes implementado)
      // Si aún no tienes este endpoint, puedes dejar el setTimeout para simularlo
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ email: username }),
      });

      // Nota: Por seguridad, algunos backends siempre devuelven OK aunque el email no exista
      if (!response.ok) {
         const data = await response.json();
         throw new Error(data.message || "Error al procesar la solicitud.");
      }
      
      setLoading(false);
      // Cambia a la vista de "email enviado"
      setView('sent');

    } catch (err) {
      setLoading(false);
      // Puedes decidir mostrar el error o un mensaje genérico
      setError((err as Error).message);
    }
  };

  /**
   * Detiene la propagación para que al hacer clic en el modal no se cierre.
   */
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  /**
   * Cambia de vista y limpia los errores.
   */
  const changeView = (newView: 'login' | 'forgot') => {
    setView(newView);
    setError("");
  };

  return (
    <>
      {/* --- ESTILOS DEL MODAL --- */}
      <style>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-card {
          background-color: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 1rem;
          padding: 2rem;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          color: white;
          position: relative;
          animation: slideIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          transform: translateY(-20px);
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .modal-close-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          opacity: 0.7;
          transition: opacity 0.2s ease;
        }
        .modal-close-btn:hover {
          opacity: 1;
        }

        /* Estilos de formulario */
        .logo { width: 100px; height: 100px; object-fit: contain; margin-bottom: 1rem; }
        .title { font-size: 1.5rem; font-weight: bold; text-align: center; margin: 0; }
        .subtitle { color: rgba(255,255,255,0.7); text-align: center; margin: 0.5rem 0 2rem 0; }
        .modal-card form { display: flex; flex-direction: column; gap: 1rem; }
        .modal-card label { font-size: 0.875rem; font-weight: 500; margin-bottom: 0.25rem; display: block; }
        .modal-card input {
          width: 100%;
          padding: 0.75rem;
          border-radius: 0.5rem;
          border: 1px solid rgba(255,255,255,0.2);
          background-color: rgba(255,255,255,0.1);
          color: white;
          font-size: 1rem;
        }
        .modal-card input::placeholder { color: rgba(255,255,255,0.5); }
        .modal-card .button {
          padding: 0.75rem;
          border: none;
          border-radius: 0.5rem;
          background-color: #1F3C88;
          color: white;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 0.5rem;
        }
        .modal-card .button:hover:not(:disabled) { background-color: white; color: #0B0E19; }
        .modal-card .button:disabled { opacity: 0.6; cursor: default; }
        .modal-card .error { 
          color: #ff7070; 
          background-color: rgba(255, 112, 112, 0.1);
          text-align: center; 
          font-size: 0.9rem; 
          padding: 0.75rem;
          border-radius: 0.5rem;
          border: 1px solid #ff7070;
        }
        .modal-card .link { font-size: 0.875rem; color: rgba(255,255,255,0.7); text-decoration: none; transition: color 0.2s ease; cursor: pointer; }
        .modal-card .link:hover { color: white; text-decoration: underline; }
      `}</style>

      {/* --- Fondo del Modal (Backdrop) --- */}
      <div className="modal-backdrop" onClick={onClose}>
        
        {/* --- Contenedor del Modal --- */}
        <div className="modal-card" onClick={handleModalClick}>
          <button className="modal-close-btn" onClick={onClose}>&times;</button>
          
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <img src="/Logo.png" alt="Logo" className="logo" />
          </div>

          {/* --- VISTA DE LOGIN --- */}
          {view === 'login' && (
            <>
              <h1 className="title">Iniciar Sesión</h1>
              <p className="subtitle">Accede al panel de gestión</p>
              
              <form onSubmit={handleSubmitLogin}>
                <div>
                  <label htmlFor="username">Usuario</label>
                  <input
                    id="username"
                    type="text"
                    placeholder="Ingresa tu usuario (email)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="password">Contraseña</label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                
                {error && <div className="error">{error}</div>}
                
                <button type="submit" className="button" disabled={loading}>
                  {loading ? "Iniciando..." : "Iniciar Sesión"}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <a className="link" onClick={() => changeView('forgot')}>
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </>
          )}

          {/* --- VISTA DE "OLVIDÉ CONTRASEÑA" --- */}
          {view === 'forgot' && (
            <>
              <h1 className="title">Recuperar Contraseña</h1>
              <p className="subtitle">Ingresa tu email y te enviaremos un enlace de recuperación.</p>
              
              <form onSubmit={handleSubmitForgot}>
                <div>
                  <label htmlFor="email">Email (Usuario)</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Ingresa tu email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                
                {error && <div className="error">{error}</div>}
                
                <button type="submit" className="button" disabled={loading}>
                  {loading ? "Enviando..." : "Enviar Email"}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <a className="link" onClick={() => changeView('login')}>
                  Volver a Iniciar Sesión
                </a>
              </div>
            </>
          )}

          {/* --- VISTA DE "EMAIL ENVIADO" --- */}
          {view === 'sent' && (
            <div style={{ textAlign: 'center' }}>
              <h1 className="title">Revisa tu Email</h1>
              <p className="subtitle" style={{ color: 'white', margin: '1rem 0', lineHeight: 1.5 }}>
                Si el email <strong style={{ color: '#a0c4ff' }}>{username}</strong> está registrado,
                recibirás un enlace para reestablecer tu contraseña.
              </p>
              <button className="button" onClick={onClose}>
                Entendido
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}