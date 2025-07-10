import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import { Send, SquarePen, Trash } from "lucide-react";
import axios from "axios";
import { use } from "react";
export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isGroqAI, setIsGroqAI] = useState(false);
  const [isMistralAI, setIsMistralAI] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}api/mistral/prompt`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setHistory(res.data);
    } catch (err) {
      console.error("Error to display a data", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPrompt("");

    try {
      const aiType = isMistralAI ? "mistral" : "groqai";
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}api/${aiType}/prompt`,
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newEntry = {
        id: res.data.id,
        prompt: res.data.prompt,
        response: res.data.response,
      };
      setHistory([...history, newEntry]);
    } catch (err) {
      console.error("Error to send a prompt", err);
    } finally {
      setLoading(false);
    }
  };

  function DisplayAndEditPrompt(id, onDelete, onUpdate) {
    const [editPrompt, setEditPrompt] = useState(id.id.prompt);
    const [isEditing, setIsEditing] = useState(false);

    return (
      <div>
        <div className="flex justify-end">
          <div className="">
            {isEditing ? (
              <textarea
                className="textarea textarea-primary mb-5 textarea-xl"
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
              />
            ) : (
              <div> {id.id.prompt}</div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          {isEditing ? (
            <div>
              <button
                className="btn btn-primary mr-2"
                onClick={() => {
                  onUpdate(id.id, editPrompt);
                  setIsEditing(false);
                }}
              >
                Send
              </button>
              <button
                className="btn btn-neutral"
                onClick={() => {
                  setIsEditing(false);
                }}
              >
                Close
              </button>
            </div>
          ) : (
            <div className="flex">
              <SquarePen onClick={() => setIsEditing(true)} />
              <Trash onClick={() => onDelete(id.id)} />
            </div>
          )}
        </div>
        <div className="mb-4 flex justify-start">
          <div className="max-w-xl text-start">
            <p className="text-gray-700 whitespace-pre-line">
              {id.id.response}
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div>
      <Navbar />
      <div className="w-full min-h-screen flex flex-col items-center p-6">
        {isMistralAI ? (
          <h2 className="font-bold text-2xl">You are using Mistral AI now</h2>
        ) : (
          <h2 className="font-bold text-2xl">You are using Groq AI now</h2>
        )}

        <div className="w-full max-w-2xl space-y-4">
          {history.map((item) => (
            <DisplayAndEditPrompt key={item.id} id={item} />
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="relative w-full">
            <textarea
              rows={4}
              cols={60}
              placeholder="Enter your prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full resize-none textarea textarea-xl textarea-neutral border border-neutral-950 mt-20"
              name=""
              id=""
            />
            <div className="flex items-center justify-center gap-2">
              <button
                type="submit"
                disabled={!prompt.trim()}
                className={`absolute bottom-2 right-2 ml-2 p-1 rounded-full transition ${
                  prompt.trim()
                    ? "text-cyan-600 hover:bg-cyan-100"
                    : "text-gray-400 cursor-not-allowed"
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsGroqAI(false);
                  setIsMistralAI(true);
                }}
                className="absolute bottom-2 right-2 mr-10 p-1 btn btn-active btn-secondary"
              >
                Mistral AI
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsGroqAI(true);
                  setIsMistralAI(false);
                }}
                className="absolute bottom-2 right-2 mr-30 p-1 btn btn-active btn-primary"
              >
                GroqAI
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
