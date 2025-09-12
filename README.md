# Parc National - Marseille <3

## Introduction

Le Parc National des Calanques de Marseille est un joyau naturel qui attire des milliers de visiteurs chaque année. Ses falaises abruptes, ses eaux cristallines et sa biodiversité unique font la fierté des Marseillais et enchantent les touristes du monde entier. Cependant, cet afflux commence à peser sur l'écosystème fragile du parc, menaçant la faune et la flore locale.

Passionné par la nature et les technologies, ce projet vise à développer une application web innovante pour améliorer la gestion du parc et sensibiliser les visiteurs à l'importance de préserver cet environnement exceptionnel.

## Objectifs

- Développer une application web pour gérer les visiteurs, les sentiers, les réservations de campings et les ressources naturelles du parc.
- Mettre en place une base de données SQL pour stocker les informations relatives aux visiteurs, sentiers, réservations et ressources naturelles.
- Implémenter des tests unitaires pour chaque module de l'application afin d'assurer sa fiabilité et sa robustesse.
- Mettre en place un workflow dans GitHub Actions pour l'intégration et le développement continu (CI/CD).

## Fonctionnalités

- **Gestion des Utilisateurs** :
  - Création, modification et suppression de comptes pour les administrateurs et visiteurs.
  - Authentification et autorisation des utilisateurs.

- **Gestion des Visiteurs** :
  - Enregistrement et suivi des informations des visiteurs.
  - Gestion des abonnements et cartes de membres.

- **Gestion des Sentiers** :
  - Création, modification et suppression des sentiers.
  - Affichage des cartes des sentiers avec niveaux de difficulté et points d'intérêt.

- **Réservations de Campings** :
  - Système de réservation en ligne pour les campings du parc.
  - Suivi des réservations et gestion des disponibilités.

- **Gestion des Ressources Naturelles** :
  - Suivi et gestion des animaux, plantes et autres ressources naturelles du parc.
  - Rapports sur l'état des ressources naturelles.

- **Notifications et Annonces** :
  - Envoi de notifications et annonces importantes aux visiteurs et administrateurs.
  - Alertes pour les conditions météorologiques et événements spéciaux.

- **Tests Unitaires et CI/CD** :
  - Mise en place d'un système d'intégration et développement continu avec GitHub Actions.
  - Tests unitaires pour vérifier la fonctionnalité des modules de gestion.

## Organisation

- **Première semaine : Conception**  
  Conception précise de la base de données et rédaction d'un cahier des charges complet pour aborder la suite sereinement.

- **Semaine 2 : Mise en place de l’environnement**  
  Installation des outils (serveur web, base de données, etc.) et configuration du workflow GitHub Actions pour CI/CD et tests.

- **Semaines 3 à 5 : Création des fonctionnalités**  
  Développement des fonctionnalités définies, avec intégration d'un système d'authentification par Token JWT.

- **Semaine 6 : Réalisation des tests, débogage et préparation de la présentation**  
  Mise en place des tests unitaires, débogage final et préparation de la présentation avec démonstration.

## Compétences Visées

- **Développer une application sécurisée** :
  - Installer et configurer l'environnement de travail (PHP / JS / SQL / CI/CD / Tests).
  - Développer des interfaces utilisateur (Wireframe / maquette / responsive design).
  - Développer des composants métier (POO / Composants sécurisés / règles de nommage).
  - Contribuer à la gestion d’un projet informatique (travail en groupe et outils collaboratifs).

- **Concevoir et développer une application sécurisée organisée en couches** :
  - Analyser les besoins et maquetter une application (Cahier des charges, maquettes, user stories).
  - Définir l’architecture logicielle d’une application (MVC, optimisation, expliquer ses choix).
  - Concevoir et mettre en place une base de données relationnelle (MCD/MLD).
  - Développer des composants d’accès aux données SQL (Requêtes, middleware).

- **Préparer le déploiement d’une application sécurisée** :
  - Préparer et exécuter les plans de tests (planification des tests unitaires).
  - Préparer et documenter le déploiement (CI/CD et documentation).

## Technologies Utilisées

- **Backend** : PHP (avec architecture MVC), SQL pour la base de données.
- **Frontend** : JavaScript pour les interfaces interactives.
- **Authentification** : Tokens JWT.
- **CI/CD** : GitHub Actions.
- **Inspiration** : "Mes Calanques" (application officielle des Calanques de Marseille).

## Installation

1. Clonez le repository :
   ```
   git clone https://github.com/nom-prenom/parcNational.git
   ```

2. Installez les dépendances (si applicable, via Composer pour PHP) :
   ```
   composer install
   ```

3. Configurez la base de données SQL :
   - Créez une base de données vide.
   - Importez le schéma SQL depuis `database/schema.sql`.
   - Mettez à jour les credentials dans le fichier de configuration (ex. `.env`).

4. Lancez le serveur web local (ex. avec PHP built-in server) :
   ```
   php -S localhost:8000
   ```

5. Accédez à l'application via `http://localhost:8000`.

**Note** : Assurez-vous d'avoir PHP, un serveur SQL (comme MySQL) et Node.js (si besoin pour JS) installés.

## Usage

- **Administrateurs** : Connectez-vous pour gérer utilisateurs, sentiers, ressources, etc.
- **Visiteurs** : Créez un compte pour réserver des campings, consulter les sentiers et recevoir des notifications.
- Tests : Exécutez les tests unitaires avec PHPUnit (configuré dans GitHub Actions).

## Contribution

- Forkez le repo.
- Créez une branch pour votre feature (`git checkout -b feature/nouvelle-fonctionnalite`).
- Committez vos changements (`git commit -m 'Ajout de nouvelle fonctionnalite'`).
- Poussez la branch (`git push origin feature/nouvelle-fonctionnalite`).
- Ouvrez une Pull Request.

Respectez les règles de nommage et la structure MVC.

## Rendu

Le projet est à rendre sur GitHub à l'adresse : `https://github.com/nom-prenom/parcNational`.  
Une soutenance inclut un support de présentation et une démonstration.

## Licence

Ce projet est sous licence MIT (ou à définir). Voir le fichier `LICENSE` pour plus d'informations.

Fait par Anne-gaelle Bernard , Armelle Pouzioux , Anissa Ourdjini
