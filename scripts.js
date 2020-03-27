// let board = [["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]];
// let board = [[".", ".", ".", ".", ".", ".", ".", ".", "."],[".", ".", ".", ".", ".", ".", ".", ".", "."],[".", ".", ".", ".", ".", ".", ".", ".", "."],[".", ".", ".", ".", ".", ".", ".", ".", "."],[".", ".", ".", ".", ".", ".", ".", ".", "."],[".", ".", ".", ".", ".", ".", ".", ".", "."],[".", ".", ".", ".", ".", ".", ".", ".", "."],[".", ".", ".", ".", ".", ".", ".", ".", "."],[".", ".", ".", ".", ".", ".", ".", ".", "."]];

function renderBoard(board) {
    // Reset first
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[0].length; col++) {
            let elemName = "" + row + "-" + col;
            // default white squares
            document.getElementById(elemName).value = "";
            document.getElementById(elemName).style.backgroundColor = "white"; 
            document.getElementById(elemName).style.color = "black";
            document.getElementById(elemName).readOnly = false;
        }
    }
    
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[0].length; col++) {
            if (board[row][col] !== ".") {
                // Filled values for starting out
                let elemName = "" + row + "-" + col;
                document.getElementById(elemName).value = board[row][col];
                document.getElementById(elemName).style.backgroundColor = "lightgray"; // make filled elements some light gray color
                document.getElementById(elemName).readOnly = true;
            }
        }
    }
}

function renderAnswer(originalBoard, solvedBoard) {
    for (let row = 0; row < solvedBoard.length; row++) {
        for (let col = 0; col < solvedBoard[0].length; col++) {
            let elemName = "" + row + "-" + col;
            if (document.getElementById(elemName).value != solvedBoard[row][col]) {
                // Incorrect answer, print it red
                document.getElementById(elemName).value = solvedBoard[row][col];
                document.getElementById(elemName).style.color = "red";
                document.getElementById(elemName).style.backgroundColor = "rgb(236, 236, 236)"; // can't edit answer by changing it to another color
                document.getElementById(elemName).readOnly = true;
            } else {
                // If it is the same and was not on original board, then it is correct user input
                if (originalBoard[row][col] == ".") {
                    document.getElementById(elemName).style.color = "limegreen";
                    document.getElementById(elemName).style.backgroundColor = "rgb(236, 236, 236)";
                    document.getElementById(elemName).readOnly = true;
                }
            }
        }
    }
}

window.onload = function() {
    let board = this.setBoard();
    document.getElementById("checkBtn").addEventListener("click", () => {this.checkBoardAndUpdate()}, false);
    document.getElementById("solveBtn").addEventListener("click", () => {solveAndRenderAnswer(board)}, false);
    document.getElementById("resetBtn").addEventListener("click", () => {board = this.setBoard()}, false);
}


// let inputs = document.getElementsByTagName('input');
// for (let i = 0; i < inputs.length; i++) {
//     inputs[i].addEventListener("onkeypress", (e) => {return this.isNumberKey(e)}, false);
// }

// Function to make sure that only numbers can be put into the sudoku board and that any number overwrites previous numbers
function isNumberKey(event) {
    // console.log(event);
    // Make sure we can only enter 1-9 on white squares (can't modify lightgray squares)
    if (event.key.match('[1-9]') && event.target.style.backgroundColor == "white") {
        event.target.value = event.key;
        return true;
    } else if (event.key.match('Backspace')) {
        return true;
    } else if (event.key.match('Tab')) {
        return true;
    }
    // event.target.value = "";
    return false;
}

function generateBoard() {
    let randomFirstRow = [];
    let firstRowElems = {};
    for (let i = 0; i < 9; i++) {
        let randomInt = Math.floor(Math.random() * (10 - 1) + 1);
        // Make sure randomInt is new
        while (randomInt in firstRowElems) {
            randomInt = Math.floor(Math.random() * (10 - 1) + 1);
        }
        firstRowElems[randomInt] = 1; // Put new elem in map
        randomFirstRow.push("" + randomInt);
    }
    // console.log(randomFirstRow);
    
    let outerArray = [];
    outerArray.push(randomFirstRow);
    for (let i = 0; i < 8; i++) {
        outerArray.push([".", ".", ".", ".", ".", ".", ".", ".", "."]);
    }
    solveSudoku(outerArray);

    // Remove spaces from solved sudoku; Need at least 17 spaces
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    // let randomRemovals = Math.floor(Math.random() * (60 - 50 + 1) + 50); // random int btw 50 to 60 inclusive
    let randomRemovals = 53; // Always remove 53 squares, leaving 28 squares
    let removalsMap = {};
    for (let i = 0; i < randomRemovals; i++) {
        let ret = findUniqueRemovals(removalsMap)
        let temp = outerArray[ret.randomRow][ret.randomCol];
        outerArray[ret.randomRow][ret.randomCol] = ".";
        let counter = 0;
        let shouldSet = true;
        while (findAllSolutions(outerArray).solutions > 1) {
            console.log("> 1 solution found, recalculating...");
            outerArray[ret.randomRow][ret.randomCol] = temp;
            // if (i > 54 && counter > 8) {
            //     console.log("Break");
            //     shouldSet = false;
            //     break;
            // }
            if (counter > 40) {
                window.location.reload(false); // Refresh the page
            } 
            ret = findUniqueRemovals(removalsMap);
            temp = outerArray[ret.randomRow][ret.randomCol];
            outerArray[ret.randomRow][ret.randomCol] = ".";
            counter++;
        }
        console.log(i);

        if (shouldSet) {
            let str = ret.randomRow + "," + ret.randomCol;
            removalsMap[str] = 1;
            // outerArray[ret.randomRow][ret.randomCol] = ".";
        } else {
            break;
        }
    }

    let cheats = [];
    for (let i = 0; i < outerArray.length; i++) {
        cheats.push([...outerArray[i]]);
    }

    solveSudoku(cheats);
    console.log(cheats);
    return outerArray;
}

function findUniqueRemovals(removalsMap) {
    let randomRow = Math.floor(Math.random() * (9)); // Pick between 0 - 9
    let randomCol = Math.floor(Math.random() * (9)); // Pick between 0 - 9
    let str = randomRow + "," + randomCol;
    // Make sure remove coordinate is new
    while (str in removalsMap) {
        randomRow = Math.floor(Math.random() * (9)); // Pick between 0 - 9
        randomCol = Math.floor(Math.random() * (9)); // Pick between 0 - 9
        str = randomRow + "," + randomCol;
    }
    return {randomRow, randomCol};
}

// Solve the current sudoku and render the answer
function solveAndRenderAnswer(board) {
    let originalBoard = [];
    for (let i = 0; i < board.length; i++) {
        originalBoard.push([...board[i]]);
    }
    solveSudoku(board);
    document.getElementById("checkBtn").disabled = true; // Cannot check once it is solved
    document.getElementById("solveBtn").disabled = true;
    renderAnswer(originalBoard, board);
}

// Generate a new board and render it
function setBoard() {
    let board = generateBoard();
    renderBoard(board);
    document.getElementById("checkBtn").disabled = false;
    document.getElementById("solveBtn").disabled = false;
    document.getElementById("resetBtn").disabled = true;
    setTimeout(enableReset, 7000); // Re-enable reset button after 7 seconds to prevent abuse
    return board;
}

// Re-enable reset button
function enableReset() {
    document.getElementById("resetBtn").disabled = false;
}

function checkBoardAndUpdate() {
    if (checkValidBoard()) {
        // Player has solved the puzzle, update score
        let str = document.getElementById("score").innerHTML;
        let strArr = str.split(":");
        let score = strArr[1];
        let newScore = parseInt(score) + 1;
        document.getElementById("score").innerHTML = strArr[0] + ": " + newScore;
        // Prevent player from checking again once it is valid
        document.getElementById("checkBtn").disabled = true;
        // document.getElementById("solveBtn").disabled = true;
        alert("You solved it!");
    } else {
        // Wrong solution, update attempts
        let str = document.getElementById("attempts").innerHTML;
        let strArr = str.split(":");
        let attempts = strArr[1];
        let newAttempts = parseInt(attempts) + 1;
        document.getElementById("attempts").innerHTML = strArr[0] + ": " + newAttempts;
        alert("Please try again.");
    }
}

function checkValidBoard() {
    let rowMap = new Map();
    for (let i = 0; i < 9; i++) {
        rowMap.set(i, {}); // Initialize rowMap, use objects instead of array
    }
    let colMap = new Map();
    for (let i = 0; i < 9; i++) {
        colMap.set(i, {}); // Initialize colMap
    }
    let subGridMap = new Map();
    for (let i = 0; i < 9; i++) {
        subGridMap.set(i, {}); // Initialize subGridMap
    }
    // Iterate through to get data on rows, columns, and subgrid
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            let elemName = "" + row + "-" + col;
            let val = document.getElementById(elemName).value;
            if (val == "") {
                // return false;
            } else {
                let currRow = rowMap.get(row);
                // Build rowMap horizontally
                currRow[val] = 1;  
                // Build colMap vertically
                let colArr = colMap.get(col);
                colArr[val] = 1;
                // Build subgrid
                let gridNum = mapCoordToGridNum(row, col);
                let currArr = subGridMap.get(gridNum);
                currArr[val] = 1;
            }
        }
    }

    // console.log(rowMap, colMap, subGridMap);
    
    for (let values of rowMap.values()) {
        let keySum = 0;
        for (let key in values) {
            keySum += parseInt(key)
        }
        if (keySum != 45) {
            return false;
        }
    }

    for (let values of colMap.values()) {
        let keySum = 0;
        for (let key in values) {
            keySum += parseInt(key)
        }
        if (keySum != 45) {
            return false;
        }
    }

    for (let values of subGridMap.values()) {
        let keySum = 0;
        for (let key in values) {
            keySum += parseInt(key)
        }
        if (keySum != 45) {
            return false;
        }
    }
    return true;
}

/**
 * @param {character[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
 */
function solveSudoku(board) {
    let rowMap = new Map();
    for (let i = 0; i < 9; i++) {
        rowMap.set(i, []); // Initialize rowMap
    }
    let colMap = new Map();
    for (let i = 0; i < 9; i++) {
        colMap.set(i, []); // Initialize colMap
    }
    let subGridMap = new Map();
    for (let i = 0; i < 9; i++) {
        subGridMap.set(i, []); // Initialize subGridMap
    }
    
    iterateBoard(board, rowMap, colMap, subGridMap);
    recursiveSolve(board, 0, 0, rowMap, colMap, subGridMap);
};

function recursiveSolve(board, row, col, rowMap, colMap, subGridMap) {
    if (row == board.length - 1 && col == board[0].length) {
        // Finished board
        return true;
    }
    if (col == board[0].length) {
        // At the end of row
        row++;
        col = 0;
    }
    if (board[row][col] == '.') {
        let possibilities = new Map();
        for (let i = 1; i <= 9; i++) {
            possibilities.set(i, 1);
        }
        let gridNum = mapCoordToGridNum(row, col);
        checkRow(row, rowMap, possibilities);
        checkCol(col, colMap, possibilities);
        checkGrid(gridNum, subGridMap, possibilities);
        for (let key of possibilities.keys()) {
            let keyStr = "" + key;
            board[row][col] = keyStr;
            let currRow = rowMap.get(row);
            currRow.push(keyStr); // Add possibility to current row
            let currCol = colMap.get(col);
            currCol.push(keyStr); // Add poss to current column
            let currGrid = subGridMap.get(gridNum);
            currGrid.push(keyStr);
            let valid = recursiveSolve(board, row, col + 1, rowMap, colMap, subGridMap);
            if (!valid) {
                // Reset everything
                currRow.pop(keyStr);
                currCol.pop(keyStr);
                currGrid.pop(keyStr);
                board[row][col] = '.';
            } else {
                return true;
            }
        }
        return false; // Could not find any possibility 1-9 that fits this criteria for this cell    
    } else {
        return recursiveSolve(board, row, col+1, rowMap, colMap, subGridMap);
    }
}

// List of helper methods to solve sudoku
function mapCoordToGridNum(row, col) {
    if (row < 3) {
        if (col < 3) {
            return 0;
        } else if (col < 6) {
            return 1;
        } else {
            return 2;
        }
    } else if (row < 6) {
        if (col < 3) {
            return 3;
        } else if (col < 6) {
            return 4;
        } else {
            return 5;
        }
    } else {
        if (col < 3) {
            return 6;
        } else if (col < 6) {
            return 7;
        } else {
            return 8;
        }
    }
}

function checkRow(row, rowMap, possibilities) {
    let currRow = rowMap.get(row);
    for (let i = 0; i < currRow.length; i++) {
        if (possibilities.has(Number(currRow[i]))) {
            possibilities.delete(Number(currRow[i]));    
        }
    }
}

function checkCol(col, colMap, possibilities) {
    let currCol = colMap.get(col);
    for (let i = 0; i < currCol.length; i++) {
        if (possibilities.has(Number(currCol[i]))) {
            possibilities.delete(Number(currCol[i]));    
        }
    }    
}

function checkGrid(gridNum, subGridMap, possibilities) {
    let currGrid = subGridMap.get(gridNum);
    for (let i = 0; i < currGrid.length; i++) {
        if (possibilities.has(Number(currGrid[i]))) {
            possibilities.delete(Number(currGrid[i]));    
        }
    }
}

function iterateBoard(board, rowMap, colMap, subGridMap) {
    for (let row = 0; row < board.length; row++) {
        let currRow = rowMap.get(row);
        for (let col = 0; col < board[0].length; col++) {
            if (board[row][col] !== '.') {
                // Build rowMap horizontally
                currRow.push(board[row][col]);  
                // Build colMap vertically
                let colArr = colMap.get(col);
                colArr.push(board[row][col]);
                // Build subgrid
                buildSubGridMap(row, col, board[row][col], subGridMap);
            }
        }
    }
}

function buildSubGridMap(row, col, val, subGridMap) {
    // Build subGridMap by checking row and col
    let gridNum = mapCoordToGridNum(row, col);
    let currArr = subGridMap.get(gridNum);
    currArr.push(val);
}

function findAllSolutions(board) {
    let rowMap = new Map();
    for (let i = 0; i < 9; i++) {
        rowMap.set(i, []); // Initialize rowMap
    }
    let colMap = new Map();
    for (let i = 0; i < 9; i++) {
        colMap.set(i, []); // Initialize colMap
    }
    let subGridMap = new Map();
    for (let i = 0; i < 9; i++) {
        subGridMap.set(i, []); // Initialize subGridMap
    }

    iterateBoard(board, rowMap, colMap, subGridMap);
    let answer = [];
    let ret = recursiveSolve2(board, 0, 0, rowMap, colMap, subGridMap, 0, answer);
    // console.log(answer);
    // for (let row = 0; row < answer.length; row++) {
    //     for (let col = 0; col < answer[0].length; col++) {
    //         board[row][col] = answer[row][col];
    //     }
    // }
    return ret;
}

// Slower but can find all possibilities recursiveSolve
function recursiveSolve2(board, row, col, rowMap, colMap, subGridMap, numSolutions, copyBoard) {
    if (row == board.length - 1 && col == board[0].length) {
        // Finished board
        // Copy over valid solution
        let answer = [];
        for (let i = 0; i < board.length; i++) {
            answer.push([...board[i]]);
        }
        copyBoard.push(answer);
        return {solved: true, solutions: numSolutions + 1};
    }
    if (col == board[0].length) {
        // At the end of row
        row++;
        col = 0;
    }
    if (board[row][col] == '.') {
        let possibilities = new Map();
        for (let i = 1; i <= 9; i++) {
            possibilities.set(i, 1);
        }
        let gridNum = mapCoordToGridNum(row, col);
        checkRow(row, rowMap, possibilities);
        checkCol(col, colMap, possibilities);
        checkGrid(gridNum, subGridMap, possibilities);
        // console.log(possibilities, row, col);
        let tempSoln = numSolutions;
        let tempSolved = false;
        for (let key of possibilities.keys()) {
            let keyStr = "" + key;
            // console.log(keyStr);
            board[row][col] = keyStr;
            let currRow = rowMap.get(row);
            currRow.push(keyStr); // Add possibility to current row
            let currCol = colMap.get(col);
            currCol.push(keyStr); // Add poss to current column
            let currGrid = subGridMap.get(gridNum);
            currGrid.push(keyStr);
            let ret = recursiveSolve2(board, row, col + 1, rowMap, colMap, subGridMap, tempSoln, copyBoard);
            if (ret.solved) {
                tempSolved = true;
                tempSoln = ret.solutions; // Add solutions for future
            }
            // Reset everything every run for next iteration
            currRow.pop(keyStr);
            currCol.pop(keyStr);
            currGrid.pop(keyStr);
            board[row][col] = '.';
        }
        return {solved: tempSolved, solutions: tempSoln}; // Find all possibilities   
    } else {
        return recursiveSolve2(board, row, col+1, rowMap, colMap, subGridMap, numSolutions, copyBoard);
    }
}