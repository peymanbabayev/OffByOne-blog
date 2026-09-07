import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { passwordSchema } from "../src/lib/validations/auth";

const pool = new Pool({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const initialPosts = [
  {
    slug: "ilk-yazi",
    title: "İlk yazım",
    category: "Mühəndislik",
    excerpt: "Bu, blogumun ilk yazısıdır.",
    content:
      "İlk yazımın ətraflı məzmunu burada olacaq. Next.js, Prisma və Neon PostgreSQL ilə öyrənmə yolumuz davam edir!",
  },
  {
    slug: "nextjs-oyrenirem",
    title: "Next.js öyrənirəm",
    category: "Next.js",
    excerpt: "Server Components və Prisma adapterləri maraqlıdır.",
    content:
      "Next.js App Router-də Server Components default olaraq gəlir. Prisma 7-nin pg adapteri vasitəsilə artıq real PostgreSQL bazası ilə birbaşa əlaqə qururuq.",
  },
  {
    slug: "server-components-nedir",
    title: "React Server Components (RSC) nədir və niyə inqilabidir?",
    category: "React",
    excerpt: "Müştəri tərəfə sıfır JavaScript göndərərək serverdə render olunmanın üstünlükləri.",
    content:
      "React Server Components (RSC) müasir veb proqramlaşdırmanın ən vacib yeniliklərindən biridir. Əvvəllər bütün komponentlər brauzerə böyük JS paketləri şəklində göndərilirdi. Server Components sayəsində komponentlər yalnız serverdə icra olunur, verilənlər bazası ilə birbaşa əlaqə saxlayır və brauzerə yalnız təmiz HTML/JSON qaytarır. Bu həm səhifənin ilk yüklənmə sürətini artırır, həm də SEO göstəricilərini əhəmiyyətli dərəcədə yaxşılaşdırır.",
  },
  {
    slug: "typescript-best-practices",
    title: "TypeScript ilə daha etibarlı kod yazmağın 5 qaydası",
    category: "TypeScript",
    excerpt: "any tipindən qaçmaqdan tutmuş generics və utility tiplərin doğru istifadəsinə qədər.",
    content:
      "TypeScript sadəcə tiplər əlavə etmək deyil, kodun davamlılığını və etibarlılığını təmin etmək vasitəsidir. 1) 'any' tipindən uzaq durun və yerinə 'unknown' istifadə edin. 2) Strict rejimini aktiv saxlayın. 3) Union və Discriminated Union tiplərindən faydalanın. 4) Omit, Pick, Partial kimi daxili Utility tipləri mənimsəyin. 5) Zod kimi runtime doğrulama kitabxanaları ilə TypeScript interfeyslərini birləşdirin.",
  },
  {
    slug: "prisma-neon-postgresql",
    title: "Prisma və Neon ilə Serverless PostgreSQL arxitekturası",
    category: "Database",
    excerpt: "Serverless mühitdə connection pooling və serverless verilənlər bazalarının işləmə prinsipi.",
    content:
      "Ənənəvi PostgreSQL serverləri sabit sayda əlaqəni (connection) dəstəkləyir. Lakin serverless platformalarda hər sorğu yeni funksiya qaldıra bilər. Neon PostgreSQL bu problemi daxili PgBouncer əsaslı Connection Pooling ilə həll edir. Prisma 7 ilə birlikdə istifadə olunan '@prisma/adapter-pg' adapteri sayəsində tətbiqimiz baza ilə son dərəcədə səmərəli və sürətli şəkildə əlaqə saxlayır.",
  },
  {
    slug: "tailwindcss-v4-yenilikler",
    title: "Tailwind CSS v4 ilə gələn əsas yeniliklər",
    category: "Mühəndislik",
    excerpt: "Yeni Oxide mühərriki, CSS-first konfiqurasiya və sürət artımı haqqında.",
    content:
      "Tailwind CSS v4 versiyası ilə JavaScript əsaslı tailwind.config.js arxada qalır. Artıq konfiqurasiya birbaşa CSS faylında '@theme' direktivi ilə aparılır. Rust dilində yazılmış yeni 'Oxide' mühərriki sayəsində kompilasiya sürəti 10 qatadək artıb. Bundan əlavə, rəng palitraları və daxili utility sinifləri müasir CSS xüsusiyyətləri ilə daha da zənginləşdirilib.",
  },
  {
    slug: "web-performance-core-web-vitals",
    title: "Veb performansının açarı: Core Web Vitals nədir?",
    category: "Performance",
    excerpt: "LCP, FID/INP və CLS metrikalarını başa düşmək və optimizasiya etmək.",
    content:
      "Google-un Core Web Vitals metrikləri istifadəçi təcrübəsini ölçmək üçün əsas meyardır. Largest Contentful Paint (LCP) səhifənin ən böyük vizual elementinin nə vaxt yükləndiyini göstərir. Interaction to Next Paint (INP) səhifənin istifadəçi toxunuşuna cavabvermə sürətini ölçür. Cumulative Layout Shift (CLS) isə yüklənmə zamanı elementlərin gözlənilməz yer dəyişmələrini qeydə alır. Şəkillərin düzgün ölçüləndirilməsi və font optimizasiyası bu metrikaları kəskin yaxşılaşdırır.",
  },
  {
    slug: "rest-vs-graphql",
    title: "REST vs GraphQL: Hansı layihədə hansını seçməli?",
    category: "Mühəndislik",
    excerpt: "Over-fetching, under-fetching və iki API arxitekturasının müqayisəsi.",
    content:
      "REST sadəliyi, geniş ekosistemi və güclü HTTP keşləmə imkanları ilə illərdir standartdır. Lakin mobil tətbiqlərdə və mürəkkəb münasibətli verilənlər strukturunda GraphQL 'over-fetching' (lazım olandan çox məlumat almaq) və 'under-fetching' (birdən çox sorğu göndərmək məcburiyyəti) problemlərini aradan qaldırır. Kiçik və orta layihələrdə REST kifayət edirsə, dərin əlaqəli və elastik sorğu tələb edən sistemlərdə GraphQL üstünlük qazanır.",
  },
  {
    slug: "clean-code-prinsipleri",
    title: "Təmiz kod (Clean Code) yazmağın təməl prinsipləri",
    category: "Best Practices",
    excerpt: "Oxunaqlı, saxlanıla bilən və gələcəyə davamlı kod arxitekturası.",
    content:
      "Hər kəs kompyuterin başa düşdüyü kodu yaza bilər, lakin yaxşı proqramçılar insanların rahat oxuyub anlaya bildiyi kodu yazırlar. Dəyişənlərə və funksiyalara aydın adlar vermək, bir funksiyaya yalnız tək bir vəzifə tapşırmaq (Single Responsibility), lazımsız şərhlərdən qaçıb kodu öz-özünü izah edən hala gətirmək və DRY (Don't Repeat Yourself) prinsipinə əməl etmək təmiz kodun təməl daşlarıdır.",
  },
  {
    slug: "git-ve-github-strategiyalari",
    title: "Git və GitHub: Peşəkar komandalarda budaqlanma strategiyaları",
    category: "DevOps",
    excerpt: "GitFlow, GitHub Flow və Trunk-based Development modellərinin fərqləri.",
    content:
      "Böyük komandalarda paralel işləyərkən merge konfliktlərinin qarşısını almaq üçün budaqlanma (branching) strategiyası şərtdir. GitFlow klassik reliz dövrləri olan böyük layihələr üçün əlverişlidir. Müasir web tətbiqlərində isə sadəliyinə və sürətinə görə GitHub Flow və ya Trunk-based development daha çox tətbiq edilir. Hər bir xüsusiyyət üçün kiçik 'feature branch' açmaq və PR vasitəsilə kod icmalı keçirmək keyfiyyəti təmin edir.",
  },
  {
    slug: "docker-esaslari-developers",
    title: "Proqramçılar üçün Docker: Konteynerləşdirmənin əsasları",
    category: "DevOps",
    excerpt: "'Mənim kompyuterimdə işləyirdi' probleminə birdəfəlik son qoymaq.",
    content:
      "Docker tətbiqi bütün asılılıqları, mühit dəyişənləri və sistem kitabxanaları ilə birlikdə izolyasiya olunmuş yüngül konteynerlərə yığır. Dockerfile vasitəsilə tətbiqin imicini qurmaq və docker-compose ilə verilənlər bazası (PostgreSQL, Redis) kimi xidmətləri bir əmrlə qaldırmaq komanda daxilində eyni mühiti təmin edir və serverə yerləşdirmə prosesini xeyli sadələşdirir.",
  },
  {
    slug: "sql-indeksleme-ve-optimizasiya",
    title: "SQL bazalarında indeksləmə və sorğuların optimallaşdırılması",
    category: "Database",
    excerpt: "B-Tree indeksləri, EXPLAIN ANALYZE və sorğu gecikmələrini azaltmaq yolları.",
    content:
      "Bazada məlumat artdıqca düzgün indekslənməmiş cədvəllərdə 'Full Table Scan' baş verir və axtarışlar yavaşlayır. 'WHERE', 'JOIN' və 'ORDER BY' şərtlərində tez-tez istifadə olunan sütunlara indeks qoymaq sorğuların icrasını millisekundlar səviyyəsinə endirir. Lakin unutmaq olmaz ki, hər əlavə indeks 'INSERT' və 'UPDATE' əməliyyatlarını bir qədər ləngidir. Buna görə də tarazlığı qorumaq vacibdir.",
  },
  {
    slug: "jwt-ve-sessiya-tehlukesizliyi",
    title: "Veb təhlükəsizliyi: JWT yoxsa Session əsaslı autentifikasiya?",
    category: "Best Practices",
    excerpt: "Stateless tokenlər ilə Stateful sessiyaların müsbət və mənfi cəhətləri.",
    content:
      "JWT (JSON Web Token) stateless struktura malik olduğu üçün mikroservislərdə və paylanmış sistemlərdə çox rahatdır. Lakin JWT-nin vaxtından əvvəl etibarsızlaşdırılması (invalidation / logout) çətindir. Stateful sessiyalarda isə hər sorğuda baza və ya Redis yoxlanılır, bu da istifadəçini istənilən an bloklamağa imkan verir. Ən təhlükəsiz üsul qısamüddətli Access Token (JWT) və httpOnly cookie-də saxlanılan Refresh Token tandemidir.",
  },
  {
    slug: "nextjs-server-actions",
    title: "Next.js Server Actions ilə formların idarə edilməsi",
    category: "Next.js",
    excerpt: "Ayrı API route yazmadan birbaşa server funksiyalarını çağırmaq.",
    content:
      "Next.js App Router ilə birlikdə gələn Server Actions xüsusiyyəti sayəsində artıq hər form üçün ayrıca '/api/submit' route yazmağa ehtiyac yoxdur. Formun 'action' atributuna birbaşa asinxron server funksiyası bağlamaq mümkündür. 'useActionState' və 'useFormStatus' hook-ları ilə yüklənmə vəziyyətlərini və xəta mesajlarını idarə etmək çox rahat və təbii şəkildə həyata keçirilir.",
  },
  {
    slug: "microservices-vs-monolith",
    title: "Mikroservislər vs Monolit: Doğru arxitektura seçimi",
    category: "Mühəndislik",
    excerpt: "Erkən mikroservis arxitekturasının təhlükələri və Modular Monolith yanaşması.",
    content:
      "Son illərdə mikroservislər çox populyarlaşsa da, hər layihə üçün uyğun deyil. Mikroservislər paylanmış sistem mürəkkəbliyi, şəbəkə gecikmələri və çətin monitoring problemləri gətirir. Əksər startaplar və yeni layihələr üçün yaxşı dizayn edilmiş 'Modulyar Monolit' arxitekturası həm inkişaf sürəti, həm də sadəlik baxımından ən doğru başlanğıcdır.",
  },
  {
    slug: "ci-cd-avtomatlasdirilmasi",
    title: "GitHub Actions ilə CI/CD proseslərinin avtomatlaşdırılması",
    category: "DevOps",
    excerpt: "Testlərin avtomatik işə salınması, lint yoxlanışları və istehsalata deploy.",
    content:
      "CI/CD (Continuous Integration & Continuous Deployment) komandanın iş sürətini və kod keyfiyyətini qoruyan mühərrikdir. GitHub Actions vasitəsilə hər 'git push' zamanı avtomatik linting (ESLint), tip yoxlaması (TypeScript) və vahid testlər (Jest/Vitest) icra edilir. Yalnız bütün testlərdən keçən kodlar avtomatik olaraq istehsalat mühitinə göndərilir.",
  },
  {
    slug: "javascript-event-loop",
    title: "JavaScript Event Loop və asinxron proqramlaşdırmanın daxili məntiqi",
    category: "Best Practices",
    excerpt: "Call Stack, Microtask Queue (Promises) və Macrotask Queue (setTimeout) fərqi.",
    content:
      "JavaScript tək axınlı (single-threaded) dildir, bəs o necə eyni anda minlərlə asinxron əməliyyatı çatdırır? Cavab Event Loop-dadır. Sinxron kodlar dərhal Call Stack-də icra olunur. Promise 'then' və 'await' kimi mikrotapşırıqlar Microtask Queue-yə, setTimeout və I/O kimi əməliyyatlar isə Task Queue-yə göndərilir. Call Stack boşalan kimi əvvəlcə bütün mikrotapşırıqlar, sonra isə növbəti makrotapşırıq işə salınır.",
  },
  {
    slug: "state-management-2026",
    title: "Müasir React-də State Management: Zustand, Jotai yoxsa Redux?",
    category: "React",
    excerpt: "Mürəkkəb Redux boilerplate-lərindən yüngül və atomik həllərə keçid.",
    content:
      "Əvvəllər hər React layihəsində standart olaraq Redux istifadə edilirdisə, bu gün vəziyyət çox dəyişib. Server vəziyyətini idarə etmək üçün TanStack Query (React Query) və ya Server Components kifayət edir. Qlobal müştəri vəziyyəti üçün isə Zustand sadəliyi və minimalizmi ilə liderlik edir. Atomik vəziyyət idarəsi tələb olunan yerlərdə isə Jotai ideal seçimdir.",
  },
  {
    slug: "api-design-best-practices",
    title: "RESTful API dizaynında diqqət edilməli 7 qızıl qayda",
    category: "Best Practices",
    excerpt: "Status kodları, versiyalama, pagination və səhvlərin vahid formatda qaytarılması.",
    content:
      "Gözəl bir API həm tərtibatçı dostu, həm də gələcəyə davamlı olmalıdır. 1) URL-lərdə fellər əvəzinə isimlərdən istifadə edin (/users, /posts). 2) Müvafiq HTTP metodlarını (GET, POST, PUT, PATCH, DELETE) doğru tətbiq edin. 3) Düzgün HTTP status kodları qaytarın (200, 201, 400, 401, 404, 500). 4) Siyahı qaytaran sorğularda mütləq pagination tətbiq edin. 5) Xəta cavablarını vahid və aydın JSON formatında təqdim edin.",
  },
  {
    slug: "ai-tools-proqramlasdirmada",
    title: "Süni intellekt alətlərinin proqramçının gündəlik işinə təsiri",
    category: "Mühəndislik",
    excerpt: "AI proqramçıları əvəz edəcəkmi, yoxsa onların məhsuldarlığını artıracaq?",
    content:
      "Müasir süni intellekt köməkçiləri proqramlaşdırma mənzərəsini kökündən dəyişir. Təkrarlanan kod bloklarının yazılması, vahid testlərin generasiyası, refaktorinq və xətaların tapılması AI ilə inanılmaz dərəcədə sürətlənir. Lakin sistem arxitekturasının qurulması, biznes məntiqinin dərk edilməsi və kritik təhlükəsizlik qərarları yenə də təcrübəli proqramçının əlində qalır.",
  },
  {
    slug: "seo-optimizasiyasi-nextjs",
    title: "Next.js ilə Texniki SEO və Meta Tagların düzgün qurulması",
    category: "Next.js",
    excerpt: "Dinamik OpenGraph şəkilləri, sitemap.xml və robots.txt yaradılması.",
    content:
      "Axtarış sistemlərində (Google) yüksək pillələrdə yer almaq üçün Next.js App Router geniş imkanlar yaradır. 'generateMetadata' funksiyası ilə hər məqalə üçün dinamik 'title', 'description' və OpenGraph tagları formalaşdırılır. Həmçinin 'app/sitemap.ts' və 'app/robots.ts' faylları vasitəsilə axtarış botları üçün dinamik sitemap və indeksləmə qaydalarını bir neçə sətir kodla yaratmaq mümkündür.",
  },
  {
    slug: "docker-containerization-prinsip-2026",
    title: "Docker ilə tətbiqlərin konteynerləşdirilməsi: Əsas prinsiplər",
    category: "DevOps",
    excerpt: "Dockerfile optimizasiyası, multi-stage builds və mühitlər arası fərqlərin aradan qaldırılması.",
    content:
      "Docker tətbiqlərimizi istənilən serverdə eyni şəkildə işə salmağa imkan verir. Multi-stage build yanaşması ilə istehsalat konteynerlərinin ölçüsünü 1GB-dan 50MB-a qədər azaltmaq mümkündür. Node.js və Next.js layihələrində Alpine və ya Distroless bazalı kiçik Linux təsvirlərindən istifadə təhlükəsizliyi də artırır.",
  },
  {
    slug: "postgresql-indekslashdirme-strategiyasi",
    title: "PostgreSQL-də İndeksləşdirmə: B-Tree və GIN fərqləri",
    category: "Database",
    excerpt: "Verilənlər bazası sorğularını 100 qatadək sürətləndirməyin yolları və EXPLAIN ANALYZE.",
    content:
      "İndekslər düzgün qurulmadıqda milyonlarla sətirlik cədvəldə axtarış 'Seq Scan' ilə bütün cədvəli oxuyaraq CPU-nu boğur. B-Tree indeksləri bərabərlik və diapazon axtarışları üçün ideal olduğu halda, JSONB və tam mətn (Full-Text) axtarışları üçün GIN indeksləri tələb olunur. EXPLAIN ANALYZE ilə icra planını oxumaq hər bir mühəndisin borcudur.",
  },
  {
    slug: "react-19-actions-ve-form-status",
    title: "React 19 Actions və useActionState hook-u",
    category: "React",
    excerpt: "Asinxron keçidlər, form vəziyyətinin avtomatik idarəsi və optimistik yeniləmələr.",
    content:
      "React 19 ilə birlikdə formalar və asinxron əməliyyatlar üçün inqilabi hook-lar gəldi. 'useActionState' ilə formun nəticəsi, xətası və yüklənmə statusu tək bir hook daxilində həll edilir. 'useOptimistic' isə serverdən cavab gəlməmiş istifadəçi interfeysini anında yeniləyərək super sürətli hissiyyat yaradır.",
  },
  {
    slug: "typescript-generics-derin-baxis",
    title: "TypeScript Generics: Çevik və Təhlükəsiz Kod Arxitekturası",
    category: "TypeScript",
    excerpt: "Təkrar istifadə oluna bilən, dinamik lakin tip etibarlılığı itməyən funksiya və interfeyslər.",
    content:
      "Generics TypeScript-in ən güclü xüsusiyyətidir. Sadə 'any' tipindən fərqli olaraq, Generics daxil olan tip ilə çıxan tip arasındakı bağlılığı qoruyur. 'T extends object' kimi generic constraints və 'infer' açar sözü ilə mürəkkəb tip manipulyasiyaları aparmaq mümkündür.",
  },
  {
    slug: "nextjs-caching-strategiyalari-ve-revalidation",
    title: "Next.js-də Keşləmə Strategiyaları və revalidatePath",
    category: "Next.js",
    excerpt: "Data Cache, Full Route Cache və On-Demand Revalidation mexanizmləri.",
    content:
      "Next.js App Router dörd fərqli səviyyədə keşləmə həyata keçirir: Router Cache, Full Route Cache, Request Memoization və Data Cache. Dəyişiklik baş verdikdə 'revalidatePath' və ya 'revalidateTag' ilə yalnız lazım olan səhifə və ya komponenti arxa planda yeniləmək olur.",
  },
  {
    slug: "web-security-owasp-top-10",
    title: "Veb Təhlükəsizliyi: OWASP Top 10 zəiflikləri və müdafiə",
    category: "Best Practices",
    excerpt: "SQL Injection, XSS, CSRF və Broken Authentication hücumlarından qorunma.",
    content:
      "İnternetdə hər bir ictimai veb tətbiq potensial hədəfdir. Prisma və müasir ORM-lər parametrləşdirilmiş sorğularla SQL Injection-ın qarşısını alır. Lakin Cross-Site Scripting (XSS) üçün 'dangerouslySetInnerHTML'-dən qaçmaq, Content Security Policy (CSP) başlıqları qurmaq və SameSite cookie siyasəti tətbiq etmək mütləqdir.",
  },
  {
    slug: "clean-architecture-frontend",
    title: "Frontend layihələrində Clean Architecture və Layered Design",
    category: "Mühəndislik",
    excerpt: "Biznes məntiqini UI freymvorkundan (React/Next) necə müstəqil saxlamaq olar?",
    content:
      "Clean Architecture yalnız backend üçün deyil. Frontend-də komponentləri 3 qata bölmək tövsiyə olunur: 1) Domain Layer (tiplər və biznes qaydaları), 2) Application Layer (servislər, sorğular, custom hook-lar), 3) Presentation Layer (JSX, vizual komponentlər). Bu yanaşma tətbiqin test edilməsini çox asanlaşdırır.",
  },
  {
    slug: "database-migrations-best-practices",
    title: "Verilənlər Bazasında Sıfır Fasiləli (Zero-Downtime) Miqrasiya",
    category: "Database",
    excerpt: "Böyük cədvəllərdə sütun adını dəyişərkən və ya silərkən sistemin çökməməsi üçün qaydalar.",
    content:
      "Canlı (production) verilənlər bazasında sütun silmək və ya tipini dəyişmək təhlükəlidir. Ən yaxşı təcrübə 'Expand and Contract' metodudur: əvvəlcə yeni sütun əlavə olunur, tətbiq hər ikisinə yazır, köhnə data köçürülür və yalnız bir neçə deploy sonra köhnə sütun təhlükəsiz silinir.",
  },
  {
    slug: "react-suspense-ve-streaming-ssr",
    title: "React Suspense və Streaming SSR ilə ani render",
    category: "React",
    excerpt: "Bütün səhifənin bazanı gözləməsinə son qoyan müasir HTML axını (streaming).",
    content:
      "Əvvəllər SSR zamanı səhifədə bir sorğu 2 saniyə gecikirdisə, bütün ağ ekran 2 saniyə donurdu. Streaming SSR ilə server dərhal hazır olan HTML-i (navbar, başlıq, skeletlər) brauzerə göndərir, ağır verilənlər gəldikcə isə eyni HTML bağlantısı üzərindən yerinə çatdırılır.",
  },
  {
    slug: "kubernetes-giris-mikroservisler",
    title: "Kubernetes Əsasları: Pod, Service və Deployment nədir?",
    category: "DevOps",
    excerpt: "Konteynerlərin orkestrasiyası, avtomatik miqyaslanma və self-healing sistemlər.",
    content:
      "Docker tək bir konteyneri qaldırmaq üçün əladır, lakin yüzlərlə konteynerin sağlamlığına nəzarət etmək üçün Kubernetes lazımdır. Pod ən kiçik icra vahididir. Deployment istənilən sayda pod nüsxəsini stabil saxlayır, Service isə daxili şəbəkə balansı (load balancer) təmin edir.",
  },
  {
    slug: "performance-budget-ve-bundle-analysis",
    title: "JavaScript Paket Ölçüsünün Azaldılması və Tree Shaking",
    category: "Performance",
    excerpt: "next/bundle-analyzer ilə böyük kitabxanaları aşkar etmək və dinamik import.",
    content:
      "İstifadəçinin zəif mobil internetlə səhifəyə girməsi böyük JS paketləri səbəbindən saniyələrlə gecikə bilər. 'next/bundle-analyzer' vasitəsilə ən çox yer tutan paketləri görmək və 'next/dynamic' ilə yalnız lazım olanda (lazy loading) yükləmək performansı dramatik artırır.",
  },
  {
    slug: "linux-komandalari-developer-beledcisi",
    title: "Hər bir Full-Stack mühəndisin bilməli olduğu 15 Linux əmri",
    category: "DevOps",
    excerpt: "grep, awk, curl, htop, systemctl, netstat və jurnalların (logs) oxunması.",
    content:
      "Serverlərdə baş verən problemləri dərhal həll etmək üçün Linux terminalı ilə dost olmaq şərtdir. 'htop' ilə yaddaş sızmasını (memory leak), 'journalctl' və 'tail -f' ilə canlı xətaları izləmək, 'lsof -i' ilə açıq portları yoxlamaq gündəlik işimizin ayrılmaz hissəsidir.",
  },
  {
    slug: "solid-prinsipleri-kod-numuneleri",
    title: "SOLID Prinsipləri: TypeScript nümunələri ilə izah",
    category: "Best Practices",
    excerpt: "Single Responsibility, Open/Closed, Liskov, Interface Segregation və Dependency Inversion.",
    content:
      "SOLID obyekt yönümlü proqramlaşdırmanın əlifbasıdır. Məsələn, Open/Closed prinsipi deyir ki, proqram təminatı genişləndirilməyə açıq, lakin mövcud kodu dəyişməyə qapalı olmalıdır. Bu, kodun köhnə hissələrini sındırmadan yeni funksiyalar əlavə etməyə imkan verir.",
  },
  {
    slug: "turbopack-vs-webpack",
    title: "Turbopack vs Webpack: Rust əsaslı yeni nəsil bundlerlər",
    category: "Next.js",
    excerpt: "Niyə JavaScript alətləri Rust dilində yenidən yazılır və 10x sürət artımı.",
    content:
      "Next.js artıq default olaraq Turbopack istifadə edir. Rust dilində yazılan bu mühərrik böyük layihələrdə HMR (Hot Module Replacement) vaxtını 50-100 millisekund səviyyəsinə endirir. Webpack-in illərlə yığılmış mürəkkəb konfiqurasiyaları yerini avtomatik optimallaşdırmaya buraxır.",
  },
  {
    slug: "redis-ile-kesleme-ve-rate-limiting",
    title: "Redis ilə Keşləmə və API Rate Limiting tətbiqi",
    category: "Database",
    excerpt: "In-memory məlumat bazası ilə sorğuların gecikməsini 2 millisekundadək endirmək.",
    content:
      "Ən sürətli SQL sorğusu belə diski oxuduğu üçün RAM qədər sürətli ola bilməz. Çox tez-tez oxunan (məsələn, istifadəçi sessiyaları, bloqun baxış sayı) məlumatları Redis-də keşləmək bazanın yükünü 80% azaldır. Həmçinin Upstash və ya daxili Redis ilə DDoS-a qarşı rate-limiting qurulur.",
  },
  {
    slug: "git-rebase-vs-merge-strategiyasi",
    title: "Git Rebase vs Merge: Komanda daxilində təmiz Git tarixi",
    category: "Best Practices",
    excerpt: "Mürəkkəb qol birləşmələrindən qaçmaq və xətti (linear) commit tarixi qurmaq.",
    content:
      "'git merge' hər dəfə əlavə 'Merge commit' yaradaraq tarixi qarışdırır. 'git rebase' isə sizin dəyişikliklərinizi ana qolun ən sonuna səliqə ilə calayır. Nəticədə 'git log' xətti və asan oxunan formaya düşür. Lakin ümumi (shared) qollarda rebase etməmək qızıl qaydadır.",
  },
  {
    slug: "unit-testing-vitest-react-testing-library",
    title: "Vitest və React Testing Library ilə Vahid Testlər",
    category: "Mühəndislik",
    excerpt: "Kod dəyişərkən heç nəyin sınmadığına əmin olmaq: Test Driven Development (TDD).",
    content:
      "Jest-in yerini tutan Vitest Vite mühərriki ilə inanılmaz sürətli işləyir. React Testing Library isə komponentlərin daxili detallarını deyil, istifadəçinin onu necə gördüyünü (düyməyə klik, mətni oxuma) test edir. Bu, etibarlı və davamlı kod yazmağın ən böyük təminatıdır.",
  },
  {
    slug: "optimizing-web-fonts-and-images",
    title: "Şəkillərin və Şriftlərin Veb Performansına Təsiri",
    category: "Performance",
    excerpt: "Next.js Image komponenti, AVIF formatı və font-display swap strategiyası.",
    content:
      "Orta statistik veb səhifənin çəkisinin 70%-ni şəkillər təşkil edir. 'next/image' komponenti şəkilləri avtomatik müasir WebP və ya AVIF formatına çevirir, brauzerin ölçüsünə uyğun rezin ölçüləndirir və yalnız ekrana girəndə (lazy loading) yükləyir.",
  },
  {
    slug: "server-sent-events-vs-websockets",
    title: "Server-Sent Events (SSE) vs WebSockets: Real-vaxt rabitəsi",
    category: "Mühəndislik",
    excerpt: "Süni intellekt cavablarının streaming edilməsi və canlı bildiriş sistemləri.",
    content:
      "ChatGPT tipli AI cavablarının hərf-hərf ekrana axması (streaming) üçün tam ikitərəfli WebSockets-ə ehtiyac yoxdur. HTTP üzərindən işləyən Server-Sent Events (SSE) daha yüngül, firewall dostu və avtomatik təkrar qoşulma (reconnect) xüsusiyyətinə malikdir.",
  },
  {
    slug: "typescript-satisfies-operatoru",
    title: "TypeScript 'satisfies' operatorunun gücü və istifadə yerləri",
    category: "TypeScript",
    excerpt: "Tip tərifini itirmədən dəyərin tipi doğrulaması ('as' tip casting-ə son).",
    content:
      "TypeScript 4.9-da gələn 'satisfies' operatoru əvvəlki ': Type' və ya 'as Type' yanaşmalarının nöqsanlarını aradan qaldırır. O, obyektin müəyyən bir interfeysə uyğun olduğunu təsdiqləyir, lakin obyektin fərdi açarlarının dar tiplərini (literal types) silmir.",
  },
];

/**
 * Admin hesabını yalnız `SEED_ADMIN_EMAIL` + `SEED_ADMIN_PASSWORD` mühit
 * dəyişənləri əsasında yaradır. Hardcoded kredensial yoxdur.
 * - Production-da bu dəyişənlər yoxdursa skript dayanır.
 * - Digər mühitlərdə xəbərdarlıq verib admin yaratmadan davam edir.
 */
async function seedAdmin(): Promise<string | null> {
  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "SEED_ADMIN_EMAIL və SEED_ADMIN_PASSWORD mühit dəyişənləri təyin edilməlidir."
      );
    }
    console.warn(
      "⚠️  SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD təyin edilməyib — admin hesabı yaradılmır."
    );
    return null;
  }

  const parsed = passwordSchema.safeParse(password);
  if (!parsed.success) {
    throw new Error(
      `SEED_ADMIN_PASSWORD parol siyasətinə uyğun deyil: ${parsed.error.issues
        .map((i) => i.message)
        .join(", ")}`
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const adminUser = await prisma.user.upsert({
    where: { email },
    update: { role: "ADMIN" },
    create: {
      name: process.env.SEED_ADMIN_NAME?.trim() || "Peyman Babayev",
      email,
      password: passwordHash,
      role: "ADMIN",
    },
  });
  console.log(`👤 Admin istifadəçisi hazırdır: ${adminUser.email} (Rol: ${adminUser.role})`);
  return adminUser.id;
}

async function main() {
  console.log("🌱 Verilənlər bazası yenilənir...");

  const adminId = await seedAdmin();

  // İlkin postların bazaya yazılması (admin varsa müəllif olaraq ona bağlanır)
  console.log(`📝 İlkin ${initialPosts.length} post yenilənir...`);
  for (const post of initialPosts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        authorId: adminId,
      },
      create: {
        ...post,
        authorId: adminId,
      },
    });
  }

  console.log(`✅ Seed əməliyyatı uğurla tamamlandı!`);
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
