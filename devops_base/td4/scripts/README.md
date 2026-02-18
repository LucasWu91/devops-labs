# TD4 — Contrôle de version, Build Systems et Tests Automatisés

> **DevOps Data for SWE — ESIEE 2025**  
> Auteur : GALLINA_WU_TORRES

---

## Table des matières

- [Introduction](#introduction)
- [Prérequis](#prérequis)
- [Section 1 — Contrôle de version avec Git](#section-1--contrôle-de-version-avec-git)
- [Section 2 — Collaboration avec GitHub](#section-2--collaboration-avec-github)
- [Section 3 — Build System avec NPM](#section-3--build-system-avec-npm)
- [Section 4 — Gestion des dépendances avec NPM](#section-4--gestion-des-dépendances-avec-npm)
- [Section 5 — Tests automatisés avec Jest et SuperTest](#section-5--tests-automatisés-avec-jest-et-supertest)
- [Section 6 — Tests automatisés pour le code OpenTofu](#section-6--tests-automatisés-pour-le-code-opentofu)
- [Section 7 — Recommandations de tests](#section-7--recommandations-de-tests)
- [Difficultés rencontrées](#difficultés-rencontrées)
- [Conclusion](#conclusion)

---

## Introduction

Ce TD couvre les pratiques fondamentales du DevOps moderne pour gérer le code de façon collaborative, automatiser les tâches courantes et garantir la qualité du code par des tests. L'ensemble du cycle de développement est exploré :

- ✅ Contrôle de version avec **Git** et collaboration via **GitHub**
- ✅ Automatisation du build avec **NPM**
- ✅ Conteneurisation de l'application avec **Docker**
- ✅ Tests automatisés avec **Jest** et **SuperTest**
- ✅ Tests d'infrastructure avec **OpenTofu**

---

## Prérequis

| Outil | Installation |
|-------|-------------|
| Git | [git-scm.com](https://git-scm.com) |
| Node.js & NPM | [nodejs.org](https://nodejs.org) |
| Docker | [docker.com](https://docker.com) |
| OpenTofu | [opentofu.org](https://opentofu.org) |
| Compte GitHub | [github.com](https://github.com) |
| Compte AWS | avec les permissions appropriées |

---

## Section 1 — Contrôle de version avec Git

### Configuration initiale

```bash
git config --global user.name "<VOTRE NOM>"
git config --global user.email "<VOTRE EMAIL>"
```

### Initialisation d'un dépôt

```bash
mkdir /tmp/git-practice && cd /tmp/git-practice
echo 'Hello, World!' > example.txt
git init
git add example.txt
git commit -m "Initial commit"
git log
```

### Gestion des branches

```bash
# Créer une nouvelle branche et basculer dessus
git checkout -b testing

# Modifier un fichier puis committer
echo 'Troisième ligne de texte' >> example.txt
git add example.txt
git commit -m "Ajout d'une 3ème ligne à example.txt"

# Fusionner dans main
git checkout main
git merge testing
```

---

### Exercice 1 — Tags Git

Les tags permettent de marquer des points stables dans l'historique, typiquement pour des versions de production. Contrairement aux branches, les tags ne bougent jamais : ils pointent toujours vers le même commit.

```bash
# Créer un tag sur le commit courant
git tag v1.0

# Publier le tag sur GitHub
git push origin v1.0

# Lister tous les tags
git tag -l
```

> **Pourquoi utiliser des tags ?** Ils permettent à toute l'équipe d'identifier facilement les releases stables (versionnage sémantique : v1.0, v2.0...).

---

### Exercice 2 — Utilisation de git rebase

`git rebase` est une alternative à `git merge`. Au lieu de créer un commit de fusion, il réécrit l'historique en rejouant les commits au-dessus de la branche cible, produisant un historique linéaire plus lisible.

```bash
# Créer une branche et faire des commits
git checkout -b feature-rebase
echo 'Contenu de la fonctionnalité' >> example.txt
git commit -am "Ajout du contenu de la fonctionnalité"

# Rebaser sur main
git rebase main
```

**En cas de conflit :**
```bash
# 1. Résoudre le conflit manuellement dans le fichier
# 2. Stager le fichier résolu
git add example.txt
# 3. Reprendre le rebase
git rebase --continue
```

**Merge vs Rebase :**

| | `git merge` | `git rebase` |
|---|---|---|
| Historique | Préserve l'historique exact (commit de fusion) | Réécrit l'historique (linéaire) |
| Cas d'usage | Intégrer des fonctionnalités terminées | Nettoyer l'historique avant une PR |
| ⚠️ Attention | Sûr sur les branches publiques | Ne jamais rebaser une branche partagée |

> **Difficulté rencontrée :** La gestion des conflits pendant un rebase et la compréhension des commandes pour reprendre le processus ont été les points les plus techniques. La sortie de l'éditeur vim lors de la validation du message de commit a aussi posé problème.

---

## Section 2 — Collaboration avec GitHub

### Pousser un dépôt local vers GitHub

```bash
git remote add origin https://github.com/<VOTRE_USERNAME>/devops-lab.git
git push -u origin main

# Récupérer les modifications faites directement sur GitHub
git pull origin main
```

### Créer une branche et ouvrir une Pull Request

```bash
git checkout -b update-readme
echo '# DevOps Lab' > README.md
echo 'Dépôt exemple pour le TD DevOps.' >> README.md
git commit -am "Ajout du README"
git push origin update-readme
```

Ensuite sur GitHub : **Compare & pull request → Remplir les détails → Soumettre → Review → Merger**.

---

### Exercice 3 — Protection de la branche principale

La protection de branche empêche les modifications directes sur `main` et impose la revue de code.

**Configuration :** GitHub → Settings → Branches → Add rule pour `main`

Règles à activer :
- ☑️ **Require a pull request before merging** : oblige le passage par des PRs
- ☑️ **Require approvals** (minimum 1 reviewer) : au moins une review obligatoire
- ☑️ **Require status checks to pass** : les tests CI doivent passer avant la fusion
- ☑️ **Do not allow bypassing the above settings** : s'applique même aux admins

> Cela garantit qu'aucun code non reviewé et non testé ne peut atteindre la branche principale — une pratique standard en environnement professionnel.

---

### Exercice 4 — Commits signés

Les commits signés vérifient cryptographiquement l'identité de l'auteur grâce aux clés GPG.

**Avantages :**
- **Authenticité** — impossible de se faire passer pour un autre contributeur
- **Non-répudiation** — l'auteur ne peut pas nier avoir effectué le commit
- **Confiance** — GitHub affiche un badge ✅ `Verified` sur les commits signés

```bash
# Activer la signature globalement (après configuration de la clé GPG)
git config --global commit.gpgsign true
```

La clé publique GPG doit aussi être ajoutée dans GitHub → Settings → SSH and GPG keys.

---

## Section 3 — Build System avec NPM

### Structure du projet

```
td4/scripts/sample-app/
├── app.js
├── server.js
├── app.test.js
├── package.json
├── package-lock.json
├── Dockerfile
└── build-docker-image.sh
```

### Initialisation de NPM

```bash
mkdir -p td4/scripts/sample-app && cd td4/scripts/sample-app
npm init -y
```

### Scripts dans `package.json`

```json
{
  "scripts": {
    "start": "node server.js",
    "dockerize": "./build-docker-image.sh",
    "test": "jest --verbose",
    "coverage": "jest --coverage"
  }
}
```

### Dockerfile

```dockerfile
FROM node:21.7
WORKDIR /home/node/app
COPY package.json .
COPY package-lock.json .
RUN npm ci --only=production
COPY *.js .
EXPOSE 8080
USER node
CMD ["npm", "start"]
```

---

### Exercice 5 — Fixer la version de Node.js dans Docker

Utiliser `FROM node:21.7` plutôt que `FROM node:latest` est essentiel pour la reproductibilité des builds.

**Pourquoi fixer les versions dans Docker ?**
- 🔁 **Reproductibilité** — le même Dockerfile produit toujours la même image
- 🛡️ **Stabilité** — évite les incompatibilités dues aux mises à jour automatiques de Node.js
- 🐛 **Débogage facilité** — les changements d'environnement sont exclus comme cause de bugs
- 📋 **Conformité** — les audits de sécurité exigent des versions précises et traçables

---

### Exercice 6 — Script de build et lancement Docker

`build-docker-image.sh` :
```bash
#!/usr/bin/env bash
set -e
name=$(npm pkg get name | tr -d '"')
version=$(npm pkg get version | tr -d '"')
docker buildx build \
  --platform=linux/amd64,linux/arm64 \
  --load \
  -t "$name:$version" \
  .
```

```bash
chmod u+x build-docker-image.sh

# Construire l'image
npm run dockerize

# Lancer l'application dans un conteneur
docker run -p 8080:8080 sample-app:1.0.0
```

> **Difficulté rencontrée :** Des erreurs JSON dans `package.json` (virgules manquantes) empêchaient NPM de lire le fichier. JSON est strict et ne tolère aucune virgule finale ni commentaire.

---

## Section 4 — Gestion des dépendances avec NPM

### Installation d'Express.js

```bash
npm install express --save
```

### `app.js` mis à jour

```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/name/:name', (req, res) => {
  res.send(`Hello, ${req.params.name}!`);
});

module.exports = app;
```

---

### Exercice 7 — Endpoint `/name/:name`

Le paramètre `:name` dans l'URL est accessible via `req.params.name`.

```javascript
app.get('/name/:name', (req, res) => {
  res.send(`Hello, ${req.params.name}!`);
});
```

Test : `GET /name/Alice` → `Hello, Alice!`

---

### Exercice 8 — `dependencies` vs `devDependencies`

| | `dependencies` | `devDependencies` |
|---|---|---|
| Commande | `npm install --save` | `npm install --save-dev` |
| Inclus en production | ✅ Oui | ❌ Non (`npm ci --only=production`) |
| Exemples | Express.js | Jest, SuperTest, ESLint |
| Rôle | Nécessaire à l'exécution | Nécessaire uniquement au développement |

> Cette séparation permet de produire des images Docker plus légères et sécurisées, car elles ne contiennent pas d'outils de développement inutiles en production.

---

## Section 5 — Tests automatisés avec Jest et SuperTest

### Installation des bibliothèques de test

```bash
npm install --save-dev jest supertest
```

### Refactoring pour la testabilité

Séparer la configuration de l'application de son démarrage rend le code testable sans conflit de ports.

**`app.js`** — exporte l'app Express sans démarrer le serveur :
```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => { res.send('Hello, World!'); });
app.get('/name/:name', (req, res) => { res.send(`Hello, ${req.params.name}!`); });

module.exports = app; // Pas de server.listen() ici
```

**`server.js`** — démarre le serveur (uniquement en production) :
```javascript
const app = require('./app');
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Serveur démarré sur le port ${port}`));
```

### `app.test.js`

```javascript
const request = require('supertest');
const app = require('./app');

describe('Test de la route principale', () => {
  test('Doit répondre à la méthode GET', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Hello, World!');
  });
});

describe('Test de la route /name/:name', () => {
  test('Doit répondre avec un message personnalisé', async () => {
    const response = await request(app).get('/name/Alice');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Hello, Alice!');
  });
});
```

```bash
npm test
```

---

### Exercice 9 — Endpoint `/add/:a/:b` avec validation

```javascript
app.get('/add/:a/:b', (req, res) => {
  const a = parseFloat(req.params.a);
  const b = parseFloat(req.params.b);
  if (isNaN(a) || isNaN(b)) {
    return res.status(400).send('Nombres invalides');
  }
  res.send(String(a + b));
});
```

**Tests :**
```javascript
describe('Test de la route /add/:a/:b', () => {
  test('Doit retourner la somme de deux entiers', async () => {
    const response = await request(app).get('/add/3/5');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('8');
  });

  test('Doit retourner la somme de deux décimaux', async () => {
    const response = await request(app).get('/add/1.5/2.5');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('4');
  });

  test('Doit retourner 400 pour des entrées invalides', async () => {
    const response = await request(app).get('/add/abc/5');
    expect(response.statusCode).toBe(400);
  });
});
```

---

### Exercice 10 — Couverture de code avec Jest

```json
"scripts": {
  "coverage": "jest --coverage"
}
```

```bash
npm run coverage
```

Jest génère un tableau avec quatre métriques :

| Métrique | Description |
|----------|-------------|
| **Statements** | % des instructions exécutées |
| **Branches** | % des branches if/else testées |
| **Functions** | % des fonctions appelées |
| **Lines** | % des lignes couvertes |

> **Important :** 100% de coverage ne garantit pas l'absence de bugs. Il faut privilégier la qualité des tests sur la quantité, en ciblant les chemins critiques et les cas limites.

---

## Section 6 — Tests automatisés pour le code OpenTofu

### Structure des répertoires

```
td4/scripts/tofu/
├── live/
│   └── lambda-sample/
│       └── deploy.tftest.hcl
└── modules/
    └── test-endpoint/
        └── main.tf
```

### Module `test-endpoint`

```hcl
data "http" "test_endpoint" {
  url = var.endpoint
}

variable "endpoint" {
  description = "L'endpoint à tester"
  type        = string
}

output "status_code"   { value = data.http.test_endpoint.status_code }
output "response_body" { value = data.http.test_endpoint.response_body }
```

### `deploy.tftest.hcl`

```hcl
run "deploy" {
  command = apply
}

run "validate" {
  command = apply
  module {
    source = "../../modules/test-endpoint"
  }
  variables {
    endpoint = run.deploy.api_endpoint
  }
  assert {
    condition     = data.http.test_endpoint.status_code == 200
    error_message = "Code de statut inattendu : ${data.http.test_endpoint.status_code}"
  }
  assert {
    condition     = data.http.test_endpoint.response_body == "Hello, World!"
    error_message = "Corps de réponse inattendu : ${data.http.test_endpoint.response_body}"
  }
}
```

```bash
cd td4/scripts/tofu/live/lambda-sample
tofu test
```

> `tofu test` déploie une vraie infrastructure AWS, la valide, puis la **détruit automatiquement** après le test — ce qui évite des coûts AWS inutiles.

---

### Exercice 11 — Réponse JSON et test adapté

```javascript
// app.js
app.get('/', (req, res) => {
  res.json({ message: 'Hello, World!' });
});
```

```javascript
// app.test.js
test('Doit retourner une réponse JSON', async () => {
  const response = await request(app).get('/');
  expect(response.statusCode).toBe(200);
  expect(response.headers['content-type']).toMatch(/json/);
  expect(response.body.message).toBe('Hello, World!');
});
```

---

### Exercice 12 — Test négatif avec erreur 404

Express retourne automatiquement un 404 pour les routes non définies — aucune modification du code nécessaire.

```javascript
describe("Test d'une route inexistante", () => {
  test('Doit retourner 404', async () => {
    const response = await request(app).get('/route-qui-nexiste-pas');
    expect(response.statusCode).toBe(404);
  });
});
```

> Les tests négatifs sont essentiels pour valider que l'application échoue de manière contrôlée plutôt que de provoquer des erreurs serveur 500 inattendues.

---

## Section 7 — Recommandations de tests

### La Pyramide de tests

```
        /\
       /  \       ← Tests End-to-End (peu nombreux, lents, flux complets)
      /----\
     /      \     ← Tests d'intégration (modérés, interactions entre composants)
    /--------\
   /          \   ← Tests unitaires (nombreux, rapides, isolés)
  /____________\
```

| Type | Vitesse | Quantité | Objectif |
|------|---------|----------|---------|
| Unitaires | ⚡ Rapide | Nombreux | Tester des fonctions/modules individuels en isolation |
| Intégration | 🔄 Moyen | Modérés | Tester les interactions entre composants |
| End-to-End | 🐢 Lent | Peu | Valider les flux utilisateurs complets |

### Que tester ?

- Se concentrer sur les **fonctionnalités critiques** et les chemins d'exécution principaux
- Tester les **cas limites** (valeurs nulles, chaînes vides, nombres négatifs, dépassements)
- Tester les **conditions d'erreur** et vérifier que l'app échoue de façon contrôlée
- Prioriser les tests par **risque et impact métier**
- Ne pas viser 100% de coverage à tout prix — privilégier la **qualité** des tests

---

### Exercice 13 — Test-Driven Development (TDD)

Le TDD inverse l'ordre habituel de développement : **on écrit le test avant le code**.

**Le cycle TDD :**

```
🔴 Rouge    → Écrire un test qui échoue (la fonctionnalité n'existe pas encore)
🟢 Vert     → Écrire le minimum de code pour faire passer le test
🔵 Refactor → Améliorer le code sans casser les tests
```

**Exemple appliqué à `/add/:a/:b` :**

1. 🔴 Écrire `expect(response.statusCode).toBe(200)` → échoue (la route n'existe pas)
2. 🟢 Implémenter la route dans `app.js` → le test passe
3. 🔵 Ajouter la validation des entrées + les tests négatifs correspondants

> Le TDD aide à définir des exigences claires avant l'implémentation, encourage un code plus simple et testable, et fournit un filet de sécurité pour les refactorisations futures.

---

### Exercice 14 — Analyse de la couverture de code

Après `npm run coverage`, identifier les lignes non couvertes dans le rapport Jest.

**Constats typiques :**
- Les blocs de gestion d'erreurs (`catch`) sont souvent peu testés
- Les cas limites des paramètres URL (valeurs vides, caractères spéciaux) peuvent manquer
- Les chemins conditionnels (`if/else`) nécessitent un test par branche pour une couverture complète

**Actions correctives :** ajouter des tests pour chaque ligne non couverte, en priorisant les branches liées à la sécurité et à la gestion des erreurs.

---

## Difficultés rencontrées

| Domaine | Problème | Résolution |
|---------|----------|------------|
| **git rebase** | Gestion des conflits et compréhension des commandes pour reprendre le processus (`git add` + `git rebase --continue`). Sortie de l'éditeur vim difficile. | Pratique et lecture de la documentation Git |
| **package.json** | Erreurs JSON dues à des virgules manquantes empêchant NPM de lire le fichier. JSON est strict : pas de virgule finale, pas de commentaires. | Formatage soigneux, utilisation d'un linter |
| **app.test.js** | Erreurs de syntaxe JavaScript mineures causant des échecs de tests sans rapport avec la logique testée. | Lecture méthodique des erreurs, tests incrémentaux |

---

## Conclusion

Ce TD a fourni une expérience pratique complète du cycle de développement DevOps :

| Domaine | Commandes clés |
|---------|---------------|
| Git | `git tag`, `git rebase`, `git push`, `git merge` |
| GitHub | Pull Requests, Protection de branche, Commits signés |
| NPM | `npm init`, `npm install`, `npm start`, `npm test`, `npm run dockerize` |
| Docker | `docker buildx build`, `docker run` |
| Tests | `jest --verbose`, `jest --coverage`, SuperTest |
| Infrastructure | `tofu test`, déploiement + validation + destruction |

Malgré les difficultés techniques rencontrées, notamment avec `git rebase` et le format JSON strict, l'ensemble du projet fonctionne correctement et tous les tests passent. Ce TD offre une vision claire et pratique de la manière dont une application peut être développée, testée, versionnée et exécutée dans un environnement structuré proche des pratiques DevOps professionnelles.

---

*ESIEE 2025 — DevOps Data for SWE*
