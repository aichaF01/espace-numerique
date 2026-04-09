from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from jose import jwt, JWTError
import httpx, os

app = FastAPI(title="MS Auth")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

KEYCLOAK_URL = os.getenv("KEYCLOAK_URL", "http://keycloak:8080")
REALM        = os.getenv("KEYCLOAK_REALM", "espace-numerique")
CLIENT_ID    = os.getenv("KEYCLOAK_CLIENT_ID", "backend")

class LoginRequest(BaseModel):
    username: str
    password: str

# ── Clé publique Keycloak ────────────────────────────────
def get_public_key() -> str:
    r = httpx.get(f"{KEYCLOAK_URL}/realms/{REALM}", timeout=10)
    r.raise_for_status()
    key = r.json()["public_key"]
    return f"-----BEGIN PUBLIC KEY-----\n{key}\n-----END PUBLIC KEY-----"

# ── verify_token — copié dans tous les autres MS ─────────
def verify_token(authorization: str, required_role: str = None) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token manquant")
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(
            token,
            get_public_key(),
            algorithms=["RS256"],
            options={"verify_aud": False}
        )
    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Token invalide : {e}")
    roles = payload.get("realm_access", {}).get("roles", [])
    if required_role and required_role not in roles:
        raise HTTPException(status_code=403,
                            detail=f"Role '{required_role}' requis")
    return {
        "user_id":  payload.get("sub"),
        "username": payload.get("preferred_username"),
        "email":    payload.get("email"),
        "roles":    roles
    }

# ════════════════════════════════════════════════════════
# ROUTES
# ════════════════════════════════════════════════════════

@app.get("/health")
def health():
    return {"status": "healthy", "service": "ms-auth"}

# ── Login ─────────────────────────────────────────────
@app.post("/login")
def login(body: LoginRequest):
    r = httpx.post(
        f"{KEYCLOAK_URL}/realms/{REALM}/protocol/openid-connect/token",
        data={
            "username":   body.username,
            "password":   body.password,
            "grant_type": "password",
            "client_id":  CLIENT_ID
        },
        timeout=10
    )
    if r.status_code == 401:
        raise HTTPException(status_code=401, detail="Identifiants incorrects")
    r.raise_for_status()
    data = r.json()
    return {
        "access_token":  data["access_token"],
        "refresh_token": data["refresh_token"],
        "expires_in":    data["expires_in"],
        "token_type":    "Bearer"
    }

# ── Logout ───────────────────────────────────────────
@app.post("/logout")
def logout(refresh_token: str):
    httpx.post(
        f"{KEYCLOAK_URL}/realms/{REALM}/protocol/openid-connect/logout",
        data={"refresh_token": refresh_token, "client_id": CLIENT_ID},
        timeout=10
    )
    return {"message": "Deconnexion reussie"}

# ── Refresh ──────────────────────────────────────────
@app.post("/refresh")
def refresh(refresh_token: str):
    r = httpx.post(
        f"{KEYCLOAK_URL}/realms/{REALM}/protocol/openid-connect/token",
        data={
            "refresh_token": refresh_token,
            "grant_type":    "refresh_token",
            "client_id":     CLIENT_ID
        },
        timeout=10
    )
    if r.status_code == 400:
        raise HTTPException(status_code=401, detail="Session expiree")
    r.raise_for_status()
    data = r.json()
    return {"access_token": data["access_token"], "expires_in": data["expires_in"]}

# ── Verify — utilisé par les autres MS ───────────────
@app.get("/verify")
def verify(authorization: str = Header(None)):
    user = verify_token(authorization)
    return {"valid": True, **user}

# ── Me — profil du user connecté ────────────────────
@app.get("/me")
def me(authorization: str = Header(None)):
    return verify_token(authorization)