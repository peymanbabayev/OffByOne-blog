# 🚀 OffByOne — Modern Full-Stack Mühəndislik Bloqu

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-16.3.4-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.10.0-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_Serverless-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech/)
[![Docker](https://img.shields.io/badge/Docker-Multi--stage-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/features/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

<br />

**Kompüter elmləri, paylanmış sistemlər, sistem arxitekturası və müasir veb mühəndisliyi haqqında yüksək performanslı və dərinləşdirilmiş bloq platforması.**

[Canlı Mühitlər](#-canlı-mühitlər) • [Arxitektura Sxemi](#-sistem-arxitekturası) • [Əsas Xüsusiyyətlər](#-əsas-xüsusiyyətlər-və-mühəndislik-nailiyyətləri) • [Təhlükəsizlik](#-təhlükəsizlik-arxitekturası-owasp-standartları) • [Texnologiya Qatı](#-texnologiya-qatı) • [Quraşdırma](#-yerli-mühitdə-işə-salma) • [English Summary](#-english-summary--architecture-overview)

</div>

---

## 📑 Mündəricat (Table of Contents)

1. [Layihə Haqqında & Fəlsəfə](#-layihə-haqqında--fəlsəfə)
2. [Canlı Mühitlər (Production & Staging)](#-canlı-mühitlər)
3. [Sistem Arxitekturası](#-sistem-arxitekturası)
4. [Verilənlər Bazası Modeli (ERD)](#-verilənlər-bazası-modeli-erd)
5. [Əsas Xüsusiyyətlər və Mühəndislik Nailiyyətləri](#-əsas-xüsusiyyətlər-və-mühəndislik-nailiyyətləri)
   - [Next.js 16 & React 19 RSC Mühərriki](#1-nextjs-16--react-19-rsc-mühərriki)
   - [Spotlight Search (Cmd+K / Ctrl+K)](#2-spotlight-search-cmdk--ctrlk)
   - [Post Slug History & 308 Daimi Yönləndirmə (SEO Friendly)](#3-post-slug-history--308-daimi-yönləndirmə-seo-friendly)
   - [Navigation API Əsaslı Scroll Bərpası (Scroll Restoration)](#4-navigation-api-əsaslı-scroll-bərpası-scroll-restoration)
   - [Vercel Blob ilə Birbaşa Müştəri Yükləməsi (Direct Client Upload)](#5-vercel-blob-ilə-birbaşa-müştəri-yükləməsi-direct-client-upload)
   - [Beynəlxalqlaşdırma (i18n: AZ, EN, RU)](#6-beynəlxalqlaşdırma-i18n-az-en-ru)
   - [FOUC-suz Tema Sistemi (Dark / Light / System)](#7-fouc-suz-tema-sistemi-dark--light--system)
6. [Təhlükəsizlik Arxitekturası (OWASP Standartları)](#-təhlükəsizlik-arxitekturası-owasp-standartları)
7. [Texnologiya Qatı](#-texnologiya-qatı)
8. [Layihə Strukturu](#-layihə-strukturu)
9. [Yerli Mühitdə İşə Salma](#-yerli-mühitdə-işə-salma)
10. [Ətraf Mühit Dəyişənləri (.env)](#-ətraf-mühit-dəyişənləri-env)
11. [Verilənlər Bazası & Prisma Əmrləri](#-verilənlər-bazası--prisma-əmrləri)
12. [Docker & DevOps Konfiqurasiyası](#-docker--devops-konfiqurasiyası)
13. [CI/CD İş Axınları (GitHub Actions)](#-cicd-iş-axınları-github-actions)
14. [English Summary & Architecture Overview](#-english-summary--architecture-overview)
15. [Müəllif və Lisenziya](#-müəllif-və-lisenziya)

---

## 📖 Layihə Haqqında & Fəlsəfə

**OffByOne**, proqramlaşdırmada ən məşhur indeksləmə və sərhəd xətalarından biri olan *"Off-by-one error"* konseptindən ilhamlanaraq adlandırılmışdır. Bu layihə təkcə standart bir bloq tətbiqi deyil — müasir veb mühəndisliyindəki ən qabaqcıl prinsipləri nümayiş etdirən sənaye səviyyəli bir platformadır:

- **Sıfır lazımsız müştəri JavaScript-i:** React Server Components (RSC) ilə maksimum LCP (Largest Contentful Paint) göstəricisi.
- **RPC tipli Server Actions:** Ənənəvi REST marşrutlarından imtina edərək birbaşa server funksiyalarının tip-təhlükəsiz icrası.
- **Kibertəhlükəsizlik Zirehi:** OWASP tələblərinə uyğun `server-only` Data Access Layer (DAL), `__Host-` prefiksli qorunan cookie-lər, `sessionVersion` ilə multi-cihaz sessiya ləğvi və Timing Attack müdafiəsi.
- **İtkin Keçidlərin Qarşısının Alınması:** Slug dəyişiklikləri zamanı SEO reytinqini qoruyan avtomatik `308 Permanent Redirect` sistemi.
- **Tam Avtomatlaşdırılmış DevOps:** Multi-stage yüngül Docker imicləri, Nginx reverse proxy və sıfır dayanma vaxtı (zero-downtime) ilə çalışan GitHub Actions CI/CD boru xətləri.

---

## 🌐 Canlı Mühitlər

Layihə real VPS serverində Docker konteynerləri və Nginx reverse proxy vasitəsilə daimi işlək vəziyyətdə saxlanılır:

| Mühit | Canlı Keçid Linki | Budaq (Branch) | Təyinat & Davranış |
| :--- | :--- | :--- | :--- |
| 🚀 **Production** | [offbyoneblog.duckdns.org](https://offbyoneblog.duckdns.org) | `main` | İstehsalat mühiti, avtomatik Let's Encrypt SSL, zero-downtime deploy, rollback mexanizmi |
| 🧪 **Staging (Dev)** | [offbyoneblog-dev.duckdns.org](https://offbyoneblog-dev.duckdns.org) | `dev` | Tərtibat və sınaq mühiti, yeni funksiyaların və miqrasiyaların real serverdə test edilməsi |

---

## 🏗 Sistem Arxitekturası

Aşağıdakı diaqram istifadəçi sorğusunun brauzerdən verilənlər bazasına və bulud anbarına qədər olan tam yolunu əks etdirir:

```mermaid
graph TD
    Client["🌐 İstifadəçi Brauzeri (Client)"]
    DNS["🌐 DuckDNS & HTTPS (Port 443)"]
    Nginx["🛡️ Nginx Reverse Proxy (SSL / Certbot)"]
    
    subgraph "Docker Şəbəkəsi (shared-web)"
        AppContainer["⚡ Next.js 16 Standalone Konteyneri (Node 20 Alpine)"]
        
        subgraph "Next.js Daxili Qatları"
            Proxy["src/proxy.ts<br/>• i18n Dil Təyinatı<br/>• Optimistik JWT Yoxlanışı<br/>• Sliding Session Yeniləməsi"]
            DAL["src/lib/auth.ts (DAL - server-only)<br/>• React cache() tək sorğu<br/>• DB-dən sessionVersion Yoxlanışı<br/>• Rol Yoxlanışı (RBAC)"]
            Actions["Server Actions (src/actions/)<br/>• Zod Sahə Doğrulaması<br/>• Məqalə CRUD & Slugs<br/>• Şəkil Blob İdarəsi"]
        end
    end

    NeonDB[("🐘 Neon Serverless PostgreSQL<br/>PgBouncer Bağlantı Hovuzu")]
    VercelBlob[("☁️ Vercel Blob Storage<br/>Örtük Şəkilləri və Avatarlar")]

    Client -->|HTTPS / WSS| DNS
    DNS --> Nginx
    Nginx -->|Reverse Proxy :3000| AppContainer
    AppContainer --> Proxy
    Proxy --> DAL
    DAL --> Actions
    Actions -->|Prisma Adapter @prisma/adapter-pg| NeonDB
    Client -.->|Birbaşa Tokenli Yükləmə| VercelBlob
```

---

## 🗄 Verilənlər Bazası Modeli (ERD)

Prisma 7 ORM vasitəsilə idarə olunan relyasion verilənlər sxemi:

```mermaid
erDiagram
    User ||--o{ Post : "müəllifidir"
    Post ||--o{ PostSlugHistory : "keçmiş URL tarixçəsi"
    
    User {
        String id PK "cuid()"
        String name "İstifadəçinin adı və soyadı"
        String email UK "Unikal e-poçt ünvanı"
        String password "Bcrypt ilə heşlənmiş şifrə"
        Role role "USER | ADMIN"
        String avatar "Vercel Blob şəklinin URL-i"
        Int sessionVersion "Sessiya ləğvi sayğacı (Default: 0)"
        DateTime createdAt "Qeydiyyat tarixi"
        DateTime updatedAt "Son yenilənmə tarixi"
    }

    Post {
        String id PK "cuid()"
        String slug UK "Unikal URL açarı (Transliterasiya olunmuş)"
        String title "Məqalənin tam başlığı"
        String excerpt "Qısa xülasə (10-300 simvol)"
        String content "Məqalənin əsas mətni"
        String coverImage "Vercel Blob örtük şəkli"
        String category "Seçilmiş texniki kateqoriya"
        String authorId FK "User cədvəlinə xarici açar (SetNull)"
        DateTime createdAt "Dərc tarixi"
        DateTime updatedAt "Son redaktə tarixi"
    }

    PostSlugHistory {
        String id PK "cuid()"
        String slug UK "Köhnə URL açarı"
        String postId FK "Post cədvəlinə xarici açar (Cascade)"
        DateTime createdAt "Dəyişdirilmə tarixi"
    }
```

---

## ✨ Əsas Xüsusiyyətlər və Mühəndislik Nailiyyətləri

### 1. Next.js 16 & React 19 RSC Mühərriki
- **Sıfır Artıq JavaScript:** Məqalələrin oxunması, axtarışı və siyahılanması React Server Components (RSC) üzərində qurulub. Brauzer yalnız hazır HTML və minimal interaktivlik kodunu qəbul edir.
- **Server Actions (REST API-siz Memarlıq):** Ənənəvi `/api/posts`, `/api/login` kimi REST endpoint-lərinə ehtiyac yoxdur. Əməliyyatlar birbaşa tip-təhlükəsiz server funksiyaları ilə çağırılır və `revalidatePath` vasitəsilə keşlər anında yenilənir.
- **Neon Serverless PostgreSQL & Connection Pooling:** `@prisma/adapter-pg` vasitəsilə runtime-da PgBouncer bağlantı hovuzu istifadə edilir. Bu, serverless mühitlərdə ani sorğu emalı təmin edir və verilənlər bazası bağlantı limitlərinin tükənməsinin qarşısını alır.

### 2. Spotlight Search (Cmd+K / Ctrl+K)
- İstənilən səhifədən klaviatura qısayolu (`⌘K` və ya `Ctrl+K`) və ya navbar-dakı axtarış düyməsi ilə açılır.
- Başlıq, məzmun, kateqoriya və müəllif üzrə dərhal axtarış aparır.
- Tam klaviatura naviqasiyası (`ArrowUp`, `ArrowDown`, `Enter`, `Escape`) və responsiv modal interfeysi təqdim edir.

### 3. Post Slug History & 308 Daimi Yönləndirmə (SEO Friendly)
- **Problem:** Məqalənin başlığı dəyişdirildikdə URL (slug) dəyişir və xarici keçidlər, axtarış motorlarındakı indekslər qırılır (404 xətası).
- **Həll:** Başlıq redaktə edildikdə köhnə slug avtomatik olaraq `PostSlugHistory` cədvəlinə arxivlənir. İstifadəçi köhnə keçidlə daxil olduqda `src/lib/posts.ts` dərhal `308 Permanent Redirect` cavabı qaytararaq oxucunu və axtarış botlarını yeni ünvana yönləndirir.
- **Azərbaycan Əlifbasına Uyğun Transliterasiya:** `src/lib/slug.ts` köməkçisi milli hərfləri (`ə` $\rightarrow$ `e`, `ı` $\rightarrow$ `i`, `ö` $\rightarrow$ `o`, `ü` $\rightarrow$ `u`, `ş` $\rightarrow$ `s`, `ç` $\rightarrow$ `c`, `ğ` $\rightarrow$ `g`) təmiz URL formatına çevirir və təsadüfi toqquşmaları (`makeUniqueSlug`) rəqəmsal indekslərlə aradan qaldırır.

### 4. Navigation API Əsaslı Scroll Bərpası (Scroll Restoration)
- **Problem:** İstifadəçi sonsuz sürüşdürmə (infinite scroll) ilə məqalələri vərəqləyib bir yazıya keçdikdə və brauzerin "Geri" düyməsini basdıqda, Next.js App Router səhifəni yenidən render edir və istifadəçi ən yuxarıya atılır.
- **Mühəndislik Həlli:** `src/lib/scroll-restoration.ts` modulu `sessionStorage` və müasir **Navigation API** (`traverse` hadisəsi) vasitəsilə istifadəçinin son mövqeyini, yüklənmiş məqalələr siyahısını və səhifələmə vəziyyətini yadda saxlayır və yalnız geri/irəli hərəkətlərdə itkisiz bərpa edir.

### 5. Vercel Blob ilə Birbaşa Müştəri Yükləməsi (Direct Client Upload)
- Böyük şəkillər (5MB-a qədər) serverin yaddaşını və bant genişliyini yükləmədən birbaşa brauzerdən `@vercel/blob` bulud anbarına ötürülür.
- `/api/blob/upload` route handler-i yalnız autentifikasiyadan keçmiş istifadəçilərə qısamüddətli, icazəli yükləmə tokeni təqdim edir.
- Məqalə və ya profil şəkli yeniləndikdə/silindikdə köhnə fayl avtomatik olaraq Vercel Blob-dan silinir və anbarın zibillənməsinin qarşısı alınır.

### 6. Beynəlxalqlaşdırma (i18n: AZ, EN, RU)
- **Dillər:** Azərbaycan dili (defolt), İngilis və Rus dilləri.
- **Proxy Qatı:** `src/proxy.ts` gələn sorğularda dil prefiksi (`/[lang]/...`) olmadıqda ardıcıllıqla yoxlayır:
  1. İstifadəçinin seçdiyi çərəz (`NEXT_LOCALE`),
  2. Brauzerin `Accept-Language` başlığı,
  3. Defolt dil (`az`).
- **SEO İkiqat İndekslənmə Müdafiəsi:** Məqalənin mətni tərcümə olunmadığı üçün alternativ dillərdə kanonik URL kimi əsas dil ünvanı göstərilir ki, axtarış sistemlərində dublikat kontent cəzası yaranmasın.

### 7. FOUC-suz Tema Sistemi (Dark / Light / System)
- `InlineThemeScript` birbaşa HTML `<head>` hissəsində icra olunur. Bu, səhifə açılarkən qaranlıq rejimdə ağartı və ya titrəmə (Flash of Unstyled Content) baş verməsinin qarşısını 100% alır.
- Sistem seçiminə dinamik reaksiya verir (`prefers-color-scheme`).

---

## 🔒 Təhlükəsizlik Arxitekturası (OWASP Standartları)

Layihədə kibertəhlükəsizlik ən yüksək beynəlxalq standartlara (OWASP Top 10) uyğun olaraq layihələndirilib:

| Təhlükəsizlik Qorunması | Tətbiq Mexanizmi | Fayl / Komponent |
| :--- | :--- | :--- |
| **Data Access Layer (DAL)** | `server-only` modulu vasitəsilə autentifikasiya və avtorizasiya hər səhifə və Server Action-da təkrar yoxlanılır. | `src/lib/auth.ts` |
| **`__Host-` Cookie Prefiksi** | İstehsalatda sessiya cookie-si `__Host-auth_token` adlandırılır. Bu, RFC 6265bis standartına əsasən yalnız HTTPS, kök yol (`Path=/`) və subdomen təhlükəsizliyini təmin edir. | `src/lib/jwt.ts` |
| **Session Versioning (Revocation)** | Şifrə dəyişdikdə və ya istifadəçi "Bütün digər cihazlardan çıxış" etdikdə `sessionVersion` artırılır və köhnə JWT-lər dərhal qüvvədən düşür. | `src/actions/auth.ts` |
| **Timing Attack Müdafiəsi** | Yanlış e-poçt daxil edildikdə belə, sabit zamanlı saxta heş yoxlanışı icra olunur ki, hakerlər istifadəçi mövcudluğunu ölçə bilməsinlər. | `src/actions/auth.ts` |
| **Open Redirect Mühafizəsi** | Girişdən sonra yönləndirmə parametrləri (`?from=...`) yalnız təhlükəsiz daxili yollara icazə verən `sanitizeRedirectPath` ilə süzülür. | `src/lib/redirects.ts` |
| **Zod Runtime Validasiyası** | Bütün form məlumatları icra olunmazdan əvvəl Zod sxemləri ilə yoxlanılır, XSS və injection cəhdləri zərərsizləşdirilir. | `src/lib/validations/` |
| **İki Mərhələli Silmə (Arm/Confirm)** | Məqalənin silinməsi təsadüfi kliklərə qarşı iki mərhələli təsdiq pəncərəsi ilə qorunur. | `DeletePostButton.tsx` |

---

## 🛠 Texnologiya Qatı

| Kateqoriya | Texnologiya | Versiya | Təyinat və Rolu |
| :--- | :--- | :--- | :--- |
| **Əsas Çərçivə** | [Next.js](https://nextjs.org/) | `16.3.4` | App Router, Server Components, Server Actions, Standalone Build |
| **İstifadəçi İnterfeysi** | [React](https://react.dev/) | `19.2.8` | `useActionState`, Actions, Optimistic UI Hooks |
| **Proqramlaşdırma Dili** | [TypeScript](https://www.typescriptlang.org/) | `^5` | 100% Strict Type Safety, mərkəzləşdirilmiş DTO qatı |
| **Dizayn və Stillər** | [Tailwind CSS](https://tailwindcss.com/) | `^4` | PostCSS mühərriki, CSS dəyişənləri, tünd/işıqlı tema |
| **ORM** | [Prisma](https://www.prisma.io/) | `^7.10.0` | Type-safe ORM klient, SQL miqrasiyaları |
| **Verilənlər Bazası** | [PostgreSQL (Neon)](https://neon.tech/) | *Serverless* | PgBouncer bağlantı hovuzu, serverless cloud DB |
| **DB Adapteri** | `@prisma/adapter-pg` | `^7.10.0` | Node `pg` hovuzlaşdırması ilə Prisma bağlantısı |
| **Autentifikasiya** | [jose](https://github.com/panva/jose) | `^6.2.12` | Kriptoqrafik HS256 JWT generasiyası və təsdiqi |
| **Şifrələmə** | [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | `^3.0.3` | Parolların duzlanması və heşlənməsi (Salt rounds) |
| **Fayl Anbarı** | [@vercel/blob](https://vercel.com/docs/storage/blob) | `^2.8.0` | Şəkillərin buludda saxlanması və CDN yayımı |
| **Məlumat Validasiyası** | [Zod](https://zod.dev/) | `^4.5.4` | Runtime schema validasiyası və forma xətaları |
| **Konteynerləşdirmə** | [Docker](https://www.docker.com/) | *Alpine* | Multi-stage qurulma və minimal imic ölçüsü |
| **Veb Server & SSL** | [Nginx](https://nginx.org/) | *Alpine* | Reverse proxy, Let's Encrypt avtomatik SSL |
| **CI / CD** | [GitHub Actions](https://github.com/features/actions) | `v4` | Avtomatik test, miqrasiya və VPS deploy boru xətti |

---

## 📂 Layihə Strukturu

```text
OffByOne-blog/
├── .github/
│   └── workflows/
│       ├── deploy-production.yml  # main budağı üçün istehsalat deploy boru xətti
│       └── deploy-staging.yml     # dev budağı üçün sınaq mühiti deploy boru xətti
├── prisma/
│   ├── migrations/              # Tarixi SQL miqrasiya qeydləri
│   ├── schema.prisma            # Prisma modelləri (User, Post, PostSlugHistory)
│   ├── seed.ts                  # Yalnız ilkin admin hesabı yaratmaq üçün seed
│   └── seed-mock-data.ts        # Tam zəngin test məqalələri və istifadəçi seed-i
├── public/                      # Statik resurslar, veb ikonları və loqolar
├── src/
│   ├── actions/                 # "use server" Server Actions
│   │   ├── auth.ts              # Giriş, qeydiyyat, çıxış və sessiya ləğvi
│   │   ├── posts.ts             # Məqalə yaratma, redaktə, silmə, axtarış və scroll
│   │   └── profile.ts           # Profil şəkli (avatar) yeniləmə və silmə
│   ├── app/                     # Next.js App Router strukturu
│   │   ├── [lang]/              # Çoxdilli dinamik marşrut seqmenti
│   │   │   ├── about/           # Manifest və layihə haqqında səhifəsi
│   │   │   ├── blog/[slug]/     # Məqalə baxış səhifəsi (308 yönləndirmə dəstəyi ilə)
│   │   │   ├── edit-post/[id]/  # Məqalə redaktə səhifəsi
│   │   │   ├── login/           # Giriş səhifəsi
│   │   │   ├── my-posts/        # Müəllifin fərdi məqalələrinin siyahısı
│   │   │   ├── new-post/        # Yeni məqalə yazma səhifəsi
│   │   │   ├── register/        # Qeydiyyat səhifəsi
│   │   │   ├── settings/        # İstifadəçi tənzimləmələri və təhlükəsizlik
│   │   │   ├── layout.tsx       # Qlobal layaut (Navbar, Footer, I18nProvider)
│   │   │   └── page.tsx         # Əsas səhifə (Hero, Spotlight, PostFeed, Sidebar)
│   │   ├── api/blob/upload/     # Vercel Blob client-upload token route handler-i
│   │   ├── favicon.ico          # Brauzer ikonu
│   │   ├── globals.css          # Tailwind CSS v4 idxalı və qlobal stillər
│   │   ├── robots.ts            # Dinamik robots.txt generasiyası
│   │   └── sitemap.ts           # Dinamik sitemap.xml generasiyası
│   ├── components/              # Komponentlər kitabxanası
│   │   ├── auth/                # AuthForm, PasswordField
│   │   ├── blog/                # Spotlight, PostCard, PostList, PostRow, PostForm və s.
│   │   │   └── sidebar/         # AuthorCard, CategoryTags, ReadingStatsCard
│   │   ├── layout/              # Navbar, Footer, UserMenu
│   │   ├── settings/            # AvatarSettings, ThemeSettings, LanguageSettings
│   │   └── ui/                  # Təməl UI elementləri (Avatar, Modal, Input, Spinner)
│   ├── constants/               # Kateqoriyalar, səhifələmə sayı, statik məlumatlar
│   ├── hooks/                   # Xüsusi React hook-ları (debounce, media-query)
│   ├── i18n/                    # Beynəlxalqlaşdırma mexanizmi (AZ, EN, RU lüğətləri)
│   ├── lib/                     # Yardımçı funksiyalar və biznes məntiqi
│   │   ├── auth.ts              # Data Access Layer - DAL (requireAuth, getCurrentUser)
│   │   ├── blob.ts              # Vercel Blob fayl əməliyyatları
│   │   ├── image.ts             # Şəkil tipi və ölçü məhdudiyyətləri
│   │   ├── jwt.ts               # Jose ilə JWT token generasiyası və sliding check
│   │   ├── permissions.ts       # Müəlliflik və admin icazə yoxlamaları
│   │   ├── post-slug.ts         # Unikal slug generasiyası və toqquşma yoxlanışı
│   │   ├── posts.ts             # Məqalələrin oxunması və 308 redirect məntiqi
│   │   ├── prisma.ts            # PrismaClient tək instansiyası və hovuz konfiqurasiyası
│   │   ├── reading-time.ts      # Oxuma müddəti və söz sayğacı alqoritmi
│   │   ├── redirects.ts         # Təhlükəsiz yönləndirmə filtri (Open Redirect Guard)
│   │   ├── scroll-restoration.ts# Sonsuz sürüşdürmə üçün Navigation API mövqe bərpası
│   │   └── validations/         # Zod forma sxemləri (auth, post, profile)
│   ├── proxy.ts                 # Next.js 16 Proxy (i18n & optimistik auth yönləndirməsi)
│   ├── theme/                   # FOUC-suz tema idarəetməsi (InlineThemeScript)
│   └── types/                   # TypeScript qlobal interfeysləri
├── docker-compose.yml           # Production Docker Compose konfiqurasiyası
├── docker-compose.staging.yml   # Staging Docker Compose konfiqurasiyası
├── Dockerfile                   # 3-mərhələli standalone Dockerfile
├── nginx.conf                   # Nginx Reverse Proxy və SSL konfiqurasiyası
├── package.json                 # Asılılıqlar və işə salma skriptləri
└── tsconfig.json                # TypeScript qaydaları və alias-lar (@/*)
```

---

## 💻 Yerli Mühitdə İşə Salma

Layihəni öz kompüterinizdə qaldırmaq üçün aşağıdakı addımları izləyin:

### Ön Şərtlər
- **Node.js:** v20.x və ya daha yuxarı
- **Paket meneceri:** `npm` (v10+)
- **Verilənlər Bazası:** PostgreSQL instansiyası (və ya pulsuz [Neon](https://neon.tech/) verilənlər bazası)

### Addım-addım Quraşdırma

1. **Repozitoriyanı klonlayın:**
   ```bash
   git clone https://github.com/peymanbabayev/OffByOne-blog.git
   cd OffByOne-blog
   ```

2. **Paketləri quraşdırın:**
   ```bash
   npm ci
   ```

3. **Ətraf mühit dəyişənlərini təyin edin:**
   ```bash
   cp .env.example .env
   ```
   `.env` faylını mətn redaktorunda açaraq öz dəyərlərinizi daxil edin.

4. **Verilənlər bazası miqrasiyalarını icra edin:**
   ```bash
   npx prisma migrate dev
   ```

5. **Test məlumatlarını bazaya əlavə edin (Seed):**
   ```bash
   # Yalnız admin istifadəçisi yaratmaq üçün:
   npm run seed

   # Geniş məqalələr toplusu və kateqoriyalar ilə zənginləşdirmək üçün:
   npm run seed:mock
   ```

6. **İnkişaf serverini başladın:**
   ```bash
   npm run dev
   ```

Brauzerdə [http://localhost:3000](http://localhost:3000) ünvanını açın. Sistem sizi avtomatik olaraq `http://localhost:3000/az` səhifəsinə yönləndirəcəkdir.

---

## ⚙️ Ətraf Mühit Dəyişənləri (`.env`)

Layihənin tam funksionallığı üçün tələb olunan konfiqurasiya açarları:

```env
# === PostgreSQL (Neon Serverless) ===
# Runtime üçün Connection Pooling ünvanı (Prisma klient tərəfindən istifadə olunur)
DATABASE_URL="postgresql://user:password@ep-xyz-pooler.region.neon.tech/neondb?sslmode=require"

# Miqrasiyalar və Prisma CLI üçün birbaşa direct ünvan (prisma.config.ts tərəfindən istifadə olunur)
DIRECT_URL="postgresql://user:password@ep-xyz.region.neon.tech/neondb?sslmode=require"

# === Vercel Blob Storage ===
# Örtük şəkilləri və istifadəçi avatarlarını saxlamaq üçün oxuma/yazma tokeni
# Vercel Dashboard -> Storage -> Blob bölməsindən əldə edilir
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# === Autentifikasiya (JWT) ===
# Minimum 256-bit kriptoqrafik gizli açar. Terminalda yaratmaq üçün:
# openssl rand -hex 32
JWT_SECRET="replace-with-a-very-secure-random-hex-string-min-32-bytes"

# === Verilənlər Bazası Seed Parametrləri (Opsional) ===
# 'npm run seed' zamanı ilkin admin hesabı yaratmaq üçün istifadə edilir
SEED_ADMIN_EMAIL="admin@example.com"
SEED_ADMIN_PASSWORD="AdminPassword123"
SEED_ADMIN_NAME="Peyman Babayev"
```

---

## 🗄 Verilənlər Bazası & Prisma Əmrləri

| Əmr | Təsvir |
| :--- | :--- |
| `npx prisma generate` | Prisma Client-i tiplərlə birlikdə yenidən generasiya edir |
| `npx prisma migrate dev` | Sxem dəyişiklikləri üçün yeni SQL miqrasiyası yaradır və yerli bazaya tətbiq edir |
| `npx prisma migrate deploy` | Mövcud miqrasiya fayllarını istehsalat (production) bazasına tətbiq edir |
| `npm run seed` | `.env`-də göstərilən məlumatlarla ilkin admin istifadəçisini yaradır |
| `npm run seed:mock` | Təqdimat və inkişaf üçün çoxsaylı məqalə və kateqoriyanı avtomatik bazaya doldurur |
| `npx prisma studio` | İnteraktiv veb interfeysində məlumat bazasını idarə etmək üçün lokal panel açır |

---

## 🐳 Docker & DevOps Konfiqurasiyası

### Multi-Stage Standalone Quruluş
Next.js konfiqurasiyasındakı `output: "standalone"` rejimi sayəsində istehsalat konteyneri yalnız layihənin icrası üçün lazım olan minimal runtime fayllarını toplayır. Bu, yekun Docker imicinin həcmini **~150MB-a qədər azaldır**:

```dockerfile
# 1. Mərhələ: Asılılıqların quraşdırılması (deps)
FROM node:20-alpine AS deps
...
RUN npm ci

# 2. Mərhələ: Prisma generasiyası və Next.js istehsalat build-i (builder)
FROM node:20-alpine AS builder
...
RUN npx prisma generate
RUN npm run build

# 3. Mərhələ: Yüngül istehsalat mühərriki (runner)
FROM node:20-alpine AS runner
...
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
CMD ["node", "server.js"]
```

### Yerli Docker ilə Test Etmək
```bash
# Konteyneri qurun və arxa planda işə salın:
docker compose up -d --build

# Konteynerin loqlarını izləyin:
docker compose logs -f app
```

---

## 🚀 CI/CD İş Axınları (GitHub Actions)

Layihədə fasiləsiz inteqrasiya və çatdırılma (CI/CD) tam avtomatlaşdırılmışdır:

### 1. Sınaq Mühiti (`deploy-staging.yml`)
- **Tətikləyici:** `dev` budağına push edildikdə.
- **Addımlar:**
  1. Kodu yoxlayır və Node 20 mühitini hazırlayır.
  2. Staging verilənlər bazasında miqrasiyaları icra edir (`npx prisma migrate deploy`).
  3. Appleboy SSH vasitəsilə VPS serverinə qoşulur.
  4. `docker-compose.staging.yml` faylı vasitəsilə `app-staging` konteynerini yenidən qurur və işə salır.

### 2. İstehsalat Mühiti (`deploy-production.yml`)
- **Tətikləyici:** `main` budağına push/merge edildikdə.
- **Addımlar:**
  1. İstehsalat verilənlər bazasında miqrasiyaları icra edir.
  2. VPS-də ən son kodu çəkir (`git pull origin main`).
  3. **Təhlükəsizlik Yoxlanışı (Nginx Config Test):** Müvəqqəti konteynerdə `nginx -t` əmrini icra edir.
  4. Nginx konfiqurasiyasında sintaksis xətası olarsa, **dərhal əvvəlki commit-ə rollback edir (`git reset --hard`)** və sistemi qoruyur.
  5. Konfiqurasiya təmizdirsə, sıfır dayanma vaxtı ilə istehsalat konteynerini yeniləyir (`docker compose up -d --build app nginx`).

---

## 🌐 English Summary & Architecture Overview

> **Note for International Reviewers:**  
> OffByOne is a modern, high-performance, and resilient full-stack blogging platform dedicated to deep computer science, distributed systems, and modern software engineering.

### 🔑 Key Engineering Highlights
- **Next.js 16 App Router & React 19 RSC:** Eliminates unnecessary client-side JavaScript, maximizing Core Web Vitals (LCP, INP, CLS).
- **Pure Server Actions (RPC Pattern):** Replaces classic REST API routing with type-safe server actions accompanied by instant path revalidation (`revalidatePath`).
- **Resilient Post Slug History & 308 Redirects:** Modifying an article's title/slug automatically records old slugs in `PostSlugHistory`, serving `308 Permanent Redirect` on legacy URLs to preserve backlinks and search engine rankings.
- **Scroll Restoration via Modern Navigation API:** Solves the classic Next.js App Router infinite scroll loss issue by caching page index, loaded posts, and scroll offset in `sessionStorage` using the browser's Navigation API `traverse` events.
- **OWASP-Hardened Security:**
  - `server-only` Data Access Layer (DAL) ensuring authorization cannot be bypassed.
  - `__Host-` prefixed secure cookies preventing subdomain injection (RFC 6265bis).
  - Multi-device instant session revocation via atomic `sessionVersion` counters.
  - Constant-time password hashing to mitigate timing attacks.
  - `sanitizeRedirectPath` safeguarding against Open Redirect vulnerabilities.
- **Direct Client-to-Cloud Uploads:** Offloads multipart image streams to Vercel Blob directly from the browser using scoped server-signed tokens, keeping server memory minimal.
- **Multilingual Support (i18n):** Native 3-language system (Azerbaijani, English, Russian) routed via custom Next.js 16 proxy with automatic `Accept-Language` and cookie negotiation.
- **Zero-Downtime CI/CD:** Fully automated GitHub Actions deployment to VPS with automated database migrations, multi-stage Alpine Docker containers, and Nginx safety pre-flight test with automatic rollback.

---

## 👨‍💻 Müəllif və Əlaqə

**Peyman Babayev**  
*Full-Stack Proqram Mühəndisi*  
- **GitHub:** [@peymanbabayev](https://github.com/peymanbabayev)  
- **Canlı Layihə:** [OffByOne Blog](https://offbyoneblog.duckdns.org)

---

## 📄 Lisenziya

Bu layihə [MIT Lisenziyası](LICENSE) altında yayımlanır. Kodu sərbəst şəkildə araşdıra, öyrənə və öz layihələrinizdə istifadə edə bilərsiniz.
