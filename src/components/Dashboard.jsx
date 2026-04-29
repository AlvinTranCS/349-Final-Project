export default function Dashboard({ wpm, accuracy, onRestart }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 animate-fade-in">
      <div className="flex space-x-16">
        <div className="text-center">
          <div className="text-untyped text-xl mb-2">wpm</div>
          <div className="text-accent text-6xl font-bold">{Math.round(wpm)}</div>
        </div>
        <div className="text-center">
          <div className="text-untyped text-xl mb-2">acc</div>
          <div className="text-accent text-6xl font-bold">{Math.round(accuracy)}%</div>
        </div>
      </div>
      <button
        onClick={onRestart}
        className="mt-8 px-6 py-2 text-untyped hover:text-correct transition-colors flex items-center space-x-2"
        title="Restart Test"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>
  );
}
