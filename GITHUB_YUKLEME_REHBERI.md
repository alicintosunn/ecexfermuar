# GitHub'a Yükleme Rehberi

## 1. Gönderim öncesi

Gerçek şifreleri yalnızca `.env.local` dosyasında veya Vercel Environment Variables ekranında tutun. `.env.example` yalnızca örnek değerler içermelidir.

Kontrol edin:

```bash
git status
pnpm install --frozen-lockfile
pnpm build
pnpm exec drizzle-kit check
```

## 2. GitHub deposu

GitHub'da boş bir depo oluşturun. README, `.gitignore` veya lisans dosyasını GitHub ekranından otomatik eklemeyin; bu projede README ve `.gitignore` zaten vardır.

Bu çalışma dizisinde eski `sites` remote'u bulunmaktadır. GitHub adresini `origin` adıyla ayrıca ekleyin:

```bash
git remote -v
git remote add origin https://github.com/KULLANICI/DEPO.git
git add -A
git commit -m "Migrate ECEX to Vercel and Supabase"
git push -u origin main
```

`origin` zaten varsa `git remote set-url origin ...` kullanın. Yanlışlıkla `sites` remote'una göndermeyin.

## 3. GitHub güvenlik ayarları

- Repository Settings > Code security bölümünde Secret scanning ve Push protection özelliklerini açın.
- Dependabot alerts ve Dependabot security updates özelliklerini açın.
- `main` branch için branch protection/ruleset oluşturun.
- Pull request ve `CI / verify` kontrolü başarılı olmadan birleşmeye izin vermeyin.
- Depo özel kalacaksa görünürlüğü Private seçin.

## 4. Vercel bağlantısı

Vercel'de GitHub deposunu içe aktarın ve `.env.example` içindeki değişkenlerin gerçek değerlerini Vercel Environment Variables bölümüne ekleyin. Gerçek değerleri GitHub'a yazmayın.

İlk yayın öncesinde Supabase migration'ını güvenli bir yerel/yönetim ortamında çalıştırın:

```bash
pnpm db:migrate
```

## 5. Önemli veri yedekleri

GitHub bir veritabanı veya medya yedekleme sistemi değildir. Aşağıdakileri depoya yüklemeyin:

- Supabase PostgreSQL dump dosyaları
- Supabase Storage medya yedekleri
- SMTP parolaları
- `.env.local`
- Vercel veya Supabase erişim anahtarları

PostgreSQL ve Storage yedeklerini ayrı, şifreli ve erişimi kısıtlı bir yedekleme alanında saklayın.
