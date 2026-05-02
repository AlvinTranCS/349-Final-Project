import { useRef, useEffect, useState } from 'react';

export default function TypingTest({ text, input, onInput, onStart, isActive, onKeystroke }) {
  const inputRef = useRef(null);
  const textContainerRef = useRef(null);
  const [cursorPos, setCursorPos] = useState({ left: 0, top: 0, height: 0 });

  useEffect(() => {
    inputRef.current?.focus();
  }, [text]);

  useEffect(() => {
    const updateCursor = () => {
      if (!textContainerRef.current) return;
      const spans = textContainerRef.current.children;
      
      if (input.length < spans.length) {
        const activeSpan = spans[input.length];
        if (activeSpan) {
          setCursorPos({
            left: activeSpan.offsetLeft,
            top: activeSpan.offsetTop,
            height: activeSpan.offsetHeight
          });
        }
      } else if (input.length === text.length && spans.length > 0) {
        const lastSpan = spans[spans.length - 1];
        if (lastSpan) {
          setCursorPos({
            left: lastSpan.offsetLeft + lastSpan.offsetWidth,
            top: lastSpan.offsetTop,
            height: lastSpan.offsetHeight
          });
        }
      }
    };

    updateCursor();
    window.addEventListener('resize', updateCursor);
    return () => window.removeEventListener('resize', updateCursor);
  }, [input, text]);

  const handleChange = (e) => {
    const value = e.target.value;
    if (!isActive && value.length === 1) {
      onStart();
    }
    if (value.length <= text.length) {
      onInput(value);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Backspace') {
      // Prevent backspacing if we are at the start of a word (previous char was space)
      if (input.length > 0 && input[input.length - 1] === ' ') {
        e.preventDefault();
        return;
      }
      
      // If valid backspace, count it as an incorrect keystroke
      if (input.length > 0) {
        onKeystroke({ isCorrect: false });
      }
      return;
    }

    // Ignore modifier keys and other special keys (except for what we already handled)
    if (e.ctrlKey || e.altKey || e.metaKey || e.key.length > 1) {
      return;
    }

    // Process a regular character keystroke
    const nextCharIndex = input.length;
    const expectedChar = text[nextCharIndex];
    const isCorrect = e.key === expectedChar;

    onKeystroke({ isCorrect });
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

      return (
        <span key={index} className={colorClass}>
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
        onKeyDown={handleKeyDown}
        onPaste={(e) => e.preventDefault()}
        className="absolute opacity-0 w-0 h-0 -z-10"
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck="false"
        autoFocus
      />
      <div 
        className="absolute w-[2px] bg-accent transition-all duration-100 ease-out z-10 animate-pulse"
        style={{ 
          left: cursorPos.left, 
          top: cursorPos.top + (cursorPos.height * 0.1),
          height: cursorPos.height * 0.8
        }}
      />
      <div className="select-none font-mono" ref={textContainerRef}>
        {renderText()}
      </div>
    </div>
  );
}
