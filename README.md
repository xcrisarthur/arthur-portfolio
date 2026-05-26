# Arthur Portfolio

Portfolio pribadi [Cristianto Tri Arthurito](https://www.linkedin.com/in/cristiantotriarthurito/) — static site + CMS (SQLite) tanpa framework frontend.

**Live:** [http://103.144.126.90:9991/](http://103.144.126.90:9991/)

## Stack

- **portfolio-web** — HTML/CSS/JS statis (nginx)
- **portfolio-api** — Node.js + better-sqlite3 (CMS, foto, JWT admin)
- API same-origin lewat nginx `/api/*` (tanpa CORS cross-port)

## Jalankan lokal

```bash
cp .env.example .env   # edit password admin
docker compose up -d --build
```

Buka [http://localhost:9991/](http://localhost:9991/) · Admin: [http://localhost:9991/admin.html](http://localhost:9991/admin.html)

## Repo terkait (Opsi B)

| Repo | Visibility | Isi |
|------|------------|-----|
| **arthur-portfolio** (ini) | Public | Portfolio web + API |
| **homelabz** | Private | ERP, POS, infra Docker, deploy server |

Perubahan portfolio dari homelab pribadi: jalankan `scripts/sync-from-homelabz.sh` di repo ini (atau sebaliknya `homelabz/scripts/sync-portfolio-public.sh`).

## Lisensi

Konten & desain © Cristianto Tri Arthurito. Kode bebas dipelajari; jangan commit secret produksi.
