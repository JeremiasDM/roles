import React from "react";
// (Pega las interfaces EncuentroAPI, Club aquí)
// ...

type Props = { partido: EncuentroAPI }; // Recibe el tipo de la API

const PartidoItem: React.FC<Props> = ({ partido }) => (
  <li style={{ marginBottom: 4, fontSize: '0.9em' }}>
    <strong>J{partido.jornada}</strong> {partido.grupo ? `| G.${partido.grupo}` : ''} |
    {/* --- CAMBIO: Mostrar nombres de clubes --- */}
    <span style={{fontWeight: 500}}> {partido.club1?.nombre || 'Club Local ?'}</span> vs
    <span style={{fontWeight: 500}}> {partido.club2?.nombre || 'Club Visit. ?'}</span>
    <span style={{ color: "#1F3C88", marginLeft: '5px' }}>({partido.resultado})</span>
    {partido.fecha && <span style={{fontSize: '0.8em', color: '#777', marginLeft: '5px'}}>[{partido.fecha}]</span>}
  </li>
);

export default PartidoItem;