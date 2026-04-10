# Espace Numérique — EST Salé

Plateforme numérique de gestion des cours basée sur une architecture micro-services.

---

## Stack technique

| Technologie | Rôle |
|-------------|------|
| FastAPI (Python) | Backend — chaque micro-service |
| React | Frontend |
| Keycloak | Authentification OAuth2 / JWT |
| Cassandra | Base de données NoSQL |
| MinIO | Stockage de fichiers |
| Nginx | API Gateway |
| Ollama + Llama3 | Intelligence artificielle |
| Docker + Docker Compose | Conteneurisation |

---

## Structure du projet

```
espace-numerique/
├── docker-compose.yml
├── .env.example              
├── .gitignore
├── README.md
├── gateway/
│   ├── Dockerfile
│   └── nginx.conf
├── services/
│   ├── auth/                 
│   │   ├── main.py
│   │   ├── keycloak-setup.py
│   │   ├── Dockerfile
│   │   ├── requirements.txt
│   │   ├── start.sh
│   │   ├── .env.example
│   │   └── README.md
│   ├── upload/               
│   │   ├── main.py
│   │   ├── Dockerfile
│   │   ├── requirements.txt
│   │   └── .env.example
│   ├── download/             
│   │   ├── main.py
│   │   ├── Dockerfile
│   │   ├── requirements.txt
│   │   └── .env.example
│   ├── admin/                
│   │   ├── main.py
│   │   ├── Dockerfile
│   │   ├── requirements.txt
│   │   └── .env.example
│   └── ai/                   
│       ├── main.py
│       ├── Dockerfile
│       ├── requirements.txt
│       └── .env.example
└── frontend/                 
    ├── Dockerfile
    ├── .env.example
    └── src/
```

---

## Prérequis

Installe ces outils avant de commencer :

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) — version 24+
- [Git](https://git-scm.com/)
- [VS Code](https://code.visualstudio.com/) (recommandé)
- [Postman](https://www.postman.com/) — pour tester les APIs

---

## Installation — première fois (tous les devs)

### 1. Cloner le repo

```bash
git clone https://github.com/aichaF01/espace-numerique.git
cd espace-numerique
```

### 2. Créer les fichiers .env depuis les exemples

```bash
# Racine du projet
cp .env.example .env

# Chaque service
cp services/auth/.env.example     services/auth/.env
cp services/upload/.env.example   services/upload/.env
cp services/download/.env.example services/download/.env
cp services/admin/.env.example    services/admin/.env
cp services/ai/.env.example       services/ai/.env
cp frontend/.env.example          frontend/.env
```

> Les fichiers `.env` ne sont JAMAIS poussés sur GitHub.
> Les valeurs dans les `.env.example` sont correctes pour le développement local — pas besoin de les modifier.

### 3. Créer sa branche de travail

```bash
# Remplace "ms-upload" par ta tâche
git checkout -b feature/ms-upload
```

---

## Démarrage selon ta tâche

### Dev 1 — MS Auth + Gateway

**Services nécessaires :**
```bash
docker-compose up --build keycloak cassandra minio auth gateway
```

**Ports utilisés :**
| Service | URL |
|---------|-----|
| MS Auth | http://localhost:8005 |
| MS Auth Swagger | http://localhost:8005/docs |
| Keycloak UI | http://localhost:8080 |
| Gateway | http://localhost:80 |

**Tester :**
```bash
# Health check
curl http://localhost:8005/health

# Login
curl -X POST http://localhost:8005/login \
  -H "Content-Type: application/json" \
  -d '{"username":"prof1","password":"password123"}'
```

---

### Dev 2 — MS Upload + MS Download

**Services nécessaires :**
```bash
docker-compose up --build keycloak cassandra minio auth upload download
```

**Ports utilisés :**
| Service | URL |
|---------|-----|
| MS Upload | http://localhost:8001 |
| MS Upload Swagger | http://localhost:8001/docs |
| MS Download | http://localhost:8002 |
| MS Download Swagger | http://localhost:8002/docs |
| MinIO Console | http://localhost:9001 |
| MS Auth | http://localhost:8005 |

**Obtenir un token JWT pour tester :**
```bash
curl -X POST http://localhost:8005/login \
  -H "Content-Type: application/json" \
  -d '{"username":"prof1","password":"password123"}'
```

Copie le `access_token` et utilise-le dans Postman avec :
```
Authorization: Bearer TON_TOKEN_ICI
```

**Tester Upload :**
```
POST http://localhost:8001/cours
Authorization: Bearer TON_TOKEN
Body (form-data):
  titre       = "Cours Python"
  description = "Introduction à Python"
  fichier     = [ton fichier PDF]
```

**Tester Download :**
```
GET http://localhost:8002/cours
Authorization: Bearer TON_TOKEN
```

---

### Dev 3 — MS Admin

**Services nécessaires :**
```bash
docker-compose up --build keycloak cassandra auth admin
```

**Ports utilisés :**
| Service | URL |
|---------|-----|
| MS Admin | http://localhost:8003 |
| MS Admin Swagger | http://localhost:8003/docs |
| Keycloak | http://localhost:8080 |

**Token admin pour tester :**
```bash
curl -X POST http://localhost:8005/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin1","password":"password123"}'
```

**Tester création user :**
```
POST http://localhost:8003/users
Authorization: Bearer TOKEN_ADMIN
Content-Type: application/json

{
  "username": "etudiant_test",
  "email": "test@est.ma",
  "password": "password123",
  "role": "etudiant"
}
```

---

### Dev 4 — Frontend React

**Services nécessaires :**
```bash
docker-compose up --build keycloak auth frontend
```

**Ports utilisés :**
| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| MS Auth | http://localhost:8005 |

**Pour le développement React en local (sans Docker) :**
```bash
cd frontend
npm install
npm start
```

> L'app React tourne sur http://localhost:3000
> Elle appelle MS Auth sur http://localhost:8005

---

### Dev 5 — MS AI

**Services nécessaires :**
```bash
docker-compose up --build auth minio ai
```

**Ports utilisés :**
| Service | URL |
|---------|-----|
| MS AI | http://localhost:8004 |
| MS AI Swagger | http://localhost:8004/docs |

> Attention : Ollama + Llama3 nécessite au moins 8GB de RAM.
> Le téléchargement de Llama3 prend du temps (première fois).

**Tester :**
```
POST http://localhost:8004/ask
Content-Type: application/json

{
  "question": "C'est quoi Python ?"
}
```

---

## Utilisateurs de test (créés automatiquement)

| Username | Password | Rôle | Utilisation |
|----------|----------|------|-------------|
| etudiant1 | password123 | etudiant | Tester Download, Frontend |
| prof1 | password123 | prof | Tester Upload |
| admin1 | password123 | admin | Tester Admin |

---

## Routes du Gateway (http://localhost)

| Route publique | Redirige vers | MS |
|----------------|---------------|-----|
| `/api/auth/*` | auth:8005 | MS Auth |
| `/api/upload/*` | upload:8001 | MS Upload |
| `/api/download/*` | download:8002 | MS Download |
| `/api/admin/*` | admin:8003 | MS Admin |
| `/api/ai/*` | ai:8004 | MS AI |
| `/` | frontend:3000 | Frontend |

---

## Workflow Git — règles de l'équipe

### Chaque jour

```bash
# 1. Récupérer les dernières modifications
git pull origin main

# 2. Aller sur sa branche
git checkout feature/ma-tache

# 3. Coder dans son dossier uniquement
# Zineb → services/upload/ et services/download/
# Sanae → services/admin/
# Meryem → frontend/
# Yassmine → services/ai/

# 4. Sauvegarder son travail (selon votre tache)
git add services/upload/
git commit -m "feat(upload): route POST /cours avec MinIO"
git push origin feature/ma-tache
```

### Fusionner dans main

1. Aller sur GitHub
2. Créer une **Pull Request** : `feature/ma-tache → main`
3. Un autre dev review le code
4. Merger dans main

### Règles importantes

- Ne jamais pusher directement sur `main`
- Ne toucher QUE son dossier
- Ne jamais committer un fichier `.env`
- Toujours `git pull` avant de commencer

---

## Commandes utiles

```bash
# Voir les conteneurs qui tournent
docker-compose ps

# Voir les logs d'un service
docker-compose logs auth
docker-compose logs -f upload    # -f = temps réel

# Entrer dans un conteneur
docker exec -it ms-auth bash
docker exec -it cassandra cqlsh

# Arrêter tous les conteneurs
docker-compose down

# Arrêter et supprimer les volumes (repart de zéro)
docker-compose down -v

# Reconstruire un seul service
docker-compose up --build upload
```

---

## Communication entre services — règle fondamentale

```
Depuis ton navigateur :        http://localhost:PORT
Depuis un conteneur Docker :   http://nom-du-service:PORT

Exemples :
  Navigateur → MS Auth :       http://localhost:8005
  MS Upload → Cassandra :      cassandra:9042
  MS Upload → MinIO :          minio:9000
  MS Upload → MS Auth :        http://auth:8005
```

---

## Contacts par module

| Module | Dev responsable | Branche |
|--------|----------------|---------|
| MS Auth + Gateway | Aicha | feature/ms-auth |
| MS Upload + Download | Zineb | feature/ms-files |
| MS Admin | Sanae | feature/ms-admin |
| Frontend | Meryem | feature/ms-frontend |
| MS AI | Yassmine | feature/ms-ai |