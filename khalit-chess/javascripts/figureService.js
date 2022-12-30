function handlePawn(color, figure) {
    figure.removePrevious();
    let movesAndTakes = collectMovesPawn(color, figure);
    let availableCells = movesAndTakes[0];
    let takes = movesAndTakes[1];
    figure.populateAvailable(availableCells);
    figure.handleTakes(takes);
}

function collectMovesPawn(color, figure) {
    let result = new Array();
    let moves = new Array();
    let takes = new Array();
    const column = figure.id.charAt(1);
    const row = figure.id.charAt(0);
    let firstCellId;
    let takeFirstId;
    let takeSecondId;
    if (color === "white") {
        firstCellId = (Number(row) + 1) + column;
        takeFirstId = (Number(row) + 1) + (Number(column) + 1).toString();
        takeSecondId = (Number(row) + 1) + (Number(column) - 1).toString();
    }
    else {
        firstCellId = (Number(row) - 1) + column;
        takeFirstId = (Number(row) - 1) + (Number(column) + 1).toString();
        takeSecondId = (Number(row) - 1) + (Number(column) - 1).toString();
    }
    if (isValidMove(firstCellId)) {
        if (document.getElementById(firstCellId).innerHTML != "") return;
        moves.push(firstCellId);
    }
    if (moves.length != 0) {
        let secondCellId;
        if (figure
            .id.charAt(0) === "2" && figure.type.split(" ")[0] === 'white') {
            secondCellId = "4" + column;
        }
        else if (figure.id.charAt(0) === "7" && figure.type.split(" ")[0] === 'black') {
            secondCellId = "5" + column;
        }
        if (typeof secondCellId != 'undefined' && secondCellId != null) {
            if (document.getElementById(secondCellId).innerHTML == "") {
                moves.push(secondCellId);
            }
        }
    }

    if (isValidTake(takeFirstId, color)) {
        takes.push(takeFirstId);
    }
    if (isValidTake(takeSecondId, color)) {
        takes.push(takeSecondId);
    }

    result.push(moves);
    result.push(takes);
    return result;
}




function isValidMove(figureId) {
    if (document.getElementById(figureId) === null || figureId === 'undefined') return false;
    const cell = document.getElementById(figureId);
    return cell.innerHTML === "";
}

function isValidTake(figureId, currentColor) {
    if (document.getElementById(figureId) === null || figureId === 'undefined') return false;
    const cell = document.getElementById(figureId);
    if (cell.innerHTML == "") return false;
    else {
        if (cell.childNodes[0].className == "dot") return false;
        let htmlOfTaken = cell.innerHTML.codePointAt(0);
        let colorOfTaken = htmlToFigures[htmlOfTaken].split(" ")[0]; 
        return currentColor != colorOfTaken;
    }
}

function processNext(nextId, moves, takes) {
    let next = document.getElementById(nextId);
    if (next.innerHTML === "") {
        moves.push(nextId);
        return true;
    } else if (next.innerHTML != "") {
        takes.push(nextId);
        return false;
    }
    return true;   
}

function handleBishop(color, figure) {
    figure.removePrevious();
    let movesAndTakes = collectMovesBishop(color, figure);
    figure.populateAvailable(movesAndTakes[0]);
    figure.handleTakes(movesAndTakes[1]);

}
/*
function checkIfBlocking(currentId, nextId, color) {
    let nextCell = document.getElementById(nextId);
    console.log(nextCell);
    if (nextCell != null && nextCell.innerHTML != "") {
        if ((color === "black" && htmlToFigures[nextCell.innerText.codePointAt(0)].split(" ")[1] === "king") ||
            (color === "white" && htmlToFigures[nextCell.innerText.codePointAt(0)].split(" ")[1] === "king")) {
                game.blockingCellId = currentId;
        }
    }
}
*/

function collectMovesBishop(color, figure) {
    let result = new Array();
    let moves = new Array();
    let takes = new Array();
    const column = Number(figure.id.charAt(1));
    const row = Number(figure.id.charAt(0));
    let nextId1 = row + 1 + (column + 1).toString();
    let nextId2 = row + 1 + (column - 1).toString();
    let nextId3 = row - 1 + (column + 1).toString();
    let nextId4 = row - 1 + (column - 1).toString();
    //return array of two arrays of moves and takes in this one method
    while (isValidMove(nextId1) || isValidTake(nextId1, color) || 
    isValidMove(nextId2) || isValidTake(nextId2, color) || isValidMove(nextId3) ||
    isValidTake(nextId3, color) || isValidMove(nextId4) || isValidTake(nextId4, color)) { 
        if (isValidMove(nextId1)) {
            processNext(nextId1, moves, takes);
            let temp = nextId1;
            nextId1 = Number(nextId1.charAt(0)) + 1 + 
            (Number(nextId1.charAt(1)) + 1).toString();
            //checkIfBlocking(temp, nextId1, color);
        } else if (isValidTake(nextId1, color)) {
            processNext(nextId1, moves, takes);
            nextId1 = 'undefined';
        } else nextId1 = 'undefined';
        if (isValidMove(nextId2)) {
            processNext(nextId2, moves, takes);
            let temp = nextId2;
            nextId2 = Number(nextId2.charAt(0)) + 1 + 
            (Number(nextId2.charAt(1)) - 1).toString();
            //checkIfBlocking(temp, nextId2, color);
            
        } else if (isValidTake(nextId2, color)) {
            processNext(nextId2, moves, takes);
            nextId2 = 'undefined';
        } else nextId2 = 'undefined';
        if (isValidMove(nextId3)) {
            processNext(nextId3, moves, takes);
            let temp = nextId3;
            nextId3 = Number(nextId3.charAt(0)) - 1 + 
            (Number(nextId3.charAt(1)) + 1).toString();
            //checkIfBlocking(temp, nextId3, color);
        } else if (isValidTake(nextId3, color)) {
            processNext(nextId3, moves, takes);
            nextId3 = 'undefined';
        } else nextId3 = 'undefined';
        if (isValidMove(nextId4)) {
            processNext(nextId4, moves, takes);
            let temp = nextId4;
            nextId4 = Number(nextId4.charAt(0)) - 1 + 
            (Number(nextId4.charAt(1)) - 1).toString();
            //checkIfBlocking(temp, nextId4, color);
        } else if (isValidTake(nextId4, color)) {
            processNext(nextId4, moves, takes);
            nextId4 = 'undefined';
        } else nextId4 = 'undefined';
    }
    result.push(moves);
    result.push(takes);
    return result;
}

function handleRook(color, figure) {
    figure.removePrevious();
    let movesAndTakes = collectMovesRook(color, figure);
    figure.populateAvailable(movesAndTakes[0]);
    figure.handleTakes(movesAndTakes[1]);
}

function collectMovesRook(color, figure) {
    let result = new Array();
    let moves = new Array();
    let takes = new Array();
    const column = Number(figure.id.charAt(1));
    const row = Number(figure.id.charAt(0));
    let nextId1 = row + 1 + column.toString();          //forward
    let nextId2 = row - 1 + (column).toString();        //backwards
    let nextId3 = row + (column - 1).toString();        //to the left
    let nextId4 = row + (column + 1).toString();        //to the right
    //return array of two arrays of moves and takes in this one method
    while (isValidMove(nextId1, color) || isValidTake(nextId1, color) || 
    isValidMove(nextId2) || isValidTake(nextId2, color) || isValidMove(nextId3) ||
    isValidTake(nextId3, color) || isValidMove(nextId4) || isValidTake(nextId4, color)) { 
        if (isValidMove(nextId1)) {
            processNext(nextId1, moves, takes);
            nextId1 = Number(nextId1.charAt(0)) + 1 + nextId1.charAt(1);
        } else if (isValidTake(nextId1, color)) {
            processNext(nextId1, moves, takes);
            nextId1 = 'undefined';
        } else nextId1 = 'undefined';
        if (isValidMove(nextId2)) {
            processNext(nextId2, moves, takes);
            nextId2 = Number(nextId2.charAt(0)) - 1 + nextId2.charAt(1);
        } else if (isValidTake(nextId2, color)) {
            processNext(nextId2, moves, takes);
            nextId2 = 'undefined';
        } else nextId2 = 'undefined';
        if (isValidMove(nextId3)) {
            processNext(nextId3, moves, takes);
            nextId3 = nextId3.charAt(0) + (Number(nextId3.charAt(1)) - 1);
        } else if (isValidTake(nextId3, color)) {
            processNext(nextId3, moves, takes);
            nextId3 = 'undefined';
        } else nextId3 = 'undefined';
        if (isValidMove(nextId4)) {
            processNext(nextId4, moves, takes);
            nextId4 = nextId4.charAt(0) + (Number(nextId4.charAt(1)) + 1);
        } else if (isValidTake(nextId4, color)) {
            processNext(nextId4, moves, takes);
            nextId4 = 'undefined';
        } else nextId4 = 'undefined';
    }
    result.push(moves);
    result.push(takes);
    return result;
}

function handleQueen(color, figure) {
    figure.removePrevious();
    let movesAndTakes1 = collectMovesBishop(color, figure);
    let movesAndTakes2 = collectMovesRook(color, figure);
    figure.populateAvailable(movesAndTakes1[0].concat(movesAndTakes2[0]));
    figure.handleTakes(movesAndTakes1[1].concat(movesAndTakes2[1]));
}

function handleKnight(color, figure) {
    figure.removePrevious();
    let movesAndTakes = collectMovesKnight(color, figure);
    figure.populateAvailable(movesAndTakes[0]);
    figure.handleTakes(movesAndTakes[1]);
}

function collectMovesKnight(color, figure) {
    let result = new Array();
    let moves = new Array();
    let takes = new Array();
    const column = Number(figure.id.charAt(1));
    const row = Number(figure.id.charAt(0));
    let nextIds = new Array();
    nextIds.push(row + 2 + (column + 1).toString());  
    nextIds.push(row + 2 + (column - 1).toString()); 
    nextIds.push(row - 2 + (column + 1).toString()); 
    nextIds.push(row - 2 + (column - 1).toString()); 
    nextIds.push(row + 1 + (column + 2).toString()); 
    nextIds.push(row + 1 + (column - 2).toString()); 
    nextIds.push(row - 1 + (column + 2).toString()); 
    nextIds.push(row - 1 + (column - 2).toString());
    for (let id of nextIds) {
        if (isValidTake(id, color)) {
            takes.push(id);
        }
        else if (isValidMove(id)) {
            moves.push(id);
        }
    }   
    result.push(moves);
    result.push(takes);
    return result;
}

function handleKing(color, figure) {
    figure.removePrevious();
    let movesAndTakes = collectMovesKing(color, figure);
    figure.populateAvailable(movesAndTakes[0]);
    figure.handleTakes(movesAndTakes[1]);
}

function collectMovesKing(color, figure) {
    let result = new Array();
    let moves = new Array();
    let takes = new Array();
    const column = Number(figure.id.charAt(1));
    const row = Number(figure.id.charAt(0));
    let nextIds = new Array();
    nextIds.push(row + 1 + (column + 1).toString());  
    nextIds.push(row + 1 + (column - 1).toString());
    nextIds.push(row + 1 + column.toString());  
    nextIds.push(row + (column + 1).toString()); 
    nextIds.push(row + (column - 1).toString()); 
    nextIds.push(row - 1 + (column - 1).toString()); 
    nextIds.push(row - 1 + (column + 1).toString()); 
    nextIds.push(row - 1 + column.toString());
    for (let id of nextIds) {
        if (isValidTake(id, color)) {
            takes.push(id);
        }
        else if (isValidMove(id)) {
            moves.push(id);
        }
    }   
    result.push(moves);
    result.push(takes);
    return result;
}