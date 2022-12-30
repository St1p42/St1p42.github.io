class Game {
    constructor() {
        this.turn = "white";
        this.prevDotArray = new Array();
        this.prevTakesArray = new Array();
        this.prevTakesListeners = new Array();
        this.checkingFigure = null;
        this.prevCaptured = null;

        this.whiteTakes = new Array();
        this.blackTakes = new Array();
        this.whiteTakesMap = new Map();
        this.blackTakesMap = new Map();
        this.whiteMoves = new Map();
        this.blackMoves = new Map();
        // avalable moves and takes if the king is checked
        this.movesIfChecked = new Map();
        this.takesIfChecked = new Map();
        //
        this.whiteIsChecked = false;
        this.blackIsChecked = false;
        this.mate = false;
        this.checkingColor;
    }

    setPrevCaptured(figure) {
        this.prevCaptured = figure;
    }

    getPrevCaptured() {
        return this.prevCaptured;
    }

    pushToDotArray(cell) {
        this.prevDotArray.push(cell);
    }

    getDotArray() {
        return this.prevDotArray;
    }

    emptyDotArray() {
        this.prevDotArray = new Array();
    }

    getTakesArray() {
        return this.prevTakesArray;
    }

    setListeners(listeners) {
        this.prevTakesListeners = listeners;
    }

    getListeners() {
        return this.prevTakesListeners;
    }

    pushToTakesArray(cell) {
        this.prevTakesArray.push(cell);
    }
    
    emptyTakesArray() {
        this.prevTakesArray = new Array();
    }

    setTurn(color) {
        this.turn = color;
    }

    getTurn() {
        return this.turn;
    }

    styleDot() {
        let divWidth = document.getElementsByClassName("cell")[0].clientWidth;
        let dotSize = divWidth * 0.4;
        const dotArray = document.getElementsByClassName("dot");
        for (let dot of dotArray) {
            dot.style.width = dotSize.toString() + "px";
            dot.style.height = dotSize.toString() + "px";
        }
    }

    changeSideClickable(color) {
        let arrayToDisable;
        let arrayToEnable;
        if (color === "white") {
            arrayToDisable = document.querySelectorAll(".whiteFigure");
            arrayToEnable = document.querySelectorAll(".blackFigure");
            for (let cell of arrayToDisable) {
                cell.removeEventListener('click', captureCell);
            }
            for (let cell of arrayToEnable) {
                cell.addEventListener('click', captureCell);
            }
        }
        else if (color === "black") {
            arrayToDisable = document.querySelectorAll(".blackFigure");
            arrayToEnable = document.querySelectorAll(".whiteFigure");
            for (let cell of arrayToDisable) {
                cell.removeEventListener('click', captureCell);
            }
            for (let cell of arrayToEnable) {
                cell.addEventListener('click', captureCell);
            }
        }
        return;
    }
    resetTakesInfo() {
        this.whiteTakes = new Array();
        this.blackTakes = new Array();
        this.whiteMoves = new Map();
        this.blackMoves = new Map();
    }
    calculateAllTakes() {
        //get all white pieces
        //for each uset the switch to determine the type
        //calculate for each all of the takes by using corresponding collectMoves()[1]
        //add to one big array and set it to the game obj
        //do the same for black pieces
        let whitePieces = document.getElementsByClassName("whiteFigure");
        this.whiteTakes = new Array();
        this.blackTakes = new Array();
        this.whiteTakesMap = new Map();
        this.blackTakesMap = new Map();
        for (let whitePiece of whitePieces) {
            this.extractTakes(whitePiece);
        }
        let blackPieces = document.getElementsByClassName("blackFigure");
        for (let blackPiece of blackPieces) {
            this.extractTakes(blackPiece);
        }
    }

    extractTakes(piece) {
        const figureType = htmlToFigures[piece.innerText.codePointAt(0)];
        const figureHTML = '&' + '#' + piece.innerText.codePointAt(0) + ';';
        let pieceFigure = new Figure(piece.id, figureType, figureHTML);
        switch (pieceFigure.type) {
            case 'white king':
                let kingWhiteMT = collectMovesKing("white", pieceFigure);
                this.whiteTakes = this.whiteTakes.concat(kingWhiteMT[1]);
                this.putMovesAndTakesToMap("white", kingWhiteMT[0], kingWhiteMT[1], pieceFigure.id);
                break;
            case 'white queen':
                let rookWhiteMT = collectMovesRook("white", pieceFigure);
                let bishopWhiteMT = collectMovesBishop("white", pieceFigure);
                this.whiteTakes = this.whiteTakes.concat(rookWhiteMT[1]).concat(bishopWhiteMT[1]);
                this.putMovesAndTakesToMap("white", rookWhiteMT[0].concat(bishopWhiteMT[0]), rookWhiteMT[1].concat(bishopWhiteMT[1]), pieceFigure.id);
                break;
            case 'white rook':
                let rookWhiteMT1 = collectMovesRook("white", pieceFigure);
                this.whiteTakes = this.whiteTakes.concat(rookWhiteMT1[1]);
                this.putMovesAndTakesToMap("white", rookWhiteMT1[0], rookWhiteMT1[1], pieceFigure.id);
                break;
            case 'white bishop':
                let bishopWhiteMT1 = collectMovesBishop("white", pieceFigure);
                this.whiteTakes = this.whiteTakes.concat(bishopWhiteMT1[1]);
                this.putMovesAndTakesToMap("white", bishopWhiteMT1[0], bishopWhiteMT1[1], pieceFigure.id);
                break;
            case 'white knight':
                let knightWhiteMT = collectMovesKnight("white", pieceFigure);
                this.whiteTakes = this.whiteTakes.concat(knightWhiteMT[1]);
                this.putMovesAndTakesToMap("white", knightWhiteMT[0], knightWhiteMT[1], pieceFigure.id);
                break;
            case 'white pawn':
                let pawnWhiteMT = collectMovesPawn("white", pieceFigure);
                this.whiteTakes = this.whiteTakes.concat(pawnWhiteMT[1]);
                this.putMovesAndTakesToMap("white", pawnWhiteMT[0], pawnWhiteMT[1], pieceFigure.id);
                break;
            case 'black king':
                let kingBlackMT = collectMovesKing("black", pieceFigure);
                this.blackTakes = this.blackTakes.concat(kingBlackMT[1]);
                this.putMovesAndTakesToMap("black", kingBlackMT[0], kingBlackMT[1], pieceFigure.id);
                break;         
            case 'black queen':
                let rookBlackMT = collectMovesRook("black", pieceFigure);
                let bishopBlackMT = collectMovesBishop("black", pieceFigure);
                this.blackTakes = this.blackTakes.concat(rookBlackMT[1]).concat(bishopBlackMT[1]);
                this.putMovesAndTakesToMap("black", rookBlackMT[0].concat(bishopBlackMT[0]), rookBlackMT[1].concat(bishopBlackMT[1]), pieceFigure.id);
                break;
            case 'black rook':
                let rookBlackMT1 = collectMovesRook("black", pieceFigure);
                this.blackTakes = this.blackTakes.concat(rookBlackMT1[1]);
                this.putMovesAndTakesToMap("black", rookBlackMT1[0], rookBlackMT1[1], pieceFigure.id);
                break;
            case 'black bishop':
                let bishopBlackMT1 = collectMovesBishop("black", pieceFigure);
                this.blackTakes = this.blackTakes.concat(bishopBlackMT1[1]);
                this.putMovesAndTakesToMap("black", bishopBlackMT1[0], bishopBlackMT1[1], pieceFigure.id);
                break;
            case 'black knight':
                let knightBlackMT = collectMovesKnight("black", pieceFigure);
                this.blackTakes = this.blackTakes.concat(knightBlackMT[1]);
                this.putMovesAndTakesToMap("black", knightBlackMT[0], knightBlackMT[1], pieceFigure.id);
                break;
            case 'black pawn':
                let pawnBlackMT = collectMovesPawn("black", pieceFigure);
                this.blackTakes = this.blackTakes.concat(pawnBlackMT[1]);
                this.putMovesAndTakesToMap("black", pawnBlackMT[0], pawnBlackMT[1], pieceFigure.id);
                break;        
            default:
                break;    
        }
    }

    putMovesAndTakesToMap(color, movesToAdd, takesToAdd, figureId) {
        if (color === "white" && movesToAdd != null && movesToAdd != 'undefined' && movesToAdd.length != 0)  {
            this.whiteMoves.set(figureId, movesToAdd);
        }
        if (color === "white" && takesToAdd != null && takesToAdd != 'undefined' && takesToAdd.length != 0) {
            this.whiteTakesMap.set(figureId, takesToAdd);
        }
        if (color === "black" && movesToAdd != null && movesToAdd != 'undefined' && movesToAdd.length != 0) {
            this.blackMoves.set(figureId, movesToAdd);
        }
        if (color === "black" && takesToAdd != null && takesToAdd != 'undefined' && takesToAdd.length != 0) {
            this.blackTakesMap.set(figureId, takesToAdd);
        }
    }
    setState(identifyMate) {
        //set checked state to either true or false
        //if during the next move 
        //it is set as true, an array of incorrect moves will be calculated
        //and the piece will not be allowed to go there
        //if false - nothing happens
        //then iterate through the possible moves of the next mover and check if incorrect  contains all the moves
        //if so - alert pop up and refresh the page
        let whiteKingPosId = document.querySelector('.whiteFigure.king').id;
        let blackKingPosId = document.querySelector('.blackFigure.king').id;
        //also check for moves because they are potential takes (except for pawns)
        if (this.blackTakes.includes(whiteKingPosId)) {
            this.whiteIsChecked = true;
            this.checkingColor = "Black";
        }
        else {
            this.whiteIsChecked = false;
            this.checkingColor = "White";
        }
        if (this.whiteTakes.includes(blackKingPosId)) { // || Array.from(this.blackMoves.values()).includes(blackKingPosId)
            this.blackIsChecked = true;
        }
        else {
            this.blackIsChecked = false;
        }
        if (identifyMate && this.whiteIsChecked) {
            this.mate = this.gameMate("white");
        }
        else if (identifyMate && this.blackIsChecked) {
            this.mate = this.gameMate("black");
        }
        //identify the check by highligting the king to red for 1 second and disabling all the event listeners
    }
    //find incorrect moves (which still lead to check) and incorrect takes - find all the moves and 
    //for each calculate the opposite takes again, if still check, add to incorrect moves array
    //as soon as at least one is found set mate to false
    //else if iterated through the array of all possible moves and mate is still true then alert pop and refresh 
    //the window

    //finidng incorrect moves and takes - 
    //1) imitate the move or take just by adding to the destination
    //the random piece of your color (e.g. white) (changing id or classname)
    //2) calculate takes of opposite color once more given the first step, add to incorrect if king is still found
    //3) revert changes in step 1
    //4) repeat the same for every possible move found from possible moves

    gameMate(checkedColor) {
        let allMoves;
        let allTakes;
        if (checkedColor == "white") {
            allMoves = new Map(this.whiteMoves);
            allTakes = new Map(this.whiteTakesMap)
        }
        else {
            allMoves = new Map(this.blackMoves);
            allTakes = new Map(this.blackTakesMap);
        }
        let mate = true;
        let possibleMoves = new Map();
        let possibleTakes = new Map();
        for (let [from, toArray] of allMoves) {
            for (let to of toArray) {
                if (this.mimic(checkedColor, from, to)) {
                    console.log("possible move is from " + from + " to " + to);
                    mate = false;
                    possibleMoves.set(from, to);
                }
            }
        }

        for (let [from, toArray] of allTakes) {
            for (let to of toArray) {
                if (this.mimic(checkedColor, from, to)) {
                    console.log("possible take is from " + from + " to " + to);
                    mate = false;
                    possibleTakes.set(from, to);
                }
            }
        }

        this.mate = mate;
        this.movesIfChecked = possibleMoves;
        this.takesIfChecked = possibleTakes;
        console.log("The mate status is: " + this.mate + "\n------");
        return mate;
    }

    /**
     * Mimics the move from one cell to another, then checks whether the checked color is 
     * still checked, and then returns everything to the initial state.
     * 
     * Verifying the check status occurs via calculateAllTakes function for the opposite color
     * @param {*} checkedColor - color of a checked side
     * @param {*} from - cell id from which the move starts
     * @param {*} to  - cell id representing the destination
     * @returns whether the mimicked move gets rid of the current check (the move is possible)
     */
    mimic(checkedColor, from, to) {
        let tempWhiteTakes = this.whiteTakes;
        let tempBlackTakes = this.blackTakes;
        let tempWhiteMoves = this.whiteMoves;
        let tempBlackMoves = this.blackMoves;
        let tempWhiteStatus = this.whiteIsChecked;
        let tempBlackStatus = this.blackIsChecked;

        //change the classname and inner html so that calculateAllTakes() works as intented 
        let fromCell = document.getElementById(from);
        let toCell = document.getElementById(to);
        let tempToCellClassName = toCell.className;
        let tempToCellHtml = toCell.innerHTML;
        let tempFromCellHtml = fromCell.innerHTML;
        let tempFromCellClassName = fromCell.className;
        toCell.innerHTML = fromCell.innerHTML;
        toCell.className = fromCell.className;
        fromCell.innerHTML = "";
        fromCell.className = fromCell.classList[0] + " " 
        + fromCell.classList[1];
        this.calculateAllTakes();   //concats in calculateTakes() so when recalculating takes the king cell is still in there so no blocking possible
        this.setState(false);
        let answer = true;

        //check if still checked
        if (checkedColor == "white") {
            //check if king is still under attack
            if (this.whiteIsChecked == true) answer = false;
        }
        //if color is black
        else  {
            if (this.blackIsChecked == true) answer = false;
        }

        //convert everything back
        this.whiteIsChecked = tempWhiteStatus;
        this.blackIsChecked = tempBlackStatus;
        this.whiteTakes = tempWhiteTakes;
        this.blackTakes = tempBlackTakes;
        this.whiteMoves = tempWhiteMoves;
        this.blackMoves = tempBlackMoves;
        fromCell.innerHTML = tempFromCellHtml;
        fromCell.className = tempFromCellClassName;
        toCell.innerHTML = tempToCellHtml;
        toCell.className = tempToCellClassName;

        return answer;
    }

    //DEBUG
    /*
    notLeadingToCheck(prevId, nextId) {
        let prev = document.getElementById(prevId);
        let prevHtml = prev.innerHTML;
        let prevClass = prev.className;

        let tempWhiteTakes = this.whiteTakes;
        let tempBlackTakes = this.blackTakes;
        let tempWhiteMoves = this.whiteMoves;
        let tempBlackMoves = this.blackMoves;
        let tempWhiteStatus = this.whiteIsChecked;
        let tempBlackStatus = this.blackIsChecked;

        let toCell = document.getElementById(nextId);
        let tempToCellClassName = toCell.className;
        let tempToCellHtml = toCell.innerHTML;

        toCell.innerHTML = prev.innerHTML;
        toCell.className = prev.className;

        let movingColor = prev.classList[2];
        prev.innerHTML = "";
        prev.className = prev.classList[0] + " " 
        + prev.classList[1];
        this.calculateAllTakes(); 
        this.setState(false);
        let answer = true;
        
        //check if still checked
        if (movingColor == "whiteFigure") {
            //check if king is still under attack
            if (this.whiteIsChecked == true) answer = false;
        }
        //if color is black
        else  {
            if (this.blackIsChecked == true) answer = false;
        }
        this.whiteIsChecked = tempWhiteStatus;
        this.blackIsChecked = tempBlackStatus;
        this.whiteTakes = tempWhiteTakes;
        this.blackTakes = tempBlackTakes;
        this.whiteMoves = tempWhiteMoves;
        this.blackMoves = tempBlackMoves;
        prev.innerHTML = prevHtml;
        prev.className = prevClass;
        toCell.innerHTML = tempToCellHtml;
        toCell.className = tempToCellClassName;
        console.log("hello")
        return answer;
    }
    */


}