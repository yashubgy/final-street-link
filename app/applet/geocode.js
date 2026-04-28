const coords = [
  {id:"v1", lat:30.7688 + 0.001, lng:76.5754 + 0.002, notes: "Current D2"},
  {id:"v2", lat:30.7688 - 0.003, lng:76.5754 + 0.001, notes: "Current NC-1"},
  {id:"v3", lat:30.7688 + 0.002, lng:76.5754 - 0.004, notes: "Current SC"},
  {id:"v4", lat:30.7688 - 0.002, lng:76.5754 - 0.002, notes: "Current Block A"},
  {id:"v5", lat:30.7688 + 0.004, lng:76.5754 + 0.003, notes: "Current Gate 1"}
];

async function geocode() {
  for (let c of coords) {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${c.lat}&lon=${c.lng}&format=json`, {
      headers: { "User-Agent": "AI_Studio_App_Agent/1.0 (yashusangwan6@gmail.com)" }
    });
    const data = await res.json();
    console.log(c.id, c.notes, "-", data.display_name);
  }
}
geocode();
