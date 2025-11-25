"use client";

import { ChessGame } from "@/components/chess/chess-game";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { ArrowRight, ChessPawn } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);
  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");

  const handleStartGame = () => {
    if (!player1Name.trim() || !player2Name.trim()) {
      toast.error("Error!!!", {
        description: "Please enter player names to start the game.",
      });
      return;
    }

    if (player1Name.trim() && player2Name.trim()) {
      setGameStarted(true);
    }
  };

  if (!gameStarted) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="fixed top-4 right-4">
          <ThemeToggle />
        </div>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">♔ Chess ♚</CardTitle>
            <CardDescription>
              Enter player names to start a 1v1 game
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="player1">Player 1 (White)</Label>
              <InputGroup>
                <InputGroupInput
                  id="player1"
                  value={player1Name}
                  onChange={(e) => setPlayer1Name(e.target.value)}
                  placeholder="Enter player 1 name"
                />
                <InputGroupAddon>
                  <ChessPawn className="text-black" />
                </InputGroupAddon>
              </InputGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="player2">Player 2 (Black)</Label>
              <InputGroup>
                <InputGroupInput
                  id="player2"
                  value={player2Name}
                  onChange={(e) => setPlayer2Name(e.target.value)}
                  placeholder="Enter player 2 name"
                />
                <InputGroupAddon>
                  <ChessPawn className="text-black" />
                </InputGroupAddon>
              </InputGroup>
            </div>
            <Button onClick={handleStartGame} className="w-full" size="lg">
              Start Game <ArrowRight className="ml-2" />
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-2 sm:p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-4 sm:mb-6 relative">
          <div className="absolute right-0 top-0">
            <ThemeToggle />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">♔ Chess ♚</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            {player1Name} vs {player2Name}
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2"
            onClick={() => setGameStarted(false)}
          >
            Change Players
          </Button>
        </header>
        <ChessGame player1Name={player1Name} player2Name={player2Name} />
      </div>
    </main>
  );
}
