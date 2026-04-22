import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import ollama from "ollama";

export function ChatPage() {
  const [isLogged, setIsLogged] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Bonjour 👋 Je suis ton assistant juridique." }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");

  const inputRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogged(!!token);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLogged(false);
    navigate("/");
  };

  const sendMessage = async () => {
    if (!inputRef.current)
      return ;
    const text = inputRef.current?.innerText?.trim();
    if (!text || isLoading) return;

    inputRef.current.innerText = "";

    const userMessage = { role: "user", content: text };

    const newMessages = [
      ...messages,
      userMessage,
      { role: "assistant", content: "" }
    ];

    setMessages(newMessages);

    setIsLoading(true);
    setStatus("Analyse juridique...");

    let thinkingBuffer = "";
    let answerBuffer = "";
    let inThinking = false;

    try {
      const stream = await ollama.chat({
        model: "qwen3.6",
        messages: [...messages, userMessage],
        think: true,
        stream: true,
      });

      for await (const chunk of stream) {
        const t = chunk.message.thinking;
        const c = chunk.message.content;
      
        if (t) {
          if (!inThinking) {
            inThinking = true;
            setStatus("Réflexion du modèle...");
          }

          thinkingBuffer += t;

          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: "assistant",
              content: `🧠 ${thinkingBuffer}`,
            };
            return updated;
          });
        }

        if (c) {
          if (inThinking) {
            inThinking = false;
            setStatus("Rédaction de la réponse...");
          }

          answerBuffer += c;

          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: "assistant",
              content: answerBuffer,
            };
            return updated;
          });
        }
      }

      setStatus("Terminé");

    } catch (err) {
      console.error(err);
      setStatus("Erreur génération");
    } finally {
      setIsLoading(false);
      setTimeout(() => setStatus(""), 1000);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#0f172a] text-white">

      {/* NAV */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10 backdrop-blur bg-white/5">
        <h1 className="text-lg font-semibold">
          ⚖️ Assistant Juridique
        </h1>

        <div className="flex items-center gap-4">
          {isLogged ? (
            <>
              <span className="text-sm text-white/60">Connecté</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600"
            >
              🔐 Login
            </Link>
          )}
        </div>
      </nav>

      {/* CHAT */}
      <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto h-80">

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-md ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white/10 border border-white/10 text-white"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        {/* STATUS */}
        {status && (
          <div className="px-4 pb-2 text-xs text-white/50 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            {status}
          </div>
        )}

        {/* INPUT */}
        <div className="p-4 border-t border-white/10 bg-[#020617]">
          <div className="flex items-center gap-3 bg-[#1e293b] border border-white/10 rounded-2xl px-4 py-3 focus-within:border-blue-500">

            <div
              ref={inputRef}
              contentEditable
              className="flex-1 outline-none text-sm text-white min-h-[24px] max-h-40 overflow-y-auto"
              data-placeholder="Écris ton message..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />

            <button
              onClick={sendMessage}
              disabled={isLoading}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "➤"
              )}
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}