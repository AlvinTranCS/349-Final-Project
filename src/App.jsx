import { useState, useEffect } from 'react';
import { generateWords } from './utils/words';
import TypingTest from './components/TypingTest';
import Timer from './components/Timer';
import Dashboard from './components/Dashboard';

export default function App() {
  const [text, setText] = useState('');
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('idle'); // idle, running, finished
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [selectedTime, setSelectedTime] = useState(30);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    setText(generateWords(200));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger hotkeys if typing
      if (status === 'running' && e.key !== 'Escape' && e.key !== 'Tab') return;

      if (e.key === 'Tab') {
        e.preventDefault();
        handleRestart();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setStatus('idle');
        setText(generateWords(200));
        setInput('');
        setTimeRemaining(selectedTime);
        setShowHelp(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTime, status]);

  const handleStart = () => {
    setStatus('running');
  };

  const handleInput = (val) => {
    setInput(val);
  };

  const handleTimeUp = () => {
    setStatus('finished');
  };

  const handleRestart = () => {
    setText(generateWords(200));
    setInput('');
    setStatus('idle');
    setTimeRemaining(selectedTime);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setTimeRemaining(time);
    if (status !== 'idle') {
      handleRestart();
    }
  };

  let wpm = 0;
  let accuracy = 100;

  if (status === 'finished') {
    let correctChars = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] === text[i]) {
        correctChars++;
      }
    }
    const minutes = selectedTime / 60;
    wpm = (correctChars / 5) / minutes;
    accuracy = input.length > 0 ? (correctChars / input.length) * 100 : 0;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center pt-24 px-8 font-mono">
      <div className="w-full max-w-5xl mb-8 flex justify-between items-center text-untyped">
        <h1 className="text-3xl font-bold text-correct">typeflow</h1>
        {status !== 'finished' && (
          <div className="flex space-x-4">
            {[15, 30, 60].map((t) => (
              <button
                key={t}
                onClick={() => handleTimeSelect(t)}
                className={`hover:text-correct transition-colors ${selectedTime === t ? 'text-accent' : ''}`}
              >
                {t}s
              </button>
            ))}
            <button
              onClick={() => setShowHelp(true)}
              className="hover:text-correct transition-colors ml-4 focus:outline-none"
              title="Help & Hotkeys"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="w-full max-w-5xl">
        {status !== 'finished' && (
          <Timer
            isActive={status === 'running'}
            timeRemaining={timeRemaining}
            setTimeRemaining={setTimeRemaining}
            onTimeUp={handleTimeUp}
          />
        )}

        {status === 'finished' ? (
          <Dashboard wpm={wpm} accuracy={accuracy} onRestart={handleRestart} />
        ) : (
          <div className="mt-8 transition-opacity duration-300">
            <TypingTest
              text={text}
              input={input}
              onInput={handleInput}
              onStart={handleStart}
              isActive={status === 'running'}
            />
          </div>
        )}
      </div>
      
     {status !== 'finished' && (
         <div className="mt-16 text-untyped flex justify-center opacity-50 hover:opacity-100 transition-opacity">
           <button onClick={handleRestart} className="flex items-center space-x-2 p-2 hover:bg-untyped/10 rounded">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
             </svg>
             <span>Restart</span>
           </button>
         </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowHelp(false)}>
          <div className="bg-background border border-untyped/30 rounded-lg p-8 max-w-md w-full relative" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setShowHelp(false)}
              className="absolute top-4 right-4 text-untyped hover:text-error transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-correct mb-6">hotkeys</h2>
            <ul className="space-y-4 text-untyped">
              <li className="flex justify-between items-center">
                <span>restart test</span>
                <span className="bg-untyped/20 px-2 py-1 rounded text-correct font-bold text-sm">tab</span>
              </li>
              <li className="flex justify-between items-center">
                <span>reset / pause</span>
                <span className="bg-untyped/20 px-2 py-1 rounded text-correct font-bold text-sm">esc</span>
              </li>
            </ul>
            <p className="mt-8 text-sm opacity-70 text-center">
              just start typing to begin the test!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
