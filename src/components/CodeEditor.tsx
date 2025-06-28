
import { useState } from 'react';
import { Play, RefreshCw, CheckCircle, AlertCircle, Lightbulb, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CodeEditorProps {
  currentLesson: number;
}

const lessonContent = {
  0: {
    title: "Introduction to Variables",
    description: "Learn how to store and use data in variables",
    objective: "Create a variable called 'name' and assign it your name as a string.",
    starterCode: `// Create a variable called 'name' and assign it your name
// Example: let name = "Your Name Here";

`,
    solution: `let name = "Alice";
console.log("Hello, " + name + "!");`,
    hint: "Remember to use quotes around text values (strings) and don't forget the semicolon!"
  },
  1: {
    title: "Working with Strings",
    description: "Master string manipulation and concatenation",
    objective: "Create two variables for first and last name, then combine them.",
    starterCode: `// Create variables for firstName and lastName
// Then create a fullName variable that combines them

`,
    solution: `let firstName = "John";
let lastName = "Doe";
let fullName = firstName + " " + lastName;
console.log(fullName);`,
    hint: "Use the + operator to combine strings. Don't forget to add a space between names!"
  },
  2: {
    title: "Numbers and Math",
    description: "Perform calculations and work with numeric data",
    objective: "Calculate the area of a rectangle with width 5 and height 3.",
    starterCode: `// Calculate the area of a rectangle
// width = 5, height = 3
// Formula: area = width * height

`,
    solution: `let width = 5;
let height = 3;
let area = width * height;
console.log("The area is: " + area);`,
    hint: "Use the * operator for multiplication. Store the result in a variable called 'area'."
  }
};

export const CodeEditor = ({ currentLesson }: CodeEditorProps) => {
  const [code, setCode] = useState(lessonContent[currentLesson as keyof typeof lessonContent]?.starterCode || '');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const currentContent = lessonContent[currentLesson as keyof typeof lessonContent];

  const runCode = async () => {
    setIsRunning(true);
    
    // Simulate code execution
    setTimeout(() => {
      try {
        // Simple simulation - in a real app, you'd use a code execution service
        if (code.includes('console.log')) {
          setOutput('✅ Code executed successfully!\n\nGreat job! You\'ve completed this exercise.');
        } else {
          setOutput('ℹ️ Add a console.log() statement to see output.');
        }
      } catch (error) {
        setOutput('❌ Error: Please check your code and try again.');
      }
      setIsRunning(false);
    }, 1000);
  };

  const resetCode = () => {
    setCode(currentContent?.starterCode || '');
    setOutput('');
    setShowHint(false);
  };

  const showSolution = () => {
    setCode(currentContent?.solution || '');
    setShowHint(false);
  };

  if (!currentContent) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-slate-400">Select a lesson to start coding!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Lesson Header */}
      <div className="p-6 bg-slate-800 border-b border-slate-700">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-2">{currentContent.title}</h2>
            <p className="text-slate-300 mb-4">{currentContent.description}</p>
            
            <div className="flex items-center gap-2 p-3 bg-blue-900/30 border border-blue-700/50 rounded-lg">
              <Target className="text-blue-400 flex-shrink-0" size={16} />
              <span className="text-blue-100 text-sm font-medium">Objective:</span>
              <span className="text-blue-200 text-sm">{currentContent.objective}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Code Editor Area */}
      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col">
          <Tabs defaultValue="editor" className="flex-1 flex flex-col">
            <TabsList className="mx-6 mt-4 bg-slate-700 border-slate-600">
              <TabsTrigger value="editor" className="data-[state=active]:bg-slate-600">Code Editor</TabsTrigger>
              <TabsTrigger value="output" className="data-[state=active]:bg-slate-600">Output</TabsTrigger>
            </TabsList>
            
            <TabsContent value="editor" className="flex-1 m-0 p-6">
              <Card className="h-full bg-slate-900 border-slate-700">
                <div className="h-full p-4">
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-full bg-transparent text-green-400 font-mono text-sm resize-none outline-none leading-6"
                    placeholder="Write your code here..."
                    spellCheck={false}
                  />
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="output" className="flex-1 m-0 p-6">
              <Card className="h-full bg-slate-900 border-slate-700">
                <div className="h-full p-4">
                  <pre className="text-slate-300 font-mono text-sm whitespace-pre-wrap">
                    {output || 'Run your code to see the output here...'}
                  </pre>
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="p-6 bg-slate-800 border-t border-slate-700">
            <div className="flex items-center gap-3">
              <Button
                onClick={runCode}
                disabled={isRunning}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isRunning ? <RefreshCw className="animate-spin" size={16} /> : <Play size={16} />}
                {isRunning ? 'Running...' : 'Run Code'}
              </Button>
              
              <Button
                onClick={resetCode}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <RefreshCw size={16} />
                Reset
              </Button>
              
              <Button
                onClick={() => setShowHint(!showHint)}
                variant="outline"
                className="border-amber-600 text-amber-400 hover:bg-amber-900/20"
              >
                <Lightbulb size={16} />
                Hint
              </Button>
              
              <Button
                onClick={showSolution}
                variant="outline"
                className="border-purple-600 text-purple-400 hover:bg-purple-900/20 ml-auto"
              >
                <CheckCircle size={16} />
                Show Solution
              </Button>
            </div>

            {/* Hint Display */}
            {showHint && (
              <div className="mt-4 p-3 bg-amber-900/20 border border-amber-700/50 rounded-lg">
                <div className="flex items-start gap-2">
                  <Lightbulb className="text-amber-400 flex-shrink-0 mt-0.5" size={16} />
                  <div>
                    <h4 className="text-amber-400 font-medium text-sm mb-1">Hint:</h4>
                    <p className="text-amber-200 text-sm">{currentContent.hint}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
