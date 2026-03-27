# TicketPulse - Fullstack Docker Environment (Sénégal)

Projet de billetterie événementielle (Laravel + React + MySQL) optimisé pour le Sénégal.

## Pré-requis
- Docker et Docker Compose installés.

## Installation et Lancement

1. **Cloner le projet** et se placer à la racine.
2. **Lancer les conteneurs :**
   ```bash
   docker-compose up -d --build
   ```
3. **Installer les dépendances et migrer la base :**
   ```bash
   # Backend
   docker exec -it laravel_app composer install
   docker exec -it laravel_app php artisan key:generate
   docker exec -it laravel_app php artisan migrate:fresh --seed
   ```

## Accès aux services
- **Frontend (React) :** [http://localhost:3000](http://localhost:3000)
- **Backend (API Laravel/Nginx) :** [http://localhost:8000](http://localhost:8000)

## Utilisateurs de test
- **Admin :** `admin@ticketpulse.sn` / `password`
- **Client :** `client@ticketpulse.sn` / `password`

## Concerts Inclus (Seeders)
- **Waly Seck** (Grand Théâtre)
- **Youssou N'Dour** (Stade Abdoulaye Wade)
- **Viviane Chidid** (Canal Olympia)
- **Jeeba** (Renaissance)
- **Dip Doundou Guiss** (MCN)
- **Pape Diouf** & **Sidy Diop**

## Architecture
- `app` : PHP 8.4-FPM (Laravel 11)
- `frontend` : Node 22 (React + Vite, Port 3000)
- `nginx` : Serveur web
- `db` : MySQL 8.0 (Persistence via `mysql_data`)
