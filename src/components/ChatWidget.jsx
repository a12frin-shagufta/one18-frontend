import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi 👋 I’m your bakery assistant. Ask me anything!" }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("https://api.frindev.in/api/chatbot", { message: input });
      setMessages(prev => [...prev, { role: "bot", text: res.data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "bot", text: "Assistant unavailable. Please contact bakery." }]);
    }
    setLoading(false);
  };
const renderMessageText = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  return text.split(urlRegex).map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-[#334b8f] break-all"
        >
          {part}
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end font-sans">
      
      {/* Chat Panel */}
      {open && (
        <div className="mb-4 w-[92vw] max-w-sm h-[70vh] max-h-[520px]
 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-5 duration-300">
          
          {/* Header: Gradient & 3D Depth */}
          <div className="bg-[#334b8f] p-4 text-white shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl shadow-inner">🍰</div>
              <div>
                <h3 className="font-bold text-sm">Bakery Assistant</h3>
                <p className="text-[10px] text-rose-100">Online | Ready to help</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="hover:bg-white/10 p-1 rounded">✕</button>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm shadow-sm transition-all
                  ${m.role === "user" 
                    ? "bg-[#334b8f] text-white rounded-tr-none" 
                    : "bg-white text-gray-700 border border-gray-100 rounded-tl-none"}`}>
                  {renderMessageText(m.text)}

                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100 animate-pulse">
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-xl focus-within:ring-2 focus-within:ring-[#334b8f] transition-all">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask about cakes..."
                className="bg-transparent border-none focus:ring-0 flex-1 text-base text-gray-700 outline-none px-2"
              />
              <button 
                onClick={sendMessage}
                className="bg-[#334b8f] text-white p-2 rounded-lg hover:bg-[#334b8f] active:scale-95 transition-all shadow-md"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating 3D Button */}
      <button
        onClick={() => setOpen(!open)}
        className="group relative flex items-center justify-center w-16 h-16 bg-[#334b8f] text-white rounded-full shadow-[0_10px_25px_rgba(225,29,72,0.4)] hover:shadow-[0_15px_30px_rgba(225,29,72,0.6)] hover:-translate-y-1 active:scale-90 transition-all duration-300 ring-4 ring-white"
      >
        <span className="text-3xl group-hover:rotate-12 transition-transform duration-300">
          {open ? "✕" : "💬"}
        </span>
        {/* Decorative Ring */}
        <span className="absolute inset-0 rounded-full animate-ping bg-[#334b8f] opacity-20 group-hover:hidden"></span>
      </button>

    </div>
  );
}