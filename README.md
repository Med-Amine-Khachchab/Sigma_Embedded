# Sigma Embedded

Plateforme web complète pour Sigma Embedded : site vitrine, blog, média, équipe et back-office sécurisé.

## Stack

- **Frontend** : Next.js (App Router) + TypeScript + TailwindCSS
- **Backend** : API Routes + Server Actions
- **DB** : PostgreSQL + Prisma
- **Auth** : NextAuth (Credentials + JWT)
- **Éditeur** : Markdown avec preview + upload d'images local

## Démarrage rapide (local)

```bash
cp .env.example .env

docker compose up -d
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

L'application est disponible sur http://localhost:3000.

## Comptes de démonstration

- Admin : `admin@sigmaembedded.ma` / `Admin123!`
- Editors : `nadia@sigmaembedded.ma` / `Editor123!`, `omar@sigmaembedded.ma` / `Editor123!`

## Scripts utiles

- `npm run dev` : lancer Next.js en dev
- `npm run build` : build production
- `npm run lint` : lint ESLint
- `npx prisma migrate dev` : migrations
- `npx prisma db seed` : seed base de données

## Fonctionnalités

- Pages publiques : Home, Blog, Media, Team
- Blog : pagination, recherche, tags, slug auto, markdown rendu
- Newsletter : stockage DB, rate limit simple
- Upload image : `/api/upload` vers `public/uploads`
- Back-office : CRUD posts, vidéos, membres, newsletter
- Rôles : `ADMIN`, `EDITOR` (middleware + checks côté serveur)

## Structure

```
app/                # Routes Next.js (App Router)
components/         # Composants UI
lib/                # Auth, Prisma, helpers, validation
prisma/             # Schema
scripts/            # Seed
```

## Variables d'environnement

Voir `.env.example`.

## Notes

- Les images uploadées sont stockées localement dans `public/uploads`.
- Le thème UI utilise une palette noir + néon inspirée de l'embedded futuriste.
