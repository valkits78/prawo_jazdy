const express = require('express');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;
const dbPath = 'dl.db';


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Ustalenie katalogu, w którym znajdują się pliki HTML i CSS
const staticDir = path.join(__dirname, '../frontend');
app.use(express.static(staticDir));

// Tworzenie połączenia z bazą danych
const db = new sqlite3.Database(dbPath);

// Ustawienia sesji
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
  }));

// Middleware sprawdzające, czy użytkownik jest zalogowany
function checkAuth(req, res, next) {
  if (req.session.isLoggedIn || req.url === '/register') {
    next();
  } else {
    res.redirect('/login');
  }
}

app.get('/login', (req, res) => {
  const loginPath = path.join(staticDir, 'login.html');
  res.sendFile(loginPath);
});
// Obsługa logowania
app.post('/login', (req, res) => {
  // Sprawdzenie danych logowania
  const username = req.body.login;
  const password = req.body.password;

  const query = 'SELECT * FROM user';

  db.all(query, [], (err, rows) => {
    if (err) { 
      // Obsługa błędu w przypadku niepowodzenia zapytania
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      const user = rows.find((row) => row.login === username && row.password === password);
      if (user) {
        req.session.isLoggedIn = true;
        res.redirect('/city');
      } else {
        res.redirect('/login');
      }
    }
  });
});

app.get('/register', checkAuth, (req, res) => {
  const registerPath = path.join(staticDir, '../frontend/register.html');
  res.sendFile(registerPath);
});
app.post('/register', (req, res) => {
  const username = req.body.login;
  const password = req.body.password;

  // Sprawdź, czy użytkownik o podanym loginie już istnieje w bazie danych
  const checkUserQuery = 'SELECT * FROM user WHERE login = ?';
  db.get(checkUserQuery, [username], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else if (row) {
      // Jeśli użytkownik o podanym loginie już istnieje, wyślij komunikat o błędzie
      res.status(409).send('Użytkownik o podanym loginie już istnieje.');
    } else {
      // Jeśli użytkownik o podanym loginie nie istnieje, dodaj go do bazy danych
      const insertUserQuery = 'INSERT INTO user (login, password, money, lvl) VALUES (?, ?, 0, 1)';
      db.run(insertUserQuery, [username, password], (err) => {
        if (err) {
          console.error('Błąd przy dodawaniu użytkownika:', err.message);
          res.status(500).send('Internal Server Error');
        } else {
          console.log(`Użytkownik ${username} został zarejestrowany.`);
          res.redirect('/login'); // Możesz przekierować użytkownika na stronę logowania po zarejestrowaniu
        }
      });
    }
  });
});

app.get('/city', checkAuth, (req, res) => {
  const cityPath = path.join(staticDir, '../frontend/city.html');
  res.sendFile(cityPath);
});
app.post('/logout', (req, res) => {
  req.session.isLoggedIn = false;
  res.json({ success: true }); // Odpowiedź dla klienta, że wylogowanie zakończyło się sukcesem
});




//-----_____-----______-----_____-----_____-----_____-----_____-----
// Uruchomienie serwera
app.listen(port, () => {
    console.log(`Serwer działa na porcie ${port}`);
  });