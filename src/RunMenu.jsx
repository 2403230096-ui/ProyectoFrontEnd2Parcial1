import { useState, useEffect } from "react";
import { obtenerPartidas, crearPartida } from "./api.js";

function RunMenu({ onLogout }) {
    // 1. Estados: partidas guardadas en la base de datos
    const [partidas, setPartidas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [mostrarRegistros, setMostrarRegistros] = useState(false);
    const [creando, setCreando] = useState(false);
    const [nombre, setNombre] = useState("");
    const [juego, setJuego] = useState("oot");

    // Ya no es un valor simulado: depende de lo que haya en la BD
    const safeRunOn = partidas.length > 0;

    // 2. Cargar partidas al abrir el menú (GET /api/partidas/)
    useEffect(() => {
        obtenerPartidas()
            .then(setPartidas)
            .catch((e) => {
                setError(e.message);
                if (e.message === "Sesión expirada") onLogout();
            })
            .finally(() => setCargando(false));
    }, [onLogout]);

    // 3. Funciones para cada botón
    const startNewRun = async () => {
        if (nombre.trim() === "") {
            setError("Escribe un nombre para la partida");
            return;
        }
        try {
            setError("");
            const nueva = await crearPartida(nombre.trim(), juego);
            setPartidas([nueva, ...partidas]);
            setNombre("");
            setCreando(false);
        } catch (e) {
            setError(e.message);
        }
    };

    const continueRun = () => {
        const ultima = partidas[0]; // el backend las ordena por última actualización
        console.log("Continuar partida:", ultima);
    };

    const seeRecord = () => {
        setMostrarRegistros(!mostrarRegistros);
    };

    if (cargando) return <p>Cargando...</p>;

    return (
        <div>
            <h2>¿Qué quieres hacer?</h2>

            <div>
                {/* Nueva partida */}
                <button onClick={() => setCreando(!creando)}>
                    Iniciar nueva partida
                </button>

                {/* Continuar partida */}
                <button
                    onClick={continueRun}
                    disabled={!safeRunOn}
                >
                    Continuar partida
                </button>

                {/* Ver registros */}
                <button onClick={seeRecord}>
                    Ver registros
                </button>

                <button onClick={onLogout}>
                    Cerrar sesión
                </button>
            </div>

            {/* Formulario de nueva partida */}
            {creando && (
                <div>
                    <input
                        type="text"
                        placeholder="Nombre de la partida"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                    <select value={juego} onChange={(e) => setJuego(e.target.value)}>
                        <option value="ss">Skyward Sword</option>
                    </select>
                    <button onClick={startNewRun}>Crear</button>
                </div>
            )}

            {/* Mensaje para saber por qué está deshabilitado */}
            {!safeRunOn && (
                <p>No hay ninguna partida guardada.</p>
            )}

            {/* Lista de registros */}
            {mostrarRegistros && (
                <ul>
                    {partidas.map((p) => (
                        <li key={p.id}>
                            {p.nombre} — {p.juego === "oot" ? "Ocarina of Time" : "Skyward Sword"}
                        </li>
                    ))}
                </ul>
            )}

            {error && <p>{error}</p>}
        </div>
    );
}

export default RunMenu;
