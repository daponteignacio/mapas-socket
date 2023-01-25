import { useContext } from "react";
import { useEffect } from "react";
import { SocketContext } from "../../context/SocketContext";
import { useMapbox } from "../../hooks/useMapbox";
import { useSocket } from "../../hooks/useSocket";

const initilPos = {
  lng: -57.9645225,
  lat: -34.9548928,
  zoom: 15.5,
};

const MapaPage = () => {
  const { setRef, mewMarker$, markerMovement$, addMarker, updateMarkerPos } =
    useMapbox(initilPos);

  const { socket } = useContext(SocketContext);

  useEffect(() => {
    socket.on("active-markers", (markers) => {
      for (const key of Object.keys(markers)) {
        addMarker(markers[key], key);
      }
    });
  }, [socket, addMarker]);

  // a marker was created
  useEffect(() => {
    mewMarker$.subscribe((marker) => {
      console.log("new marker");
      socket.emit("new-marker", marker);
    });
  }, [mewMarker$, socket]);

  // a marker was moved
  useEffect(() => {
    markerMovement$.subscribe((marker) => {
      socket.emit("marker-moved", marker);
    });
  }, [markerMovement$]);

  useEffect(() => {
    socket.on("new-marker", (marker) => {
      addMarker(marker, marker.id);
    });
  }, [socket, addMarker]);

  useEffect(() => {
    socket.on("marker-moved", (marker) => {
      updateMarkerPos(marker, marker.id);
    });
  }, [socket, addMarker]);

  return (
    <>
      <div className="map-container" ref={setRef}></div>
      <div></div>
    </>
  );
};

export default MapaPage;
