export default async function handler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const q = url.searchParams.get("q") || "";
  const tt = url.searchParams.get("tt") || "";

  try {
    const response = await fetch(
      `https://imdb.iamidiotareyoutoo.com/search?q=${encodeURIComponent(q)}&tt=${encodeURIComponent(
        tt
      )}`
    );

    const data = await response.json();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
}
