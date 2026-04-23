export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: "lat and lng are required" });
  }

  const radius = 10000;
  const query = `[out:json][timeout:25];(node["amenity"~"^(hospital|clinic)$"](around:${radius},${lat},${lng});way["amenity"~"^(hospital|clinic)$"](around:${radius},${lat},${lng});node["healthcare"="hospital"](around:${radius},${lat},${lng});way["healthcare"="hospital"](around:${radius},${lat},${lng}););out center tags;`;

  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

  try {
    const overpassRes = await fetch(url);
    if (!overpassRes.ok) {
      return res.status(502).json({ error: `Overpass returned ${overpassRes.status}` });
    }
    const data = await overpassRes.json();
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}
