import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input) return;
    setMessages([...messages, { role: "You", text: input }]);
    setInput("");
    setMessages(prev => [...prev, { role: "Bot", text: "⏳ Thinking..." }]);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input })
    });

    const data = await res.json();
    setMessages(prev => {
      prev.pop(); 
      return [...prev, { role: "Bot", text: data.reply || "No response" }];
    });
  };

  return (
    <div style={{ maxWidth: 700, margin: "30px auto", fontFamily: "Arial" }}>
      <h1>🤖 My Chatbot</h1>
      <div style={{ border: "1px solid #ddd", padding: 10, height: 400, overflowY: "auto", background: "#fafafa" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.role === "You" ? "right" : "left", color: m.role === "You" ? "blue" : "black", margin: "8px 0" }}>
            <b>{m.role}:</b> {m.text}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} style={{ display: "flex", marginTop: 10 }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{ flex: 1, padding: 10 }}
        />
        <button type="submit" style={{ padding: 10 }}>Send</button>
      </form>
    </div>
  );
}
