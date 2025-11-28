import React, { useState } from "react";
import type { CSSProperties } from "react";
import { styles } from "./ReferentesPage";

interface Club {
  id: number;
  nombre: string;
}

interface Referente {
  id: number;
  nombre: string;
  apellido: string;
  categoria: "Masculino" | "Femenino";
  dni: string;
  correo: string;
  telefono: string; // <--- AÑADIDO
  clubId: number;
  club: Club;
}

type UpdateReferenteDto = Partial<{
  nombre: string;
  apellido: string;
  categoria: "Masculino" | "Femenino";
  dni: string;
  correo: string;
  telefono: string; // <--- AÑADIDO
  clubId: number;
}>;

type Props = {
  referente: Referente;
  clubes: Club[];
  onActualizar: (id: number, dto: UpdateReferenteDto) => void;
  onCancelar: () => void;
  error: string | null;
};

const categorias = ["Masculino", "Femenino"];

const estiloBotonBase: CSSProperties = {
  padding: "0.5rem 1rem",
  borderRadius: "5px",
  color: "white",
  border: "none",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "16px",
  transition: 'background-color 0.3s ease, transform 0.1s ease',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const estiloBotonActualizar: CSSProperties = {
  ...estiloBotonBase,
  backgroundColor: "#1f3c88",
};

const estiloBotonCancelar: CSSProperties = {
  ...estiloBotonBase,
  backgroundColor: "#ef4444",
};

const EditarReferente: React.FC<Props> = ({
  referente,
  clubes,
  onActualizar,
  onCancelar,
  error,
}) => {
  const [form, setForm] = useState<UpdateReferenteDto>({
    nombre: referente.nombre,
    apellido: referente.apellido,
    categoria: referente.categoria,
    dni: referente.dni,
    correo: referente.correo,
    telefono: referente.telefono, // <--- Cargar teléfono existente
    clubId: referente.clubId,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "clubId" ? Number(value) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onActualizar(referente.id, form);
  };

  return (
    <div style={styles.cardFormulario}>
      <h2 style={styles.formTitulo}>Editar Referente</h2>

      {error && (
        <div style={{ ...styles.mensajeAlerta, ...styles.mensajeError }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
          <input
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={handleChange}
            style={{ ...styles.inputOscuro, flex: 1, marginBottom: 0 }}
            required
          />
          <input
            name="apellido"
            placeholder="Apellido"
            value={form.apellido}
            onChange={handleChange}
            style={{ ...styles.inputOscuro, flex: 1, marginBottom: 0 }}
            required
          />
        </div>

        <select
          name="categoria"
          value={form.categoria}
          onChange={handleChange}
          style={styles.inputOscuro}
          required
        >
          {categorias.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <input
          name="dni"
          type="text"
          placeholder="DNI (sin puntos)"
          value={form.dni}
          onChange={handleChange}
          style={styles.inputOscuro}
          required
        />

        <input
          name="correo"
          type="email"
          placeholder="Correo Electrónico"
          value={form.correo}
          onChange={handleChange}
          style={styles.inputOscuro}
          required
        />

        {/* INPUT DE TELÉFONO PARA EDITAR */}
        <input
          name="telefono"
          type="tel"
          placeholder="Teléfono"
          value={form.telefono}
          onChange={handleChange}
          style={styles.inputOscuro}
          required
        />

        <select
          name="clubId"
          value={form.clubId}
          onChange={handleChange}
          style={styles.inputOscuro}
          required
        >
          <option value={0} disabled>
            — Seleccione Equipo —
          </option>
          {clubes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>

        <div style={{ display: "flex", gap: "16px", marginTop: "30px" }}>
          <button
            type="submit"
            style={{ ...estiloBotonActualizar, width: "50%", marginTop: 0 }}
          >
            Actualizar
          </button>
          <button
            type="button"
            onClick={onCancelar}
            style={{ ...estiloBotonCancelar, width: "50%" }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarReferente;