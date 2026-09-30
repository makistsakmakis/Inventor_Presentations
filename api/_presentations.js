// Κατάλογος παρουσιάσεων: όνομα υποφακέλου → τίτλος που γράφεται στο αρχείο συνδέσεων.
// Για νέα παρουσίαση: προσθέστε μία γραμμή εδώ + μία κάρτα στο index.html.
export const PRESENTATIONS = {
  'welcome-stores-thessaloniki-2026': 'Welcome Stores · Θεσσαλονίκη 2026',
  'Inventor_Organogram_2026': 'Οργανόγραμμα 2026',
  'Psyktikos_Kyklos_2026': 'Ο Ψυκτικός Κύκλος · Σεμινάριο Κλιματισμού',
};
export const LOGIN = 'login';
export const titleOf = k => k === LOGIN ? 'Σύνδεση' : (PRESENTATIONS[k] || k || '—');
