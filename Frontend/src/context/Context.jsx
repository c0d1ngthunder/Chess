import React, { createContext, useState, useRef } from "react";
import { Chess } from "chess.js"; // Import chess.js
import domtoimage from "dom-to-image";
import { socket } from "../socket";
import renderBoard from "../renderBoard";
import { act } from "react";

export const chessContext = createContext();
const Context = (props) => {
  let draggedPiece = useRef(null);
  let sourceSquare = useRef(null); // Variable to store the source square
  const [playerRole, setPlayerRole] = useState(null); // Variable to store the player role
  const [lostPlayer, setLostPlayer] = useState(null);
  const [cause, setCause] = useState({ isdraw: false, cause: null });
  const [visible, setVisible] = useState(true);
  const [showBtn, setShowBtn] = useState(true);
  const [game, setGame] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [history, setHistory] = useState([]);
  const [isLocked, setIsLocked] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [activeTab,setActiveTab] = useState("moves"); // State to manage the active tab
  const chess = useRef(new Chess()).current; // State to store the chess game
  const boardref = useRef(null); // Reference to the board

  const reset = () => {
    setMessages([]);
    setLostPlayer("");
    setCause({ isdraw: false, cause: null });
    setVisible(true);
    chess.reset();
    socket.connect();
  };

  const sendMessage = () => {
    if (inputValue.trim()) {
      socket.emit("message", { content: inputValue, role: playerRole });
    }
    setInputValue("");
  };

  const renderBoardUtil = () => {
    renderBoard(
      boardref,
      chess,
      playerRole,
      GetPieceUnicode,
      draggedPiece,
      sourceSquare,
      handleMove,
      isFullscreen
    );
  };

  const toggleLock = () => {
    document.body.classList.toggle("overflow-hidden");
    setIsLocked(document.body.classList.contains("overflow-hidden")); // Update state
  };

  const resign = () => {
    socket.emit("resign", playerRole);
  };

  const GetPieceUnicode = (piece) => {
    const unicodes = {
      p: {
        w: "♙", // White Pawn (U+2659)
        b: "♙", // Black Pawn (U+265F) ♟
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

  function exportBoard(exportas) {
    if (exportas === "img") {
      const board = document.getElementById("board");

      domtoimage
        .toPng(board)
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = "chessboard.png";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch((error) => console.error("Error capturing board:", error));
    } else if (exportas === "pgn") {
      chess.header(
        "Event",
        "Casual Game",
        "Site",
        "chessmasters",
        "Date",
        Date.now(),
        "White",
        "Player1",
        "Black",
        "Player2",
        "Result",
        "*"
      );
      navigator.clipboard.writeText(chess.pgn()).then(() => {
        alert("Copied PGN to Clipboard!");
      });
    }
    setExporting(false);
  }

  const handleMove = (source, target) => {
    const move = {
      from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
      to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
    };

    socket.emit("move", move);
  };
  const connectToServer = () => {
    socket.connect();
  };
  const changevisible = () => {
    setVisible(false);
  };

  const disconnect = ()=>{
    socket.disconnect()
  }

  return (
    <chessContext.Provider
      value={{
        playerRole,
        setPlayerRole,
        lostPlayer,
        setLostPlayer,
        cause,
        setCause,
        visible,
        setVisible,
        showBtn,
        setShowBtn,
        game,
        setGame,
        isFullscreen,
        setIsFullscreen,
        history,
        setHistory,
        isLocked,
        setIsLocked,
        exporting,
        setExporting,
        messages,
        setMessages,
        inputValue,
        setInputValue,
        changevisible,
        connectToServer,
        chess,
        boardref,
        renderBoardUtil,
        toggleLock,
        handleMove,
        GetPieceUnicode,
        resign,
        exportBoard,
        sendMessage,
        reset,
        draggedPiece,
        sourceSquare,
        activeTab,
        setActiveTab,
        disconnect
      }}
    >
      {props.children}
    </chessContext.Provider>
  );
};

export default Context;
