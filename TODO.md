# TODO

## Yetim (istifadəsiz) Blob şəkilləri

AI ilə yaradılan və ya əl ilə yüklənən örtük şəkli dərhal Vercel Blob-a yazılır. İstifadəçi şəkli
yenidən yaradırsa, silirsə və ya postu saxlamadan formadan çıxırsa, köhnə fayl Blob-da qalır
(`covers/` qovluğu). Post yenilənəndə yalnız əvvəl saxlanılmış örtük silinir.

Gələcəkdə təmizləmə scripti lazımdır: `covers/` və `avatars/` altındakı, `Post.coverImage` və
`User.avatar`-da istinad olunmayan və müəyyən müddətdən (məs. 24 saat) köhnə faylları silsin.
