import { useState, useEffect } from "react";
import type { Jugador } from "../types/types";

export function useJugadores() {
  const [jugadores, setJugadores] = useState<Jugador[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("jugadores");
    if (data) setJugadores(JSON.parse(data));
  }, []);

  useEffect(() => {
    localStorage.setItem("jugadores", JSON.stringify(jugadores));
  }, [jugadores]);

  const agregar = (nuevo: Jugador) => setJugadores([nuevo, ...jugadores]);
  const actualizar = (actualizado: Jugador) =>
    setJugadores(jugadores.map(j => j.id === actualizado.id ? actualizado : j));
  const eliminar = (id: number) =>
    setJugadores(jugadores.filter(j => j.id !== id));

  return { jugadores, agregar, actualizar, eliminar };
}