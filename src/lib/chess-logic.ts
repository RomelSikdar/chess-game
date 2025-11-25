export type PieceType =
  | "king"
  | "queen"
  | "rook"
  | "bishop"
  | "knight"
  | "pawn";
export type PieceColor = "white" | "black";

export interface Piece {
  type: PieceType;
  color: PieceColor;
  hasMoved?: boolean;
}

export interface Position {
  row: number;
  col: number;
}

export type Board = (Piece | null)[][];

export interface Move {
  from: Position;
  to: Position;
  piece: Piece;
  captured?: Piece;
  isPromotion?: boolean;
  isCastling?: boolean;
  isEnPassant?: boolean;
}

export interface GameState {
  board: Board;
  currentPlayer: PieceColor;
  moves: Move[];
  capturedPieces: { white: Piece[]; black: Piece[] };
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  winner: PieceColor | null;
  enPassantTarget: Position | null;
  scores: { white: number; black: number };
}

const PIECE_VALUES: Record<PieceType, number> = {
  pawn: 1,
  knight: 3,
  bishop: 3,
  rook: 5,
  queen: 9,
  king: 0,
};

export function createInitialBoard(): Board {
  const board: Board = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null));

  // Place pawns
  for (let col = 0; col < 8; col++) {
    board[1][col] = { type: "pawn", color: "black" };
    board[6][col] = { type: "pawn", color: "white" };
  }

  // Place other pieces
  const backRow: PieceType[] = [
    "rook",
    "knight",
    "bishop",
    "queen",
    "king",
    "bishop",
    "knight",
    "rook",
  ];
  for (let col = 0; col < 8; col++) {
    board[0][col] = { type: backRow[col], color: "black" };
    board[7][col] = { type: backRow[col], color: "white" };
  }

  return board;
}

export function createInitialGameState(): GameState {
  return {
    board: createInitialBoard(),
    currentPlayer: "white",
    moves: [],
    capturedPieces: { white: [], black: [] },
    isCheck: false,
    isCheckmate: false,
    isStalemate: false,
    winner: null,
    enPassantTarget: null,
    scores: { white: 0, black: 0 },
  };
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => row.map((piece) => (piece ? { ...piece } : null)));
}

export function findKing(board: Board, color: PieceColor): Position | null {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece?.type === "king" && piece.color === color) {
        return { row, col };
      }
    }
  }
  return null;
}

export function isSquareAttacked(
  board: Board,
  pos: Position,
  byColor: PieceColor
): boolean {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === byColor) {
        const moves = getRawMoves(board, { row, col }, piece, null, true);
        if (moves.some((m) => m.row === pos.row && m.col === pos.col)) {
          return true;
        }
      }
    }
  }
  return false;
}

export function isInCheck(board: Board, color: PieceColor): boolean {
  const kingPos = findKing(board, color);
  if (!kingPos) return false;
  const opponentColor = color === "white" ? "black" : "white";
  return isSquareAttacked(board, kingPos, opponentColor);
}

function getRawMoves(
  board: Board,
  from: Position,
  piece: Piece,
  enPassantTarget: Position | null,
  attackOnly = false
): Position[] {
  const moves: Position[] = [];
  const { row, col } = from;
  const { type, color } = piece;

  const addMove = (r: number, c: number) => {
    if (r >= 0 && r < 8 && c >= 0 && c < 8) {
      const target = board[r][c];
      if (!target || target.color !== color) {
        moves.push({ row: r, col: c });
      }
    }
  };

  const addAttack = (r: number, c: number) => {
    if (r >= 0 && r < 8 && c >= 0 && c < 8) {
      moves.push({ row: r, col: c });
    }
  };

  const addSlidingMoves = (directions: [number, number][]) => {
    for (const [dr, dc] of directions) {
      let r = row + dr;
      let c = col + dc;
      while (r >= 0 && r < 8 && c >= 0 && c < 8) {
        const target = board[r][c];
        if (target) {
          if (target.color !== color) {
            moves.push({ row: r, col: c });
          }
          break;
        }
        moves.push({ row: r, col: c });
        r += dr;
        c += dc;
      }
    }
  };

  switch (type) {
    case "pawn": {
      const direction = color === "white" ? -1 : 1;
      const startRow = color === "white" ? 6 : 1;

      if (attackOnly) {
        addAttack(row + direction, col - 1);
        addAttack(row + direction, col + 1);
      } else {
        // Forward move
        if (
          row + direction >= 0 &&
          row + direction < 8 &&
          !board[row + direction][col]
        ) {
          moves.push({ row: row + direction, col });
          // Double move from start
          if (row === startRow && !board[row + 2 * direction][col]) {
            moves.push({ row: row + 2 * direction, col });
          }
        }
        // Captures
        for (const dc of [-1, 1]) {
          const newRow = row + direction;
          const newCol = col + dc;
          if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            const target = board[newRow][newCol];
            if (target && target.color !== color) {
              moves.push({ row: newRow, col: newCol });
            }
            // En passant
            if (
              enPassantTarget &&
              newRow === enPassantTarget.row &&
              newCol === enPassantTarget.col
            ) {
              moves.push({ row: newRow, col: newCol });
            }
          }
        }
      }
      break;
    }
    case "knight": {
      const knightMoves = [
        [-2, -1],
        [-2, 1],
        [-1, -2],
        [-1, 2],
        [1, -2],
        [1, 2],
        [2, -1],
        [2, 1],
      ];
      for (const [dr, dc] of knightMoves) {
        addMove(row + dr, col + dc);
      }
      break;
    }
    case "bishop": {
      addSlidingMoves([
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
      ]);
      break;
    }
    case "rook": {
      addSlidingMoves([
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ]);
      break;
    }
    case "queen": {
      addSlidingMoves([
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ]);
      break;
    }
    case "king": {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr !== 0 || dc !== 0) {
            addMove(row + dr, col + dc);
          }
        }
      }
      break;
    }
  }

  return moves;
}

export function getValidMoves(
  board: Board,
  from: Position,
  enPassantTarget: Position | null
): Position[] {
  const piece = board[from.row][from.col];
  if (!piece) return [];

  const rawMoves = getRawMoves(board, from, piece, enPassantTarget);
  const validMoves: Position[] = [];

  for (const to of rawMoves) {
    const testBoard = cloneBoard(board);
    testBoard[to.row][to.col] = testBoard[from.row][from.col];
    testBoard[from.row][from.col] = null;

    // Handle en passant capture
    if (
      piece.type === "pawn" &&
      enPassantTarget &&
      to.row === enPassantTarget.row &&
      to.col === enPassantTarget.col
    ) {
      const capturedPawnRow = piece.color === "white" ? to.row + 1 : to.row - 1;
      testBoard[capturedPawnRow][to.col] = null;
    }

    if (!isInCheck(testBoard, piece.color)) {
      validMoves.push(to);
    }
  }

  // Add castling moves
  if (
    piece.type === "king" &&
    !piece.hasMoved &&
    !isInCheck(board, piece.color)
  ) {
    const row = piece.color === "white" ? 7 : 0;

    // Kingside castling
    const kingsideRook = board[row][7];
    if (kingsideRook?.type === "rook" && !kingsideRook.hasMoved) {
      if (!board[row][5] && !board[row][6]) {
        const opponentColor = piece.color === "white" ? "black" : "white";
        if (
          !isSquareAttacked(board, { row, col: 5 }, opponentColor) &&
          !isSquareAttacked(board, { row, col: 6 }, opponentColor)
        ) {
          validMoves.push({ row, col: 6 });
        }
      }
    }

    // Queenside castling
    const queensideRook = board[row][0];
    if (queensideRook?.type === "rook" && !queensideRook.hasMoved) {
      if (!board[row][1] && !board[row][2] && !board[row][3]) {
        const opponentColor = piece.color === "white" ? "black" : "white";
        if (
          !isSquareAttacked(board, { row, col: 2 }, opponentColor) &&
          !isSquareAttacked(board, { row, col: 3 }, opponentColor)
        ) {
          validMoves.push({ row, col: 2 });
        }
      }
    }
  }

  return validMoves;
}

export function hasAnyValidMoves(
  board: Board,
  color: PieceColor,
  enPassantTarget: Position | null
): boolean {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === color) {
        const moves = getValidMoves(board, { row, col }, enPassantTarget);
        if (moves.length > 0) return true;
      }
    }
  }
  return false;
}

export function makeMove(
  state: GameState,
  from: Position,
  to: Position
): GameState {
  const newBoard = cloneBoard(state.board);
  const piece = newBoard[from.row][from.col];
  if (!piece) return state;

  const captured = newBoard[to.row][to.col];
  const move: Move = {
    from,
    to,
    piece: { ...piece },
    captured: captured || undefined,
  };

  // Handle en passant capture
  if (
    piece.type === "pawn" &&
    state.enPassantTarget &&
    to.row === state.enPassantTarget.row &&
    to.col === state.enPassantTarget.col
  ) {
    const capturedPawnRow = piece.color === "white" ? to.row + 1 : to.row - 1;
    move.captured = newBoard[capturedPawnRow][to.col] || undefined;
    move.isEnPassant = true;
    newBoard[capturedPawnRow][to.col] = null;
  }

  // Handle castling
  if (piece.type === "king" && Math.abs(to.col - from.col) === 2) {
    move.isCastling = true;
    const row = from.row;
    if (to.col === 6) {
      // Kingside
      newBoard[row][5] = newBoard[row][7];
      newBoard[row][7] = null;
      if (newBoard[row][5]) newBoard[row][5]!.hasMoved = true;
    } else {
      // Queenside
      newBoard[row][3] = newBoard[row][0];
      newBoard[row][0] = null;
      if (newBoard[row][3]) newBoard[row][3]!.hasMoved = true;
    }
  }

  // Move the piece
  newBoard[to.row][to.col] = { ...piece, hasMoved: true };
  newBoard[from.row][from.col] = null;

  // Handle pawn promotion (auto-promote to queen)
  if (piece.type === "pawn" && (to.row === 0 || to.row === 7)) {
    newBoard[to.row][to.col] = {
      type: "queen",
      color: piece.color,
      hasMoved: true,
    };
    move.isPromotion = true;
  }

  // Update en passant target
  let enPassantTarget: Position | null = null;
  if (piece.type === "pawn" && Math.abs(to.row - from.row) === 2) {
    enPassantTarget = { row: (from.row + to.row) / 2, col: from.col };
  }

  // Update captured pieces and scores
  const newCapturedPieces = { ...state.capturedPieces };
  const newScores = { ...state.scores };
  if (move.captured) {
    if (piece.color === "white") {
      newCapturedPieces.white = [...newCapturedPieces.white, move.captured];
      newScores.white += PIECE_VALUES[move.captured.type];
    } else {
      newCapturedPieces.black = [...newCapturedPieces.black, move.captured];
      newScores.black += PIECE_VALUES[move.captured.type];
    }
  }

  const nextPlayer = state.currentPlayer === "white" ? "black" : "white";
  const isCheck = isInCheck(newBoard, nextPlayer);
  const hasValidMoves = hasAnyValidMoves(newBoard, nextPlayer, enPassantTarget);

  return {
    board: newBoard,
    currentPlayer: nextPlayer,
    moves: [...state.moves, move],
    capturedPieces: newCapturedPieces,
    isCheck,
    isCheckmate: isCheck && !hasValidMoves,
    isStalemate: !isCheck && !hasValidMoves,
    winner: isCheck && !hasValidMoves ? state.currentPlayer : null,
    enPassantTarget,
    scores: newScores,
  };
}

export function getPieceSymbol(piece: Piece): string {
  const symbols: Record<PieceColor, Record<PieceType, string>> = {
    white: {
      king: "icon-[fa6-regular--chess-king]",
      queen: "icon-[fa7-regular--chess-queen]",
      rook: "icon-[fa7-regular--chess-rook]",
      bishop: "icon-[fa6-regular--chess-bishop]",
      knight: "icon-[fa6-regular--chess-knight]",
      pawn: "icon-[la--chess-pawn]",
    },
    black: {
      king: "icon-[fa6-solid--chess-king]",
      queen: "icon-[fa7-solid--chess-queen]",
      rook: "icon-[fa7-solid--chess-rook]",
      bishop: "icon-[fa6-solid--chess-bishop]",
      knight: "icon-[fa6-solid--chess-knight]",
      pawn: "icon-[game-icons--chess-pawn]",
    },
  };
  return symbols[piece.color][piece.type];
}
