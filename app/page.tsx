// app/page.tsx

'use client'; // Dies ist wichtig für Client-Komponenten im App Router

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Wichtig: next/navigation für App Router

export default function HomePage() {
  const [username, setUsername] = useState<string>('');
  const [userId, setUserId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false); // State für den Bearbeitungsmodus des Namens
  const [showJoinInput, setShowJoinInput] = useState<boolean>(false); // State für Sichtbarkeit des Join-Inputs
  const [joinGameCode, setJoinGameCode] = useState<string>(''); // State für den eingegebenen Gruppen-Code

  const router = useRouter();

  useEffect(() => {
    // Dieser Effekt läuft einmalig beim Laden der Komponente (im Browser)
    if (typeof window !== 'undefined') {
      const storedUsername = localStorage.getItem('mixit_username');
      let storedUserId = localStorage.getItem('mixit_user_id');

      if (storedUsername) {
        setUsername(storedUsername);
        setIsEditing(false); // Wenn Name gefunden, nicht im Bearbeitungsmodus starten
      } else {
        setIsEditing(true); // Wenn kein Name gefunden, direkt im Bearbeitungsmodus starten
      }

      if (!storedUserId) {
        // Wenn keine User-ID gespeichert ist, generiere eine neue
        const newUserId = crypto.randomUUID(); // Sichere UUID-Generierung
        localStorage.setItem('mixit_user_id', newUserId);
        storedUserId = newUserId; // Aktualisiere die Variable für den aktuellen Render
        console.log('Generated new User ID:', newUserId);
      } else {
        console.log('Existing User ID:', storedUserId);
      }
      setUserId(storedUserId); // Setze den userId State
    }
  }, []); // Leeres Array als Abhängigkeit bedeutet: nur einmal beim Mounten ausführen

  // --- Event-Handler für den Benutzernamen ---
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleSaveUsername = () => {
    if (username.trim()) {
      localStorage.setItem('mixit_username', username.trim());
      alert(`Spielername "${username.trim()}" gespeichert!`); // Temporärer Alert
      setIsEditing(false); // Nach dem Speichern Bearbeitungsmodus verlassen
    } else {
      alert('Bitte gib einen Spielernamen ein.'); // Temporärer Alert
    }
  };

  const handleEditUsername = () => {
    setIsEditing(true); // Bearbeitungsmodus aktivieren
  };

  // --- Event-Handler für Gruppenaktionen ---
  const handleCreateGroup = () => {
    // Grundlegende Validierung vor Backend-Call
    if (!username.trim() || !userId) {
      alert('Bitte gib zuerst einen Spielernamen ein und stelle sicher, dass deine ID generiert wurde.');
      setIsEditing(true); // Ggf. Bearbeitungsmodus öffnen, damit Name eingegeben werden kann
      return;
    }
    console.log(`Gruppe erstellen für User: ${username} (ID: ${userId})`);
    alert(`Gruppe wird erstellt für ${username}! (Noch keine Backend-Integration)`); // Temporärer Alert
    // Später: API-Call zum Backend, z.B. fetch('/api/games/create', ...)
    // router.push('/lobby/new'); // Beispiel-Weiterleitung nach erfolgreicher Erstellung
  };

  const handleJoinGroup = () => {
    // Grundlegende Validierung
    if (!username.trim() || !userId) {
      alert('Bitte gib zuerst einen Spielernamen ein und stelle sicher, dass deine ID generiert wurde.');
      setIsEditing(true);
      return;
    }
    setShowJoinInput(true); // Eingabefeld für den Code anzeigen
  };

  const handleJoinGroupCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setJoinGameCode(event.target.value);
  };

  const handleSubmitJoinGroupCode = () => {
    if (joinGameCode.trim()) {
      // Hier würde später der API-Call zum Backend erfolgen
      console.log(`Versuche, Gruppe beizutreten mit Code: ${joinGameCode.trim()} für User: ${username} (ID: ${userId})`);
      alert(`Versuche, Gruppe beizutreten: ${joinGameCode.trim()} (Noch keine Backend-Integration)`); // Temporärer Alert
      // Später: API-Call zum Backend, z.B. fetch(`/api/games/join`, { method: 'POST', body: JSON.stringify({ gameCode: joinGameCode, userId, username }) })
      // router.push(`/lobby/${joinGameCode.trim()}`); // Beispiel-Weiterleitung
    } else {
      alert('Bitte gib einen Gruppen-Code ein.'); // Temporärer Alert
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-mixit-dark text-mixit-light-yellow p-4">
      <h1 className="text-5xl md:text-7xl font-bold mb-8 text-mixit-orange drop-shadow-lg">
        Mixit
      </h1>

      <div className="bg-mixit-green p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-6 text-center text-mixit-light-yellow">
          Dein Spielername
        </h2>

        {/* Konditionelles Rendering basierend auf isEditing State für den Namen */}
        {isEditing ? (
          // Bearbeitungsmodus: Zeige Input und Speichern-Button für den Namen
          <>
            <div className="mb-4">
              <label htmlFor="username" className="block text-mixit-light-yellow text-lg font-medium mb-2">
                Gib deinen Namen ein:
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={handleUsernameChange}
                placeholder="Dein Name"
                className="w-full p-3 rounded-md bg-mixit-dark-orange/20 text-mixit-light-yellow placeholder-mixit-light-yellow/70 border border-mixit-dark-orange focus:outline-none focus:ring-2 focus:ring-mixit-orange"
                maxLength={20}
              />
            </div>

            <button
              onClick={handleSaveUsername}
              className="w-full bg-mixit-dark-orange hover:bg-mixit-orange transition-colors duration-200 text-white font-bold py-3 px-6 rounded-md shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-mixit-light-yellow"
            >
              Namen speichern
            </button>
          </>
        ) : (
          // Ansichtsmodus: Zeige nur Namen und "Namen ändern", "Gruppe erstellen", "Gruppe beitreten" Buttons
          <div className="text-center">
            <p className="text-mixit-light-yellow text-3xl font-bold mb-6">
              {username}
            </p>
            <button
              onClick={handleEditUsername}
              className="w-full bg-mixit-dark-orange hover:bg-mixit-orange transition-colors duration-200 text-white font-bold py-3 px-6 rounded-md shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-mixit-light-yellow mb-4" // Margin unten hinzugefügt
            >
              Namen ändern
            </button>

            {/* Buttons für Gruppe erstellen/beitreten - nur sichtbar, wenn Name gespeichert */}
            <button
              onClick={handleCreateGroup}
              className="w-full bg-mixit-orange hover:bg-mixit-dark-orange transition-colors duration-200 text-white font-bold py-3 px-6 rounded-md shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-mixit-light-yellow mb-4"
            >
              Gruppe erstellen
            </button>

            <button
              onClick={handleJoinGroup}
              className="w-full bg-mixit-orange hover:bg-mixit-dark-orange transition-colors duration-200 text-white font-bold py-3 px-6 rounded-md shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-mixit-light-yellow mb-4"
            >
              Gruppe beitreten
            </button>

            {/* Eingabefeld und Button zum Beitreten per Code, nur sichtbar wenn 'Gruppe beitreten' geklickt wurde */}
            {showJoinInput && (
              <div className="mt-4">
                <label htmlFor="joinCode" className="block text-mixit-light-yellow text-lg font-medium mb-2">
                  Gruppen-Code eingeben:
                </label>
                <input
                  type="text"
                  id="joinCode"
                  value={joinGameCode}
                  onChange={handleJoinGroupCodeChange}
                  placeholder="UUID des Spiels"
                  className="w-full p-3 rounded-md bg-mixit-dark-orange/20 text-mixit-light-yellow placeholder-mixit-light-yellow/70 border border-mixit-dark-orange focus:outline-none focus:ring-2 focus:ring-mixit-orange mb-4"
                />
                <button
                  onClick={handleSubmitJoinGroupCode}
                  className="w-full bg-mixit-dark-orange hover:bg-mixit-orange transition-colors duration-200 text-white font-bold py-3 px-6 rounded-md shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-mixit-light-yellow"
                >
                  Beitreten
                </button>
              </div>
            )}
          </div>
        )}

        {/* Die User ID Anzeige bleibt immer sichtbar, unabhängig vom Bearbeitungsmodus */}
        <p className="mt-8 text-mixit-light-yellow text-opacity-80 text-sm text-center">
          Deine einzigartige ID: <span className="font-mono text-xs">{userId || 'Wird geladen...'}</span>
        </p>
      </div>
    </div>
  );
}