// Servidor de Express
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const { fileURLToPath } = require("url");
const { join , resolve} = require("path");

const Sockets = require("./sockets");
const dirname = resolve();

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 8082;

    // Http server
    this.server = http.createServer(this.app);

    // Configuraciones de sockets
    this.io = socketio(this.server, {
      cors: {
        origin: ['http://localhost:8082'],
        methods: ["GET", "POST"],
      },
    });
  }

  middlewares() {
    // Desplegar el directorio público
    this.app.use(express.static(join(dirname, "../mapas-app/dist")));
  }

  // Esta configuración se puede tener aquí o como propieda de clase
  // depende mucho de lo que necesites
  configurarSockets() {
    new Sockets(this.io);
  }

  execute() {
    // Inicializar Middlewares
    this.middlewares();

    // Inicializar sockets
    this.configurarSockets();

    // Inicializar Server
    this.server.listen(this.port, () => {
      console.log("Server corriendo en puerto:", this.port);
    });
  }
}

module.exports = Server;
