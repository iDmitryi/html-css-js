let table = document.querySelector("table");
let cells = table.querySelectorAll("td");
let row = 0;
let col = 0;
let timerId;

// This function adds a random number to a cell in the game board.
function addRandom() {
  // It first clears the interval timer set by the "fallDown" function to avoid conflicts.
  clearInterval(timerId);

  // It then sets the current row to 0 and generates a random column index between 0 and 3.
  row = 0;
  col = Math.floor(Math.random() * 4);

  // It selects the cell at the current row and column index and assigns it a random number (2, 4 or 8).
  let cell = document.getElementById(`${row}-${col}`);
  let randomNum = [2, 4, 8][Math.floor(Math.random() * 3)];
  cell.innerHTML = randomNum;
  colorCells();

  // Finally, it sets a new interval timer to trigger the "fallDown" function after 1000 milliseconds.
  timerId = setInterval(fallDown, 1000);
}

// This function is responsible for moving the numbers down the grid
// and merging them if necessary
function fallDown() {
  // If the current row is the last row, clear the interval, merge with bottom neighbor, and return
  if (row === 3) {
    clearInterval(timerId);
    multiplyBottomNeighbor(col);
    return;
  }

  // Get the current and next cells and their values
  let currentCell = document.getElementById(`${row}-${col}`);
  let nextCell = document.getElementById(`${row + 1}-${col}`);
  let currentCellValue = parseInt(currentCell.innerHTML);
  let nextCellValue = parseInt(nextCell.innerHTML);

  // If the current cell has a value and the next cell is empty, move the current cell down
  if (currentCellValue > 0 && nextCellValue === 0) {
    nextCell.innerHTML = currentCell.innerHTML;
    currentCell.innerHTML = "0";
    row++;
    colorCells();

    // If the current cell has the same value as the next cell, merge them into the next cell
  } else if (currentCellValue > 0 && currentCellValue === nextCellValue) {
    let lastCell = document.getElementById(`${row + 1}-${col}`);
    let resultCellValue = currentCellValue * 2;
    lastCell.innerHTML = resultCellValue;
    currentCell.innerHTML = "0";
    row++;
    colorCells();

    // If the merged cell is now in the last row, multiply with its bottom neighbor
    if (row === 3) {
      multiplyBottomNeighbor(col);
    }

    // If the current cell cannot be moved down or merged, check if it's in the second last row and
    // if so, multiply it with its bottom neighbor, clear the interval and return
  } else if (row === 2) {
    multiplyBottomNeighbor(col);
    clearInterval(timerId);

    // If none of the above conditions are met, clear the interval and return
  } else {
    clearInterval(timerId);
  }
}

// This function multiplies the bottom-most cell with its neighbor cells
function multiplyBottomNeighbor(col) {
  // Get the current cell and its left and right neighbor cells
  let currentCell = document.getElementById(`3-${col}`);
  let leftCell = document.getElementById(`3-${col - 1}`);
  let rightCell = document.getElementById(`3-${col + 1}`);

  // Get the current cell value and its left and right neighbor cell values
  let currentCellValue = parseInt(currentCell.innerHTML);
  let leftCellValue = parseInt(leftCell.innerHTML);
  let rightCellValue = parseInt(rightCell.innerHTML);

  // If the left and right neighbor cells have the same value and both match the current cell value,
  // multiply the current cell value by 2 and multiply by 2 again, and set the left and right neighbor
  // cells to 0
  if (leftCellValue === rightCellValue && currentCellValue === leftCellValue) {
    currentCell.innerHTML = currentCellValue * 2 * 2;
    leftCell.innerHTML = "0";
    rightCell.innerHTML = "0";
    colorCells();

    // If the left neighbor cell matches the current cell value,
    // multiply the current cell value by 2 and set the left neighbor cell to 0
  } else if (leftCellValue === currentCellValue) {
    currentCell.innerHTML = currentCellValue * 2;
    leftCell.innerHTML = "0";
    colorCells();

    // If the right neighbor cell matches the current cell value,
    // multiply the current cell value by 2 and set the right neighbor cell to 0
  } else if (rightCellValue === currentCellValue) {
    currentCell.innerHTML = currentCellValue * 2;
    rightCell.innerHTML = "0";
    colorCells();
  }
}

// This function moves the current cell to the left by one column
function moveLeft() {
  // If current column is already the leftmost column, return without moving
  if (col === 0) {
    return;
  }

  // Get the current and next cell elements, and their values
  let currentCell = document.getElementById(`${row}-${col}`);
  let nextCell = document.getElementById(`${row}-${col - 1}`);
  let currentCellValue = currentCell.innerHTML;
  let nextCellValue = nextCell.innerHTML;

  // If current and next cells have the same value and not zero, merge them into one cell
  if (currentCellValue === nextCellValue && currentCellValue !== "0") {
    let resultCellValue = currentCellValue * 2;
    currentCell.innerHTML = "0";
    nextCell.innerHTML = resultCellValue;
    colorCells();

    // Otherwise, move the current cell to the next cell and vice versa
  } else {
    currentCell.innerHTML = nextCellValue;
    nextCell.innerHTML = currentCellValue;
    colorCells();
  }

  // Decrease the column number by 1, and if we're at the bottom row, multiply with bottom neighbor(s)
  col--;
  if (row === 3) {
    multiplyBottomNeighbor(col);
  }
}

// This function moves the current cell to the right by one column
function moveRight() {
  // Check if current column is already at the right-most edge
  if (col === 3) {
    return;
  }

  // Get the current and next cells, as well as their values
  let currentCell = document.getElementById(`${row}-${col}`);
  let nextCell = document.getElementById(`${row}-${col + 1}`);
  let currentCellValue = currentCell.innerHTML;
  let nextCellValue = nextCell.innerHTML;

  // If the current and next cells have the same value and neither are zero,
  // multiply the value by 2 and set the current cell value to zero
  if (currentCellValue === nextCellValue && currentCellValue !== "0") {
    let resultCellValue = currentCellValue * 2;
    currentCell.innerHTML = "0";
    nextCell.innerHTML = resultCellValue;
    colorCells();

    // Otherwise, swap the values of the current and next cells
  } else {
    currentCell.innerHTML = nextCellValue;
    nextCell.innerHTML = currentCellValue;
    colorCells();
  }

  // Increment the current column by one
  col++;

  // If the current row is the bottom row, multiply with the bottom neighbor
  if (row === 3) {
    multiplyBottomNeighbor(col);
  }
}

function colorCells() {
  // get all table rows
  const rows = document.getElementsByTagName("tr");

  // loop over each row
  for (let i = 0; i < rows.length; i++) {
    // get all cells in the current row
    const cells = rows[i].getElementsByTagName("td");

    // loop over each cell in the current row
    for (let j = 0; j < cells.length; j++) {
      // get the value of the current cell and parse it as an integer
      const value = parseInt(cells[j].innerHTML);

      // add appropriate CSS style to the cell based on its value
      if (value === 2) {
        cells[j].style.backgroundColor = "#ccc0b3";
        cells[j].style.color = "#776e65";
      } else if (value === 4) {
        cells[j].style.backgroundColor = "#ede0c8";
        cells[j].style.color = "#776e65";
      } else if (value === 8) {
        cells[j].style.backgroundColor = "#f2b179";
        cells[j].style.color = "#f9f6f2";
      } else if (value === 16) {
        cells[j].style.backgroundColor = "#f59563";
        cells[j].style.color = "#f9f6f2";
      } else if (value === 32) {
        cells[j].style.backgroundColor = "#f67c5f";
        cells[j].style.color = "#f9f6f2";
      } else if (value === 64) {
        cells[j].style.backgroundColor = "#f65e3b";
        cells[j].style.color = "#f9f6f2";
      } else if (value === 128) {
        cells[j].style.backgroundColor = "#edcf72";
        cells[j].style.color = "#f9f6f2";
      } else if (value === 256) {
        cells[j].style.backgroundColor = "#edcc61";
        cells[j].style.color = "#f9f6f2";
      } else if (value === 512) {
        cells[j].style.backgroundColor = "#edc850";
        cells[j].style.color = "#f9f6f2";
      } else if (value === 1024) {
        cells[j].style.backgroundColor = "#edc53f";
        cells[j].style.color = "#f9f6f2";
      } else if (value >= 2048) {
        cells[j].style.backgroundColor = "#edc22e";
        cells[j].style.color = "#f9f6f2";
      } else {
        cells[j].style.backgroundColor = "#faf8ef";
        cells[j].style.color = "#faf8ef";
      }
    }
  }
}

// initialize table
for (let i = 0; i < cells.length; i++) {
  cells[i].innerHTML = "0";
  colorCells();
}

// add event listeners
document.getElementById("add-random").addEventListener("click", addRandom);
document.getElementById("move-left").addEventListener("click", moveLeft);
document.getElementById("move-right").addEventListener("click", moveRight);
