const express = require('express');
const app = express();
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const db = new sqlite3.Database('dl.db');

function getRandomObjects(callback) {
  db.all('SELECT * FROM sign ORDER BY RANDOM() LIMIT 3', function (err, rows) {
    if (err) {
      console.log(err);
      return callback(err);
    }
    callback(null, rows);
  });
}

function getCategoryById(categoryId, callback) {
  db.get('SELECT name FROM signCategory WHERE id = ?', categoryId, function (err, row) {
    if (err) {
      console.log(err);
      return callback(err);
    }
    callback(null, row ? row.name : '');
  });
}

app.get('/listSign', function (req, res) {
  db.all('SELECT * FROM sign', function (err, rows) {
    if (err) {
      console.log(err);
      return res.status(500).send('Błąd serwera');
    }
    res.json(rows);
  });
});

app.get('/randomObjects', function (req, res) {
  getRandomObjects(function (err, objects) {
    if (err) {
      return res.status(500).send('Błąd serwera');
    }
    // Przetwarzanie każdego obiektu, aby dodać nazwę kategorii
    let count = 0;
    objects.forEach(function (object) {
      getCategoryById(object.categoryId, function (err, categoryName) {
        if (err) {
          return res.status(500).send('Błąd serwera');
        }
        object.categoryName = categoryName;
        count++;
        // Po przetworzeniu wszystkich obiektów, zwróć wynik
        if (count === objects.length) {
          res.json(objects);
        }
      });
    });
  });
});


app.get('/categoryById/:id', function(req, res) {
  const categoryId = req.params.id;
  getCategoryById(categoryId, function(err, categoryName) {
    if (err) {
      console.log(err);
      return res.status(500).send('Błąd serwera');
    }
    res.json({ name: categoryName });
  });
});




app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const server = app.listen(8081, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log(`Serwer nasłuchuje na http://${host}:${port}`);
});
