"use client";

import { useState, useCallback } from "react";
import {
  type GameState,
  type Position,
  createInitialGameState,
  getValidMoves,
  makeMove,
} from "@/lib/chess-logic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw, Flag, ChevronDown, ChevronUp } from "lucide-react";
import { ChessMoveHistory } from "@/components/chess/chess-move-history";
import { ChessPlayerPanel } from "@/components/chess/chess-player-panel";
import { ChessGameStatus } from "@/components/chess/chess-game-status";
import { ChessBoard } from "@/components/chess/chess-board";

interface ChessGameProps {
  player1Name: string;
  player2Name: string;
}

export function ChessGame({ player1Name, player2Name }: ChessGameProps) {
  const [gameState, setGameState] = useState<GameState>(
    createInitialGameState()
  );
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(
    null
  );
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const [gameHistory, setGameHistory] = useState({
    white: 0,
    black: 0,
    draws: 0,
  });
  const [showMobilePanel, setShowMobilePanel] = useState(false);

  const handleSquareClick = useCallback(
    (position: Position) => {
      if (gameState.isCheckmate || gameState.isStalemate) return;

      const clickedPiece = gameState.board[position.row][position.col];

      if (
        selectedPosition &&
        validMoves.some((m) => m.row === position.row && m.col === position.col)
      ) {
        const newState = makeMove(gameState, selectedPosition, position);
        setGameState(newState);
        setSelectedPosition(null);
        setValidMoves([]);

        if (newState.isCheckmate && newState.winner) {
          setGameHistory((prev) => ({
            ...prev,
            [newState.winner!]: prev[newState.winner!] + 1,
          }));
        } else if (newState.isStalemate) {
          setGameHistory((prev) => ({ ...prev, draws: prev.draws + 1 }));
        }
        return;
      }

      if (clickedPiece && clickedPiece.color === gameState.currentPlayer) {
        setSelectedPosition(position);
        setValidMoves(
          getValidMoves(gameState.board, position, gameState.enPassantTarget)
        );
        return;
      }

      setSelectedPosition(null);
      setValidMoves([]);
    },
    [gameState, selectedPosition, validMoves]
  );

  const handleNewGame = () => {
    setGameState(createInitialGameState());
    setSelectedPosition(null);
    setValidMoves([]);
  };

  const handleResign = () => {
    const winner = gameState.currentPlayer === "white" ? "black" : "white";
    setGameHistory((prev) => ({ ...prev, [winner]: prev[winner] + 1 }));
    setGameState({
      ...gameState,
      isCheckmate: true,
      winner,
    });
  };

  const lastMove =
    gameState.moves.length > 0
      ? {
          from: gameState.moves[gameState.moves.length - 1].from,
          to: gameState.moves[gameState.moves.length - 1].to,
        }
      : null;

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-center lg:items-start justify-center">
      {/* Main game area */}
      <div className="flex flex-col gap-4 w-full max-w-[min(100vw-1rem,28rem)] lg:max-w-none lg:w-auto">
        <ChessPlayerPanel
          color="black"
          playerName={player2Name}
          score={gameState.scores.black}
          capturedPieces={gameState.capturedPieces.black}
          isCurrentTurn={
            gameState.currentPlayer === "black" &&
            !gameState.isCheckmate &&
            !gameState.isStalemate
          }
          isWinner={gameState.winner === "black"}
        />

        <ChessBoard
          board={gameState.board}
          selectedPosition={selectedPosition}
          validMoves={validMoves}
          lastMove={lastMove}
          currentPlayer={gameState.currentPlayer}
          isCheck={gameState.isCheck}
          onSquareClick={handleSquareClick}
        />

        <ChessPlayerPanel
          color="white"
          playerName={player1Name}
          score={gameState.scores.white}
          capturedPieces={gameState.capturedPieces.white}
          isCurrentTurn={
            gameState.currentPlayer === "white" &&
            !gameState.isCheckmate &&
            !gameState.isStalemate
          }
          isWinner={gameState.winner === "white"}
        />
      </div>

      {/* Sidebar - collapsible on mobile */}
      <div className="w-full max-w-[min(100vw-1rem,28rem)] lg:w-72 flex flex-col gap-3 sm:gap-4">
        {/* Always visible game status */}
        <ChessGameStatus
          currentPlayer={gameState.currentPlayer}
          isCheck={gameState.isCheck}
          isCheckmate={gameState.isCheckmate}
          isStalemate={gameState.isStalemate}
          winner={gameState.winner}
          moveCount={gameState.moves.length}
        />

        {/* Action buttons - always visible */}
        <div className="flex gap-2">
          <Button
            onClick={handleNewGame}
            variant="outline"
            className="flex-1 bg-transparent"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            New Game
          </Button>
          <Button
            onClick={handleResign}
            variant="destructive"
            className="flex-1"
            disabled={gameState.isCheckmate || gameState.isStalemate}
          >
            <Flag className="w-4 h-4 mr-2" />
            Resign
          </Button>
        </div>

        <Button
          variant="ghost"
          className="lg:hidden w-full"
          onClick={() => setShowMobilePanel(!showMobilePanel)}
        >
          {showMobilePanel ? (
            <>
              Hide Details <ChevronUp className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Show Score & History <ChevronDown className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>

        {/* Collapsible panels - always visible on desktop, toggle on mobile */}
        <div
          className={`flex flex-col gap-3 sm:gap-4 ${
            showMobilePanel ? "block" : "hidden lg:flex"
          }`}
        >
          <Card>
            <CardHeader className="py-2 sm:py-3">
              <CardTitle className="text-sm sm:text-base">
                Match Score
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <div className="flex justify-around text-center">
                <div>
                  <p className="text-xl sm:text-2xl font-bold">
                    {gameHistory.white}
                  </p>
                  <p className="text-xs text-muted-foreground truncate max-w-20">
                    {player1Name}
                  </p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-muted-foreground">
                    {gameHistory.draws}
                  </p>
                  <p className="text-xs text-muted-foreground">Draws</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold">
                    {gameHistory.black}
                  </p>
                  <p className="text-xs text-muted-foreground truncate max-w-20">
                    {player2Name}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-2 sm:py-3">
              <CardTitle className="text-sm sm:text-base">
                Move History
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <ChessMoveHistory moves={gameState.moves} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
