import React, { use, useState } from "react";
import { createCours } from "../../api/cours";
import Icon from "../../components/ui/icon";
import { ICONS } from "../../components/ui/icons";
import { s } from "../../styles/dashboard";
import { uploadFile } from "../../api/upload";
import { useNavigate } from "react-router-dom";

function ProfUpload() {
  const navigate = useNavigate();
  const [titre, setTitre] = useState("");
  const [desc, setDesc] = useState("");
  const [fichier, setFichier] = useState(null);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!titre || !fichier) {
      setError("Titre et fichier sont obligatoires.");
      return;
    }
    setLoading(true);
    setError("");
    setMsg("");
    try {
      const uploadRes = await uploadFile(fichier);

      const fileUrl = uploadRes.url || uploadRes.file_url;

      const coursPayload = {
        title: titre,
        description: desc,
        file_url: fileUrl,
      };

      await createCours(coursPayload);

      setMsg("Cours publié avec succès !");
      setTitre("");
      setDesc("");
      setFichier(null);

      navigate("/prof/cours");
    } catch {
      setError("Erreur lors de la publication. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.card}>
      <div style={s.secTitle}>Publier un nouveau cours</div>

      <div style={s.formGrid}>
        <div style={s.formGrp}>
          <label style={s.formLbl}>Titre du cours *</label>
          <input
            style={s.formInp}
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            placeholder="ex: Introduction à Python"
          />
        </div>
        <div style={s.formGrp}>
          <label style={s.formLbl}>Description</label>
          <input
            style={s.formInp}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="ex: Bases du langage..."
          />
        </div>
        <div style={{ ...s.formGrp, gridColumn: "1/-1" }}>
          <label style={s.formLbl}>Fichier PDF *</label>
          {!fichier ? (
            <label style={s.dropZone}>
              <div style={s.dropTxt}>
                Cliquez pour sélectionner un fichier PDF
              </div>
              <div style={s.dropHint}>PDF uniquement · max 50 MB</div>
              <input
                type="file"
                accept=".pdf"
                style={{ display: "none" }}
                onChange={(e) => setFichier(e.target.files[0])}
              />
            </label>
          ) : (
            <div
              style={{
                ...s.uploadedFile,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <Icon d={ICONS.file} size={14} />
                <span>
                  {fichier.name} — {(fichier.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
              <button
                onClick={() => setFichier(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#A32D2D",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                Changer
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <p style={{ fontSize: "13px", color: "#A32D2D", margin: "12px 0 0" }}>
          {error}
        </p>
      )}
      {msg && (
        <p style={{ fontSize: "13px", color: "#085041", margin: "12px 0 0" }}>
          {msg}
        </p>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "16px",
        }}
      >
        <button
          style={{ ...s.btnPrimary, opacity: loading ? 0.7 : 1 }}
          onClick={handleUpload}
          disabled={loading}
        >
          <Icon d={ICONS.upload} size={14} />
          {loading ? "Publication..." : "Publier le cours"}
        </button>
      </div>
    </div>
  );
}

export default ProfUpload;
