import { useState } from "react";

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState(""); // this will send correo
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    setLoading(false);

    if (data.success) {
      onLoginSuccess();
    } else {
      setError("Usuario o contraseña incorrectos.");
    }
  } catch (err) {
    console.error(err);
    setLoading(false);
    setError("Error de conexión con el servidor.");
  }
};

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        html, body, #root {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
          font-family: 'Inter', sans-serif;
          background: linear-gradient(135deg, #0B0E19 0%, #1F3C88 100%);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }
        .card {
          background-color: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 1rem;
          padding: 2rem;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        .logo {
          width: 128px;
          height: 128px;
          object-fit: contain;
          margin-bottom: 1rem;
        }
        .title {
          font-size: 1.5rem;
          font-weight: bold;
          text-align: center;
          margin: 0;
        }
        .subtitle {
          color: rgba(255,255,255,0.7);
          text-align: center;
          margin: 0.5rem 0 2rem 0;
        }
        form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        label {
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
          display: block;
        }
        input {
          width: 100%;
          padding: 0.75rem;
          border-radius: 0.5rem;
          border: 1px solid rgba(255,255,255,0.2);
          background-color: rgba(255,255,255,0.1);
          color: white;
          font-size: 1rem;
        }
        input::placeholder {
          color: rgba(255,255,255,0.5);
        }
        input:focus {
          outline: none;
          border-color: #1F3C88;
          box-shadow: 0 0 0 3px rgba(31,60,136,0.3);
        }
        .button {
          padding: 0.75rem;
          border: none;
          border-radius: 0.5rem;
          background-color: #1F3C88;
          color: white;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .button:hover:not(:disabled) {
          background-color: white;
          color: #0B0E19;
        }
        .button:disabled {
          opacity: 0.6;
          cursor: default;
        }
        .error {
          color: #ff7070;
          text-align: center;
          font-size: 0.9rem;
        }
        .links {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          margin-top: 1rem;
        }
        .link {
          font-size: 0.875rem;
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .link:hover {
          color: #1F3C88;
        }
        .register {
          font-size: 0.875rem;
          text-align: center;
        }
      `}</style>

      <div className="container">
        <div className="card">
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <img
              src="/Logo.png"
              alt="Logo"
              className="logo"
            />
            <h1 className="title">Bienvenido</h1>
            <p className="subtitle">Inicia sesión para acceder a la Pagina</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username">Usuario</label>
              <input
                id="username"
                type="text"
                placeholder="Ingresa tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
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
                required
              />
            </div>
            {error && <div className="error">{error}</div>}
            <button
              type="submit"
              className="button"
              disabled={loading}
            >
              {loading ? "Iniciando..." : "Iniciar Sesión"}
            </button>
          </form>

          <div className="links">
            <a href="#" className="link">
              ¿Olvidaste tu contraseña?
            </a>
            <p className="register">
              <span style={{ color: "rgba(255,255,255,0.7)" }}>¿No tienes una cuenta?</span>{" "}
              <a href="#" className="link">Regístrate aquí</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}