// Dirección del backend Django. Se puede cambiar con un archivo .env:
//   VITE_API_URL=http://localhost:8000/api
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

export const obtenerToken = () => localStorage.getItem("token");
export const guardarToken = (token) => localStorage.setItem("token", token);
export const borrarToken = () => localStorage.removeItem("token");

// Función base: agrega el token y convierte los errores en excepciones
async function peticion(ruta, opciones = {}) {
    const token = obtenerToken();

    const respuesta = await fetch(`${API_URL}${ruta}`, {
        ...opciones,
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Token ${token}` }),
        },
    });

    if (respuesta.status === 401) {
        borrarToken(); // token inválido o vencido
        throw new Error("Sesión expirada");
    }

    if (!respuesta.ok) {
        const datos = await respuesta.json().catch(() => ({}));
        throw new Error(
            datos.non_field_errors?.[0] ?? "Error al comunicarse con el servidor"
        );
    }

    return respuesta.status === 204 ? null : respuesta.json();
}

// --- Endpoints ---
export const login = (username, password) =>
    peticion("/login/", {
        method: "POST",
        body: JSON.stringify({ username, password }),
    });

export const obtenerPartidas = () => peticion("/partidas/");

export const crearPartida = (nombre, juego = "oot") =>
    peticion("/partidas/", {
        method: "POST",
        body: JSON.stringify({ nombre, juego }),
    });
