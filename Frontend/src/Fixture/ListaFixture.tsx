import React from 'react';

// --- Tipos ---
interface Club {
  id: number;
  nombre: string;
}

interface EncuentroAPI {
  id: number;
  jornada: number;
  grupo?: string;
  fecha?: string;
  resultado: string;
  club1Id: number;
  club2Id: number;
  club1: Club;
  club2: Club;
}

interface FixtureAPI {
  id: number;
  fecha: string;
  lugar: string;
  partidos: EncuentroAPI[];
}

// --- Props del Componente ---
interface ListaFixtureProps {
  fixtures: FixtureAPI[];
  onEdit: (fixture: FixtureAPI) => void;
  canEdit: boolean; // 🔒 Nueva prop para permisos
}

const PartidoRow: React.FC<{ partido: EncuentroAPI }> = ({ partido }) => {
  const parseResultado = (resultado: string): { score1: string; score2: string } => {
    if (!resultado || resultado.trim() === "-") {
      return { score1: "-", score2: "-" };
    }
    const scores = resultado.split('-');
    if (scores.length === 2) {
      return { score1: scores[0].trim(), score2: scores[1].trim() };
    }
    return { score1: resultado, score2: "" };
  };

  const { score1, score2 } = parseResultado(partido.resultado);

  return (
    <div className="partido-row">
      <span className="team-name team-left">{partido.club1?.nombre || 'Local'}</span>
      
      <div className="score-container">
        <span className={`score score-left ${score1 > score2 ? 'winner' : ''}`}>
          {score1}
        </span>
        <span className="separator">{score2 ? ':' : 'vs'}</span>
        <span className={`score score-right ${score2 > score1 ? 'winner' : ''}`}>
          {score2}
        </span>
      </div>

      <span className="team-name team-right">{partido.club2?.nombre || 'Visitante'}</span>
    </div>
  );
};

const ListaFixture: React.FC<ListaFixtureProps> = ({ fixtures, onEdit, canEdit }) => {

  const groupPartidosByJornada = (partidos: EncuentroAPI[]) => {
    return partidos.reduce((acc, partido) => {
      const jornada = partido.jornada || 0; 
      if (!acc[jornada]) {
        acc[jornada] = [];
      }
      acc[jornada].push(partido);
      return acc;
    }, {} as { [key: number]: EncuentroAPI[] });
  };

  return (
    <>
      <style>{`
        .lista-fixture-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 1.5rem; 
        }

        .no-fixtures-message {
          text-align: center;
          color: #6c757d;
          font-size: 1.1rem;
          padding: 2rem;
          background-color: #f8f9fa;
          border-radius: 8px;
        }

        .fixture-item-card {
          background-color: #ffffff;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          overflow: hidden; 
          transition: box-shadow 0.3s ease;
        }
        
        .fixture-item-card:hover {
            box-shadow: 0 6px 16px rgba(0,0,0,0.08);
        }

        .fixture-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          background-color: #f8f9fa; 
          border-bottom: 1px solid #e0e0e0;
        }
        
        .fixture-item-info h3 {
          margin: 0;
          font-size: 1.25rem;
          color: #1f3c88; 
        }
        
        .fixture-item-info p {
          margin: 0;
          color: #6c757d; 
          font-size: 0.95rem;
        }

        .edit-button {
          padding: 0.5rem 1rem;
          background-color: #6c757d; 
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: 600;
          transition: background-color 0.2s ease;
        }
        
        .edit-button:hover {
          background-color: #5a6268;
        }

        .fixture-item-body {
          padding: 1rem 1.5rem 1.5rem 1.5rem;
        }

        .jornada-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #343a40;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #1f3c88;
        }

        .partido-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 0.5rem;
          border-bottom: 1px solid #f0f0f0;
          font-size: 1.1rem;
        }
        .partido-row:last-child {
          border-bottom: none;
        }

        .team-name {
          flex: 1; 
          font-weight: 600;
          color: #333;
        }
        .team-left {
          text-align: right;
        }
        .team-right {
          text-align: left;
        }

        .score-container {
          flex: 0 0 130px; 
          text-align: center;
          font-size: 1.3rem;
          font-weight: 700;
          color: #1f3c88;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .score {
          display: inline-block;
          width: 45px; 
        }
        .score.winner {
            color: #000; 
            transform: scale(1.1);
        }
        .score-left {
          text-align: right;
        }
        .score-right {
          text-align: left;
        }
        
        .separator {
          margin: 0 0.5rem;
          font-weight: 500;
          color: #888;
        }
      `}</style>
      
      <div className="lista-fixture-container">
        {fixtures.length === 0 && (
          <div className="no-fixtures-message">
            <p>No hay fixtures registrados por el momento.</p>
          </div>
        )}

        {fixtures.map((fixture) => {
          const jornadasAgrupadas = groupPartidosByJornada(fixture.partidos);

          return (
            <div key={fixture.id} className="fixture-item-card">
              <div className="fixture-item-header">
                <div className="fixture-item-info">
                  <h3>{fixture.lugar}</h3>
                  <p>Fecha de Evento: {new Date(fixture.fecha).toLocaleDateString()}</p>
                </div>
                
                {/* 🔒 BOTÓN PROTEGIDO: Solo visible si canEdit es true */}
                {canEdit && (
                  <button
                    className="edit-button"
                    onClick={() => onEdit(fixture)}
                  >
                    Editar
                  </button>
                )}
              </div>

              <div className="fixture-item-body">
                {Object.keys(jornadasAgrupadas).length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#6c757d' }}>
                    Este fixture no tiene partidos asignados.
                  </p>
                ) : (
                  Object.keys(jornadasAgrupadas).sort((a, b) => Number(a) - Number(b)).map((jornadaNum) => (
                    <div key={jornadaNum} className="jornada-section">
                      <h4 className="jornada-title">
                        Jornada {jornadaNum}
                      </h4>
                      {jornadasAgrupadas[Number(jornadaNum)].map((partido) => (
                        <PartidoRow key={partido.id} partido={partido} />
                      ))}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ListaFixture;