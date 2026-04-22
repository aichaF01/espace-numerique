import {React, useState, useEffect} from 'react'
// ---------------icons------------------
import Icon from '../../components/ui/icon';
import { ICONS } from '../../components/ui/icons';

import {s} from "../../styles/dashboard"

function EtudiantCours() {
  const [cours, setCours]   = useState([
      {
      id: 1,
      titre: "Docker pour débutants",
      description: "Introduction aux conteneurs",
    },
    {
      id: 2,
      titre: "React avancé",
      description: "Hooks et optimisation",
    },
    {
      id: 3,
      titre: "DevOps",
      description: "CI/CD et GitHub Actions",
    },
  ]);
  // make it true when you test the api
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  // useEffect(() => {
  //   listCours()
  //     .then(setCours)
  //     .catch(() => setError('Impossible de charger les cours.'))
  //     .finally(() => setLoading(false));
  // }, []);

  if (loading) return <p style={{ color:'#999', fontSize:'13px' }}>Chargement des cours...</p>;
  if (error)   return <p style={{ color:'#A32D2D', fontSize:'13px' }}>{error}</p>;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'24px' }}>
      <div style={s.statsRow}>
        <div style={s.statCard}><div style={s.statLbl}>Cours disponibles</div><div style={s.statVal}>{cours.length}</div><div style={s.statHint}>ce semestre</div></div>
        <div style={s.statCard}><div style={s.statLbl}>Format</div><div style={s.statVal} >PDF</div><div style={s.statHint}>uniquement</div></div>
        <div style={s.statCard}><div style={s.statLbl}>Accès</div><div style={s.statVal}>24/7</div><div style={s.statHint}>en ligne</div></div>
      </div>

      <div style={s.card}>
        <div style={s.secTitle}>Cours disponibles</div>
        {cours.length === 0
          ? <p style={{ fontSize:'13px', color:'#bbb' }}>Aucun cours publié pour le moment.</p>
          : (
            <div style={s.coursList}>
              {cours.map((c) => (
                <div key={c.id} style={s.coursRow}>
                  <div style={s.coursIcon}><Icon d={ICONS.file} /></div>
                  <div style={s.coursInfo}>
                    <div style={s.coursTit}>{c.titre}</div>
                    <div style={s.coursMeta}>{c.description}</div>
                  </div>
                  <a href={c.download_url} target="_blank" rel="noreferrer">
                    <button style={s.btnOutline}>
                      <Icon d={ICONS.download} size={13} /> Télécharger
                    </button>
                  </a>
                </div>
              ))}
            </div>
          )
        }
      </div>
    </div>
  );
}

export default EtudiantCours