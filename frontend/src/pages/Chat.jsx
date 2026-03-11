import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FaRobot, FaUser, FaPaperPlane } from "react-icons/fa";

export default function Chat() {
    const [messages, setMessages] = useState([
        {
            role: "bot",
            text: "Hi! I'm your AI Mentor. Ask me anything about programming, tech concepts, or career advice. Try asking:\n- \"Explain React hooks\"\n- \"How do I learn recursion?\"\n- \"What's the best way to prepare for interviews?\""
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef(null);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        if (e) e.preventDefault();
        if (!input.trim()) return;

        const userText = input.trim();
        setMessages((prev) => [...prev, { role: "user", text: userText }]);
        setInput("");
        setIsLoading(true);

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                "http://localhost:5000/api/chat",
                { message: userText },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessages((prev) => [
                ...prev,
                { role: "bot", text: response.data.reply }
            ]);
        } catch (error) {
            console.error(error);
            setMessages((prev) => [
                ...prev,
                { role: "bot", text: "Oops! My wires are crossed. Please try again! ⚙️" }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-180px)] bg-zinc-950 rounded-3xl border border-white/5 overflow-hidden shadow-2xl relative">
            {/* Background Orbs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="px-8 py-6 border-b border-white/[0.08] bg-zinc-900/50 backdrop-blur-md z-10 flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <FaRobot className="text-2xl text-white" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white tracking-wide">AI Mentor</h2>
                    <p className="text-zinc-400 text-sm">Powered by Gemini AI</p>
                </div>
            </div>

            {/* Chat Area */}
            <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 z-10 custom-scrollbar"
            >
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-start gap-4 max-w-5xl mx-auto`}>
                        {/* Bot Avatar */}
                        {msg.role === "bot" && (
                            <div className="w-10 h-10 rounded-xl bg-indigo-900/40 border border-indigo-500/20 flex items-center justify-center shrink-0 mt-1 shadow-inner">
                                <FaRobot className="text-indigo-400" size={18} />
                            </div>
                        )}

                        {/* Message Bubble */}
                        <div
                            className={`p-5 rounded-2xl text-[15px] leading-relaxed whitespace-pre-wrap font-medium ${msg.role === "user"
                                ? "bg-indigo-600 text-white rounded-tr-sm shadow-[0_0_20px_rgba(79,70,229,0.2)]"
                                : "bg-zinc-900/80 border border-white/[0.05] text-zinc-300 rounded-tl-sm shadow-md"
                                }`}
                        >
                            {msg.text}
                        </div>

                        {/* User Avatar */}
                        {msg.role === "user" && (
                            <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 mt-1">
                                <FaUser className="text-zinc-400" size={16} />
                            </div>
                        )}
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start items-start gap-4 max-w-5xl mx-auto">
                        <div className="w-10 h-10 rounded-xl bg-indigo-900/40 border border-indigo-500/20 flex items-center justify-center shrink-0 mt-1 shadow-inner">
                            <FaRobot className="text-indigo-400" size={18} />
                        </div>
                        <div className="p-5 rounded-2xl rounded-tl-sm bg-zinc-900/80 border border-white/[0.05] flex items-center gap-2 h-[60px] shadow-md">
                            <span className="w-2.5 h-2.5 bg-zinc-500 rounded-full animate-bounce"></span>
                            <span className="w-2.5 h-2.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                            <span className="w-2.5 h-2.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 md:p-6 border-t border-white/[0.08] bg-zinc-900/80 backdrop-blur-md z-10">
                <form onSubmit={handleSend} className="max-w-5xl mx-auto relative group flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask me anything about programming, tech concepts, or career advice..."
                        className="flex-1 bg-zinc-950 border border-zinc-800 rounded-2xl pl-6 pr-6 py-4 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-inner placeholder-zinc-500/70"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="w-14 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-2xl flex items-center justify-center transition-all shadow-lg hover:shadow-indigo-500/25 shrink-0"
                    >
                        <FaPaperPlane size={18} />
                    </button>
                </form>
                <p className="text-center text-xs text-zinc-500 mt-4">
                    AI Mentor can make mistakes. Consider verifying important information.
                </p>
            </div>
        </div>
    );
}
