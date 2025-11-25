"use client";

import type { Piece, Position } from "@/lib/chess-logic";
import { ChessPiece } from "@/components/chess/chess-piece";

interface ChessSquareProps {
  piece: Piece | null;
  position: Position;
  isLight: boolean;
  isSelected: boolean;
  isValidMove: boolean;
  isLastMove: boolean;
  isCheck: boolean;
  onClick: () => void;
}

export function ChessSquare({
  piece,
  isLight,
  isSelected,
  isValidMove,
  isLastMove,
  isCheck,
  onClick,
}: ChessSquareProps) {
  const getBgColor = () => {
    if (isCheck) return "bg-[var(--chess-check)]";
    if (isSelected) return "bg-[var(--chess-selected)]";
    if (isLastMove) return "bg-[var(--chess-highlight)]";
    return isLight ? "bg-[var(--chess-light)]" : "bg-[var(--chess-dark)]";
  };

  return (
    <button
      onClick={onClick}
      className={`
        aspect-square w-full flex items-center justify-center relative
        ${getBgColor()}
        transition-colors duration-150
        hover:brightness-110
        focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset
      `}
    >
      {piece && <ChessPiece piece={piece} isSelected={isSelected} />}
      {isValidMove && !piece && (
        <span className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-foreground/30" />
      )}
      {isValidMove && piece && (
        <span className="absolute inset-0 border-4 border-foreground/40 rounded-sm" />
      )}
    </button>
  );
}
