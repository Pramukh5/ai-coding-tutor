'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { debounce } from '@/lib/utils';

interface EditorClientProps {
  lesson: {
    id: string;
    title: string;
    initial_code: string | null;
  };
  userProgress: {
    code: string | null;
  } | null;
}

export default function EditorClient({ lesson, userProgress }: EditorClientProps) {
  const [code, setCode] = useState(userProgress?.code || lesson.initial_code || '');
  const [hint, setHint] = useState('Your hints will appear here.');
    const [isLoading, setIsLoading] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [isAsking, setIsAsking] = useState(false);


  const fetchHint = useCallback(async (currentCode: string) => {
    if (!currentCode.trim()) {
      setHint('Your hints will appear here.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('/api/get-hint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: currentCode }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch hint');
      }
      const data = await response.json();
      setHint(data.hint);
    } catch (error) {
      console.error(error);
      setHint('Could not fetch a hint. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedFetchHint = useMemo(() => {
    return debounce(fetchHint, 750);
  }, [fetchHint]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    debouncedFetchHint(newCode);
  };

  const handleSaveProgress = async () => {
    try {
      const response = await fetch('/api/save-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lessonId: lesson.id, code }),
      });

      if (!response.ok) {
        throw new Error('Failed to save progress');
      }

    } catch (error) {
      console.error(error);
      alert('Could not save your progress. Please try again later.');
    }
  };

  const handleAskAI = async () => {
    if (!aiQuestion.trim()) return;
    setIsAsking(true);
    setAiAnswer('');
    try {
      const response = await fetch('/api/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: aiQuestion, editorContent: code }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get answer from AI');
      }

      const data = await response.json();
      setAiAnswer(data.answer);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setAiAnswer(`Error: ${errorMessage}`);
    } finally {
      setIsAsking(false);
    }
  };



  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white p-4 font-sans">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{lesson.title}</h1>
        <div>
          <Button onClick={handleSaveProgress} className="mr-4 bg-blue-600 hover:bg-blue-700">
            Save Progress
          </Button>
          <Link href="/" passHref>
            <Button variant="outline" className="bg-slate-700 hover:bg-slate-600 text-white">
              Home
            </Button>
          </Link>
        </div>
      </header>
      <main className="flex flex-grow gap-4 overflow-hidden">
        <div className="flex flex-col w-2/3">
          <h2 className="text-lg mb-2 font-semibold">Code Editor</h2>
          <div className="flex-grow bg-gray-800 rounded-md overflow-hidden">
            <textarea
              value={code}
              onChange={handleCodeChange}
              className="w-full h-full bg-gray-800 text-white p-4 focus:outline-none resize-none font-mono text-sm"
              placeholder="Write your code here..."
            />
          </div>
        </div>
        <div className="flex flex-col w-1/3 space-y-4">
          <div>
            <h2 className="text-lg mb-2 font-semibold">Hints & Suggestions</h2>
            <div className="bg-gray-800 p-4 rounded-md min-h-[150px]">
              {isLoading ? (
                <p className="text-gray-400">Getting hint...</p>
              ) : (
                <p className="text-gray-400 whitespace-pre-wrap">{hint}</p>
              )}
            </div>
          </div>
          <div>
            <h2 className="text-lg mb-2 font-semibold">AI Assistant</h2>
            <div className="bg-gray-800 p-4 rounded-md flex flex-col gap-4">
              <textarea
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                className="w-full bg-gray-700 text-white p-2 rounded-md focus:outline-none resize-none text-sm"
                placeholder="Ask a question about your code or the lesson..."
                rows={3}
              />
              <Button onClick={handleAskAI} disabled={isAsking} className="bg-purple-600 hover:bg-purple-700">
                {isAsking ? 'Thinking...' : 'Ask AI'}
              </Button>
              <div className="min-h-[100px] text-gray-400 whitespace-pre-wrap">
                {aiAnswer}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
