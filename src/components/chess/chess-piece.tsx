"use client";

import { type Piece, getPieceSymbol } from "@/lib/chess-logic";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface ChessPieceProps {
  piece: Piece;
  isSelected?: boolean;
}

export function ChessPiece({ piece, isSelected }: ChessPieceProps) {
  const { resolvedTheme } = useTheme();

  return (
    <span
      className={`text-2xl sm:text-4xl md:text-5xl select-none transition-transform duration-150 ${
        isSelected ? "scale-110" : ""
      } ${
        piece.color === "white"
          ? "drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]"
          : "drop-shadow-[0_2px_2px_rgba(255,255,255,0.2)]"
      }`}
    >
      <i
        className={cn(
          "size-9",
          getPieceSymbol(piece),
          resolvedTheme === "light" &&
            piece.color === "white" &&
            "text-gray-50",
          resolvedTheme === "light" &&
            piece.color === "black" &&
            "text-gray-800"
        )}
      />
    </span>
  );
}
