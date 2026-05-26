"use strict";

const http = require("http");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");
const Database = require("better-sqlite3");
const defaultPortfolio = require("./seed-default");
const media = require("./media");

const PORT = Number(process.env.PORT || 3002);
const DATA_DIR = process.env.DATA_DIR || "/data";
const ADMIN_USER = String(process.env.ADMIN_USER || "arthur").trim();
const ADMIN_PASS = String(process.env.ADMIN_PASS || "arthur14");
const JWT_SECRET = String(process.env.JWT_SECRET || "portfolio-jwt-change-in-production");
const CORS_ORIGINS = String(process.env.CORS_ORIGIN || "http://103.164.99.2:9991,http://localhost:9991")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const TOKEN_TTL_MS = Number(process.env.TOKEN_TTL_HOURS || 24) * 3600 * 1000;
const MAX_BODY = 2 * 1024 * 1024;
const MAX_BODY_MEDIA = 4 * 1024 * 1024;

fs.mkdirSync(DATA_DIR, { recursive: true });
const db = new Database(path.join(DATA_DIR, "portfolio.sqlite"));
db.pragma("journal_mode = WAL");

db.exec(`
CREATE TABLE IF NOT EXISTS portfolio (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  data_json TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
`);

function hydratePortfolioDefaults(data) {
  const defaults = defaultPortfolio();
  if (data.profile) {
    if (!data.profile.bio && defaults.profile.bio) data.profile.bio = defaults.profile.bio;
  }
  return data;
}

function loadPortfolio() {
  const row = db.prepare("SELECT data_json FROM portfolio WHERE id = 1").get();
  if (!row) {
    const data = defaultPortfolio();
    const now = new Date().toISOString();
    db.prepare("INSERT INTO portfolio (id, data_json, updated_at) VALUES (1, ?, ?)").run(
      JSON.stringify(data),
      now
    );
    return data;
  }
  return hydratePortfolioDefaults(media.migratePortfolioPhotos(JSON.parse(row.data_json)));
}

function savePortfolio(data) {
  const now = new Date().toISOString();
  db.prepare(
    "INSERT INTO portfolio (id, data_json, updated_at) VALUES (1, ?, ?) ON CONFLICT(id) DO UPDATE SET data_json = excluded.data_json, updated_at = excluded.updated_at"
  ).run(JSON.stringify(data), now);
  return { updatedAt: now };
}

function b64url(buf) {
  return Buffer.from(buf)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function signToken(payload) {
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = b64url(JSON.stringify(payload));
  const sig = crypto.createHmac("sha256", JWT_SECRET).update(header + "." + body).digest();
  return header + "." + body + "." + b64url(sig);
}

function verifyToken(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, body, sig] = parts;
  const expected = b64url(crypto.createHmac("sha256", JWT_SECRET).update(header + "." + body).digest());
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString());
    if (!payload.exp || Date.now() > payload.exp) return null;
    if (payload.sub !== ADMIN_USER) return null;
    return payload;
  } catch {
    return null;
  }
}

function timingSafeStr(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

function corsOrigin(req) {
  const origin = req.headers.origin || "";
  if (CORS_ORIGINS.includes("*") || CORS_ORIGINS.includes(origin)) return origin || CORS_ORIGINS[0];
  return CORS_ORIGINS[0] || "*";
}

function send(res, status, body, req) {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": corsOrigin(req),
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    Vary: "Origin"
  };
  res.writeHead(status, headers);
  res.end(typeof body === "string" ? body : JSON.stringify(body));
}

function readBody(req, maxBytes) {
  const limit = maxBytes || MAX_BODY;
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (c) => {
      size += c.length;
      if (size > limit) {
        reject(new Error("body_too_large"));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function normalizePortfolio(input) {
  const d = input && typeof input === "object" ? input : {};
  const profile = d.profile && typeof d.profile === "object" ? d.profile : {};
  const ach = d.achievements && typeof d.achievements === "object" ? d.achievements : {};
  const data = {
    profile: {
      name: String(profile.name || ""),
      nickname: String(profile.nickname || ""),
      tagline: String(profile.tagline || ""),
      interests: String(profile.interests || ""),
      email: String(profile.email || ""),
      phone: String(profile.phone || ""),
      location: String(profile.location || ""),
      linkedin: String(profile.linkedin || ""),
      github: String(profile.github || ""),
      photos: media.normalizePhotoList(profile.photos)
    },
    about: Array.isArray(d.about) ? d.about.map((p) => String(p)) : [],
    aboutPhotos: media.normalizePhotoList(d.aboutPhotos),
    experiences: Array.isArray(d.experiences)
      ? d.experiences.map((e, i) => ({
          id: String(e.id || "exp-" + (i + 1)),
          title: String(e.title || ""),
          company: String(e.company || ""),
          period: String(e.period || ""),
          bullets: Array.isArray(e.bullets) ? e.bullets.map((b) => String(b)) : [],
          photos: media.normalizePhotoList(e.photos)
        }))
      : [],
    achievements: {
      photos: media.normalizePhotoList(ach.photos),
      competitions: Array.isArray(ach.competitions) ? ach.competitions.map((x) => String(x)) : [],
      competitionPhotos: media.normalizePhotoList(ach.competitionPhotos),
      certifications: Array.isArray(ach.certifications) ? ach.certifications.map((x) => String(x)) : [],
      certificationPhotos: media.normalizePhotoList(ach.certificationPhotos),
      activities: Array.isArray(ach.activities) ? ach.activities.map((x) => String(x)) : [],
      activityPhotos: media.normalizePhotoList(ach.activityPhotos)
    },
    skills: Array.isArray(d.skills)
      ? d.skills.map((s, i) => ({
          id: String(s.id || "sk-" + (i + 1)),
          category: String(s.category || ""),
          items: String(s.items || "")
        }))
      : []
  };
  return media.migratePortfolioPhotos(data);
}

function sendBinary(res, status, buf, mime, req) {
  res.writeHead(status, {
    "Content-Type": mime,
    "Cache-Control": "public, max-age=86400",
    "Access-Control-Allow-Origin": corsOrigin(req),
    Vary: "Origin"
  });
  res.end(buf);
}

function authFromReq(req) {
  const h = req.headers.authorization || "";
  const m = /^Bearer\s+(.+)$/i.exec(h);
  return m ? verifyToken(m[1].trim()) : null;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", "http://" + (req.headers.host || "localhost"));

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": corsOrigin(req),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
      Vary: "Origin"
    });
    res.end();
    return;
  }

  try {
    if (req.method === "GET" && (url.pathname === "/health" || url.pathname === "/")) {
      send(res, 200, { ok: true, service: "portfolio-api" }, req);
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/portfolio") {
      send(res, 200, { ok: true, data: loadPortfolio() }, req);
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/auth/login") {
      const raw = await readBody(req);
      let body = {};
      try {
        body = JSON.parse(raw || "{}");
      } catch {
        send(res, 400, { ok: false, error: "invalid_json" }, req);
        return;
      }
      const user = String(body.username || "").trim();
      const pass = String(body.password || "");
      if (!timingSafeStr(user, ADMIN_USER) || !timingSafeStr(pass, ADMIN_PASS)) {
        send(res, 401, { ok: false, error: "invalid_credentials" }, req);
        return;
      }
      const exp = Date.now() + TOKEN_TTL_MS;
      const token = signToken({ sub: ADMIN_USER, exp });
      send(res, 200, { ok: true, token, expiresAt: new Date(exp).toISOString() }, req);
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/auth/me") {
      const payload = authFromReq(req);
      if (!payload) {
        send(res, 401, { ok: false, error: "unauthorized" }, req);
        return;
      }
      send(res, 200, { ok: true, user: payload.sub }, req);
      return;
    }

    const mediaMatch = url.pathname.match(/^\/api\/media\/([^/]+)$/);

    if (req.method === "GET" && mediaMatch) {
      const found = media.findMediaFile(mediaMatch[1]);
      if (!found) {
        send(res, 404, { ok: false, error: "not_found" }, req);
        return;
      }
      sendBinary(res, 200, fs.readFileSync(found.path), found.mime, req);
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/media") {
      const payload = authFromReq(req);
      if (!payload) {
        send(res, 401, { ok: false, error: "unauthorized" }, req);
        return;
      }
      const raw = await readBody(req, MAX_BODY_MEDIA);
      let body = {};
      try {
        body = JSON.parse(raw || "{}");
      } catch {
        send(res, 400, { ok: false, error: "invalid_json" }, req);
        return;
      }
      try {
        const saved = media.saveUpload(body.data || body.dataUrl);
        send(res, 200, { ok: true, id: saved.id, url: "/api/media/" + saved.id }, req);
      } catch (e) {
        const code = e && e.message ? e.message : "upload_failed";
        send(res, 400, { ok: false, error: code }, req);
        return;
      }
      return;
    }

    if (req.method === "DELETE" && mediaMatch) {
      const payload = authFromReq(req);
      if (!payload) {
        send(res, 401, { ok: false, error: "unauthorized" }, req);
        return;
      }
      const id = mediaMatch[1];
      media.deleteMedia(id);
      const data = loadPortfolio();
      media.removeIdFromPortfolio(data, id);
      savePortfolio(data);
      send(res, 200, { ok: true }, req);
      return;
    }

    if (req.method === "PUT" && url.pathname === "/api/portfolio") {
      const payload = authFromReq(req);
      if (!payload) {
        send(res, 401, { ok: false, error: "unauthorized" }, req);
        return;
      }
      const raw = await readBody(req);
      let body = {};
      try {
        body = JSON.parse(raw || "{}");
      } catch {
        send(res, 400, { ok: false, error: "invalid_json" }, req);
        return;
      }
      const data = normalizePortfolio(body.data || body);
      const meta = savePortfolio(data);
      send(res, 200, { ok: true, updatedAt: meta.updatedAt }, req);
      return;
    }

    send(res, 404, { ok: false, error: "not_found" }, req);
  } catch (e) {
    if (e && e.message === "body_too_large") {
      send(res, 413, { ok: false, error: "body_too_large" }, req);
      return;
    }
    console.error(e);
    send(res, 500, { ok: false, error: "server_error" }, req);
  }
});

media.ensureUploadDir();
loadPortfolio();
server.listen(PORT, "0.0.0.0", () => {
  console.log("portfolio-api listening on", PORT);
});
