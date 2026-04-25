import React, { useEffect, useState } from "react";
// ---------------icons------------------
import Icon from "../../components/ui/icon";
import { ICONS } from "../../components/ui/icons";

import { s } from "../../styles/dashboard";
import { listCours } from "../../api/cours";
import { useNavigate } from 'react-router-dom';

function ProfCours() {
  const navigate = useNavigate();
  const [cours, setCours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await listCours();
      setCours(data);
    } catch (err) {
      console.error("Erreur chargement cours:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <p style={{ color: "#999", fontSize: "13px", padding: "20px" }}>
        Chargement des cours...
      </p>
    );

  return (
    <div style={s.card}>
      <div style={s.secTitle}>Mes cours publiés</div>

      {cours.length === 0 ? (
        <p style={{ fontSize: "13px", color: "#bbb", padding: "10px" }}>
          Aucun cours publié pour le moment.
        </p>
      ) : (
        <div style={s.coursList}>
          {cours.map((c) => (
            <div key={c.id} style={s.coursRow}>
              <div style={s.coursIcon}>
                <Icon d={ICONS.file} color="#085041" />
              </div>
              <div style={s.coursInfo}>
                <div style={s.coursTit}>{c.title}</div>
                <div style={s.coursMeta}>{c.description}</div>
              </div>

              {/* --- ACTIONS --- */}
              <div style={{ display: "flex", gap: "8px" }}>
                <a
                  href={c.file_url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    ...s.btnPrimary,
                    padding: "6px 10px",
                    backgroundColor: "#eee",
                    color: "#333",
                  }}
                >
                  <Icon d={ICONS.eye || ICONS.file} size={14} />
                </a>

                {/* Bouton Update (on passera l'objet complet au formulaire plus tard) */}
                <button
                  style={{ ...s.btnPrimary, padding: "6px 10px" }}
                  onClick={() => navigate(`edit/${c.id}`)} // On navigue vers la page edit
                >
                  <Icon d={ICONS.edit} size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProfCours;
