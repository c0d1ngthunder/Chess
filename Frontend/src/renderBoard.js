const renderBoard = (
  boardref,
  chess,
  playerRole,
  GetPieceUnicode,
  draggedPiece,
  sourceSquare,
  handleMove
) => {
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

export default renderBoard;
