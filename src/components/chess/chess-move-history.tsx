"use client";

import type { Move } from "@/lib/chess-logic";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MoveHistoryProps {
  moves: Move[];
}

function positionToAlgebraic(row: number, col: number): string {
  const files = "abcdefgh";
  const ranks = "87654321";
  return files[col] + ranks[row];
}

function moveToNotation(move: Move): string {
  const pieceSymbols: Record<string, string> = {
    king: "K",
    queen: "Q",
    rook: "R",
    bishop: "B",
    knight: "N",
    pawn: "",
  };

  let notation = pieceSymbols[move.piece.type];

  if (move.isCastling) {
    return move.to.col === 6 ? "O-O" : "O-O-O";
  }

  if (move.captured) {
    if (move.piece.type === "pawn") {
      notation += positionToAlgebraic(move.from.row, move.from.col)[0];
    }
    notation += "x";
  }

  notation += positionToAlgebraic(move.to.row, move.to.col);

  if (move.isPromotion) {
    notation += "=Q";
  }

  return notation;
}

export function ChessMoveHistory({ moves }: MoveHistoryProps) {
  const movePairs: { number: number; white?: string; black?: string }[] = [];

  moves.forEach((move, index) => {
    const moveNumber = Math.floor(index / 2) + 1;
    const notation = moveToNotation(move);

    if (index % 2 === 0) {
      movePairs.push({ number: moveNumber, white: notation });
    } else {
      movePairs[movePairs.length - 1].black = notation;
    }
  });

  if (moves.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No moves yet. White to play.
      </div>
    );
  }

  return (
    <ScrollArea className="h-48">
      <div className="grid grid-cols-[auto_1fr_1fr] gap-x-4 gap-y-1 text-sm font-mono">
        {movePairs.map((pair) => (
          <div key={pair.number} className="contents">
            <span className="text-muted-foreground">{pair.number}.</span>
            <span className="text-foreground">{pair.white}</span>
            <span className="text-foreground">{pair.black || ""}</span>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
