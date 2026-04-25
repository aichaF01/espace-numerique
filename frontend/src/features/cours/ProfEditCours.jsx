import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { listCours, updateCours } from "../../api/cours";
import { uploadFile } from "../../api/upload";
import Icon from "../../components/ui/icon";
import { ICONS } from "../../components/ui/icons";
import { s } from "../../styles/dashboard";

function ProfEditCours() {
  const { id } = useParams(); // Récupère l'ID du cours depuis l'URL
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    file_url: "",
  });
  const [newFile, setNewFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // On cherche le cours spécifique dans la liste
    listCours().then((data) => {
      const current = data.find((c) => c.id === id);
      if (current) {
        setForm({
          title: current.title,
          description: current.description,
          file_url: current.file_url,
        });
      }
      setLoading(false);
    });
  }, [id]);

  const handleUpdate = async () => {
    setSubmitting(true);
    try {
      let finalUrl = form.file_url;
      if (newFile) {
        const uploadRes = await uploadFile(newFile);
        finalUrl = uploadRes.url || uploadRes.file_url;
      }

      await updateCours(id, { ...form, file_url: finalUrl });
      navigate("/prof/cours"); // Redirection après succès
    } catch (err) {
      alert("Erreur lors de la mise à jour");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p style={{ padding: "20px" }}>Chargement du cours...</p>;

  return (
    <div style={s.card}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <div style={s.secTitle}>Modifier le cours</div>
      </div>

      <div style={s.formGrid}>
        <div style={s.formGrp}>
          <label style={s.formLbl}>Titre du cours</label>
          <input
            style={s.formInp}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>
        <div style={s.formGrp}>
          <label style={s.formLbl}>Description</label>
          <input
            style={s.formInp}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div style={{ ...s.formGrp, gridColumn: "1/-1" }}>
          <label style={s.formLbl}>Fichier PDF</label>
          <label style={s.dropZone}>
            <div style={s.dropTxt}>
              Cliquez pour sélectionner un fichier PDF
            </div>
            <input
              type="file"
              accept=".pdf"
              style={{ display: "none" }}
              onChange={(e) => setNewFile(e.target.files[0])}
            />
          </label>
          {newFile && (
            <div style={s.uploadedFile}>
              <Icon d={ICONS.file} size={14} />
              {newFile.name} — {(newFile.size / 1024 / 1024).toFixed(2)} MB
            </div>
          )}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginTop: "24px",
          alignItems: "center",
        }}
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{ ...s.btnOutline, flex: 2, marginTop: 0 }}
        >
          Retour
        </button>

        <button
          style={{
            ...s.btnPrimary,
            flex: 2,
            marginTop: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
          onClick={handleUpdate}
          disabled={submitting}
        >
          <Icon d={ICONS.upload} size={14} />
          <span>
            {submitting ? "Enregistrement..." : "Mettre à jour le cours"}
          </span>
        </button>
      </div>
    </div>
  );
}

export default ProfEditCours;
