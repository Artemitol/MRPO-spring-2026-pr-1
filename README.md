# Практика 1 — ООО «Обувь»

[![Maintainability](https://api.codeclimate.com/v1/badges/REPLACE_WITH_REAL_BADGE_ID/maintainability)](https://codeclimate.com/)

> После подключения репозитория в CodeClimate замени `REPLACE_WITH_REAL_BADGE_ID` на актуальный идентификатор бейджа.

## Стек

- Frontend: React + TypeScript + Vite
- Backend: Express + TypeScript
- DB: PostgreSQL

## Запуск проекта

### 1. База данных

1. Скопируй `.env.example` в `.env` в корне проекта.
2. Подними PostgreSQL через Docker Compose:

```bash
docker compose up -d
```

1. По умолчанию контейнер публикуется на `5433`, чтобы не конфликтовать с локальным PostgreSQL.
2. Инициализируй БД через кодовый seed-скрипт:

```bash
cd server
npm install
npm run db:reset-seed
```

Альтернатива: можно выполнять SQL напрямую из [server/sql](server/sql).

### 2. Сервер

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

Сервер доступен на `http://localhost:4000`.

### 3. Клиент

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Клиент доступен на `http://localhost:5173`.

## Docker Compose

- Конфиг: `docker-compose.yml`
- Основные переменные: `.env`
- PostgreSQL публикуется на порту `5433` и хранит данные в именованном volume `postgres_data`

## Тестовые пользователи

Пароль для всех: `123456`

- `client`
- `manager`
- `admin`

## Документация

- Свод требований: [docs/requirements/main-requirements.md](docs/requirements/main-requirements.md)
- Решения владельца: [docs/requirements/owner-decisions.md](docs/requirements/owner-decisions.md)
- Чек-лист приемки: [docs/requirements/acceptance-checklist.md](docs/requirements/acceptance-checklist.md)
