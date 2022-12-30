//keep on server and then export via require
class Figure {
    constructor(id, type, html) {
        this.id = id;      //e.g. 42 (where 4 is row num and 2 is a column num)
        this.type = type;  //e.g. white pawn
        this.html = html;  //e.g. &#9817;
    }

    getId() {
        return this.id;
    }
    
    equals(figure) {
        if (figure === null) return false;
        return this.id === figure.id && this.type === figure.type && this.html == figure.html;
    }

    possibleMoves() {
        switch (this.type) {
            case 'white king':
                handleKing("white", this);
                break;
            case 'white queen':
                handleQueen("white", this);
                break;
            case 'white rook':
                handleRook("white", this);
                break;
            case 'white bishop':
                handleBishop("white", this);
                break;
            case 'white knight':
                handleKnight("white", this);
                break;
            case 'white pawn':
                handlePawn("white", this);
                break;
            case 'black king':
                handleKing("black", this);
                break;            
            case 'black queen':
                handleQueen("black", this);
                break;
            case 'black rook':
                handleRook("black", this);
                break;
            case 'black bishop':
                handleBishop("black", this);
                break;
            case 'black knight':
                handleKnight("black", this);
                break;
            case 'black pawn':
                handlePawn("black", this);
                break;               
            default:
                break;    
        }
    }

    populateAvailable(availableCells) {
        if (availableCells.length === 0) return; 
        let getRidOfPrevTakes = this.getRidOfPrevTakes;
        getRidOfPrevTakes();
        let dotArray = game.getDotArray();

        for (let dotCell of dotArray) {
            let newCell = dotCell.cloneNode(true);
            dotCell.replaceWith(newCell);  
        }

        game.emptyDotArray();
        const prevCell = document.getElementById(this.id);
        const html = this.html;
        const type = this.type;
        const movingColor = (prevCell.classList[2] == "whiteFigure") ? "white" : "black";

        for (let id of availableCells) {
            let nextCell = document.getElementById(id);
            if (game.whiteIsChecked || game.blackIsChecked) {
                if (game.movesIfChecked.get(prevCell.id) != "undefined" && game.movesIfChecked.get(prevCell.id) == nextCell.id) nextCell.addEventListener('click', moveCell);
            } else {
                if (game.mimic(movingColor, prevCell.id, nextCell.id)) {
                    nextCell.addEventListener('click', moveCell);
                }
            }
        }

        for (let id of availableCells) {
            let dot1 = document.createElement("div");
            dot1.className = "dot";
            let nextCell = document.getElementById(id);
            nextCell.appendChild(dot1);
        }

        game.styleDot();
        const dots = document.querySelectorAll(".dot");
        let cells = new Array();
        let count = 0;
        for (let dot of dots) {
            cells.push(dot.parentNode);
        }
        for (let cell of cells) {
            game.pushToDotArray(cell);
        }
        function moveCell() {
            getRidOfPrevTakes();
            for (let dot of dots) {
                dot.parentNode.removeEventListener('click', moveCell);
                dot.remove();
            }
            if (this.id.charAt(0) == 8 && htmlToFigures[prevCell.innerHTML.codePointAt(0)] == "white pawn") {
                this.innerHTML = "&#9813;"
            }
            else if (this.id.charAt(0) == 1 && htmlToFigures[prevCell.innerHTML.codePointAt(0)] == "black pawn") {
                this.innerHTML = "&#9819;"
            } else {    
                this.innerHTML = html;
            }
            prevCell.innerHTML = "";
            this.className += " " + prevCell.classList[2] + " " + prevCell.classList[3];
            this.addEventListener('click', captureCell);
            /*
            const figureType = htmlToFigures[this.innerText.codePointAt(0)];
            const figureHTML = '&' + '#' + this.innerText.codePointAt(0) + ';';
            let newFigure = new Figure(this.id, figureType, figureHTML);
            */
            prevCell.className = prevCell.classList[0] + " " + 
            prevCell.classList[1];
            if (game.getTurn() === "white") {
                game.setTurn("black");
                game.changeSideClickable("white");
            }
            else {
                game.setTurn("white");
                game.changeSideClickable("black");
            }
            game.resetTakesInfo();
            game.calculateAllTakes();
            game.setState(true);
            if (game.mate == true) {
                setTimeout(function() {
                    alert(game.checkingColor + " pieces have won!");
                    location.reload();
                }, 100);
                // reload the page here
                //ADD FUNCITONALITY - Don't allow moves which open up the king leading to the check
            }
            //console.log(game.blockingCellId);
        }
    }
    /*
    checkIfChecks() {
        let color = this.type.split(" ")[0];
        let takes;
        switch (this.type.split(" ")[1]) {
            case 'king':
                takes = collectMovesKing(color, this)[1];
                break;
            case 'queen':
                let movesAndTakes1 = collectMovesBishop(color, this);
                let movesAndTakes2 = collectMovesRook(color, this);
                takes = movesAndTakes1[1].concat(movesAndTakes2[1]);
                break;
            case 'rook':
                takes = collectMovesRook(color, this)[1];
                break;
            case 'bishop':
                takes = collectMovesBishop(color, this)[1];
                break;
            case 'knight':
                takes = collectMovesKnight(color, this)[1];
                break;
            case 'pawn':
                takes = collectMovesPawn(color, this)[1];
                break;      
            default:
                break;    
        }
        for (let take of takes) {
            let takeCell = document.getElementById(take);
            console.log(takeCell);
            if (htmlToFigures[takeCell.innerText.codePointAt(0)].split(" ")[1] === "king") {
                game.checkingFigure = this;
                return true;
            }
        }
        return false;
    }
    */
    getRidOfPrevTakes() {
        let prevTakes = game.getTakesArray();
        let prevListeners = game.getListeners();
        for (let prevTake of prevTakes) {
            prevTake.removeEventListener('mouseover', prevListeners[0]);
            prevTake.removeEventListener('mouseout', prevListeners[1]);
            prevTake.removeEventListener('click', prevListeners[2]);
            colorBack(prevTake);
        }
        game.emptyTakesArray();
    }

    removePrevious() {
        const dots = document.querySelectorAll(".dot");
        for (let dot of dots) {
            dot.remove();
        }
    }

    handleTakes(possibleTakes) {
        if (possibleTakes.length === 0) return;
        let listeners = [colorOnTake, colorBackTake, moveCell];
        game.setListeners(listeners);
        let currentColor = this.type.split(" ")[0];
        let allValidTakes = new Array();
        let prevCell = document.getElementById(this.id);
        const html = this.html;

        for (let take of possibleTakes) {
            let takeCell = document.getElementById(take);
            let htmlOfTaken = takeCell.innerHTML.codePointAt(0);
            let colorOfTaken = htmlToFigures[htmlOfTaken];
            if (colorOfTaken != 'undefined' && 
            takeCell.innerHTML != "" ) {
                colorOfTaken = colorOfTaken.split(" ")[0];
                if (colorOfTaken != currentColor) {
                    allValidTakes.push(takeCell);
                }
            }
        }

        function colorOnTake(event) {
            event.stopPropagation();
            colorRed(this);
        }

        function colorBackTake(event) {
            event.stopPropagation();
            colorPink(this);
        }
        /*
        for (let validTake of allValidTakes) {
            game.pushToTakesArray(validTake);
            validTake.style.background = 'rgb(255,128,128)';
            validTake.addEventListener('mouseover', colorOnTake);
            validTake.addEventListener('mouseout', colorBackTake);
            //validTake.addEventListener('click', moveCell);

            if (game.whiteIsChecked || game.blackIsChecked) {
                if (game.takesIfChecked.get(prevCell.id) != "undefined" && game.takesIfChecked.get(prevCell.id) == validTake.id) {
                    validTake.addEventListener('click', moveCell);
                }
            }
            else {
                if (game.notLeadingToCheck(prevCell.id)) validTake.addEventListener('click', moveCell);
            }
            
        }
        */
        for (let validTake of allValidTakes) {
            game.pushToTakesArray(validTake);
            validTake.style.background = 'rgb(255,128,128)';
            validTake.addEventListener('mouseover', colorOnTake);
            validTake.addEventListener('mouseout', colorBackTake);
        }

        for (let validTake of allValidTakes) {
            if (game.whiteIsChecked || game.blackIsChecked) {
                if (game.takesIfChecked.get(prevCell.id) != "undefined" && game.takesIfChecked.get(prevCell.id) == validTake.id) {
                    validTake.addEventListener('click', moveCell);
                }
            }
            else {
                if (game.mimic(currentColor, prevCell.id, validTake.id)) {
                    validTake.addEventListener('click', moveCell);;
                }
            }
        }
  
        let dotArray = game.getDotArray();
        game.emptyDotArray();

        function colorRed(cell) {
            cell.style.background = "rgb(255, 102, 0)";
        }

        function colorPink(cell) {
            cell.style.background = 'rgb(255,102,102)';
        }

        function moveCell() {
            for (let dotCell of dotArray) {
                if (dotCell != null) {
                    let newCell = dotCell.cloneNode(true);
                    if (newCell.firstChild != null) newCell.firstChild.remove();
                    dotCell.replaceWith(newCell);  
                }
            }
            if (this.id.charAt(0) == 8 && htmlToFigures[prevCell.innerHTML.codePointAt(0)] == "white pawn") {
                this.innerHTML = "&#9813;"
            }
            else if (this.id.charAt(0) == 1 && htmlToFigures[prevCell.innerHTML.codePointAt(0)] == "black pawn") {
                this.innerHTML = "&#9819;"
            } else {    
                this.innerHTML = html;
            }
            if (this.classList[2] === 'blackFigure') {
                this.className = this.classList[0] + " " + this.classList[1] 
                + ' whiteFigure ' + prevCell.classList[3];
            }
            else if (this.classList[2] === 'whiteFigure') {
                this.className = this.classList[0] + " " + this.classList[1] 
                + ' blackFigure ' + prevCell.classList[3];
            }
            /*
            const figureType = htmlToFigures[this.innerText.codePointAt(0)];
            const figureHTML = '&' + '#' + this.innerText.codePointAt(0) + ';';
            let newFigure = new Figure(this.id, figureType, figureHTML);
            newFigure.checkIfChecks();
            */
            prevCell.innerHTML = "";
            if (game.getTurn() === "white") {
                game.setTurn("black");
                game.changeSideClickable("white");
            }
            else {
                game.setTurn("white");
                game.changeSideClickable("black");
            }
            game.resetTakesInfo();
            game.calculateAllTakes();
            game.setState(true);
            if (game.mate == true) {
                /*
                setTimeout(function() {
                    alert(game.checkingColor + " pieces have won!");
                }, 100);
                */
                setTimeout(function() {
                    alert(game.checkingColor + " pieces have won!");
                    location.reload();
                }, 100);
                // reload the page here
            }

            for (let validTake of allValidTakes) {
                validTake.removeEventListener('mouseout', colorBackTake);
                validTake.removeEventListener('click', moveCell);
                validTake.removeEventListener('mouseover', colorOnTake);
                colorBack(validTake);
            }

        }


    }

    

}




