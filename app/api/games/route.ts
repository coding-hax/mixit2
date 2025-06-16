// lib/db.ts

import { Pool } from 'pg';

// Lade Umgebungsvariablen aus der .env-Datei
// In Next.js werden .env-Variablen, die nicht mit NEXT_PUBLIC_ beginnen,
// automatisch auf der Server-Seite geladen.
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // Wenn DATABASE_URL nicht gefunden wird, werfe einen Fehler,
  // da die Datenbankverbindung entscheidend ist.
  throw new Error('DATABASE_URL ist in den Umgebungsvariablen nicht gesetzt.');
}

// Erstelle einen Connection Pool für PostgreSQL.
// Ein Pool ist effizienter, da er eine Gruppe von wiederverwendbaren Client-Verbindungen verwaltet.
// Dies ist wichtig für Webanwendungen, die viele gleichzeitige Anfragen verarbeiten müssen.
const pool = new Pool({
  connectionString: connectionString,
  // Optional: Weitere Konfigurationsoptionen
  // max: 20, // Maximale Anzahl von Clients im Pool (Standard ist 10)
  // idleTimeoutMillis: 30000, // Clients werden nach dieser Zeit im Leerlauf geschlossen (Standard ist 30 Sekunden)
});

// Listener für Pool-Fehler
pool.on('error', (err, client) => {
  console.error('Unerwarteter Fehler auf inaktivem Client', err);
  // Optional: Füge hier spezifisches Fehler-Handling hinzu
  // z.B. Benachrichtigung an ein Monitoring-System
});

/**
 * Eine Wrapper-Funktion für Datenbankabfragen.
 * Sie ermöglicht eine einfache und sichere Ausführung von SQL-Abfragen.
 * @param text - Der SQL-Abfragetext.
 * @param params - Optionale Parameter für die Abfrage, um SQL-Injection zu verhindern.
 * @returns Das Ergebnis der Datenbankabfrage.
 */
export const query = (text: string, params?: any[]) => pool.query(text, params);

// Optional: Test der Verbindung beim Start
async function testDbConnection() {
  try {
    const client = await pool.connect();
    // Führe eine einfache Abfrage aus, um die Verbindung zu testen
    const res = await client.query('SELECT 1+1 AS result');
    console.log('Datenbankverbindung erfolgreich hergestellt:', res.rows[0].result); // Sollte 2 ausgeben
    client.release(); // Verbindung zurück in den Pool geben
  } catch (err) {
    console.error('Fehler beim Testen der Datenbankverbindung:', err);
    // Beende den Prozess, wenn die Datenbankverbindung kritisch ist und nicht hergestellt werden kann
    process.exit(1);
  }
}

// Teste die Verbindung nur, wenn nicht im Test-Modus
if (process.env.NODE_ENV !== 'test') {
  testDbConnection();
}

export default pool;
