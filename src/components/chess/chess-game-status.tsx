"use client";

import type { PieceColor } from "@/lib/chess-logic";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Trophy, Scale } from "lucide-react";

interface GameStatusProps {
  currentPlayer: PieceColor;
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  winner: PieceColor | null;
  moveCount: number;
}

export function ChessGameStatus({
  currentPlayer,
  isCheck,
  isCheckmate,
  isStalemate,
  winner,
  moveCount,
}: GameStatusProps) {
  if (isCheckmate && winner) {
    return (
      <div className="flex items-center h-16 justify-center gap-2 p-4 bg-yellow-500/20 rounded-lg border border-yellow-500/50">
        <Trophy className="w-6 h-6 text-yellow-500" />
        <span className="text-md font-semibold capitalize">
          Checkmate! {winner} wins!
        </span>
      </div>
    );
  }

  if (isStalemate) {
    return (
      <div className="flex items-center h-16 justify-center gap-2 p-4 bg-muted rounded-lg border">
        <Scale className="w-6 h-6" />
        <span className="text-lg font-semibold">Stalemate - Draw!</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 h-16 bg-card rounded-lg border">
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground">Turn:</span>
        <Badge
          variant={currentPlayer === "white" ? "secondary" : "default"}
          className="capitalize text-sm"
        >
          {currentPlayer}
        </Badge>
        {isCheck && (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Check!
          </Badge>
        )}
      </div>
      <div className="text-sm text-muted-foreground">
        Move {Math.floor(moveCount / 2) + 1}
      </div>
    </div>
  );
}
