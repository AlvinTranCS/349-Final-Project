import { useRef, useEffect } from 'react';

export default function TypingTest({ text, input, onInput, onStart, isActive }) {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    if (!isActive && value.length === 1) {
      onStart();
    }
    if (value.length <= text.length) {
      onInput(value);
    }
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const renderText = () => {
    const chars = text.split('');
    return chars.map((char, index) => {
      let colorClass = 'text-untyped';
      if (index < input.length) {
        colorClass = input[index] === char ? 'text-correct' : 'text-error bg-error/20';
      }

      const isCursor = index === input.length;
      
      return (
        <span key={index} className={`relative ${colorClass}`}>
          {isCursor && (
            <span className="absolute left-0 top-[10%] w-[2px] h-[80%] bg-accent animate-pulse z-10"></span>
          )}
          {char}
        </span>
      );
    });
  };

  return (
    <div 
      className="relative text-2xl leading-relaxed cursor-text max-w-5xl mx-auto text-justify tracking-wide"
      onClick={handleContainerClick}
    >
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={handleChange}
        className="absolute opacity-0 w-0 h-0 -z-10"
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck="false"
        autoFocus
      />
      <div className="select-none font-mono">
        {renderText()}
        {input.length === text.length && (
          <span className="relative">
            <span className="absolute left-0 top-[10%] w-[2px] h-[80%] bg-accent animate-pulse z-10"></span>
          </span>
        )}
      </div>
    </div>
  );
}
