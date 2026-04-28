async function getBuildings() {
  const query = `
    [out:json];
    (
      way["building"](30.76, 76.57, 30.78, 76.58);
      node["name"](30.76, 76.57, 30.78, 76.58);
    );
    out center;
  `;
  const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);
  
  const res = await fetch(url);
  const data = await res.json();
  
  for (const element of data.elements) {
    if (element.tags && element.tags.name) {
      console.log(`Lat: ${element.center ? element.center.lat : element.lat}, Lng: ${element.center ? element.center.lon : element.lon} - Name: ${element.tags.name}`);
    } else if (element.tags && element.tags.ref) {
      console.log(`Lat: ${element.center ? element.center.lat : element.lat}, Lng: ${element.center ? element.center.lon : element.lon} - Ref: ${element.tags.ref}`);
    }
  }
}
getBuildings();
