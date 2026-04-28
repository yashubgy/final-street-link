async function search() {
  const blocks = ["Block A", "Block B", "Block C", "Block D2", "Gate 1", "NC-1", "SC"];
  for (let b of blocks) {
    const res = await fetch("https://nominatim.openstreetmap.org/search?q=Chandigarh+University+" + encodeURIComponent(b) + "&format=json", {headers: {"User-Agent": "AI"}});
    const data = await res.json();
    if (data.length > 0) {
      console.log(b + " -> lat: " + data[0].lat + ", lng: " + data[0].lon);
    }
  }
}
search();
