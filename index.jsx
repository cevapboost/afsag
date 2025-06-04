import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function ZurichParkingApp() {
  const [parkingSpots, setParkingSpots] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [parkingPoints, setParkingPoints] = useState(0);

  useEffect(() => {
    const storedPoints = parseInt(localStorage.getItem("parkingPoints") || "0");
    setParkingPoints(storedPoints);
  }, []);

  useEffect(() => {
    localStorage.setItem("parkingPoints", parkingPoints);
  }, [parkingPoints]);

  useEffect(() => {
    fetch("/api/parking-zurich")
      .then((res) => res.json())
      .then((data) => setParkingSpots(data))
      .catch(() => {
        setParkingSpots([
          { id: 1, name: "Parkhaus Urania", lat: 47.3753, lng: 8.5391, freeSpots: 12 },
          { id: 2, name: "Parkhaus Hauptbahnhof", lat: 47.3782, lng: 8.5402, freeSpots: 5 },
          { id: 3, name: "Parkhaus Sihlquai", lat: 47.38, lng: 8.5355, freeSpots: 8 }
        ]);
      });
  }, []);

  const filteredSpots = parkingSpots.filter((spot) =>
    spot.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getGoogleMapsLink = (lat, lng) => `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  const handleReport = (id) => {
    const free = parseInt(prompt("Anzahl freie Plätze?"));
    if (!isNaN(free)) {
      setParkingSpots((spots) =>
        spots.map((spot) =>
          spot.id === id ? { ...spot, freeSpots: free } : spot
        )
      );
      setParkingPoints((points) => points + 1);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Zürich Parkplatz-App</h1>
      <input
        type="text"
        placeholder="Parkplatz suchen..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "1rem", padding: "0.5rem", width: "100%" }}
      />
      <div style={{ marginBottom: "0.5rem" }}>Ihre Punkte: {parkingPoints}</div>
      <MapContainer center={[47.3769, 8.5417]} zoom={14} scrollWheelZoom={false} style={{ height: "400px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
        {filteredSpots.map((spot) => (
          <Marker key={spot.id} position={[spot.lat, spot.lng]}>
            <Popup>
              <strong>{spot.name}</strong>
              <br />
              Freie Plätze: {spot.freeSpots}
              <br />
              <a href={getGoogleMapsLink(spot.lat, spot.lng)} target="_blank" rel="noopener noreferrer">Navigation</a>
              <br />
              <button onClick={() => handleReport(spot.id)}>Plätze melden</button>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
