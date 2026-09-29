/* =========================================================
   Περιεχόμενο παρουσίασης — Οργανόγραμμα & Καθήκοντα Τμημάτων
   ========================================================= */

window.DEPTS = [
  { id: 'finance',   n: '01', name: 'Finance' },
  { id: 'hr',        n: '02', name: 'HR' },
  { id: 'marketing', n: '03', name: 'Marketing' },
  { id: 'logistics', n: '04', name: 'Logistics' },
  { id: 'it',        n: '05', name: 'IT' },
  { id: 'field',     n: '06', name: 'Field Service' },
  { id: 'technical', n: '07', name: 'Technical' },
  { id: 'consumer1', n: '08', name: 'Consumer Sales' },
  { id: 'commercial',n: '09', name: 'Commercial Sales' },
  { id: 'product',   n: '10', name: 'Product' },
  { id: 'intl',      n: '11', name: 'International Business' }
];

/* helper: bold label + text */
const L = (b, t) => `<p><b>${b}:</b> ${t}</p>`;
const UL = (arr) => `<ul>${arr.map(x => `<li>${x}</li>`).join('')}</ul>`;

window.TILE_SLIDES = {
  why: {
    tiles: [
      { t: 'Η αφορμή', b: '<p>Η ανάγκη αναδείχθηκε στην πρόσφατη έρευνα ικανοποίησης.</p>' },
      { t: 'Η ανάγκη', b: '<p>Υπάρχει ανάγκη για μεγαλύτερη σαφήνεια στους ρόλους, τις αρμοδιότητες και τα σημεία επαφής μεταξύ των τμημάτων.</p>' },
      { t: 'Ο στόχος', b: '<p>Στόχος είναι να γνωρίζουν όλοι πού να απευθύνονται για πληροφορίες, υποστήριξη και συνεργασία.</p>' }
    ]
  },
  coo1: {
    tiles: [
      { t: 'Strategy Execution & Operational Coordination', b:
        L('Μετάφραση Στόχων', 'Μετατροπή της εταιρικής στρατηγικής σε συγκεκριμένα επιχειρησιακά πλάνα, δράσεις, σαφείς ρόλους και χρονοδιαγράμματα.') +
        L('Εποπτεία Λειτουργιών', 'Συντονισμός κρίσιμων περιοχών, συμπεριλαμβανομένων των Operations, Logistics, Customer & Technical Service, IT/ERP, Ποιότητας και Compliance.') },
      { t: 'Operational Excellence & Digital Transformation', b:
        L('Βελτιστοποίηση Διαδικασιών', 'Χαρτογράφηση ροών εργασίας, μείωση λειτουργικών κινδύνων, καθορισμός εγκριτικών ροών και εισαγωγή KPIs.') +
        L('Project Execution', 'Ιεράρχηση και υλοποίηση κρίσιμων έργων (ERP/CRM projects, αυτοματοποιήσεις, data management & reporting) με σωστό ownership και πρακτικό αποτέλεσμα.') },
      { t: 'Organizational Development, Cost Efficiency & Risk Management', b:
        L('Resource Allocation', 'Ευθυγράμμιση ανθρώπων και συστημάτων, σαφέστεροι ρόλοι και ενίσχυση της κουλτούρας accountability.') +
        L('Financial Planning & Risk', 'Συμμετοχή στον σχεδιασμό των λειτουργικών budgets, εντοπισμός ευκαιριών εξοικονόμησης και σύνδεση του κόστους με την ποιότητα.') }
    ]
  },
  coo2: {
    tiles: [
      { t: 'Διατμηματικά ζητήματα', b: '<p>Όταν ένα ζήτημα επηρεάζει περισσότερα από ένα τμήματα ή απαιτείται προτεραιοποίηση μεταξύ ομάδων.</p>' },
      { t: 'Έργα σε καθυστέρηση ή χωρίς ownership', b: '<p>Όταν ένα έργο/project αντιμετωπίζει καθυστερήσεις ή στερείται ξεκάθαρου ownership.</p>' },
      { t: 'Διαδικασίες, KPIs & IT/ERP', b: '<p>Όταν απαιτείται βελτίωση διαδικασίας, εισαγωγή νέων KPIs ή διασύνδεση της business ανάγκης με IT/ERP υλοποιήσεις.</p>' }
    ]
  }
};

window.DEPT_SLIDES = [
  { id: 'finance', no: '01', title: 'Finance', photo: 'finance', photoPos: '20% center',
    tiles: [
      { t: 'Accounting & Expenses Management', b:
        L('Γενική Λογιστική', 'Καταχώρηση εγγραφών, παρακολούθηση παγίων/αποσβέσεων, υποβολή φορολογικών δηλώσεων (ΦΠΑ, παρακρατούμενοι), προετοιμασία Ισολογισμού και εκκαθάριση μισθοδοσίας.') +
        L('Κύκλωμα Εξόδων', 'Έλεγχος δαπανών, τιμολογίων προμηθευτών και εξοδολογίων, εκτέλεση πληρωμών, συμφωνίες λογαριασμών/τραπεζών και ανάλυση αποκλίσεων δαπανών.') },
      { t: 'Financial Planning, Reporting & Compliance', b:
        L('Budget & Cash Flow', 'Σύνταξη και παρακολούθηση του ετήσιου προϋπολογισμού (Budget vs Actual), διαδικασίες Forecasting, διαχείριση ταμειακών ροών (Cash Flow) και υποστήριξη οικονομικών ελέγχων.') +
        L('Συμμόρφωση & ESG', 'Διασφάλιση τήρησης φορολογικών/ασφαλιστικών υποχρεώσεων, εφαρμογή συστήματος εσωτερικού ελέγχου και σύνταξη μη χρηματοοικονομικών πληροφοριών για εκθέσεις βιωσιμότητας (ESG).') },
      { t: 'Trade Finance, Inventory & Credit Control', b:
        L('Κοστολόγηση & Αποθέματα', 'Παρακολούθηση κόστους εισαγωγών (μεταφορικά, δασμοί), συμφωνίες με εκτελωνιστές, ορθή κοστολόγηση προϊόντων, αποτίμηση/συμφωνία αξίας αποθεμάτων και οικονομικό κλείσιμο απογραφών.') +
        L('Credit Control', 'Αξιολόγηση πελατών, διαχείριση πιστωτικών ορίων/κινδύνου, παρακολούθηση εισπράξεων/ληξιπρόθεσμων, δρομολόγηση παραγγελιών και συμμόρφωση με την πιστωτική πολιτική και το ασφαλιστήριο συμβόλαιο.') }
    ]},
  { id: 'hr', no: '02', title: 'HR', photo: 'hr',
    tiles: [
      { t: 'Talent Acquisition & Onboarding', b: '<p>Σύγχρονες διαδικασίες recruitment, χρήση εξελιγμένων συστημάτων ATS για γρήγορο screening και ομαλή εισαγωγή των νέων συναδέλφων στην εταιρική κουλτούρα.</p>' },
      { t: 'Comp & Benefits / Payroll', b: '<p>Δίκαιη και έγκαιρη μισθοδοσία, διαχείριση bonus, εταιρικών παροχών και κινήτρων που κρατούν την ομάδα engaged.</p>' },
      { t: 'Employee Relations & Operations', b: '<p>Διαχείριση της καθημερινότητας των εργαζομένων, επίλυση θεμάτων, διασφάλιση της εργασιακής ειρήνης και ευθυγράμμιση με την εργατική νομοθεσία.</p>' },
      { t: 'HR as a Strategic Partner', b:
        L('Data-Driven Αποφάσεις', 'Παρακολούθηση βασικών δεικτών όπως το turnover, ο χρόνος πρόσληψης και το employee engagement.') +
        L('Υποστήριξη του Management', 'Είμαστε δίπλα στους Heads των άλλων τμημάτων για να τους βοηθήσουμε στη διαχείριση, την παρακίνηση και το σωστό staffing των ομάδων τους.') +
        L('Εταιρική Κουλτούρα', 'Καλλιέργεια ενός περιβάλλοντος που προάγει την ισότητα, τη συμπερίληψη και την ανοιχτή επικοινωνία.') },
      { t: 'Performance & Development', b: '<p>Πλάνο εκπαίδευσης, συστήματα αξιολόγησης της απόδοσης και ανάδειξη των low & high performers για τη συνεχή εξέλιξη του οργανισμού.</p>' }
    ]},
  { id: 'marketing', no: '03', title: 'Marketing', photo: 'marketing',
    tiles: [
      { t: 'Product Branding & Client Support', b:
        L('Product Launching & Assets', 'Ονοματοδοσία, λογοτύπηση, φωτογράφηση, manuals, συνοδευτικά αρχεία (energy labels, product sheets), σχεδιασμός συσκευασιών και έντυπου υλικού.') +
        L('B2B & Retail Support', 'Δημιουργία υλικών για τα sites και τα καταστήματα των πελατών (In-store/POS υλικά, τιμοκατάλογοι, newsletters) και σχεδιασμός καμπανιών πώλησης στα e-shops των πελατών (Skroutz, Κωτσόβολος, Public).') },
      { t: 'Brand Awareness & Always-On Campaigns', b:
        L('Καμπάνιες Μεγάλης Κλίμακας', 'Στρατηγικός σχεδιασμός εποχικών καμπανιών (Κλιματισμός, Αφυγραντήρας, Αντλίες Θερμότητας) μέσω TV, ραδιοφώνου, outdoor διαφήμισης (Μετρό, Τραμ κλπ.) και κλαδικού τύπου.') +
        L('Digital & Social Ecosystem', 'Always-on διαχείριση social media (posts, community management, influencers, competitions) και Google campaigns. Maintenance των εταιρικών websites και συνεχής παρακολούθηση του ανταγωνισμού.') },
      { t: 'Corporate Communications & Events', b:
        L('PR & Events', 'Διαχείριση δημοσίων σχέσεων (άρθρα, δελτία τύπου, χορηγίες), διοργάνωση εκθέσεων, ημερίδων και εταιρικών εκδηλώσεων (εσωτερικά/εξωτερικά events, Tech Days, εταιρικά πάρτυ).') +
        L('Cross-Departmental Projects', 'Υποστήριξη εσωτερικών projects (CRM, Invy, Sustainability reports, υλικά After Sales Service και εταιρικές παρουσιάσεις).') }
    ]},
  { id: 'logistics', no: '04', title: 'Logistics', photo: 'logistics',
    tiles: [
      { t: 'International & Domestic Freight', b:
        L('Εισαγωγές & Εξαγωγές', 'Παρακολούθηση φορτίων από τη φόρτωση, διαχείριση ETA στο ERP, εντολές εκτελωνισμού και στενή παρακολούθηση αποστολών εξωτερικού.') +
        L('Εγχώριες Αποστολές & Last Mile', 'Προώθηση παραγγελιών σε 3PL παρόχους, παρακολούθηση παραδόσεων, επίλυση καθυστερήσεων, διασφάλιση On-Time Delivery και συντονισμός Last Mile deliveries.') },
      { t: '3PL Supervision & Cost Optimization', b:
        L('Έλεγχος & Αξιολόγηση', 'Παρακολούθηση τιμολογίων/χρεώσεων αποθήκευσης, έλεγχος των KPIs απόδοσης και συμμετοχή σε διαπραγματεύσεις συμβολαίων.') +
        L('Στρατηγική Μείωσης Κόστους', 'Διαρκής αναζήτηση λύσεων για τη μείωση του μεταφορικού κόστους και των αποθηκεύτρων, με παράλληλη αναβάθμιση του επιπέδου εξυπηρέτησης.') },
      { t: 'Inventory, Spare Parts & Reverse Logistics', b:
        L('Inventory Control & Spare Parts', 'Συστηματικός έλεγχος/αναπλήρωση αποθεμάτων μεταξύ αποθηκών, διενέργεια απογραφών και πλήρης διαχείριση αποθήκης ανταλλακτικών After-Sales (παραλαβές/αποστολές από Sarmed, αεροδρόμιο, εξωτερικό).') +
        L('Διαχείριση Επιστροφών', 'Έκδοση εντολών συλλογής προς τη 3PL, οπτικός έλεγχος συσκευασιών/ελαττωματικών μονάδων (RMA) και ενημέρωση ERP.') }
    ]},
  { id: 'it', no: '05', title: 'IT Department', vtitle: 'IT', sub: 'IT Infrastructure, Cybersecurity & User Support', photo: 'it', photoPos: '70% center',
    tiles: [
      { t: 'Systems, Security & Compliance', s: 'Υποδομές, Ασφάλεια & Συμμόρφωση', b:
        L('Core Infrastructure', 'Διαχείριση Servers, Storage, Virtualization, Cloud, καθώς και Backup & DR Testing.') +
        L('Networking & Cyber-ops', 'Firewalls, VPN, LAN/WAN, Wi-Fi, SIEM, EDR, IAM και συνεχές security monitoring.') +
        L('Κανονιστική Συμμόρφωση', 'Εφαρμογή των τεχνικών ελέγχων για το ISO 27001, τεχνικά μέτρα προστασίας για το GDPR και Documentation (SOPs).') },
      { t: 'Endpoint, Helpdesk & Operations', s: 'Υποστήριξη, Συσκευές & Λειτουργία', b:
        L('User Support', 'Καθημερινό Helpdesk, διαχείριση tickets και account management για όλη την εταιρεία.') +
        L('Device Management', 'Έλεγχος PCs, laptops, mobile devices, asset management (CMDB, inventory) και updates/patching.') +
        L('Vendor Management', 'Συνεργασία με εξωτερικούς προμηθευτές και παρακολούθηση των SLAs σε επίπεδο IT υποδομών.') }
    ]},
  { id: 'field', no: '06', title: 'Field Service', vtitle: 'Field', sub: 'Επιτόπια υποστήριξη & συντονισμός τεχνικών', photo: 'field', photoPos: 'center',
    tiles: [
      { t: 'In-house & On-site Επισκευές', b: '<p>Πλήρης τεχνική αποκατάσταση και επισκευή των προϊόντων μας, τόσο στις εγκαταστάσεις της εταιρείας όσο και απευθείας στον χώρο των πελατών (on-site).</p>' },
      { t: 'Η «Βιτρίνα» της Εταιρείας στον Πελάτη', b: '<p>Ως τμήμα που έρχεται σε άμεση επαφή με τον τελικό καταναλωτή, διαχειριζόμαστε με εξειδικευμένο χειρισμό κάθε ιδιαιτερότητα, με στόχο τη βέλτιστη εμπειρία και την εξασφάλιση θετικών Google Reviews.</p>' },
      { t: 'Ποιοτικός Έλεγχος & Σύνδεση με το Product', b: '<p>Σχολαστικός έλεγχος και δοκιμές όλων των νέων προϊόντων πριν βγουν στην αγορά, και σύνταξη αναλυτικών τεχνικών εκθέσεων (technical reports) προς το τμήμα Product για τη συνεχή βελτίωσή τους.</p>' }
    ]},
  { id: 'technical', no: '07', title: 'Technical', photo: 'technical',
    tiles: [
      { t: 'Frontline & Customer Contact', b:
        L('Τηλεφωνικό Κέντρο E-Value', 'Διαχείριση εισερχόμενων κλήσεων τελικών πελατών, καταγραφή στοιχείων, δημιουργία tickets και έρευνες ικανοποίησης (happy calls).') +
        L('Support Specialists', 'Διαχείριση κλήσεων έδρας και email (συνεργατών & πελατών), αντιμετώπιση τεχνικών προβλημάτων 1ου επιπέδου (μικροσυσκευές, RAC, WIFI), ανάθεση εντολών και έκδοση τεχνικών εκθέσεων προς καταστήματα.') },
      { t: 'Network & Spare Parts Management', b:
        L('Network Coordinators', 'Διαχείριση εντολών και ραντεβού, κλείσιμο tickets, προσθήκη δαπανών, καθώς και η συντήρηση/επέκταση του δικτύου τεχνικών και των Service Points.') +
        L('Spare Parts', 'Διαχείριση αιτημάτων εκτός εγγύησης (Mailbox), λειτουργία του e-Shop, παραγγελίες ανταλλακτικών στο εργοστάσιο και πλήρης ενημέρωση της βάσης δεδομένων στο Entersoft (κωδικοί, φωτογραφίες κ.λπ.).') },
      { t: 'Technical Operations & Engineering', b:
        L('Engineers (RAC, CAC, H/P, VRF)', 'Τεχνική υποστήριξη και εξερχόμενες κλήσεις σε τεχνικούς δικτύου.') +
        L('Εκκινήσεις & Εργοστάσια', 'Διεκπεραίωση εκκινήσεων μονάδων/συστημάτων και απευθείας επικοινωνία με τα εργοστάσια.') +
        L('Knowledge & Training', 'Δημιουργία εκπαιδευτικού υλικού στο SharePoint και διοργάνωση εκπαιδεύσεων (Techdays).') },
      { t: 'Service Center Operations & In-House Repairs', b:
        L('Service Center Operations (Front Office)', 'Φυσική υποδοχή πελατών/συνεργατών, παραλαβή συσκευών για έλεγχο/επισκευή, έκδοση παραστατικών παραλαβής και άμεση ενημέρωση πελάτη.') +
        L('Local Bench Inventory', 'Προετοιμασία και χρέωση ανταλλακτικών για τους τεχνικούς του εσωτερικού service και ορθή χρήση POS/ERP για τις τοπικές χρεώσεις.') }
    ]},
  { id: 'consumer1', no: '08', title: 'Consumer Sales', part: '1 / 2', vtitle: 'Consumer', sub: 'Retail Segment (Διαχείριση Αλυσίδων & Buying Groups)', photo: 'consumer',
    tiles: [
      { t: 'Key Account Management & Commercial Agreements', s: 'Συμφωνίες & Εμπορική Στρατηγική', b: UL([
        'Κατάρτιση ετήσιου business plan ανά πελάτη/όμιλο (Euronics, Expert κ.λπ.) με στόχους τζίρου και όγκου.',
        'Διαχείριση των ετήσιων εμπορικών συμβάσεων (rebates, bonus στόχων, όροι πληρωμής).',
        'Καθορισμός εκπτωτικής πολιτικής, ειδικών προσφορών και deal-based τιμολόγησης για μεγάλες παραγγελίες.']) },
      { t: 'Sales Activation & In-Store Support', s: 'Προώθηση Πωλήσεων στα Καταστήματα', b: UL([
        'Σχεδιασμός καμπανιών πώλησης και προώθησης προϊόντων στα φυσικά και ηλεκτρονικά καταστήματα των πελατών.',
        'Εξασφάλιση της παρουσίας των προϊόντων στα σημεία πώλησης (stands, displays, εκθεσιακά προϊόντα).',
        'Εκπαίδευση των πωλητών των καταστημάτων πάνω στα χαρακτηριστικά και τα πλεονεκτήματα των προϊόντων της εταιρείας.']) },
      { t: 'Sales Forecasting & Performance Reporting', s: 'Προβλέψεις & Αναφορές Πωλήσεων', b: UL([
        'Πρόβλεψη ζήτησης (forecasting) ανά πελάτη με βάση την εποχικότητα (κλιματισμός) για τη σωστή κατανομή αποθεμάτων (stock allocation).',
        'Μηνιαία και τριμηνιαία reporting προς τη διοίκηση για την επίτευξη των στόχων και την κερδοφορία ανά πελάτη.',
        'Δια-τμηματική επικοινωνία με το Οικονομικό (πιστωτικός έλεγχος) και την Αποθήκη (χρόνοι παράδοσης) για την εξυπηρέτηση των παραγγελιών.']) }
    ]},
  { id: 'consumer2', no: '08', title: 'Consumer Sales', part: '2 / 2', vtitle: 'Consumer', sub: 'Sales Administration', photo: 'consumer', photoPos: '70% center',
    tiles: [
      { t: 'Customer Care & Sales Support', b:
        L('Διαχείριση Πελατών', 'Καθημερινή εξυπηρέτηση (μέσω τηλεφώνου/email), έλεγχος καρτέλας, παροχή πληροφοριών για προϊόντα/διαδικασίες και ενημέρωση εμπορικής πολιτικής.') +
        L('Επίλυση Προβλημάτων', 'Διαχείριση αιτημάτων, ερωτήσεων και παραπόνων, με στόχο τη διατήρηση της ικανοποίησης και της πιστότητας των πελατών.') +
        L('Υποστήριξη Πωλήσεων & Συνεργασία', 'Στενή υποστήριξη της ομάδας πωλήσεων και δια-τμηματική συνεργασία με Logistics, Τεχνική Υποστήριξη και Οικονομικό για την αποτελεσματική εξυπηρέτηση.') },
      { t: 'Order Processing & ERP Systems', b:
        L('Operations & Τιμολόγηση', 'Καταχώρηση και διαχείριση παραγγελιών, επιστροφών, αλλαγών ή ακυρώσεων, καθώς και έκδοση τιμολογίων και λοιπών παραστατικών.') +
        L('Data & Retail Admin', 'Καταχώριση στοιχείων/συμβάσεων στο ERP, δημιουργία αρχείων τιμοκαταλόγου για τις μεγάλες αλυσίδες και διαχείριση των διαδικασιών για το άνοιγμα νέων κωδικών.') +
        L('MyInventor Platform', 'Διαχείριση της πλατφόρμας ως προς τη διαθεσιμότητα των προϊόντων και την παραπομπή για επίλυση τεχνικών ή λειτουργικών ζητημάτων.') }
    ]},
  { id: 'commercial', no: '09', title: 'Commercial Sales', vtitle: 'Commercial', sub: 'B2B Sales, Engineering & Professional Channel Development', photo: 'commercial',
    tiles: [
      { t: 'Commercial Strategy & Network Development', b:
        L('Πωλήσεις & Συμφωνίες', 'Επίτευξη πωλήσεων, κλείσιμο εμπορικών συμφωνιών και προώθηση τεχνολογικά προηγμένων λύσεων (VRF, αντλίες θερμότητας, επαγγελματικός κλιματισμός).') +
        L('Διαχείριση Δικτύου', 'Στρατηγική ανάπτυξη και καθοδήγηση του δικτύου επαγγελματιών (εξειδικευμένα καταστήματα, εγκαταστάτες, τεχνικές εταιρείες, μελετητικά γραφεία).') +
        L('Market Intelligence', 'Συνεχής παρακολούθηση των ποσοτικών στόχων και ανάλυση της αγοράς και του ανταγωνισμού.') },
      { t: 'Pre Sales Support & Enablement', b:
        L('Pre-Sales Support', 'Παροχή εξειδικευμένης τεχνικής υποστήριξης πριν από την πώληση, τόσο για την εγχώρια αγορά όσο και για το δίκτυο εξαγωγών (Domestic & Export).') +
        L('Εκπαίδευση Συνεργατών', 'Διοργάνωση εκπαιδεύσεων και συνεχή υποστήριξη των επαγγελματιών του δικτύου, με στόχο την εδραίωση μακροχρόνιων σχέσεων.') }
    ]},
  { id: 'intl', no: '11', title: 'International Business', vtitle: 'International', photo: 'intl', photoPos: 'center',
    tiles: [
      { t: 'International Sales & Account Management', b:
        L('Ανάπτυξη Αγορών', 'Είσοδος σε νέες χώρες, ενδυνάμωση συνεργασιών με διανομείς εξωτερικού και υλοποίηση εμπορικής στρατηγικής εξαγωγών.') +
        L('Διαχείριση Σχέσεων', 'Εμπορική υποστήριξη, διαπραγματεύσεις συμβολαίων, εκπαίδευση προϊόντων και ανάλυση αποτελεσμάτων ανά χώρα και συνεργάτη.') },
      { t: 'Market Growth & Strategy', b:
        L('Διεθνής Παρουσία', 'Συμμετοχή σε διεθνείς εκθέσεις, επιχειρηματικές συναντήσεις στο εξωτερικό και λανσαρίσματα νέων προϊόντων.') +
        L('KPIs & Συνεργασία', 'Παρακολούθηση δεικτών (κερδοφορία, customer satisfaction) και δια-τμηματική συνεργασία με Product, Marketing, Finance και After Sales.') },
      { t: 'Export Operations & Logistics', b:
        L('Συντονισμός Παραγγελιών', 'Διαχείριση από τη λήψη έως την παράδοση, συντονισμός μεταφορέων (forwarders) και έλεγχος μεταφορικού κόστους.') +
        L('Supply Chain & Compliance', 'Παρακολούθηση αποθεμάτων σε συνεργασία με Product & Logistics και έκδοση εξαγωγικής τεκμηρίωσης (τιμολόγια, πιστοποιητικά, έγγραφα συμμόρφωσης).') }
    ]},
  { id: 'product', no: '10', title: 'Product', photo: 'product', photoPos: '40% center',
    tiles: [
      { t: 'Product Management', b: UL([
        'Ανάλυση αγοράς, ανταγωνισμού και νέων τάσεων για τον καθορισμό της στρατηγικής τοποθέτησης των προϊόντων.',
        'Επιλογή και εξέλιξη προϊόντων σε συνεργασία με προμηθευτές.',
        'Δημιουργία τεχνικού/εμπορικού περιεχομένου και υποστήριξη των εμπορικών και τεχνικών ομάδων με παρουσιάσεις και τεκμηρίωση.',
        'Παρακολούθηση της εμπορικής πορείας των κωδικών και εισήγηση νέων ευκαιριών.']) },
      { t: 'Purchasing & Product Compliance', b: UL([
        'Διαχείριση συνεργειών, διαπραγμάτευση τιμών και εμπορικών όρων με τους προμηθευτές.',
        'Προγραμματισμός αγορών, παρακολούθηση παραγγελιών και διασφάλιση της διαθεσιμότητας των προϊόντων.',
        'Διαχείριση πιστοποιήσεων, τεχνικής τεκμηρίωσης και διασφάλιση της πλήρους συμμόρφωσης με τη νομοθεσία κάθε αγοράς.']) }
    ]}
];

/* ---------------- Οργανόγραμμα ----------------
   n = όνομα, r = ρόλος, c = πλήθος (ομάδα), k = υφιστάμενοι */
const T = (c, r, k) => ({ c, r, k });
window.ORG = {
  n: 'ΚΩΣΤΟΠΟΥΛΟΥ ΜΑΡΙΑ', r: 'Managing Director',
  k: [
    { n: 'ΦΟΥΤΡΗΣ ΑΘΑΝΑΣΙΟΣ', r: 'CFO', tag: 'Finance', k: [
      { n: 'ΚΩΝΣΤΑΝΤΟΠΟΥΛΟΥ ΑΙΚΑΤΕΡΙΝΗ', r: 'Financial Controller' },
      { n: 'ΚΟΤΣΑΝΙΤΗ ΒΑΣΙΛΙΚΗ', r: 'Accounting Manager', k: [
        T(1, 'Senior Accountant / Import-Export Officer'), T(1, 'Junior Accountant'),
        T(1, 'Certified Tax Accountant'), T(2, 'Credit Control Officers') ] }
    ]},
    { n: 'ΡΕΑ ΛΕΘΙΩΤΑΚΗ', r: 'Chief People, Culture & Communications Officer', short: 'CPCO', tag: 'HR · Marketing', k: [
      { n: 'ΤΣΟΥΚΑΝΕΛΗ ΔΗΜΗΤΡΑ', r: 'HR Director', k: [
        T(2, 'HR Generalists'), T(1, 'Executive Secretary'), T(1, 'Driver'), T(4, 'Operation Staff') ] },
      { n: 'ΠΑΝΑΓΟΠΟΥΛΟΥ ΑΘΑΝΑΣΙΑ', r: 'Marketing Director', k: [
        { n: 'ΚΟΡΜΠΑΚΗ ΑΦΡΟΔΙΤΗ', r: 'Senior Brand Manager', k: [ T(1, 'Brand Manager'), T(1, 'Junior Brand Manager') ] },
        { n: 'ΚΑΡΕΚΛΑ ΚΛΕΑΝΘΗ', r: 'Graphic Designer Manager', k: [ T(2, 'Senior Graphic Designers'), T(1, 'Graphic Designer & Photo Expert') ] }
      ]}
    ]},
    { n: 'ΦΛΟΥΡΗΣ ΜΥΡΩΝ', r: 'COO', tag: 'Operations', k: [
      { n: 'ΠΕΤΡΟΠΟΥΛΟΥ ΝΙΚΗ', r: 'Logistics Director', k: [
        { n: 'ΜΑΡΘΑ ΤΖΩΡΤΖΗ', r: 'Logistics Manager', k: [ T(1, 'Logistics Coordinator'), T(3, 'Logistics Administrators') ] } ] },
      { n: 'ΣΤΕΦΑΝΗΣ ΑΘΑΝΑΣΙΟΣ', r: 'IT Director', k: [ T(1, 'ICT Administrator') ] },
      { n: 'ΣΙΣΚΟΣ ΖΑΦΕΙΡΗΣ', r: 'Field Service & Maintenance Director', k: [
        { n: 'ΚΟΡΔΩΝΗΣ ΑΝΑΣΤΑΣΙΟΣ', r: 'Field Service Manager', k: [ T(6, 'Field Technicians'), T(1, 'Facilities Coordinator') ] } ] },
      { n: 'ΚΡΙΚΟΣ ΚΩΣΤΑΣ', r: 'Technical Service Director', wide: true, k: [
        { n: 'ΚΑΡΡΑΣ ΠΑΝΑΓΙΩΤΗΣ', r: 'Contact Center Manager', k: [ T(6, 'External Contact Center') ] },
        { n: 'ΧΑΡΑΤΣΑΡΗΣ ΓΕΩΡΓΙΟΣ', r: 'Spare Parts Manager', k: [ T(2, 'Spare Parts Coordinators') ] },
        T(1, 'Dispatch Scheduling Supervisor', [ T(1, 'Service Coordinator') ]),
        T(1, 'Service Center Operations Coordinator'),
        T(6, 'Customer Service Specialists'),
        T(3, 'Warehouse Admin'),
        T(2, 'Technical Specialists'),
        T(2, 'Senior Technical Specialists')
      ]}
    ]},
    { n: 'ΜΑΡΑΘΟΣ ΧΡΗΣΤΟΣ', low: true, r: 'Consumer Sales Director', tag: 'Consumer', k: [
      { n: 'ΚΑΡΑΚΩΣΤΑΣ ΚΩΝΣΤΑΝΤΙΝΟΣ', r: 'Key Account Manager', k: [ T(6, 'Merchandisers') ] },
      { n: 'ΓΕΩΡΓΟΥΛΟΥ ΒΑΡΒΑΡΑ', r: 'Sales Administration Manager', k: [ T(5, 'Sales Administrators') ] },
      T(7, 'Sales Account Managers')
    ]},
    { n: 'ΓΑΖΗΣ ΤΑΣΟΣ', low: true, r: 'Commercial Sales Director', tag: 'Commercial', k: [
      T(1, 'Sales Engineer'), T(2, 'Account Managers'), T(1, 'Presales Specialist'),
      T(1, 'Senior Business Development Manager, Professional Channel (N. Greece)')
    ]},
    { n: 'ΤΣΕΛΕΣ ΛΟΥΚΑΣ', low: true, r: 'International Business Director', tag: 'International', k: [
      T(5, 'International Account Managers'),
      { n: 'ΘΕΟΧΑΡΗ ΚΩΝΣΤΑΝΤΙΝΑ', r: 'International Operations Manager', k: [ T(3, 'International Operations Coordinators') ] }
    ]},
    { n: 'ΛΑΖΑΡΙΔΟΥ ΓΕΩΡΓΙΑ', low: true, r: 'Product Director', tag: 'Product', k: [
      { n: 'ΤΟΜΑΣΗ ΕΛΕΝΗ', r: 'Product Compliance & Purchase Manager', k: [ T(2, 'Junior Buyers') ] },
      T(2, 'Senior Product Owners'), T(1, 'Product Owner')
    ]}
  ]
};

/* ---------------- Απολογισμός (Ιαν–Αυγ) ---------------- */
window.RESULTS = {
  rows: [
    { k: 'Πωλήσεις Ελλάδος',    a25: 41030127.18, bu: 48347094.45, a26: 39384825.39, vLY: -4.00,  vBU: -18.50 },
    { k: 'Πωλήσεις Εξωτερικού', a25: 12709425.38, bu: 14414703.87, a26: 10075806.96, vLY: -20.70, vBU: -30.10 },
    { k: 'ΣΥΝΟΛΑ',              a25: 53739552.56, bu: 62761798.32, a26: 49460632.35, vLY: -7.96,  vBU: -21.20, total: true }
  ],
  ebit: { a25: 15.49, bu: 15.84, a26: 11.83 }
};
