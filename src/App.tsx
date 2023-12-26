import React, { useRef, useState } from 'react';
import Markdown from "react-markdown";

type Message = {
    content: string
    type: 'question' | 'response'
}

function App() {
    const [text, setText] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isSubmitting, setSubmitting] = useState<boolean>(false);
    const feedRef = useRef<HTMLDivElement>(null);

    const getResponse = async () => {
        const question: Message = {
            content: text,
            type: 'question'
        };
        setText('');
        setSubmitting(true);
        setMessages([...messages, question]);

        if (feedRef.current) {
            // feedRef.current.scrollTop = feedRef.current.scrollHeight;
            feedRef.current.scrollIntoView(false)
        }
        let answer: Message;

        try {
            const response = await fetch(`http://localhost:8080/prompt/${text}`);
            const data = await response.json();
            answer = {
                content: `${data.candidates[0].content}`,
                type: 'response'
            };
        } catch (e) {
            answer = {
                content: `Sorry! I don't understand`,
                type: 'response'
            };
        }

        setSubmitting(false);
        setMessages([...messages, question, answer]);
    }

    return (
        <div className="chat-bot">
            <div className="chatbot-header">
                <div className="info-container">
                    <h3>Chat with</h3>
                    <h2>Pard</h2>
                </div>
            </div>
            <div className="feed" ref={feedRef}>
                {messages?.map((message, _index) =>
                    <div key={_index}>
                        <div className={`message-container ${message.type}-container`}>
                            <div className={`${message.type} bubble`}>
                                <Markdown>
                                    {message.content}
                                </Markdown>
                            </div>
                        </div>
                    </div>
                )}
                {
                    isSubmitting ?
                        <p className="submitting">Pard is answering...</p> : null
                }
            </div>
            <div className="input-container">
                <input placeholder="Ask me anything..." defaultValue="" value={text}
                       onChange={e => setText(e.target.value)}/>
                <button onClick={getResponse}>Send</button>
            </div>
        </div>
    );
}

export default App;
