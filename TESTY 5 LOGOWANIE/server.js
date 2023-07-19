const http = require('http');
const { parse, serialize } = require('cookie');

const server = http.createServer((req, res) => {
  console.log('elo');

  // Ustawianie ciasteczka
  res.setHeader('Set-Cookie', serialize('name', 'value'));

  // Odczytywanie ciasteczka
  const cookie = parse(req.headers.cookie || '');
  const value = cookie.name;

  console.log(value);

  // Wysyłanie odpowiedzi do klienta
  res.end('Hello, World!');
});

// Nasłuchiwanie na porcie 3000
server.listen(3000, () => {
  console.log('Server started on port 3000');
});
