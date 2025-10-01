export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message required" });

  const HF_TOKEN = process.env.HF_API_KEY;
  const MODEL = process.env.HF_MODEL || "sagorsarker/bangla-gpt2";

  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: message })
    });

    const data = await response.json();
    let reply = "No response";
    if (Array.isArray(data) && data[0]?.generated_text) reply = data[0].generated_text;
    else if (data.error) reply = data.error;

    res.status(200).json({ reply });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
