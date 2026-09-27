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
