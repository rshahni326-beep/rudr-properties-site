RUDR PROPERTIES — आसान हिंदी गाइड
====================================

इस फोल्डर में वेबसाइट की सभी जरूरी फाइलें हैं:
1. index.html — ग्राहकों को दिखने वाली वेबसाइट
2. styles.css — डिजाइन
3. app.js — प्रॉपर्टी लोड करना, सर्च और WhatsApp
4. admin.html — एडमिन पैनल
5. config.js — Supabase URL और Publishable Key रखने की जगह
6. supabase-setup.sql — डेटाबेस की अनुमति (RLS) के लिए SQL

जरूरी: config.js में अभी उदाहरण/placeholder हैं। अपना असली Project URL और Publishable Key भरना बाकी है।
Supabase Secret या service_role key कभी भी वेबसाइट में न डालें।

A. Supabase जानकारी भरें
1. https://supabase.com/dashboard खोलें और rudr-properties प्रोजेक्ट चुनें।
2. Project URL कॉपी करें। इसका रूप https://YOUR_PROJECT_ID.supabase.co जैसा होगा। अंत में /rest/v1/ नहीं लगाना है।
3. Publishable key कॉपी करें। Secret/service_role key नहीं।
4. config.js खोलकर इन दो placeholders की जगह अपनी जानकारी डालें:
   PASTE_YOUR_SUPABASE_PROJECT_URL_HERE
   PASTE_YOUR_SUPABASE_PUBLISHABLE_KEY_HERE
5. फाइल सेव करें।

B. Admin Panel चालू करें
1. Supabase > Authentication > Users में rshahni326@gmail.com के लिए user बनाएँ और मजबूत password रखें।
2. SQL Editor में supabase-setup.sql को ध्यान से देखकर Run करें।
3. Admin पेज पर उसी ईमेल और password से लॉगिन करें।
4. यहाँ से प्रॉपर्टी जोड़ने, Edit करने और Delete करने की सुविधा मिलेगी।

C. नई वेबसाइट प्रकाशित करें
1. GitHub पर नई repository बनाएँ: rudr-properties-site
2. इस फोल्डर की सभी फाइलें repository के मुख्य/root हिस्से में upload करें।
3. Commit changes करें।
4. Repository > Settings > Pages खोलें।
5. Deploy from a branch चुनें; Branch: main; Folder: /(root); Save करें।
6. प्रकाशित होने पर पता ऐसा होगा:
   https://YOUR-GITHUB-USERNAME.github.io/rudr-properties-site/
7. Admin पेज इसी पते के बाद admin.html जोड़कर खुलेगा।

अभी config.js भरे बिना वेबसाइट sample preview दिखाएगी। Live प्रॉपर्टी दिखाने के लिए Supabase जानकारी भरना और सही RLS permissions लगाना जरूरी है।

WhatsApp नंबर +91 8887036646 और ईमेल rshahni326@gmail.com सेट हैं।
