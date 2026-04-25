import React, { useState, useEffect } from "react";
import { listCours } from "../../api/cours"; // On utilise la même fonction que le prof
import Icon from "../../components/ui/icon";
import { ICONS } from "../../components/ui/icons";
import { s } from "../../styles/dashboard";

function EtudiantCours() {
  const [cours, setCours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --- Consommation de l'API ---
  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await listCours();
      setCours(data);
    } catch (err) {
      setError("Impossible de charger les cours. Vérifiez votre connexion.");
      console.error(err);
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
  if (error)
    return (
      <p style={{ color: "#A32D2D", fontSize: "13px", padding: "20px" }}>
        {error}
      </p>
    );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* --- Dashboard Stats --- */}
      <div style={s.statsRow}>
        <div style={s.statCard}>
          <div style={s.statLbl}>Cours disponibles</div>
          <div style={s.statVal}>{cours.length}</div>
          <div style={s.statHint}>ce semestre</div>
        </div>
        <div style={s.statCard}>
          <div style={s.statLbl}>Format</div>
          <div style={s.statVal}>PDF</div>
          <div style={s.statHint}>Haute qualité</div>
        </div>
        <div style={s.statCard}>
          <div style={s.statLbl}>Accès</div>
          <div style={s.statVal}>Libre</div>
          <div style={s.statHint}>24h/24 & 7j/7</div>
        </div>
      </div>

      {/* --- Liste des Cours --- */}
      <div style={s.card}>
        <div style={s.secTitle}>Catalogue des cours</div>

        {cours.length === 0 ? (
          <p style={{ fontSize: "13px", color: "#bbb", padding: "10px" }}>
            Aucun cours n'a été publié par vos professeurs pour le moment.
          </p>
        ) : (
          <div style={s.coursList}>
            {cours.map((c) => (
              <div key={c.id} style={s.coursRow}>
                <div style={s.coursIcon}>
                  <Icon d={ICONS.file} color="#085041" />
                </div>

                <div style={s.coursInfo}>
                  <div style={s.coursTit}>{c.title}</div> {/* Backend: title */}
                  <div style={s.coursMeta}>{c.description}</div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#888",
                      marginTop: "4px",
                    }}
                  >
                    Par : <b>{c.instructor || "Professeur"}</b>
                  </div>
                </div>

                {/* --- Bouton de téléchargement --- */}
                <a
                  href={c.file_url}
                  download
                  target="_blank"
                  rel="noreferrer"
                  style={{ textDecoration: "none" }}
                >
                  <button
                    style={{
                      ...s.btnOutline,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 12px",
                    }}
                  >
                    <Icon d={ICONS.download} size={14} />
                    <span>Télécharger</span>
                  </button>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default EtudiantCours;
