import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../components/ui/icon";
import { ICONS } from "../../components/ui/icons";
import { s } from "../../styles/dashboard";
import { createUser } from "../../api/admin";

export default function AddUserForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "etudiant",
  });
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [creating, setCreating] = useState(false);

  const update = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPassword = (password) => {
    // au moins 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
  };

  const handleCreate = async () => {
    let newErrors = {};

    if (!form.username || !form.email || !form.password) {
      setError("Tous les champs sont obligatoires.");
      return;
    }
    if (!isValidEmail(form.email)) {
      newErrors.email = "Email invalide (ex: test@est.com)";
    }

    if (!isValidPassword(form.password)) {
      newErrors.password =
        "Mot de passe ≥ 8 caractères avec majuscule, minuscule et chiffre.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setCreating(true);
    setErrors({});
    setError("");
    setMsg("");

    try {
      const response = await createUser(form);

      navigate("/admin/users");
    } catch (err) {
      console.error("Détail de l'erreur interceptée:", err);

      // Si l'erreur vient de l'API (Axios)
      if (err.response) {
        setError(err.response.data?.detail || "Erreur serveur.");
      }
    } finally {
      setCreating(false);
    }
  };

  return (
    <div style={s.card}>
      <div style={s.secTitle}>Créer un compte</div>

      <div style={s.formGrid}>
        <div style={s.formGrp}>
          <label style={s.formLbl}>Nom d'utilisateur *</label>
          <input
            style={s.formInp}
            value={form.username}
            onChange={update("username")}
            placeholder="ex: etudiant_test"
          />
        </div>

        <div style={s.formGrp}>
          <label style={s.formLbl}>Email *</label>
          <input
            style={s.formInp}
            value={form.email}
            onChange={update("email")}
            placeholder="test@est.ma"
          />
          {errors.email && (
            <p style={{ color: "red", fontSize: "12px" }}>{errors.email}</p>
          )}
        </div>

        <div style={{ ...s.formGrp, position: "relative" }}>
          <label style={s.formLbl}>Mot de passe *</label>
          <input
            style={s.formInp}
            type={show ? "text" : "password"}
            value={form.password}
            onChange={update("password")}
            placeholder="••••••••"
          />
          {form.password && (
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              style={st.eyeBtn}
            >
              <Icon d={show ? ICONS.eyeOff : ICONS.eye} size={16} />
            </button>
          )}
          {errors.password && (
            <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
              {errors.password}
            </p>
          )}
        </div>

        <div style={s.formGrp}>
          <label style={s.formLbl}>Rôle</label>
          <select style={s.formInp} value={form.role} onChange={update("role")}>
            <option value="etudiant">Étudiant</option>
            <option value="prof">Professeur</option>
            <option value="admin">Administrateur</option>
          </select>
        </div>
      </div>

      {error && <p style={s.msgError}>{error}</p>}
      {msg && <p style={s.msgSuccess}>{msg}</p>}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "16px",
        }}
      >
        <button style={s.btnOutline} onClick={() => navigate("../users")}>
          Retour
        </button>
        <button
          style={{ ...s.btnPrimary, opacity: creating ? 0.7 : 1 }}
          onClick={handleCreate}
          disabled={creating}
        >
          <Icon d={ICONS.plus} size={14} color="white" />
          {creating ? "Création..." : "Créer le compte"}
        </button>
      </div>
    </div>
  );
}

const st = {
  eyeBtn: {
    position: "absolute",
    right: "10px",
    top: "40%",
    transform: "translateY(-40%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#888",
    padding: 0,
    display: "flex",
    alignItems: "center",
  },
};
