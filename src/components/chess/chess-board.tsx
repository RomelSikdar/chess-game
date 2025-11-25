"use client";

import type { Board, Position, PieceColor } from "@/lib/chess-logic";
import { ChessSquare } from "@/components/chess/chess-square";

interface ChessBoardProps {
  board: Board;
  selectedPosition: Position | null;
  validMoves: Position[];
  lastMove: { from: Position; to: Position } | null;
  currentPlayer: PieceColor;
  isCheck: boolean;
  onSquareClick: (position: Position) => void;
}

export function ChessBoard({
  board,
  selectedPosition,
  validMoves,
  lastMove,
  currentPlayer,
  isCheck,
  onSquareClick,
}: ChessBoardProps) {
  const isValidMove = (row: number, col: number) =>
    validMoves.some((m) => m.row === row && m.col === col);

  const isLastMove = (row: number, col: number) =>
    lastMove &&
    ((lastMove.from.row === row && lastMove.from.col === col) ||
      (lastMove.to.row === row && lastMove.to.col === col));

  const isKingInCheck = (row: number, col: number) => {
    const piece = board[row][col];
    return isCheck && piece?.type === "king" && piece.color === currentPlayer;
  };

  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex w-full justify-center">
        <div className="flex flex-col justify-around pr-1 sm:pr-2 text-xs sm:text-sm text-muted-foreground font-mono">
          {ranks.map((rank) => (
            <span
              key={rank}
              className="h-[calc((min(100vw-2rem,26rem))/8)] sm:h-10 md:h-14 flex items-center"
            >
              {rank}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-8 border-2 border-foreground/20 rounded-sm overflow-hidden shadow-lg w-md">
          {board.map((row, rowIndex) =>
            row.map((piece, colIndex) => (
              <ChessSquare
                key={`${rowIndex}-${colIndex}`}
                piece={piece}
                position={{ row: rowIndex, col: colIndex }}
                isLight={(rowIndex + colIndex) % 2 === 0}
                isSelected={
                  selectedPosition?.row === rowIndex &&
                  selectedPosition?.col === colIndex
                }
                isValidMove={isValidMove(rowIndex, colIndex)}
                isLastMove={!!isLastMove(rowIndex, colIndex)}
                isCheck={isKingInCheck(rowIndex, colIndex)}
                onClick={() => onSquareClick({ row: rowIndex, col: colIndex })}
              />
            ))
          )}
        </div>
      </div>
      <div className="flex justify-center w-full">
        <div className="pl-4 sm:pl-6 pt-1 grid grid-cols-8 w-md text-xs sm:text-sm text-muted-foreground font-mono">
          {files.map((file) => (
            <span key={file} className="text-center">
              {file}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
