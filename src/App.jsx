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
  const [mode, setMode] = useState('words');
  const [showHelp, setShowHelp] = useState(false);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    setText(generateWords(200, mode));
  }, [mode]);

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
        if (status === 'running') {
          setStatus('paused');
        } else if (status === 'paused') {
          setStatus('running');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTime, status, mode]);

  const handleStart = () => {
    setStatus('running');
    setStartTime(Date.now());
  };

  const handleInput = (val) => {
    setInput(val);
    if (val.length === text.length) {
      handleTimeUp();
    }
  };

  const handleKeystroke = ({ isCorrect }) => {
    setTotalKeystrokes((prev) => prev + 1);
    if (isCorrect) {
      setCorrectKeystrokes((prev) => prev + 1);
    }
  };

  const handleTimeUp = () => {
    setStatus('finished');
    setEndTime(Date.now());
  };

  const handleRestart = () => {
    setText(generateWords(200, mode));
    setInput('');
    setStatus('idle');
    setTimeRemaining(selectedTime);
    setTotalKeystrokes(0);
    setCorrectKeystrokes(0);
    setStartTime(null);
    setEndTime(null);
  };

  const handleModeSelect = (newMode) => {
    setMode(newMode);
    setStatus('idle');
    setInput('');
    setTimeRemaining(selectedTime);
    setTotalKeystrokes(0);
    setCorrectKeystrokes(0);
    setStartTime(null);
    setEndTime(null);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setTimeRemaining(time);
    if (status !== 'idle') {
      setStatus('idle');
      setInput('');
      setTotalKeystrokes(0);
      setCorrectKeystrokes(0);
      setStartTime(null);
      setEndTime(null);
    }
  };

  const toggleTheme = () => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  };

  let wpm = 0;
  let accuracy = 100;

  if (status === 'finished') {
    const timeElapsedSecs = endTime && startTime ? (endTime - startTime) / 1000 : selectedTime;
    const minutes = Math.max(timeElapsedSecs / 60, 0.01); // Prevent division by zero
    wpm = (totalKeystrokes / 5) / minutes;
    accuracy = totalKeystrokes > 0 ? (correctKeystrokes / totalKeystrokes) * 100 : 0;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center pt-24 px-8 font-mono">
      <div className="w-full max-w-5xl mb-8 flex justify-between items-center text-untyped">
        <h1 className="text-3xl font-bold text-correct">typeflow</h1>
        {status !== 'finished' && (
          <div className="flex items-center">
            <div className="flex space-x-4 border-r border-untyped/30 pr-4 mr-4">
              {['words', 'random'].map((m) => (
                <button
                  key={m}
                  onClick={() => handleModeSelect(m)}
                  onMouseDown={(e) => e.preventDefault()}
                  className={`hover:text-correct transition-colors ${mode === m ? 'text-accent' : ''}`}
                >
                  {m}
                </button>
              ))}
            </div>
            <div className="flex space-x-4">
              {[15, 30, 60].map((t) => (
                <button
                  key={t}
                  onClick={() => handleTimeSelect(t)}
                  onMouseDown={(e) => e.preventDefault()}
                  className={`hover:text-correct transition-colors ${selectedTime === t ? 'text-accent' : ''}`}
                >
                  {t}s
                </button>
              ))}
            </div>
            <button
              onClick={toggleTheme}
              onMouseDown={(e) => e.preventDefault()}
              className="hover:text-correct transition-colors ml-4 focus:outline-none"
              title="Toggle Theme"
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
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
          <div className="mt-8 transition-opacity duration-300 relative">
            {status === 'paused' && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-20 backdrop-blur-sm rounded">
                <span className="text-3xl font-bold text-accent animate-pulse">paused</span>
              </div>
            )}
            <TypingTest
              text={text}
              input={input}
              onInput={handleInput}
              onStart={handleStart}
              isActive={status === 'running'}
              isPaused={status === 'paused'}
              onKeystroke={handleKeystroke}
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
                <span>pause / resume</span>
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
