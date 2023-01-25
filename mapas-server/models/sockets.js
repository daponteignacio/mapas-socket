const Markers = require("./markers");

class Sockets {
  constructor(io) {
    this.io = io;

    this.markers = new Markers();

    this.socketEvents();
  }

  socketEvents() {
    // On connection
    this.io.on("connection", (socket) => {
      console.log('connected');

      socket.emit("active-markers", this.markers.actives);

      socket.on("marker-moved", marker => {
        this.markers.updateMarker(marker)
        socket.broadcast.emit("marker-moved", marker);
      })

      socket.on("new-marker", (marker) => {
        console.log("new-marker", marker.id);
        this.markers.addMarker(marker);

        socket.broadcast.emit("new-marker", marker);
      });
    });
  }
}

module.exports = Sockets;
