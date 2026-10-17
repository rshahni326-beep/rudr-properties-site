RUDR PROPERTIES — Website package
==================================

Included files
- index.html: public, mobile-friendly website
- styles.css: premium responsive styling
- app.js: Supabase listing load, search and WhatsApp enquiries
- admin.html: private admin login + add/edit/delete listing interface
- config.js: place to enter Supabase Project URL and Publishable Key
- supabase-setup.sql: starter RLS policies
- README-HI.txt: this guide in Hindi

IMPORTANT: The config file currently contains placeholders, not your actual credentials.
Never put a Supabase secret/service_role key in browser code.

STEP 1 — Configure Supabase
1. Open https://supabase.com/dashboard and select your rudr-properties project.
2. Copy the Project URL (it should look like https://YOUR_PROJECT_ID.supabase.co; do not add /rest/v1/).
3. Copy the Publishable key (not Secret/service_role).
4. Open config.js and replace:
   PASTE_YOUR_SUPABASE_PROJECT_URL_HERE
   PASTE_YOUR_SUPABASE_PUBLISHABLE_KEY_HERE
   Save the file.

STEP 2 — Check table columns
The existing public.properties table should have:
id, created_at, title, location, price, property_type, area, description,
image_urls, video_url, status.
This package assumes image_urls and video_url are text columns. If your actual schema is different, change it before publishing.

STEP 3 — Admin sign-in
1. In Supabase, open Authentication > Users.
2. Add/create a user for rshahni326@gmail.com and set a strong password.
3. In SQL Editor, review and run supabase-setup.sql.
4. Do not make the table publicly writable. The SQL limits insert/update/delete to the admin email.
5. Open admin.html on the published site and sign in with that account.

STEP 4 — Publish as a new GitHub Pages site
1. Create a NEW GitHub repository, for example: rudr-properties-site.
2. Upload all files from this folder to the repository root (not inside another nested folder).
3. Commit the files.
4. In repository Settings > Pages, choose Deploy from a branch, branch main, folder /(root), then Save.
5. Wait for GitHub Pages to publish. Your address will be:
   https://YOUR-GITHUB-USERNAME.github.io/rudr-properties-site/
6. The admin page will be at the same address plus admin.html.

Note: If you use GitHub Pages, files are public. The Project URL and Publishable key are intended for browser use, but database access must be controlled by RLS. Never add private keys or passwords to these files.

PREVIEW
If config.js is not filled in yet, index.html shows three sample cards and a message that it is in preview mode. It will not show live Supabase data until the real URL/key are added.

IMAGES
The public site supports direct HTTPS image URLs in image_urls. For a later upload workflow, configure a Supabase Storage bucket and storage policies before adding uploads.

CONTACT
WhatsApp is configured as 918887036646 (India country code +91).
Email is configured as rshahni326@gmail.com.
