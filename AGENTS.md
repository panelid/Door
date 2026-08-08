---
# Door.id — Agent Context

## Stack Saat Ini
- Framework: Next.js 15 + Tailwind v4 + shadcn/ui (new-york)
- Database: Supabase (PostgreSQL + Auth)
- Storage: Cloudflare R2
- Hosting: Vercel (production)
- DNS: Cloudflare

## Environment
- x.door.id = sandbox/preview — semua eksperimen di sini dulu
- door.id = production — jangan deploy tanpa izin eksplisit Sobur

## Rules Wajib
- Baca struktur repo aktual dari disk sebelum coding apapun
- Jangan replace komponen yang sudah berjalan — extend, jangan overwrite
- Setiap fitur baru: buat di branch baru, test di x.door.id dulu
- Jalankan npm run build sebelum push apapun
- Cloudflare Pages tidak bisa build Next.js — jangan push ke sana

## Fitur Aktif (jangan diubah tanpa izin)
- Short link + redirect (/[slug])
- Paste dengan password protection
- QR code generator
- Dashboard user
- Auth via Supabase

## Sebelum Tambah Fitur Baru
1. Cek docs resmi teknologi yang akan dipakai
2. Buat plan + estimasi, konfirmasi ke Sobur
3. Buat di branch baru
4. Test end-to-end di x.door.id
5. Laporkan bukti (screenshot/curl) sebelum minta merge ke main

## Update File Ini
Kalau stack atau arsitektur berubah, update file ini dan 
laporkan perubahannya ke Sobur secara eksplisit.
---
