import React, { useState } from "react";
import { styles } from "./ReferentesPage";
import type { CSSProperties } from "react";

interface Club {
  id: number;
  nombre: string;
}

interface CreateReferenteDto {
  nombre: string;
  apellido: string;
  categoria: "Masculino" | "Femenino";
  dni: string;
  correo: string;
  telefono: string; // <--- AÑADIDO
  clubId: number;
}

type Props = {
  onGuardar: (dto: CreateReferenteDto) => void;
  clubes: Club[];
};

const categorias = ["Masculino", "Femenino"];

const estiloBotonGuardar: CSSProperties = {
    padding: "0.5rem 1rem",
    borderRadius: "5px",
    backgroundColor: "#1f3c88",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "16px",
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: "100%",
    marginTop: "20px",
    transition: 'background-color 0.3s ease',
};

const RegistrarReferente: React.FC<Props> = ({ onGuardar, clubes }) => {
  const [form, setForm] = useState<CreateReferenteDto>({
    nombre: "",
    apellido: "",
    categoria: "Masculino",
    dni: "",
    correo: "",
    telefono: "", // <--- Inicializado
    clubId: 0,
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
    onGuardar(form);
    
    // Limpiar formulario
    setForm({
      nombre: "",
      apellido: "",
      categoria: "Masculino",
      dni: "",
      correo: "",
      telefono: "", // <--- Limpiar también teléfono
      clubId: 0,
    });
  };

  return (
    <div>
      <h2 style={styles.formTitulo}>Registro de Referente</h2>

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

        {/* INPUT DE TELÉFONO OBLIGATORIO */}
        <input
          name="telefono"
          type="tel"
          placeholder="Teléfono (mínimo 7 números)"
          value={form.telefono}
          onChange={handleChange}
          style={styles.inputOscuro}
          required // <--- Obligatorio
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

        <button type="submit" style={estiloBotonGuardar}>
          Guardar Referente
        </button>
      </form>
    </div>
  );
};

export default RegistrarReferente;