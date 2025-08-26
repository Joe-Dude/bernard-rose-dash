import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { GameCanvas } from './GameCanvas';

export const SaintBernardGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const startGame = () => {
    setGameStarted(true);
  };

  const restartGame = () => {
    setGameStarted(false);
    setGameWon(false);
    setFinalScore(0);
    setTimeout(() => setGameStarted(true), 100);
  };

  const handleGameWin = (score: number) => {
    setGameWon(true);
    setFinalScore(score);
  };

  return (
    <div className="min-h-screen bg-gradient-game flex items-center justify-center p-4">
      <div className="relative rounded-3xl shadow-game overflow-hidden bg-gradient-sky">
        <GameCanvas 
          gameStarted={gameStarted} 
          onGameWin={handleGameWin}
        />
        
        {/* Start Instructions */}
        {!gameStarted && (
          <div className="absolute inset-0 flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-game-dog-brown/95 to-game-wood-brown/95 backdrop-blur-sm text-white p-8 rounded-3xl text-center max-w-lg mx-4 shadow-magical border-2 border-accent">
              <h1 className="text-3xl font-bold mb-4 text-accent">
                🌹 Saint Bernard's Rose Quest 🌹
              </h1>
              <p className="text-lg mb-6 leading-relaxed">
                Help the brave Saint Bernard find the magical white rose for his beloved owner!
              </p>
              
              <div className="bg-black/20 p-4 rounded-xl mb-6">
                <p className="font-semibold mb-2">🎮 Controls:</p>
                <p className="mb-1">← → Arrow Keys - Move</p>
                <p>🚀 Spacebar - Jump</p>
              </div>
              
              <div className="text-sm space-y-1 mb-6">
                <p>✨ Collect sparkling gummy clusters</p>
                <p>⚠️ Avoid dangerous hair gel bottles</p>
                <p>🌸 Find the mystical white rose</p>
              </div>
              
              <Button 
                onClick={startGame}
                size="lg"
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300 transform hover:scale-105 text-lg px-8 py-6 font-bold"
              >
                Begin Adventure!
              </Button>
            </div>
          </div>
        )}

        {/* Win Message */}
        {gameWon && (
          <div className="absolute inset-0 flex items-center justify-center z-50">
            <div className="bg-gradient-primary text-white p-10 rounded-3xl text-center max-w-lg mx-4 shadow-magical border-3 border-accent">
              <h2 className="text-4xl font-bold mb-4">🎉 Quest Complete! 🎉</h2>
              <p className="text-xl mb-4">The noble Saint Bernard has returned with the white rose!</p>
              <p className="text-lg mb-6">His owner's heart fills with joy! ❤️</p>
              <div className="text-xl mb-6">Final Score: <span className="font-bold text-accent">{finalScore}</span></div>
              <Button 
                onClick={restartGame}
                size="lg"
                className="bg-gradient-magical hover:shadow-glow transition-all duration-300 transform hover:scale-105 text-lg px-8 py-6 font-bold"
              >
                New Adventure
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};