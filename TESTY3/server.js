const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const dbPath = 'dl.db';

app.get('/api/sign', (req, res) => {
  // Tworzenie połączenia z bazą danych
  const db = new sqlite3.Database(dbPath);

  // Wykonanie zapytania SQL do pobrania wszystkich rekordów z tabeli "sign"
  const query = 'SELECT * FROM sign';

  db.all(query, [], (err, rows) => {
    if (err) {
      // Obsługa błędu w przypadku niepowodzenia zapytania
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      // Zwracanie wyników jako odpowiedź API
      console.log(rows[0].id);
      res.json(rows);
    }
  });

  // Zamykanie połączenia z bazą danych po zakończeniu zapytania
  db.close();
});

app.listen(3000, () => {
  console.log('Server is up on port 3000');
});
