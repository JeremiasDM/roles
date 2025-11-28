import React, { useState } from "react";

// Definición local para evitar conflicto de imports
interface Club { id: number; nombre: string; }
interface Jugador {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  clubId: number;
  club: Club;
  categoria: string;
  telefono?: string;
  vencimiento?: string;
  estado?: string;
}

type Props = {
  jugador: Jugador;
  onActualizar: (id: number, dto: Partial<any>) => void;
  onCancelar: () => void;
  jugadores: Jugador[];
  clubes: Club[];
};

const EditarJugador: React.FC<Props> = ({
  jugador,
  onActualizar,
  onCancelar,
  jugadores,
  clubes,
}) => {
  const [form, setForm] = useState({
    nombre: jugador.nombre,
    apellido: jugador.apellido,
    dni: jugador.dni,
    clubId: jugador.clubId,
    categoria: jugador.categoria,
    telefono: jugador.telefono || "",
    vencimiento: jugador.vencimiento ? jugador.vencimiento.split('T')[0] : "",
    estado: jugador.estado || "activo",
  });
  
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setError(null);
    setForm({ ...form, [name]: name === "clubId" ? Number(value) : value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.apellido || !form.dni || !form.clubId) {
      setError("Campos obligatorios faltantes.");
      return;
    }
    const updateDto = { ...form, vencimiento: form.vencimiento || null };
    onActualizar(jugador.id, updateDto);
  };

  return (
    <>
      <style>{/* ... TUS ESTILOS CSS PREVIOS (EditarJugador) ... */}</style>
      <form onSubmit={handleSubmit}>
        <h2 className="edit-title">Editando a {jugador.nombre}</h2>
        {error && <div className="error-message-edit">{error}</div>}
        
        <div className="edit-form-grid">
            {/* Inputs... (Mismos que tu archivo original, omitidos por brevedad pero deben estar) */}
            <div className="form-group-edit">
                <label className="form-label-edit">Nombre</label>
                <input name="nombre" value={form.nombre} onChange={handleChange} className="form-input-edit" />
            </div>
            {/* ... Resto de inputs (Apellido, DNI, Club, etc) ... */}
             <div className="form-group-edit">
                <label className="form-label-edit">Club</label>
                <select name="clubId" value={form.clubId} onChange={handleChange} className="form-select-edit">
                    {clubes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
            </div>
        </div>

        <div className="button-group-edit">
          <button type="submit" className="btn-action btn-update">Actualizar</button>
          <button type="button" onClick={onCancelar} className="btn-action btn-cancel">Cancelar</button>
        </div>
      </form>
    </>
  );
};

export default EditarJugador;