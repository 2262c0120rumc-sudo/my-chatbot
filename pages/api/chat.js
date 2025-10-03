// pages/api/chat.js
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message required" });

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/microsoft/DialoGPT-small",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: message }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: result.error || "HF error" });
    }

    const reply =
      result[0]?.generated_text ||
      result.generated_text ||
      "Sorry, I didn’t get that.";

    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


    res.status(200).json({ reply });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
