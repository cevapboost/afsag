export default function handler(req, res) {
  res.status(200).json([
    { id: 1, name: "Parkhaus Urania", lat: 47.3753, lng: 8.5391, freeSpots: 12 },
    { id: 2, name: "Parkhaus Hauptbahnhof", lat: 47.3782, lng: 8.5402, freeSpots: 5 },
    { id: 3, name: "Parkhaus Sihlquai", lat: 47.3800, lng: 8.5355, freeSpots: 8 }
  ]);
}
