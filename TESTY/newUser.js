var express = require('express');
var app = express();
var fs = require("fs");

app.use(express.urlencoded({ extended: true }));

app.post('/addUser', function (req, res) {
  var user = {
    "name": req.body.name,
    "password": req.body.password,
    "profession": req.body.profession,
    "id": generateId() // Dodatkowo generuje unikalne ID dla nowego użytkownika
  };

  fs.readFile("users.json", 'utf8', function (err, data) {
    if (err) {
      console.log(err);
      return res.status(500).send("Błąd serwera");
    }

    var users = {};

    try {
      users = JSON.parse(data);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Nieprawidłowy format pliku JSON");
    }

    users["user" + user.id] = user;

    fs.writeFile("users.json", JSON.stringify(users), function (err) {
      if (err) {
        console.log(err);
        return res.status(500).send("Błąd serwera");
      }

      console.log("Użytkownik został dodany: ", user);
      res.redirect("/");
    });
  });
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Serwer nasłuchuje na http://%s:%s", host, port);
});

// Funkcja do generowania unikalnego ID
function generateId() {
  return Math.floor(Math.random() * 1000);
}
