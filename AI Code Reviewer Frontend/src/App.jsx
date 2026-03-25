import { useState, useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios'
import './App.css'

function App() {
  const [messages, setMessages] = useState([]);
  const [code, setCode] = useState(` function sum() {
  return 1 + 1
    }`)

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    prism.highlightAll()
  }, [])

  function typeEffect(text) {
    let i = 0;
    let temp = "";

    const interval = setInterval(() => {
      temp += text[i];
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1].content = temp;
        return updated;
      });
      i++;

      if (i >= text.length) clearInterval(interval);
    }, 10);
  }

  async function reviewCode() {
    const userMessage = { role: "user", content: code };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await axios.post("https://ai-code-reviewer-1-xq6n.onrender.com/api/review", {
        code
      });

      const aiMessage = { role: "ai", content: "" };
      setMessages(prev => [...prev, aiMessage]);

      typeEffect(response.data.review);
      console.log(response.data.review);

    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <main>
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                border: "1px solid #ddd",
                borderRadius: "5px",
                height: "100%",
                width: "100%"
              }}
            />
          </div>
          <div
            onClick={reviewCode}
            className="review">Review</div>
        </div>
        <div className="right">
          <div className="chat">
            {messages.map((msg, index) => (
              <div key={index} className={msg.role === "user" ? "user" : "ai"}>
                <Markdown
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const codeText = String(children).replace(/\n$/, "");

                      if (inline) {
                        return <code className={className} {...props}>{children}</code>;
                      }

                      return (
                        <div className="code-block">
                          <button
                            className="copy-btn"
                            onClick={() => navigator.clipboard.writeText(codeText)}
                          >
                            Copy
                          </button>
                          <pre className={className}>
                            <code {...props}>{children}</code>
                          </pre>
                        </div>
                      );
                    }
                  }}
                >
                  {msg.content}
                </Markdown>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}



export default App
