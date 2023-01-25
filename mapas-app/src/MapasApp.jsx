import { useState } from "react";
import MapaPage from "./pages/MapaPage";
import "./index.css";
import { SocketProvider } from "../context/SocketContext";

function MapasApp() {
  return (
    <SocketProvider>
      <MapaPage />
    </SocketProvider>
  );
}

export default MapasApp;
