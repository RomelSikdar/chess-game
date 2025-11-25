"use client";

import {
  type Piece,
  type PieceColor,
  getPieceSymbol,
  type PieceType,
} from "@/lib/chess-logic";
import { Card } from "@/components/ui/card";
import { Crown, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface PlayerPanelProps {
  color: PieceColor;
  playerName: string;
  score: number;
  capturedPieces: Piece[];
  isCurrentTurn: boolean;
  isWinner: boolean;
}

export function ChessPlayerPanel({
  color,
  playerName,
  score,
  capturedPieces,
  isCurrentTurn,
  isWinner,
}: PlayerPanelProps) {
  const { resolvedTheme } = useTheme();

  const sortOrder: PieceType[] = ["queen", "rook", "bishop", "knight", "pawn"];
  const sortedPieces = [...capturedPieces].sort(
    (a, b) => sortOrder.indexOf(a.type) - sortOrder.indexOf(b.type)
  );

  return (
    <Card
      className={`p-4 transition-all duration-300 ${
        isCurrentTurn ? "ring-2 ring-primary shadow-lg" : "opacity-80"
      } ${isWinner ? "ring-2 ring-yellow-500 bg-yellow-500/10" : ""}`}
    >
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className={cn(
              "w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2",
              resolvedTheme === "light" &&
                color === "white" &&
                "bg-white border-foreground/30",
              resolvedTheme === "light" &&
                color === "black" &&
                "bg-gray-800 border-foreground/30",
              resolvedTheme === "dark" &&
                color === "white" &&
                "bg-gray-100 border-foreground/30",
              resolvedTheme === "dark" &&
                color === "black" &&
                "bg-gray-900 border-foreground/30"
            )}
          />
          <div>
            <h3 className="font-semibold text-sm sm:text-lg truncate max-w-[120px] sm:max-w-[200px]">
              {playerName}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground capitalize">
              {color}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isWinner && <Crown className="w-5 h-5 text-yellow-500" />}
          {isCurrentTurn && !isWinner && (
            <Clock className="w-4 h-4 text-primary animate-pulse" />
          )}
        </div>
        <div className="flex flex-wrap gap-0.5 min-h-6 sm:min-h-7">
          {sortedPieces.map((piece, index) => (
            <span
              key={index}
              className="text-base sm:text-xl opacity-70"
              title={piece.type}
            >
              <i
                className={cn(
                  "md:size-9 size-5",
                  getPieceSymbol(piece),
                  resolvedTheme === "light" && "text-gray-800"
                )}
              />
            </span>
          ))}
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">
            {score > 0 ? `+${score}` : score}
          </p>
          <p className="text-xs text-muted-foreground">Score</p>
        </div>
      </div>
    </Card>
  );
}
