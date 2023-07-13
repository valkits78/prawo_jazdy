const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

const usersFilePath = path.join(__dirname, 'users.json');

app.get('/listUsers', function (req, res) {
  fs.readFile(usersFilePath, 'utf8', function (err, data) {
    if (err) {
      console.log(err);
      return res.status(500).send('Błąd serwera');
    }

    try {
      const users = JSON.parse(data);
      res.json(users);
    } catch (error) {
      console.log(error);
      return res.status(500).send('Nieprawidłowy format pliku JSON');
    }
  });
});

app.post('/addUser', function (req, res) {
  const user = {
    name: req.body.name,
    password: req.body.password,
    profession: req.body.profession,
    id: generateId()
  };

  fs.readFile(usersFilePath, 'utf8', function (err, data) {
    if (err) {
      console.log(err);
      return res.status(500).send('Błąd serwera');
    }

    try {
      const users = JSON.parse(data);
      users['user' + user.id] = user;

      fs.writeFile(usersFilePath, JSON.stringify(users), function (err) {
        if (err) {
          console.log(err);
          return res.status(500).send('Błąd serwera');
        }

        console.log('Użytkownik został dodany:', user);
        //res.json({ success: true, user });
		res.redirect('/');
		
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send('Nieprawidłowy format pliku JSON');
    }
  });
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname,'index.html'));
});

const server = app.listen(8081, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log(`Serwer nasłuchuje na http://${host}:${port}`);
});

function generateId() {
  return Math.floor(Math.random() * 1000);
}
