import { useEffect, useRef } from "react";
import socket from "./socket"; // Import socket.io-client
import { Chess } from "chess.js"; // Import chess.js

const App = () => {
  const chess = new Chess(); // Create a new chess game

  let draggedPiece = null; // Variable to store the dragged piece
  let sourceSquare = null; // Variable to store the source square
  let playerRole = null; // Variable to store the player role

  const boardref = useRef(null); // Reference to the board

  const GetPieceUnicode = (piece) => {
    const unicodes = {
      p: {
        w: "♙", // White Pawn (U+2659)
        b: "♟", // Black Pawn (U+265F)
      },
      n: {
        w: "♘", // White Knight (U+2658)
        b: "♞", // Black Knight (U+265E)
      },
      b: {
        w: "♗", // White Bishop (U+2657)
        b: "♝", // Black Bishop (U+265D)
      },
      r: {
        w: "♖", // White Rook (U+2656)
        b: "♜", // Black Rook (U+265C)
      },
      q: {
        w: "♕", // White Queen (U+2655)
        b: "♛", // Black Queen (U+265B)
      },
      k: {
        w: "♔", // White King (U+2654)
        b: "♚", // Black King (U+265A)
      },
    };

    if (!piece) return "";
    return unicodes[piece.type][piece.color];
  };

  const renderBoard = () => {
    const boardelement = boardref.current; // Get the board element
    const board = chess.board(); // Get the board from the chess game

    boardref.current.innerHTML = ""; // Clear the board

    board.forEach((row, rowidx) => {
      row.forEach((square, squareidx) => {
        const squareElement = document.createElement("div"); // Create a square element
        squareElement.classList.add(
          "square",
          (rowidx + squareidx) % 2 === 0 ? "light" : "dark"
        ); // Add classes to the square element
        squareElement.dataset.row = rowidx; // Set the row index
        squareElement.dataset.col = squareidx; // Set the column index

        squareElement.addEventListener("drop", (e) => {
          e.preventDefault(); // Prevent the default behavior
          if (draggedPiece) {
            const targetSquare = {
              row: Number(squareElement.dataset.row),
              col: Number(squareElement.dataset.col),
            }; // Get the target square

            handleMove(sourceSquare, targetSquare); // Handle the move
          }
        });

        boardelement.appendChild(squareElement); // Append the square element to the board element

        if (square) {
          const pieceElement = document.createElement("div"); // Create a piece element
          pieceElement.classList.add(
            "piece",
            square.color === "w" ? "white" : "black" // Add color class to the piece element
          ); // Add class to the piece element

          pieceElement.innerHTML = GetPieceUnicode(square); // Set the innerHTML of the piece element
          pieceElement.draggable = playerRole === square.color; // Set the draggable attribute of the piece element

          pieceElement.addEventListener("dragstart", (e) => {
            if (pieceElement.draggable) {
              draggedPiece = pieceElement;
              sourceSquare = { row: rowidx, col: squareidx };
              e.dataTransfer.setData("text/plain", ""); // Set the data to be transferred
            }
            squareElement.addEventListener("dragover", (e) => {
              // Add event listener to the square element
              e.preventDefault(); // Prevent the default behavior
            });
          });

          pieceElement.addEventListener("dragend", () => {
            sourceSquare = null; //set the source square to null
            draggedPiece = null; //set the dragged piece to null
          });

          squareElement.appendChild(pieceElement); // Append the piece element to the square element
        }
      });
    });
  };
  const handleMove = (source, target) => {};

  useEffect(() => {
    if (boardref.current) {
      renderBoard();
    }
  });

  return (
    <div className="w-full h-screen bg-zinc-900 flex justify-center items-center">
      <div ref={boardref} className="board h-112 w-112 bg-blue-400"></div>
    </div>
  );
};

export default App;
