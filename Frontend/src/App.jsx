import { useEffect, useRef, useState } from "react";
import { socket } from "./socket"; // Import socket.io-client
import { Chess } from "chess.js"; // Import chess.js

const App = () => {
  let draggedPiece = useRef(null);
  let sourceSquare = useRef(null);
  // Variable to store the source square
  const [playerRole, setPlayerRole] = useState(null); // Variable to store the player role
  let [lostPlayer, setLostPlayer] = useState("");
  let [causeofloss, setCauseofloss] = useState("");
  const chess = useRef(new Chess()).current; // State to store the chess game

  const boardref = useRef(null); // Reference to the board

  const reset = () => {
    setLostPlayer("");
    setCauseofloss("");
  };

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
    console.log("Rendering board..."); // Debug log
    const boardelement = boardref.current; // Get the board element
    const board = chess.board(); // Get the board from the chess game

    if (playerRole === "b") {
      boardelement.classList.add("flipped");
    }

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

        boardelement.appendChild(squareElement); // Append the square element to the board element

        if (square) {
          const pieceElement = document.createElement("div"); // Create a piece element
          pieceElement.classList.add(
            "piece",
            square.color === "w" ? "white" : "black" // Add color class to the piece element
          ); // Add class to the piece element

          pieceElement.innerText = GetPieceUnicode(square); // Set the innerHTML of the piece element
          pieceElement.draggable = playerRole === square.color; // Set the draggable attribute of the piece element
          pieceElement.addEventListener("dragstart", (e) => {
            console.log(
              "Dragging piece:",
              square.type,
              "Color:",
              square.color,
              "Player Role:",
              playerRole
            ); // <-- debug log
            if (pieceElement.draggable) {
              draggedPiece = pieceElement;
              sourceSquare = { row: rowidx, col: squareidx };
              e.dataTransfer.setData("text/plain", ""); // Set the data to be transferred
            }
          });

          pieceElement.addEventListener("dragend", () => {
            sourceSquare = null; //set the source square to null
            draggedPiece = null; //set the dragged piece to null
          });

          squareElement.appendChild(pieceElement); // Append the piece element to the square element
        }

        squareElement.addEventListener("dragover", (e) => {
          // Add event listener to the square element
          e.preventDefault(); // Prevent the default behavior
        });

        squareElement.addEventListener("drop", (e) => {
          console.log("dropped", e, draggedPiece);

          e.preventDefault(); // Prevent the default behavior
          if (draggedPiece) {
            const targetSquare = {
              row: parseInt(squareElement.dataset.row),
              col: parseInt(squareElement.dataset.col),
            }; // Get the target square

            handleMove(sourceSquare, targetSquare); // Handle the move
          }
        });
      });
    });
  };
  const handleMove = (source, target) => {
    const move = {
      from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
      to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
    };

    // const piece = chess.get(move.from);
    // if (
    //   piece &&
    //   piece.type === "p" &&
    //   (move.to[1] === "8" || move.to[1] === "1")
    // ) {
    //   move.promotion = "q"; // Promote pawn to Queen
    // }
    console.log("Current FEN before move:", chess.fen()); // Debugging line
    console.log("Attempting to emit move:", move); // <-- debug log
    const result = chess.move(move); // Attempt to move the piece
    if (result) {
      socket.emit("move", move);
    } else {
      console.log(result);
    }
  };
  useEffect(() => {
    socket.on("playerRole", (role) => {
      setPlayerRole(role);
      renderBoard();
    });

    socket.on("spectatorRole", () => {
      setPlayerRole(role);
      renderBoard();
    });

    socket.on("boardState", (fen) => {
      chess.load(fen); // Load the board state
      renderBoard();
    });

    socket.on("move", (move) => {
      chess.move(move);
      renderBoard();
    });

    socket.on("checkmate", (turn) => {
      console.log(turn);
      // alert("Checkmate", turn);
      setCauseofloss("Checkmate");
      setLostPlayer(turn);
      chess.reset();
    });

    socket.on("Resign", (color) => {
      setCauseofloss("Resignation");
      setLostPlayer(color);
      chess.reset();
    });

    socket.on("draw", () => {
      setCauseofloss("Draw");
      setLostPlayer("Both");
      chess.reset();
    });

    return () => {
      socket.off("move");
      socket.off("boardState");
      socket.off("playerRole");
      socket.off("spectatorRole");
    };
  }, [playerRole]);

  useEffect(() => {
    if (playerRole !== null) {
      renderBoard();
    }
  }, [playerRole]);

  return (
    <div className="w-full h-screen bg-zinc-900 flex justify-center items-center">
      <div ref={boardref} className="board h-112 w-112 bg-blue-400"></div>
      {lostPlayer && (
        <div className="absolute bg-white h-60 p-4 rounded-lg">
          <h1 className="text-2xl text-black">
            {lostPlayer === playerRole ? "Opponent" : "You"}{" "}
            {causeofloss === "Draw" ? "drew the game" : "won"} by {causeofloss}
          </h1>
          <button className="text-lg bg-green-400 p-2 rounded-md left-[30%] mt-4 absolute" onClick={() => reset()}>Play again</button>
        </div>
      )}
    </div>
  );
};

export default App;
