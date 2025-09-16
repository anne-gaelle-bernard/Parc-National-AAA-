# Parc National AAA

## Project Structure

- `Backend/` - PHP backend code, config, models, routes, and public assets
- `Frontend/` - Frontend code, assets, database schema, and Docker setup
- `config.json` - Project and API configuration
- `package.json` - Frontend dependencies
- `vite.config.js` - Vite configuration
- `index.html` - Main entry point (frontend)

## How to Run

1. Import the SQL schema from `Frontend/database/parc_national.sql` into your MySQL database.
2. Start WAMP server (Apache & MySQL).
3. Access the frontend via `Frontend/index.html` and backend via API endpoints in `Backend/src/routes/`.

## Folder Details

- `Backend/config/` - Database connection
- `Backend/middlewares/` - Authentication middleware
- `Backend/models/` - PHP models
- `Backend/src/routes/` - API routes (auth, etc.)
- `Backend/public/` - Public backend assets
- `Frontend/assets/` - CSS, JS, images
- `Frontend/src/components/pages/` - Frontend page components
- `Frontend/database/` - SQL schema files
- `Frontend/docker/` - Docker setup
- `Frontend/public/` - Public frontend assets

## API Endpoints
- Login: `/Backend/src/routes/authRoutes.php?action=login`
- Register: `/Backend/src/routes/authRoutes.php?action=register`

---

For any issues, check the folder structure and make sure all dependencies are installed and services are running.
