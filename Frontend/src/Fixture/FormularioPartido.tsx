// Inlined Encuentro type
type Encuentro = {
  fecha?: string;
  jornada: number;
  grupo: string;
  club1: string;
  club2: string;
  resultado: string;
};

type Props = {
  partido: Encuentro;
  onChange: (campo: keyof Encuentro, valor: string) => void;
  clubesValidos: string[];
  gruposValidos: string[];
};

const FormularioPartido: React.FC<Props> = ({ partido, onChange, clubesValidos, gruposValidos }) => (
  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 8 }}>
    <label>
      Jornada:
      <input
        name="jornada"
        type="number"
        min={1}
        value={partido.jornada}
        onChange={e => onChange("jornada", e.target.value)}
        style={{ width: 60 }}
      />
    </label>
    <label>
      Grupo:
      <select value={partido.grupo} onChange={e => onChange("grupo", e.target.value)}>
        {gruposValidos.map((g) => (
          <option key={g} value={g}>Grupo {g}</option>
        ))}
      </select>
    </label>
    <label>
      Club 1:
      <select value={partido.club1} onChange={e => onChange("club1", e.target.value)}>
        <option value="">Selecciona Club 1</option>
        {clubesValidos.map((club) => (
          <option key={club} value={club}>{club}</option>
        ))}
      </select>
    </label>
    <label>
      Club 2:
      <select value={partido.club2} onChange={e => onChange("club2", e.target.value)}>
        <option value="">Selecciona Club 2</option>
        {clubesValidos.map((club) => (
          <option key={club} value={club}>{club}</option>
        ))}
      </select>
    </label>
    <label>
      Resultado:
      <input
        name="resultado"
        placeholder="Ej: 25-21 o -"
        value={partido.resultado}
        onChange={e => onChange("resultado", e.target.value)}
        style={{ width: 80 }}
      />
    </label>
  </div>
);

export default FormularioPartido;