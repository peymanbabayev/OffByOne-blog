import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pool = new Pool({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const initialPosts = [
  {
    slug: "ilk-yazi",
    title: "İlk yazım",
    excerpt: "Bu, blogumun ilk yazısıdır.",
    content:
      "İlk yazımın ətraflı məzmunu burada olacaq. Next.js, Prisma və Neon PostgreSQL ilə öyrənmə yolumuz davam edir!",
  },
  {
    slug: "nextjs-oyrenirem",
    title: "Next.js öyrənirəm",
    excerpt: "Server Components və Prisma adapterləri maraqlıdır.",
    content:
      "Next.js App Router-də Server Components default olaraq gəlir. Prisma 7-nin pg adapteri vasitəsilə artıq real PostgreSQL bazası ilə birbaşa əlaqə qururuq.",
  },
  {
    slug: "server-components-nedir",
    title: "React Server Components (RSC) nədir və niyə inqilabidir?",
    excerpt: "Müştəri tərəfə sıfır JavaScript göndərərək serverdə render olunmanın üstünlükləri.",
    content:
      "React Server Components (RSC) müasir veb proqramlaşdırmanın ən vacib yeniliklərindən biridir. Əvvəllər bütün komponentlər brauzerə böyük JS paketləri şəklində göndərilirdi. Server Components sayəsində komponentlər yalnız serverdə icra olunur, verilənlər bazası ilə birbaşa əlaqə saxlayır və brauzerə yalnız təmiz HTML/JSON qaytarır. Bu həm səhifənin ilk yüklənmə sürətini artırır, həm də SEO göstəricilərini əhəmiyyətli dərəcədə yaxşılaşdırır.",
  },
  {
    slug: "typescript-best-practices",
    title: "TypeScript ilə daha etibarlı kod yazmağın 5 qaydası",
    excerpt: "any tipindən qaçmaqdan tutmuş generics və utility tiplərin doğru istifadəsinə qədər.",
    content:
      "TypeScript sadəcə tiplər əlavə etmək deyil, kodun davamlılığını və etibarlılığını təmin etmək vasitəsidir. 1) 'any' tipindən uzaq durun və yerinə 'unknown' istifadə edin. 2) Strict rejimini aktiv saxlayın. 3) Union və Discriminated Union tiplərindən faydalanın. 4) Omit, Pick, Partial kimi daxili Utility tipləri mənimsəyin. 5) Zod kimi runtime doğrulama kitabxanaları ilə TypeScript interfeyslərini birləşdirin.",
  },
  {
    slug: "prisma-neon-postgresql",
    title: "Prisma və Neon ilə Serverless PostgreSQL arxitekturası",
    excerpt: "Serverless mühitdə connection pooling və serverless verilənlər bazalarının işləmə prinsipi.",
    content:
      "Ənənəvi PostgreSQL serverləri sabit sayda əlaqəni (connection) dəstəkləyir. Lakin serverless platformalarda hər sorğu yeni funksiya qaldıra bilər. Neon PostgreSQL bu problemi daxili PgBouncer əsaslı Connection Pooling ilə həll edir. Prisma 7 ilə birlikdə istifadə olunan '@prisma/adapter-pg' adapteri sayəsində tətbiqimiz baza ilə son dərəcə səmərəli və sürətli şəkildə əlaqə saxlayır.",
  },
  {
    slug: "tailwindcss-v4-yenilikler",
    title: "Tailwind CSS v4 ilə gələn əsas yeniliklər",
    excerpt: "Yeni Oxide mühərriki, CSS-first konfiqurasiya və sürət artımı haqqında.",
    content:
      "Tailwind CSS v4 versiyası ilə JavaScript əsaslı tailwind.config.js arxada qalır. Artıq konfiqurasiya birbaşa CSS faylında '@theme' direktivi ilə aparılır. Rust dilində yazılmış yeni 'Oxide' mühərriki sayəsində kompilasiya sürəti 10 qatadək artıb. Bundan əlavə, rəng palitraları və daxili utility sinifləri müasir CSS xüsusiyyətləri ilə daha da zənginləşdirilib.",
  },
  {
    slug: "web-performance-core-web-vitals",
    title: "Veb performansının açarı: Core Web Vitals nədir?",
    excerpt: "LCP, FID/INP və CLS metrikalarını başa düşmək və optimizasiya etmək.",
    content:
      "Google-un Core Web Vitals metrikləri istifadəçi təcrübəsini ölçmək üçün əsas meyardır. Largest Contentful Paint (LCP) səhifənin ən böyük vizual elementinin nə vaxt yükləndiyini göstərir. Interaction to Next Paint (INP) səhifənin istifadəçi toxunuşuna cavabvermə sürətini ölçür. Cumulative Layout Shift (CLS) isə yüklənmə zamanı elementlərin gözlənilməz yer dəyişmələrini qeydə alır. Şəkillərin düzgün ölçüləndirilməsi və font optimizasiyası bu metrikaları kəskin yaxşılaşdırır.",
  },
  {
    slug: "rest-vs-graphql",
    title: "REST vs GraphQL: Hansı layihədə hansını seçməli?",
    excerpt: "Over-fetching, under-fetching və iki API arxitekturasının müqayisəsi.",
    content:
      "REST sadəliyi, geniş ekosistemi və güclü HTTP keşləmə imkanları ilə illərdir standartdır. Lakin mobil tətbiqlərdə və mürəkkəb münasibətli verilənlər strukturunda GraphQL 'over-fetching' (lazım olandan çox məlumat almaq) və 'under-fetching' (birdən çox sorğu göndərmək məcburiyyəti) problemlərini aradan qaldırır. Kiçik və orta layihələrdə REST kifayət edirsə, dərin əlaqəli və elastik sorğu tələb edən sistemlərdə GraphQL üstünlük qazanır.",
  },
  {
    slug: "clean-code-prinsipleri",
    title: "Təmiz kod (Clean Code) yazmağın təməl prinsipləri",
    excerpt: "Oxunaqlı, saxlanıla bilən və gələcəyə davamlı kod arxitekturası.",
    content:
      "Hər kəs kompyuterin başa düşdüyü kodu yaza bilər, lakin yaxşı proqramçılar insanların rahat oxuyub anlaya bildiyi kodu yazırlar. Dəyişənlərə və funksiyalara aydın adlar vermək, bir funksiyaya yalnız tək bir vəzifə tapşırmaq (Single Responsibility), lazımsız şərhlərdən qaçıb kodu öz-özünü izah edən hala gətirmək və DRY (Don't Repeat Yourself) prinsipinə əməl etmək təmiz kodun təməl daşlarıdır.",
  },
  {
    slug: "git-ve-github-strategiyalari",
    title: "Git və GitHub: Peşəkar komandalarda budaqlanma strategiyaları",
    excerpt: "GitFlow, GitHub Flow və Trunk-based Development modellərinin fərqləri.",
    content:
      "Böyük komandalarda paralel işləyərkən merge konfliktlərinin qarşısını almaq üçün budaqlanma (branching) strategiyası şərtdir. GitFlow klassik reliz dövrləri olan böyük layihələr üçün əlverişlidir. Müasir web tətbiqlərində isə sadəliyinə və sürətinə görə GitHub Flow və ya Trunk-based development daha çox tətbiq edilir. Hər bir xüsusiyyət üçün kiçik 'feature branch' açmaq və PR vasitəsilə kod icmalı keçirmək keyfiyyəti təmin edir.",
  },
  {
    slug: "docker-esaslari-developers",
    title: "Proqramçılar üçün Docker: Konteynerləşdirmənin əsasları",
    excerpt: "'Mənim kompyuterimdə işləyirdi' probleminə birdəfəlik son qoymaq.",
    content:
      "Docker tətbiqi bütün asılılıqları, mühit dəyişənləri və sistem kitabxanaları ilə birlikdə izolyasiya olunmuş yüngül konteynerlərə yığır. Dockerfile vasitəsilə tətbiqin imicini qurmaq və docker-compose ilə verilənlər bazası (PostgreSQL, Redis) kimi xidmətləri bir əmrlə qaldırmaq komanda daxilində eyni mühiti təmin edir və serverə yerləşdirmə prosesini xeyli sadələşdirir.",
  },
  {
    slug: "sql-indeksleme-ve-optimizasiya",
    title: "SQL bazalarında indeksləmə və sorğuların optimallaşdırılması",
    excerpt: "B-Tree indeksləri, EXPLAIN ANALYZE və sorğu gecikmələrini azaltmaq yolları.",
    content:
      "Bazada məlumat artdıqca düzgün indekslənməmiş cədvəllərdə 'Full Table Scan' baş verir və axtarışlar yavaşlayır. 'WHERE', 'JOIN' və 'ORDER BY' şərtlərində tez-tez istifadə olunan sütunlara indeks qoymaq sorğuların icrasını millisekundlar səviyyəsinə endirir. Lakin unutmaq olmaz ki, hər əlavə indeks 'INSERT' və 'UPDATE' əməliyyatlarını bir qədər ləngidir. Buna görə də tarazlığı qorumaq vacibdir.",
  },
  {
    slug: "jwt-ve-sessiya-tehlukesizliyi",
    title: "Veb təhlükəsizliyi: JWT yoxsa Session əsaslı autentifikasiya?",
    excerpt: "Stateless tokenlər ilə Stateful sessiyaların müsbət və mənfi cəhətləri.",
    content:
      "JWT (JSON Web Token) stateless struktura malik olduğu üçün mikroservislərdə və paylanmış sistemlərdə çox rahatdır. Lakin JWT-nin vaxtından əvvəl etibarsızlaşdırılması (invalidation / logout) çətindir. Stateful sessiyalarda isə hər sorğuda baza və ya Redis yoxlanılır, bu da istifadəçini istənilən an bloklamağa imkan verir. Ən təhlükəsiz üsul qısamüddətli Access Token (JWT) və httpOnly cookie-də saxlanılan Refresh Token tandemidir.",
  },
  {
    slug: "nextjs-server-actions",
    title: "Next.js Server Actions ilə formların idarə edilməsi",
    excerpt: "Ayrı API route yazmadan birbaşa server funksiyalarını çağırmaq.",
    content:
      "Next.js App Router ilə birlikdə gələn Server Actions xüsusiyyəti sayəsində artıq hər form üçün ayrıca '/api/submit' route yazmağa ehtiyac yoxdur. Formun 'action' atributuna birbaşa asinxron server funksiyası bağlamaq mümkündür. 'useActionState' və 'useFormStatus' hook-ları ilə yüklənmə vəziyyətlərini və xəta mesajlarını idarə etmək çox rahat və təbii şəkildə həyata keçirilir.",
  },
  {
    slug: "microservices-vs-monolith",
    title: "Mikroservislər vs Monolit: Doğru arxitektura seçimi",
    excerpt: "Erkən mikroservis arxitekturasının təhlükələri və Modular Monolith yanaşması.",
    content:
      "Son illərdə mikroservislər çox populyarlaşsa da, hər layihə üçün uyğun deyil. Mikroservislər paylanmış sistem mürəkkəbliyi, şəbəkə gecikmələri və çətin monitoring problemləri gətirir. Əksər startaplar və yeni layihələr üçün yaxşı dizayn edilmiş 'Modulyar Monolit' arxitekturası həm inkişaf sürəti, həm də sadəlik baxımından ən doğru başlanğıcdır.",
  },
  {
    slug: "ci-cd-avtomatlasdirilmasi",
    title: "GitHub Actions ilə CI/CD proseslərinin avtomatlaşdırılması",
    excerpt: "Testlərin avtomatik işə salınması, lint yoxlanışları və istehsalata deploy.",
    content:
      "CI/CD (Continuous Integration & Continuous Deployment) komandanın iş sürətini və kod keyfiyyətini qoruyan mühərrikdir. GitHub Actions vasitəsilə hər 'git push' zamanı avtomatik linting (ESLint), tip yoxlaması (TypeScript) və vahid testlər (Jest/Vitest) icra edilir. Yalnız bütün testlərdən keçən kodlar avtomatik olaraq istehsalat mühitinə göndərilir.",
  },
  {
    slug: "javascript-event-loop",
    title: "JavaScript Event Loop və asinxron proqramlaşdırmanın daxili məntiqi",
    excerpt: "Call Stack, Microtask Queue (Promises) və Macrotask Queue (setTimeout) fərqi.",
    content:
      "JavaScript tək axınlı (single-threaded) dildir, bəs o necə eyni anda minlərlə asinxron əməliyyatı çatdırır? Cavab Event Loop-dadır. Sinxron kodlar dərhal Call Stack-də icra olunur. Promise 'then' və 'await' kimi mikrotapşırıqlar Microtask Queue-yə, setTimeout və I/O kimi əməliyyatlar isə Task Queue-yə göndərilir. Call Stack boşalan kimi əvvəlcə bütün mikrotapşırıqlar, sonra isə növbəti makrotapşırıq işə salınır.",
  },
  {
    slug: "state-management-2026",
    title: "Müasir React-də State Management: Zustand, Jotai yoxsa Redux?",
    excerpt: "Mürəkkəb Redux boilerplate-lərindən yüngül və atomik həllərə keçid.",
    content:
      "Əvvəllər hər React layihəsində standart olaraq Redux istifadə edilirdisə, bu gün vəziyyət çox dəyişib. Server vəziyyətini idarə etmək üçün TanStack Query (React Query) və ya Server Components kifayət edir. Qlobal müştəri vəziyyəti üçün isə Zustand sadəliyi və minimalizmi ilə liderlik edir. Atomik vəziyyət idarəsi tələb olunan yerlərdə isə Jotai ideal seçimdir.",
  },
  {
    slug: "api-design-best-practices",
    title: "RESTful API dizaynında diqqət edilməli 7 qızıl qayda",
    excerpt: "Status kodları, versiyalama, pagination və səhvlərin vahid formatda qaytarılması.",
    content:
      "Gözəl bir API həm tərtibatçı dostu, həm də gələcəyə davamlı olmalıdır. 1) URL-lərdə fellər əvəzinə isimlərdən istifadə edin (/users, /posts). 2) Müvafiq HTTP metodlarını (GET, POST, PUT, PATCH, DELETE) doğru tətbiq edin. 3) Düzgün HTTP status kodları qaytarın (200, 201, 400, 401, 404, 500). 4) Siyahı qaytaran sorğularda mütləq pagination tətbiq edin. 5) Xəta cavablarını vahid və aydın JSON formatında təqdim edin.",
  },
  {
    slug: "ai-tools-proqramlasdirmada",
    title: "Süni intellekt alətlərinin proqramçının gündəlik işinə təsiri",
    excerpt: "AI proqramçıları əvəz edəcəkmi, yoxsa onların məhsuldarlığını artıracaq?",
    content:
      "Müasir süni intellekt köməkçiləri proqramlaşdırma mənzərəsini kökündən dəyişir. Təkrarlanan kod bloklarının yazılması, vahid testlərin generasiyası, refaktorinq və xətaların tapılması AI ilə inanılmaz dərəcədə sürətlənir. Lakin sistem arxitekturasının qurulması, biznes məntiqinin dərk edilməsi və kritik təhlükəsizlik qərarları yenə də təcrübəli proqramçının əlində qalır.",
  },
  {
    slug: "seo-optimizasiyasi-nextjs",
    title: "Next.js ilə Texniki SEO və Meta Tagların düzgün qurulması",
    excerpt: "Dinamik OpenGraph şəkilləri, sitemap.xml və robots.txt yaradılması.",
    content:
      "Axtarış sistemlərində (Google) yüksək pillələrdə yer almaq üçün Next.js App Router geniş imkanlar yaradır. 'generateMetadata' funksiyası ilə hər məqalə üçün dinamik 'title', 'description' və OpenGraph tagları formalaşdırılır. Həmçinin 'app/sitemap.ts' və 'app/robots.ts' faylları vasitəsilə axtarış botları üçün dinamik sitemap və indeksləmə qaydalarını bir neçə sətir kodla yaratmaq mümkündür.",
  },
];

async function main() {
  console.log(`🌱 Verilənlər bazası toxumlanır (${initialPosts.length} post)...`);

  for (const post of initialPosts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
      },
      create: post,
    });
  }

  console.log(`✅ Seed əməliyyatı uğurla tamamlandı! Cəmi ${initialPosts.length} post bazaya yazıldı.`);
}

main()
  .catch((e) => {
    console.error("❌ Seed zamanı xəta baş verdi:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
