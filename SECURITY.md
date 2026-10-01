# Security

Do not commit `.env`, `.env.local`, database exports, Supabase service-role keys, SMTP passwords, private keys or production backups.

Report a security issue privately to the repository owner. Do not publish production credentials or exploit details in a public GitHub issue.

Production requirements:

- Set a unique `ADMIN_USERNAME` and a long random `ADMIN_PASSWORD` in Vercel.
- Keep `SUPABASE_SERVICE_ROLE_KEY` server-only. Never prefix it with `NEXT_PUBLIC_`.
- Use a private Supabase Storage bucket.
- Protect the GitHub `main` branch and require the CI workflow to pass.
- Enable GitHub secret scanning, push protection and Dependabot alerts.
- Rotate any credential immediately if it is accidentally committed.
