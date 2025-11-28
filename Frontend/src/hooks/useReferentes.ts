import { useState, useEffect } from "react";
import type { Referente } from "../types/types";

export function useReferentes() {
  const [referentes, setReferentes] = useState<Referente[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("referentes");
    if (data) setReferentes(JSON.parse(data));
  }, []);

  useEffect(() => {
    localStorage.setItem("referentes", JSON.stringify(referentes));
  }, [referentes]);

  const agregar = (nuevo: Referente) => setReferentes([nuevo, ...referentes]);
  const actualizar = (actualizado: Referente) =>
    setReferentes(referentes.map(r => r.id === actualizado.id ? actualizado : r));
  const eliminar = (id: number) =>
    setReferentes(referentes.filter(r => r.id !== id));

  return { referentes, agregar, actualizar, eliminar };
}