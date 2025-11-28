import React, { useState } from "react";

// Props simplificadas
type Props = {
  jugadorInfo: { nombre: string; apellido: string };
  onGuardar: (docs: { carnetUrl?: string; fichaMedicaUrl?: string; vencimientoFichaMedica?: string }) => void;
  onCancelar: () => void;
};

const FormularioDocumentacion: React.FC<Props> = ({
  jugadorInfo,
  onGuardar,
  onCancelar,
}) => {
  const [carnet, setCarnet] = useState<string | undefined>(undefined);
  const [fichaMedica, setFichaMedica] = useState<string | undefined>(undefined);
  const [vencimientoFichaMedica, setVencimientoFichaMedica] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleFechaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valorLimpio = e.target.value.replace(/\D/g, '');
    if (valorLimpio.length > 8) valorLimpio = valorLimpio.slice(0, 8);
    let valorFormateado = '';
    for (let i = 0; i < valorLimpio.length; i++) {
      if (i === 2 || i === 4) valorFormateado += '/';
      valorFormateado += valorLimpio[i];
    }
    setVencimientoFichaMedica(valorFormateado);
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    tipo: "carnet" | "ficha",
  ) => {
    const file = e.target.files?.[0];
    setError(null);
    if (!file) return;

    if (tipo === "carnet" && !file.type.startsWith("image/")) {
      setError("El carnet debe ser una imagen (jpg, png).");
      return;
    }
    if (tipo === "ficha" && file.type !== "application/pdf") {
      setError("La ficha médica debe ser un archivo PDF.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("El archivo no puede superar los 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        if (tipo === "carnet") setCarnet(reader.result);
        if (tipo === "ficha") setFichaMedica(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    onGuardar({ carnetUrl: carnet, fichaMedicaUrl: fichaMedica, vencimientoFichaMedica: vencimientoFichaMedica || undefined });
  };

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">
        Paso 2: Documentación de {jugadorInfo.nombre} {jugadorInfo.apellido}
      </h2>
      {error && <div style={{ color: "red", textAlign: "center", marginBottom: "1rem" }}>{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Carnet (Imagen, max 5MB):</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, "carnet")}
            className="w-full p-2 border rounded"
          />
          {carnet && (
            <img
              src={carnet}
              alt="Carnet"
              style={{ maxWidth: 200, marginTop: 10, borderRadius: '8px' }}
            />
          )}
        </div>

        <div>
          <label className="block font-semibold">Ficha Médica (PDF, max 5MB):</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => handleFileUpload(e, "ficha")}
            className="w-full p-2 border rounded"
          />
          {fichaMedica && (
            <a
              href={fichaMedica}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Ver ficha médica cargada
            </a>
          )}
        </div>

        <div>
          <label className="block font-semibold">Vencimiento Ficha Médica:</label>
          <input
            type="text"
            placeholder="dd/mm/yyyy"
            value={vencimientoFichaMedica}
            onChange={handleFechaChange}
            maxLength={10}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="flex gap-2 mt-4">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-1/2"
          >
            Finalizar Registro
          </button>
          <button
            type="button"
            onClick={onCancelar}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 w-1/2"
          >
            Atrás
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioDocumentacion;