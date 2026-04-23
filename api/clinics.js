export default async function handler(req, res) {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: "lat and lng are required" });
  }

  const radius = 10000;
  const query = `[out:json][timeout:25];(node["amenity"~"^(hospital|clinic)$"](around:${radius},${lat},${lng});way["amenity"~"^(hospital|clinic)$"](around:${radius},${lat},${lng});node["healthcare"="hospital"](around:${radius},${lat},${lng});way["healthcare"="hospital"](around:${radius},${lat},${lng}););out center tags;`;

  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

  try {
    const overpassRes = await fetch(url);
    if (!overpassRes.ok) throw new Error(`Overpass ${overpassRes.status}`);
    const data = await overpassRes.json();

    // Cache results for 5 minutes at the edge
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
