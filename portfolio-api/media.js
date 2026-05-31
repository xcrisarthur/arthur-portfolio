"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const UPLOAD_DIR = path.join(process.env.DATA_DIR || "/data", "uploads");
const MAX_PHOTOS_PER_SECTION = 10;
/** 0 = tanpa batas ukuran file (default). Set MEDIA_MAX_BYTES untuk membatasi. */
const MAX_BYTES = Number(process.env.MEDIA_MAX_BYTES || 0);
const ALLOWED = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif"
};

function ensureUploadDir() {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

function mediaPath(id, ext) {
  return path.join(UPLOAD_DIR, id + ext);
}

function findMediaFile(id) {
  for (const ext of Object.values(ALLOWED)) {
    const p = mediaPath(id, ext);
    if (fs.existsSync(p)) return { path: p, ext, mime: mimeFromExt(ext) };
  }
  return null;
}

function mimeFromExt(ext) {
  if (ext === ".jpg") return "image/jpeg";
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  return "application/octet-stream";
}

function newMediaId() {
  return "m-" + Date.now().toString(36) + crypto.randomBytes(4).toString("hex");
}

function normalizePhotoList(list) {
  if (!Array.isArray(list)) return [];
  const out = [];
  const seen = {};
  for (let i = 0; i < list.length && out.length < MAX_PHOTOS_PER_SECTION; i++) {
    const item = list[i];
    const id = typeof item === "string" ? item : item && item.id ? String(item.id) : "";
    if (!/^m-[a-z0-9]+$/i.test(id) || seen[id]) continue;
    seen[id] = true;
    out.push({ id });
  }
  return out;
}

function saveUpload(dataUrl) {
  const m = /^data:(image\/[a-z+]+);base64,(.+)$/i.exec(String(dataUrl || ""));
  if (!m) throw new Error("invalid_data_url");
  const mime = m[1].toLowerCase();
  if (!ALLOWED[mime]) throw new Error("invalid_mime");
  const buf = Buffer.from(m[2], "base64");
  if (MAX_BYTES > 0 && buf.length > MAX_BYTES) throw new Error("file_too_large");
  ensureUploadDir();
  const id = newMediaId();
  const ext = ALLOWED[mime];
  fs.writeFileSync(mediaPath(id, ext), buf);
  return { id, mime, size: buf.length };
}

function deleteMedia(id) {
  const found = findMediaFile(id);
  if (found) fs.unlinkSync(found.path);
}

function removeIdFromPortfolio(data, id) {
  if (data.profile && data.profile.photos) {
    data.profile.photos = data.profile.photos.filter((p) => p.id !== id);
  }
  if (Array.isArray(data.aboutPhotos)) {
    data.aboutPhotos = data.aboutPhotos.filter((p) => p.id !== id);
  }
  if (Array.isArray(data.experiences)) {
    data.experiences.forEach((e) => {
      if (e.photos) e.photos = e.photos.filter((p) => p.id !== id);
    });
  }
  if (data.achievements) {
    const keys = ["photos", "competitionPhotos", "certificationPhotos", "activityPhotos"];
    keys.forEach((k) => {
      if (Array.isArray(data.achievements[k])) {
        data.achievements[k] = data.achievements[k].filter((p) => p.id !== id);
      }
    });
  }
}

function migratePortfolioPhotos(data) {
  if (!data.profile) data.profile = {};
  data.profile.photos = normalizePhotoList(data.profile.photos);
  data.aboutPhotos = normalizePhotoList(data.aboutPhotos);
  if (!data.achievements) data.achievements = {};
  data.achievements.photos = normalizePhotoList(data.achievements.photos);
  data.achievements.competitionPhotos = normalizePhotoList(data.achievements.competitionPhotos);
  data.achievements.certificationPhotos = normalizePhotoList(data.achievements.certificationPhotos);
  data.achievements.activityPhotos = normalizePhotoList(data.achievements.activityPhotos);
  if (Array.isArray(data.experiences)) {
    data.experiences = data.experiences.map((e) => ({
      ...e,
      photos: normalizePhotoList(e.photos)
    }));
  }
  return data;
}

module.exports = {
  UPLOAD_DIR,
  MAX_PHOTOS_PER_SECTION,
  MAX_BYTES,
  ensureUploadDir,
  findMediaFile,
  saveUpload,
  deleteMedia,
  removeIdFromPortfolio,
  migratePortfolioPhotos,
  normalizePhotoList
};
