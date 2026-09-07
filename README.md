# Parc National des Calanques — My Calanques

Application web de gestion du Parc National des Calanques de Marseille : visiteurs, sentiers, campings/réservations et ressources naturelles.

## Stack

- **Frontend** : HTML / CSS / JavaScript vanilla (`Frontend/`, `index.html`, `map.html`)
- **Backend** : PHP (PDO/MySQL), architecture MVC légère (`Backend/models`, `Backend/src/controllers`, `Backend/api`)
- **Base de données** : MySQL (schéma dans `parc_national.sql`, `Frontend/database/shema.sql`, données de test dans `Frontend/database/seed.sql`)
- **Auth** : JWT (émis au login, vérifié par `Backend/src/middlewares/JwtMiddleware.php`) pour les endpoints API ; session PHP pour les vues côté serveur (`Backend/view`)
- **Tests** : PHPUnit (`Backend/tests`)
- **CI/CD** : GitHub Actions (`.github/workflows/ci.yml` — lint frontend + tests backend, `.github/workflows/deploy-pages.yml` — déploiement du frontend sur GitHub Pages)

## Démarrage

### Backend

```bash
cd Backend
composer install
```

Configurez la connexion à la base de données dans `Backend/config/db.php` (ou via variables d'environnement selon votre setup) et importez le schéma :

```bash
mysql -u root -p < ../parc_national.sql
```

Définissez un secret JWT en production (sinon une valeur de développement par défaut est utilisée) :

```bash
export JWT_SECRET="change-me-in-production"
```

Servez `Backend/` avec un serveur PHP (Apache/PHP-FPM, ou pour du dev rapide) :

```bash
php -S localhost:8000 -t .
```

### Frontend

Ouvrez `index.html` via un serveur statique, ou utilisez `Frontend/docker/docker-compose.yml` pour un environnement conteneurisé.

## Tests

```bash
cd Backend
composer install
vendor/bin/phpunit
```

## API

- `Backend/api/login.php`, `register.php`, `logout.php`, `check-session.php`, `update-profile.php`, `change-password.php` — utilisateurs
- `Backend/api/get-campings.php`, `get-camping-details.php`, `reservations.php` — campings & réservations (JWT requis pour réserver/annuler/consulter ses réservations)
- `Backend/api/trails.php` — sentiers + points d'intérêt (lecture publique, écriture réservée au rôle `admin`)
- `Backend/api/resources.php` — ressources naturelles (faune/flore) et rapport d'observations (lecture publique, écriture réservée au rôle `admin`)

La carte interactive (`map.html`) charge désormais les sentiers et ressources naturelles depuis ces API au lieu de données codées en dur.

## État du projet

- ✅ Utilisateurs (inscription/connexion, JWT, session)
- ✅ Campings & réservations (avec vérification de disponibilité et de capacité)
- ✅ Sentiers & points d'intérêt (CRUD + affichage carte)
- ✅ Ressources naturelles (CRUD + rapport d'observations + affichage carte)
- 🚧 Visiteurs (abonnements/cartes de membre) et notifications : modèles/contrôleurs encore à implémenter (`Backend/models/Visitor.php`, `Backend/src/routes/*.php` sont des stubs)
