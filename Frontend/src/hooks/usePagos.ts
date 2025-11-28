import { useState, useEffect } from "react";
import type { Pago } from "../types/types";

export function usePagos() {
  const [pagos, setPagos] = useState<Pago[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("pagos");
    if (data) setPagos(JSON.parse(data));
  }, []);

  useEffect(() => {
    localStorage.setItem("pagos", JSON.stringify(pagos));
  }, [pagos]);

  const agregar = (nuevo: Pago) => setPagos([nuevo, ...pagos]);
  const actualizar = (actualizado: Pago) =>
    setPagos(pagos.map(p => p.id === actualizado.id ? actualizado : p));
  const eliminar = (id: number) =>
    setPagos(pagos.filter(p => p.id !== id));

  return { pagos, agregar, actualizar, eliminar };
}