# Newbee Web Sitesi (`newbeeapp.com`) — Durum

## Hedef
Newbee için tamamen İngilizce, tam ekran slayt kaydırmalı tanıtım sitesi (`newbeeapp.com` ve `www.newbeeapp.com`) ile cihaza göre mağaza yönlendirmesi yapan indirme bağlantısı (`download.newbeeapp.com` ve `/download`).

## Ana Slogan
> **"One-stop app to navigate all challenges of moving and living abroad."**

## Şu an
- **Canlı (`main` `31e2e68`):** Vercel üzerinde yayında (`newbeeapp.com`, `www.newbeeapp.com`, `download.newbeeapp.com`).
  - Ana sayfa (`/`): 5 slaytlık tam ekran kaydırmalı deneyim (`#start`, `#ask`, `#events`, `#meet`, `#get-started`).
  - `/communities` → `/#meet`, `/businesses` → `/#ask`, `/about` → `/#start` sunucu yönlendirmeleri aktif.
  - `/contact`, `/privacy` ve `/termsandconditions` sayfaları tamamen İngilizce (`lang="en"`).
  - `/download` (`download.newbeeapp.com`): Kullanıcı cihazına göre iOS App Store, Google Play veya masaüstü web (`https://www.newbeeapp.com/#get-started` / `https://app.newbeeapp.com`) yönlendirmesi yapar.
- **Geliştirme (`develop` `4efe7c5`, PR #7 — 2026-10-28):** 10/10 test ve yerel Docker yayın kapısı yükseltmesi tamamlandı:
  - Ortak iş mantığı `lib/marketing.ts` modülüne taşındı.
  - `lib/__tests__/marketing-and-download.test.ts` içinde 17 birim, yönlendirme ve güvenlik testi eklendi.
  - `npm run ci` (`lint → typecheck → check:security → test → build`) ve yerel Docker yayın kapısı (`Dockerfile.test`, `docker-compose.test.yml`, `npm run test:docker`) kuruldu.
- **Veritabanı ve sırlar:** Bu projede Supabase bağlantısı veya çalışma zamanı gizli anahtarı (secret) yoktur; tamamen bağımsız Next.js 16 uygulamasıdır.

## Sıradaki adımlar
1. `develop` dalındaki 10/10 test ve belge güncellemelerini PR onayıyla `main` dalına birleştir.
2. `newbeeapp.com` ve `download.newbeeapp.com` canlı yönlendirmelerini izlemeye devam et.

Son güncelleme: 2026-10-28
