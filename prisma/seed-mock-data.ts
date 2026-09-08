import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateSlug } from "../src/lib/slug";

const pool = new Pool({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

interface UserWithPosts {
  name: string;
  email: string;
  posts: {
    title: string;
    category:
      | "Next.js"
      | "React"
      | "TypeScript"
      | "Database"
      | "DevOps"
      | "Performance"
      | "Best Practices"
      | "Mühəndislik";
    excerpt: string;
    content: string;
  }[];
}

const mockUsersData: UserWithPosts[] = [
  {
    name: "Leyla Əliyeva",
    email: "leyla.aliyeva@example.com",
    posts: [
      {
        title:
          "Next.js 16-da Server Actions ilə Formaların Dərin İdarə Olunması",
        category: "Next.js",
        excerpt:
          "React 19 və Next.js 16 ilə birlikdə formaları ənənəvi API marşrutları olmadan necə etibarlı, növ-təhlükəsiz və səmərəli idarə edə bilərik?",
        content: `Müasir veb tətbiqlərdə formaların idarə olunması həmişə ən çox boilerplate kod tələb edən sahələrdən biri olub. Əvvəllər sadə bir əlaqə və ya qeydiyyat forması yaratmaq üçün bir neçə addım atmalı olurduq: '/api/contact' REST marşrutu qurmaq, müştəri tərəfdə 'useState' ilə 'loading', 'error' və 'success' vəziyyətlərini saxlamaq, form submit zamanı 'fetch()' sorğusu göndərmək və xəta baş verdikdə bunu əl ilə render etmək.

React 19 və Next.js 16 ilə birlikdə gələn Server Actions bu paradiqmanı tamamilə dəyişdi. Artıq ayrıca bir API marşrutu yaratmağa və şəbəkə sorğularını əl ilə idarə etməyə ehtiyac yoxdur.

📌 1. Server Actions Nədir və Necə İşləyir?
Server Actions əslində serverdə icra olunan asinxron funksiyalardır. Funksiyanın yuxarısına 'use server' direktivini əlavə etməklə Next.js arxa planda avtomatik olaraq RPC (Remote Procedure Call) endpoint-i formalaşdırır. Müştəri komponentindən bu funksiya adi JavaScript funksiyası kimi çağırılır, lakin onun icrası təhlükəsiz Node.js mühitində baş verir.

📌 2. React 19 'useActionState' Hook-u ilə Vəziyyətin İdarəsi
Formanın vəziyyətini idarə etmək üçün React 19-un 'useActionState' hook-u ən yaxşı təcrübə hesab olunur:
const [state, formAction, isPending] = useActionState(myServerAction, initialState);

Bu yanaşmanın üstünlükləri:
- Təbii Form Submit: Formanın 'action' atributuna birbaşa 'formAction' ötürülür.
- Avtomatik Optimistik Yenilənmə: 'isPending' vasitəsilə düymədə yüklənmə spinneri göstərilir.
- Təhlükəsizlik: Giriş məlumatları birbaşa FormData kimi serverə çatır və Zod ilə anındaca yoxlanılır.

📌 3. Tez-tez Edilən Səhvlər və Həll Yolları
- Səhv 1: 'redirect()' funksiyasını 'try/catch' daxilində çağırmaq. Next.js-də 'redirect()' daxildə xüsusi xəta atır (NEXT_REDIRECT). Əgər siz onu 'catch' blokunda tutsanız, istifadəçi yönləndirilməyəcək. 'redirect()' həmişə 'try/catch'-dən kənarda çağırılmalıdır.
- Səhv 2: Validasiya xətası baş verdikdə istifadəçinin daxil etdiyi mətni silmək. Ən yaxşı təcrübə state daxilində 'fields' obyektini geri qaytarmaq və inputların 'defaultValue' xanalarına bağlamaqdır.

Nəticə olaraq, Server Actions ilə yazılan formalar həm daha az kod tələb edir, həm də JavaScript yüklənməsə belə təmiz HTML formu kimi işləmə qabiliyyətinə (Progressive Enhancement) malik olur.`,
      },
      {
        title: "React 19-da 'use' Hook-u və Asinxron Məlumat Oxunması",
        category: "React",
        excerpt:
          "Yeni 'use' API-si ilə asinxron verilənləri və React Context-i necə daha rahat, çevik və şərtli şəkildə oxumaq olar?",
        content: `React-in tarixində ilk dəfə olaraq 'use' adlı xüsusi bir primitiv təqdim edildi. Ənənəvi hook-lar ('useState', 'useEffect', 'useContext') React-in məşhur "Hook Qaydaları"na tabedir: onlar heç vaxt dövrlərin ('for', 'while') və ya şərtlərin ('if') daxilində çağırıla bilməz.

Lakin 'use' bu qaydaların sərhədlərini aşır. O, texniki olaraq bir hook-dan daha çox operator kimi işləyir və şərt daxilində çağırıla bilir!

📌 1. 'use' ilə Promislərin Oxunması
Təsəvvür edin ki, komponentinizə bir Promise ötürülüb. Əvvəllər bu Promise-i həll etmək üçün 'useEffect' açıb daxilində '.then()' yazmalı, nəticəni 'useState'-ə qoymalı idiniz.

İndi isə bu cəmi bir sətirə enir:
const data = use(fetchDataPromise);

Əgər Promise hələ tamamlanmayıbsa, React komponenti dondurur və ən yaxın <Suspense fallback={<Loading />}> sərhədini ekranda göstərir. Promise uğurla bitən kimi komponent məlumatla birgə render olunur.

📌 2. Şərtli Context Oxunması
Köhnə 'useContext(ThemeContext)' mütləq komponentin ən yuxarısında çağırılmalı idi. Əgər siz müəyyən bir şərt ödənəndə konteksti oxumaq istəyirdinizsə, bunu edə bilmirdiniz.
'use' ilə artıq mümkündür:
if (isLoggedIn) {
  const theme = use(ThemeContext);
}

📌 3. Praktiki Məsləhətlər
- 'use(Promise)' çağırışında hər render zamanı yeni Promise yaratmaqdan çəkinin, çünki bu sonsuz dövrə səbəb ola bilər. Promise ya Server Component-dən prop kimi gəlməli, ya da keşlənməlidir.
- React 19 ilə layihələrinizdə 'use' tətbiq etmək kodun həcmini 40%-ə qədər azaldır və oxunaqlılığı artırır.`,
      },
    ],
  },
];

async function seedMockData() {
  console.log("🌱 Geniş və zəngin məqalələrin bazaya yazılması başladı...\n");

  const defaultPassword = "Password123!";
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  let totalUsersCreated = 0;
  let totalPostsCreated = 0;

  for (const userData of mockUsersData) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        name: userData.name,
      },
      create: {
        name: userData.name,
        email: userData.email,
        password: passwordHash,
        role: "USER",
      },
    });

    totalUsersCreated++;
    console.log(`👤 Müəllif: ${user.name} (${user.email})`);

    for (const postData of userData.posts) {
      let slug = generateSlug(postData.title);
      if (!slug) slug = `post-${Date.now()}`;

      await prisma.post.upsert({
        where: { slug },
        update: {
          title: postData.title,
          category: postData.category,
          excerpt: postData.excerpt,
          content: postData.content,
          authorId: user.id,
        },
        create: {
          title: postData.title,
          slug,
          category: postData.category,
          excerpt: postData.excerpt,
          content: postData.content,
          authorId: user.id,
        },
      });

      totalPostsCreated++;
      const words = postData.content.trim().split(/\s+/).length;
      console.log(
        `   📖 "${postData.title}" [${postData.category}] — ~${words} söz`,
      );
    }
    console.log("");
  }

  console.log("--------------------------------------------------");
  console.log(`🎉 Geniş məzmunlu seed uğurla tamamlandı!`);
  console.log(`👥 Müəllif sayı: ${totalUsersCreated}`);
  console.log(`📚 Məqalə sayı: ${totalPostsCreated}`);
  console.log(`🔑 Sınaq parolu: ${defaultPassword}`);
  console.log("--------------------------------------------------");
}

seedMockData()
  .catch((e) => {
    console.error("❌ Seed zamanı xəta:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
