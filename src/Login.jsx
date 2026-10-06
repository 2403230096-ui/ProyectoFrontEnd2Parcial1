import { useState } from 'react'
import { login, guardarToken } from './api.js'

function Login({onLogin}) {
    const[user, setUser] = useState("");
    const[password, setPassword] = useState("");
    const[errorUser, setErrorUser] = useState("");
    const[errorPassword, setErrorPassword] = useState("");
    const[errorApi, setErrorApi] = useState("");
    const[cargando, setCargando] = useState(false);

    const validarFormulario = async () => {
        let valido = true;

        setErrorUser("");
        setErrorPassword("");
        setErrorApi("");

        if (user.trim() === ""){
            setErrorUser("El usuario es obligatorio");
            valido = false;
        }

        if (password.trim() === ""){
            setErrorPassword("La contraseña es obligatoria");
            valido = false;
        }

        if (!valido) return;

        // Validación del lado del servidor (Django)
        setCargando(true);
        try {
            const datos = await login(user.trim(), password);
            guardarToken(datos.token);
            onLogin();
        } catch (error) {
            setErrorApi(error.message);
        } finally {
            setCargando(false);
        }
    }

    return (
        <div>
            <h2>Iniciar sesión</h2>

            {/* Input de usuario */}
            <input
                type="text"
                placeholder="User"
                value={user}
                onChange={(e) => setUser(e.target.value)}
            />

            {/* Mensaje de error del usuario */}
            {errorUser && (
                <p>{errorUser}</p>
            )}

            {/* Input de contraseña */}
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            {/* Mensaje de error de contraseña */}
            {errorPassword && (
                <p>{errorPassword}</p>
            )}

            {/* Error devuelto por el backend (credenciales incorrectas, servidor caído...) */}
            {errorApi && (
                <p>{errorApi}</p>
            )}

            <button onClick={validarFormulario} disabled={cargando}>
                {cargando ? "Entrando..." : "Iniciar sesión"}
            </button>
        </div>
    )
};

export default Login;
