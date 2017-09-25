import connect from 'connect';
import path from 'path';
import portscanner from 'portscanner';
import serveStatic from 'serve-static';

// Configuration for the server.
const PORT = 9999;
const MAX_PORT = PORT + 100;
const HOST = '127.0.0.1';

const app = connect();

app.use(serveStatic(path.join(__dirname, '..')));

portscanner.findAPortNotInUse(PORT, MAX_PORT, HOST, (error, port) => {
  if (error) {
    throw error;
  }

  process.stdout.write(`Serving on http://${HOST}:${port}` + '\n\n');

  app.listen(port);
});
