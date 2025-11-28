import React, { useState } from "react";
import Login from "./Login";
import HudPrincipal from "./Menu";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // Mostrar login desde la navbar
  const handleShowLogin = () => setShowLogin(true);

  // Al iniciar sesión correctamente, volver al menú principal
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowLogin(false);
  };

  return (
    <>
      {showLogin ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <HudPrincipal
          isAuthenticated={isAuthenticated}
          onShowLogin={handleShowLogin}
        />
      )}
    </>
  );
}

export default App;