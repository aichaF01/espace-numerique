import React, { useState } from 'react'
// ---------------icons------------------
import Icon from '../../components/ui/icon';
import { ICONS } from '../../components/ui/icons';

import {s} from "../../styles/dashboard"

function ProfCours() {
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
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   listCours().then(setCours).finally(() => setLoading(false));
  // }, []);

  if (loading) return <p style={{ color:'#999', fontSize:'13px' }}>Chargement...</p>;

  return (
    <div style={s.card}>
      <div style={s.secTitle}>Cours publiés</div>
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
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}

export default ProfCours