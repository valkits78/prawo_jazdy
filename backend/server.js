const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Ustalenie katalogu, w którym znajdują się pliki HTML i CSS
const staticDir = path.join(__dirname, '../frontend');
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
    const username = req.body.login;
    const password = req.body.password;
  
    
    // Walidacja użytkownika (przykładowe dane)
    if (username === 'admin' && password === 'password') {
      req.session.isLoggedIn = true;
      res.redirect('/city');
    } else {
      res.redirect('/login');
    }
  });

app.get('/city', checkAuth, (req, res) => {
    res.sendFile(path.join(staticDir, '../frontend/city.html'));
});






//-----_____-----______-----_____-----_____-----_____-----_____-----
// Uruchomienie serwera
app.listen(port, () => {
    console.log(`Serwer działa na porcie ${port}`);
  });