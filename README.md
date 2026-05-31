# Arthur Portfolio

Portfolio pribadi [Cristianto Tri Arthurito](https://www.linkedin.com/in/cristiantotriarthurito/) — static site + CMS (SQLite) tanpa framework frontend.

**Live (VPS):** [http://103.144.126.90:9991/](http://103.144.126.90:9991/)  
**Live (GitHub Pages):** [https://xcrisarthur.github.io/](https://xcrisarthur.github.io/) — frontend statis; API di VPS.

## Stack

- **portfolio-web** — HTML/CSS/JS statis (nginx atau GitHub Pages)
- **portfolio-api** — Node.js + better-sqlite3 (CMS, foto, JWT admin) — **hanya di VPS**
- Same-origin di VPS lewat nginx `/api/*`
- GitHub Pages memanggil API publik: `https://103-144-126-90.sslip.io/portfolio-api`

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

### GitHub Pages (`https://xcrisarthur.github.io/`)

```bash
~/homelabz/scripts/sync-github-pages.sh
cd ~/xcrisarthur.github.io && git add -A && git commit -m "sync: portfolio web" && git push
```

Repo terpisah: [xcrisarthur.github.io](https://github.com/xcrisarthur/xcrisarthur.github.io) (hanya `portfolio-web` di root).

## Lisensi

Konten & desain © Cristianto Tri Arthurito. Kode bebas dipelajari; jangan commit secret produksi.
