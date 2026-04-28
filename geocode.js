const coords = [
  {id:"v1 (D2)", lat:30.7698, lng:76.5774},
  {id:"v2 (NC-1)", lat:30.7658, lng:76.5764},
  {id:"v3 (SC)", lat:30.7708, lng:76.5714},
  {id:"v4 (Block A)", lat:30.7668, lng:76.5734},
  {id:"v5 (Gate 1)", lat:30.7728, lng:76.5784}
];

async function geocode() {
  for (let c of coords) {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${c.lat}&lon=${c.lng}&format=json`);
    const data = await res.json();
    console.log(c.id, data.display_name);
  }
}
geocode();
