import { useState } from "react";
import Login from "./Login.jsx";
import RunMenu from "./RunMenu.jsx";
import { obtenerToken, borrarToken } from "./api.js";

function App() {
    // Si ya hay un token guardado, entra directo al menú
    const [pantalla, setPantalla] = useState(
        obtenerToken() ? "menu" : "login"
    );

    // Función que Login utilizará cuando el inicio de sesión sea exitoso
    const iniciarSesion = () => {
        setPantalla("menu");
    };

    const cerrarSesion = () => {
        borrarToken();
        setPantalla("login");
    };

    return (
        <div>
            {pantalla === "login" && (
                <Login onLogin={iniciarSesion} />
            )}

            {pantalla === "menu" && (
                <RunMenu onLogout={cerrarSesion} />
            )}
        </div>
    );
}

export default App;
