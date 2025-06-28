"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function CodeAnalyzer() {
  const [code, setCode] = useState("");
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setError("Please enter some code to analyze.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze code");
      }

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mt-10 p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-4">Code Analysis</h2>
      <p className="text-gray-400 mb-6">
        Enter your code below and get an analysis from our AI.
      </p>
      <textarea
        className="w-full h-64 p-4 bg-gray-900 text-white rounded-md font-mono text-sm border border-gray-700 focus:ring-2 focus:ring-indigo-500"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter your code here..."
      />
      <button
        onClick={handleAnalyze}
        disabled={isLoading}
        className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-medium disabled:bg-gray-500 disabled:cursor-not-allowed"
      >
        {isLoading ? "Analyzing..." : "Analyze Code"}
      </button>

      {error && <p className="mt-4 text-red-500">{error}</p>}

      {analysis && (
        <div className="mt-6">
          <h3 className="text-2xl font-bold mb-2">Analysis Result</h3>
          <div className="prose prose-invert max-w-none p-4 bg-gray-900 rounded-md">
            <ReactMarkdown>{analysis}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
