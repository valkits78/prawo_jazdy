const express = require('express');
const app = express();
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const db = new sqlite3.Database('testowa_baza.db');

app.get('/listUsers', function (req, res) {
  db.all('SELECT * FROM testowa_baza', function (err, rows) {
    if (err) {
      console.log(err);
      return res.status(500).send('Błąd serwera');
    }
    res.json(rows);
  });
});

app.post('/addUser', function (req, res) {
  const user = {
    name: req.body.name,
    password: req.body.password,
    profession: req.body.profession,
  };
  
  console.log(user.name);
  console.log('Użytkownik został dodany:', user);

  db.run(
    'INSERT INTO testowa_baza (name, password, profesion) VALUES (?, ?, ?)',
    [user.name, user.password, user.profession],
    function (err) {
      if (err) {
        console.log(err);
        return res.status(500).send('Błąd serwera');
      }

      res.redirect('/'); // Przekierowanie na stronę główną
    }
  );
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const server = app.listen(8081, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log(`Serwer nasłuchuje na http://${host}:${port}`);
});
