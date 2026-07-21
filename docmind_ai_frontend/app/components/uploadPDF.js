"use client";

import { useRef, useState } from "react";
import axios from "axios";
import BASE_URL from "../config";
import ReactMarkdown from "react-markdown";

export default function UploadPdf() {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [askLoading, setAskLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [question, setQuestion] = useState("");
  const [documentId, setDocumentId] = useState(null);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Upload a PDF and then ask any question about it.",
    },
  ]);

  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setMessage("Please select a PDF file");
      return;
    }

    setFile(selectedFile);
    setMessage("");
  };

  const handleRemoveFile = () => {
    setFile(null);
    setMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    console.log("BASE_URL:", BASE_URL);
    if (!file) {
      setMessage("Please choose a PDF first");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setMessage("File size must not exceed 10 MB.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `${BASE_URL}/docMind/upload-pdf`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("PDF uploaded successfully");
      setDocumentId(response.data.document_id);
      console.log(response.data);
    } catch (error) {
      console.error(error);
      setMessage("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // const handleAsk = async () => {
  //   const trimmedQuestion = question.trim();

  //   if (!trimmedQuestion) {
  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         role: "assistant",
  //         content: "Please enter a question about your document.",
  //       },
  //     ]);
  //     return;
  //   }

  //   if (!documentId) {
  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         role: "assistant",
  //         content: "Please upload a PDF first so the chat has a document context.",
  //       },
  //     ]);
  //     return;
  //   }

  //   try {
  //     setAskLoading(true);
  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         role: "user",
  //         content: trimmedQuestion,
  //       },
  //     ]);
  //     setQuestion("");

  //     const response = await axios.get(`${BASE_URL}/get-Queryanswer`, {
  //       params: {
  //         query: trimmedQuestion,
  //         document_id: documentId,
  //       },
  //     });

  //     console.log("response", response.data);
  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         role: "assistant",
  //         content: response.data.answer || "I couldn't generate an answer for that question.",
  //       },
  //     ]);
  //   } catch (error) {
  //     console.error(error);
  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         role: "assistant",
  //         content: "Sorry, I couldn't get an answer right now.",
  //       },
  //     ]);
  //   } finally {
  //     setAskLoading(false);
  //   }
  // };

const handleAsk = async () => {
  const trimmedQuestion = question.trim();

  if (!trimmedQuestion) {
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "Please enter a question about your document.",
      },
    ]);
    return;
  }

  if (!documentId) {
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "Please upload a PDF first so the chat has a document context.",
      },
    ]);
    return;
  }

  try {
    setAskLoading(true);

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: trimmedQuestion,
      },
      {
        role: "assistant",
        content: "",
      },
    ]);

    setQuestion("");

    const response = await fetch(
      `${BASE_URL}/get-Queryanswer?query=${encodeURIComponent(
        trimmedQuestion
      )}&document_id=${documentId}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch response");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let fullAnswer = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      const chunk = decoder.decode(value, { stream: true });

      fullAnswer += chunk;

      setMessages((prev) => {
        const updated = [...prev];

        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          content: fullAnswer,
        };

        return updated;
      });
    }
  } catch (error) {
    console.error(error);

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "Sorry, I couldn't get an answer right now.",
      },
    ]);
  } finally {
    setAskLoading(false);
  }
};

  return (
    <div className="mx-auto grid h-full max-w-6xl gap-6 lg:grid-cols-2 lg:items-stretch">
      <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-100 lg:h-full lg:min-h-0 lg:overflow-hidden">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800">Upload PDF</h2>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            Step 1
          </span>
        </div>

        <div className="rounded-2xl border-2 border-dashed border-slate-300 p-6 text-center transition hover:border-blue-500">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-medium file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {file && (
          <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
            <p className="truncate">📄 {file.name}</p>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="ml-3 rounded-full bg-slate-200 p-1 text-slate-700 transition hover:bg-slate-300"
              aria-label="Remove selected PDF"
            >
              ✕
            </button>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:bg-slate-400"
        >
          {loading ? "Uploading..." : "Upload PDF"}
        </button>

        {message && (
          <div className="mt-4 text-center">
            <p className="font-medium text-green-600">{message}</p>
          </div>
        )}
      </div>

      <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-100 lg:h-full lg:min-h-0 lg:overflow-hidden">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800">Ask anything about your document</h2>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            Step 2
          </span>
        </div>

        <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((msg, index) => (
              <div
                key={`${msg.role}-${index}`}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                    msg.role === "user"
                      ? "bg-slate-900 text-white"
                      : "bg-white text-slate-700 ring-1 ring-slate-200"
                  }`}
                >
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            ))}

            {askLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm text-slate-500 ring-1 ring-slate-200">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600"></span>
                  <span>Generating answer...</span>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 bg-white p-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <textarea
                rows="3"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="🔍 Ask a question about this PDF..."
                className="min-h-[84px] flex-1 resize-none border-0 bg-transparent text-slate-700 outline-none placeholder:text-slate-400"
              />

              <div className="mb-1 flex justify-start sm:justify-start">
                <button
                  onClick={handleAsk}
                  disabled={askLoading}
                  className="mt-1 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-500"
                >
                  {askLoading ? "Getting answer..." : "Ask"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}