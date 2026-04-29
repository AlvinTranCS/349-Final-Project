import { useEffect, useRef } from 'react';

export default function Timer({ isActive, timeRemaining, setTimeRemaining, onTimeUp }) {
  const onTimeUpRef = useRef(onTimeUp);

  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            onTimeUpRef.current();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, setTimeRemaining]);

  return (
    <div className="text-accent font-bold text-2xl mb-4">
      {timeRemaining}s
    </div>
  );
}
