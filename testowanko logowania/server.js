const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Ustalenie katalogu, w którym znajdują się pliki HTML i CSS
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

// Ustawienia sesji
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
}));

// Middleware sprawdzające, czy użytkownik jest zalogowany
function checkAuth(req, res, next) {
  if (req.session.isLoggedIn) {
    next();
  } else {
    res.redirect('/login');
  }
}

// Strona logowania
app.get('/login', (req, res) => {
  res.sendFile(path.join(staticDir, 'login.html'));
});

// Obsługa logowania
app.post('/login', (req, res) => {
  // Sprawdzenie danych logowania
  const username = req.body.username;
  const password = req.body.password;

  // Walidacja użytkownika (przykładowe dane)
  if (username === 'admin' && password === 'password') {
    req.session.isLoggedIn = true;
    res.redirect('/page1');
  } else {
    res.redirect('/login');
  }
});

// Wylogowanie
app.get('/logout', (req, res) => {
  req.session.isLoggedIn = false;
  res.redirect('/login');
});

// Strona 1 (dostępna tylko po zalogowaniu)
app.get('/page1', checkAuth, (req, res) => {
  res.sendFile(path.join(staticDir, 'page1.html'));
});

// Strona 2 (dostępna tylko po zalogowaniu)
app.get('/page2', checkAuth, (req, res) => {
  res.sendFile(path.join(staticDir, 'page2.html'));
});

// Uruchomienie serwera
app.listen(port, () => {
  console.log(`Serwer Express.js działa na porcie ${port}`);
});
