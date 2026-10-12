import { useState, useEffect, useRef } from "react";
import api from "../../api";
import "./Chatbot.css";

const Chatbot = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleOpen = () => {
        setOpen(true);

        if (messages.length === 0) {
            setMessages([
                {
                    sender: "bot",
                    text: "👋 Hi! Welcome to SKCodingSchool!\n\nMain aapka AI assistant hoon.\nAap courses, fees ya enroll ke baare me pooch sakte hain."
                }
            ]);
        }
    };

    useEffect(() => {
        scrollToBottom();
        if (open) {
            inputRef.current?.focus();
        }
    }, [messages, open]);

    const sendMessage = async () => {
        const trimmedInput = input.trim();
        if (!trimmedInput || isSending) return;

        const userMsg = { sender: "user", text: trimmedInput };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsSending(true);

        const typingMsg = { sender: "bot", text: "Typing..." };
        setMessages((prev) => [...prev, typingMsg]);

        try {
            const res = await api.post("/api/chat", {
                message: userMsg.text,
            });

            setMessages((prev) => {
                const updated = [...prev];
                updated.pop();
                return [...updated, { sender: "bot", text: res.data.reply }];
            });
        } catch (error) {
            const errorMessage = error.response?.data?.error
                || (error.message?.startsWith("REACT_APP_API_URL")
                    ? error.message
                    : error.response
                    ? "The AI assistant is temporarily unavailable. Please try again later."
                    : "Could not reach the server. Check the backend deployment and REACT_APP_API_URL.");
            setMessages((prev) => {
                const updated = [...prev];
                updated.pop();
                return [...updated, { sender: "bot", text: `⚠ ${errorMessage}` }];
            });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <>
            {!open && (
                <button className="ai-icon" onClick={handleOpen} aria-label="Open AI assistant">
                    🤖
                </button>
            )}

            {open && (
                <div className="chat-modal">
                    <div className="chat-header">
                        <div className="chat-header-left">
                            <span className="chat-avatar">AI</span>
                            <div>
                                <div className="chat-title">SKCodingSchool AI</div>
                                <div className="chat-status">
                                    <span className="chat-status-dot" />
                                    Online
                                </div>
                            </div>
                        </div>
                        <button type="button" className="chat-close" onClick={() => setOpen(false)} aria-label="Close chat">
                            ✕
                        </button>
                    </div>

                    <div className="chat-body">
                        {messages.map((msg, i) => (
                            <div key={i} className={`msg ${msg.sender}`}>
                                {msg.text}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-input">
                        <input
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask something..."
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            disabled={isSending}
                        />
                        <button type="button" onClick={sendMessage} disabled={isSending} aria-label="Send message">
                            ➤
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;