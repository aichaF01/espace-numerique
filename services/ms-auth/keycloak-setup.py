import httpx, time, sys

KEYCLOAK_URL = "http://keycloak:8080"
REALM        = "espace-numerique"
CLIENT_ID    = "backend"

def wait_for_keycloak():
    print("Attente de Keycloak...")
    for i in range(30):
        try:
            r = httpx.get(f"{KEYCLOAK_URL}/realms/master", timeout=5)
            if r.status_code == 200:
                print("Keycloak pret !")
                return
        except Exception:
            pass
        print(f"  tentative {i+1}/30 ...")
        time.sleep(5)
    sys.exit(1)

def get_admin_token():
    r = httpx.post(
        f"{KEYCLOAK_URL}/realms/master/protocol/openid-connect/token",
        data={
            "username":   "admin",
            "password":   "admin",
            "grant_type": "password",
            "client_id":  "admin-cli"
        }
    )
    r.raise_for_status()
    return r.json()["access_token"]

def headers(token):
    return {
        "Authorization": f"Bearer {token}",
        "Content-Type":  "application/json"
    }

def create_realm(token):
    print(f"[1] Realm '{REALM}'...")
    r = httpx.get(f"{KEYCLOAK_URL}/admin/realms/{REALM}",
                  headers=headers(token))
    if r.status_code == 200:
        print("    existe deja — skip")
        return
    httpx.post(
        f"{KEYCLOAK_URL}/admin/realms",
        headers=headers(token),
        json={
            "realm":               REALM,
            "enabled":             True,
            "displayName":         "Espace Numerique EST Sale",
            "accessTokenLifespan": 3600
        }
    ).raise_for_status()
    print("    cree")

def create_roles(token):
    print("[2] Roles...")
    for role in ["etudiant", "prof", "admin"]:
        r = httpx.get(
            f"{KEYCLOAK_URL}/admin/realms/{REALM}/roles/{role}",
            headers=headers(token)
        )
        if r.status_code == 200:
            print(f"    '{role}' existe — skip")
            continue
        httpx.post(
            f"{KEYCLOAK_URL}/admin/realms/{REALM}/roles",
            headers=headers(token),
            json={"name": role}
        ).raise_for_status()
        print(f"    '{role}' cree")

def create_client(token):
    print(f"[3] Client '{CLIENT_ID}'...")
    r = httpx.get(
        f"{KEYCLOAK_URL}/admin/realms/{REALM}/clients?clientId={CLIENT_ID}",
        headers=headers(token)
    )
    if r.json():
        print("    existe deja — skip")
        return
    httpx.post(
        f"{KEYCLOAK_URL}/admin/realms/{REALM}/clients",
        headers=headers(token),
        json={
            "clientId":                  CLIENT_ID,
            "enabled":                   True,
            "publicClient":              True,
            "directAccessGrantsEnabled": True,
            "standardFlowEnabled":       True,
            "redirectUris":              ["http://localhost:3000/*"],
            "webOrigins":                ["http://localhost:3000"]
        }
    ).raise_for_status()
    print("    cree")

def create_user(token, username, email, password, role_name):
    h = headers(token)
    r = httpx.get(
        f"{KEYCLOAK_URL}/admin/realms/{REALM}/users?username={username}",
        headers=h
    )
    if r.json():
        print(f"    '{username}' existe — skip")
        return
    r = httpx.post(
        f"{KEYCLOAK_URL}/admin/realms/{REALM}/users",
        headers=h,
        json={
            "username":    username,
            "email":       email,
            "enabled":     True,
            "credentials": [{"type": "password", "value": password, "temporary": False}]
        }
    )
    r.raise_for_status()
    user_id   = r.headers["Location"].split("/")[-1]
    role_data = httpx.get(
        f"{KEYCLOAK_URL}/admin/realms/{REALM}/roles/{role_name}",
        headers=h
    ).json()
    httpx.post(
        f"{KEYCLOAK_URL}/admin/realms/{REALM}/users/{user_id}/role-mappings/realm",
        headers=h,
        json=[role_data]
    ).raise_for_status()
    print(f"    '{username}' cree avec role '{role_name}'")

def create_test_users(token):
    print("[4] Users de test...")
    users = [
        ("etudiant1", "etudiant1@est.ma", "password123", "etudiant"),
        ("prof1",     "prof1@est.ma",     "password123", "prof"),
        ("admin1",    "admin1@est.ma",    "password123", "admin"),
    ]
    for args in users:
        create_user(token, *args)

if __name__ == "__main__":
    wait_for_keycloak()
    token = get_admin_token()
    create_realm(token)
    create_roles(token)
    create_client(token)
    create_test_users(token)
    print("\nKeycloak configure avec succes !")