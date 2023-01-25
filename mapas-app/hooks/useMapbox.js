import { useCallback, useEffect, useRef, useState } from "react";
import mapboxgl, { maxParallelImageRequests } from "mapbox-gl";
import { v4 } from "uuid";
import { Subject } from "rxjs";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZGFwb250ZWlnbmFjaW8iLCJhIjoiY2xkYXN0ZXU0MG0ycDN3cWtvb2U3ajJwYSJ9.gk-M_A5Jcq1pc89YDKQ8IA";

export const useMapbox = (initialPos) => {
  // rxjs observables
  const markerMovement = useRef(new Subject());
  const newMarker = useRef(new Subject());

  // markers reference
  const markers = useRef({});

  // map and coords
  const mapa = useRef();
  const [coords, setCoords] = useState(initialPos);

  // ref to map
  const mapaRef = useRef();
  const setRef = useCallback((node) => {
    mapaRef.current = node;
  });

  const updateMarkerPos = useCallback(({ id, lng, lat }) => {
    markers.current[id].setLngLat([lng, lat]);
  }, []);

  const addMarker = useCallback((e, id) => {
    const { lng, lat } = e.lngLat || e;

    // create marker
    const marker = new mapboxgl.Marker();
    marker.id = id ?? v4();
    marker.setLngLat([lng, lat]).addTo(mapa.current).setDraggable(true);

    // add marker to object
    markers.current[marker.id] = marker;

    // add marker to observable
    if (!id) {
      newMarker.current.next({
        id: marker.id,
        lng,
        lat,
      });
    }

    // listen marker movements
    marker.on("drag", ({ target }) => {
      const { id } = target;
      const { lng, lat } = target.getLngLat();
      markerMovement.current.next({ id, lng, lat });
    });
  }, []);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapaRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [initialPos.lng, initialPos.lat],
      zoom: initialPos.zoom,
    });

    mapa.current = map;
  }, [initialPos]);

  useEffect(() => {
    mapa.current?.on("move", () => {
      const { lng, lat } = mapa.current?.getCenter();
      setCoords([lng, lat]);
    });
  }, []);

  // add markers on click
  useEffect(() => {
    mapa.current?.on("click", addMarker);
  }, [addMarker]);

  return {
    addMarker,
    updateMarkerPos,
    coords,
    mewMarker$: newMarker.current,
    markerMovement$: markerMovement.current,
    setRef,
  };
};
