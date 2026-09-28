# Inventor Presentations

Στατικά, διαδραστικά microsites παρουσιάσεων της Inventor A.G. — ένα ανά υποφάκελο.

```
/
├── index.html                              ← αρχική σελίδα με λίστα παρουσιάσεων
├── vercel.json                             ← ρυθμίσεις Vercel (trailing slash, cache, noindex)
├── robots.txt
└── welcome-stores-thessaloniki-2026/       ← «Πώς μοιάζει το αύριο» · Θεσσαλονίκη 10/10/2026
    ├── index.html
    └── assets/ (css, js, fonts, img, shots, video)
```

## Νέα παρουσίαση
1. Δημιουργήστε νέο υποφάκελο με όνομα σε πεζά λατινικά και παύλες (π.χ. `partners-athens-2027/`) με δικό του `index.html` και `assets/`.
2. Όλα τα paths μέσα στον υποφάκελο να είναι **σχετικά** (`assets/...`), όχι απόλυτα (`/assets/...`).
3. Προσθέστε μια κάρτα στο `index.html` της ρίζας (δείτε το σχόλιο `PRESENTATIONS` μέσα στο αρχείο).

## Deploy στο Vercel
- Import του repo → Framework Preset: **Other** · Build Command: *(κενό)* · Output Directory: *(κενό / ρίζα)*.
- Κάθε παρουσίαση ανοίγει στο `https://<project>.vercel.app/<υποφάκελος>/`.
- Τα sites έχουν `noindex` (δεν εμφανίζονται σε μηχανές αναζήτησης).

## Πρόσβαση (σελίδα εισόδου)
Όλο το site προστατεύεται από τη σελίδα `/login/` (μέσω `middleware.js`).
- **Επισκέπτες:** οποιοδήποτε έγκυρο email + κωδικός επισκέπτη.
- **Διαχειριστής:** email/κωδικός διαχειριστή → στην αρχική σελίδα εμφανίζεται το «Αρχείο συνδέσεων» (`/api/logs`, απλό κείμενο).
- Κάθε επιτυχής σύνδεση καταγράφεται ως `ΗΗΗΗ-ΜΜ-ΗΗ ωω:λλ:δδ | email` (ώρα Αθήνας).

### Ρύθμιση στο Vercel (μία φορά)
1. **Storage για το log:** Project → Storage → Marketplace → *Upstash for Redis* → Create & Connect στο project (δημιουργεί αυτόματα τα `KV_REST_API_URL` / `KV_REST_API_TOKEN`). Χωρίς αυτό, οι συνδέσεις γράφονται μόνο στα Function Logs.
2. **Environment Variables (συνιστάται):** `AUTH_SECRET` (ένα μεγάλο τυχαίο κείμενο), και προαιρετικά `VIEWER_PASSWORD`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` για να μη μένουν οι κωδικοί μέσα στον κώδικα.
3. Redeploy.

> Οι κωδικοί υπάρχουν ως προεπιλογές στο `api/_auth.js`. Κρατήστε το repo **private** ή ορίστε τα Environment Variables.
