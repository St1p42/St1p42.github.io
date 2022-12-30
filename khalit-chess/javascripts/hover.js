//try to make one file only in html
const cells = document.getElementsByClassName("cell");
const game = new Game();
let captureFunc;
for (let i = 0; i < cells.length; i++) {
    if (cells[i].innerHTML != "") {
        const figureType = htmlToFigures[cells[i].innerText.codePointAt(0)];
        const color = figureType.split(" ")[0];
        const figure = figureType.split(" ")[1];
        cells[i].className += " " + color + "Figure " + figure;
    }
    if (cells[i].innerHTML != "" && cells[i].classList[2] === "whiteFigure") {
        cells[i].addEventListener('click', captureCell);
    }
}

let board = document.querySelector(".grid-container");
board.addEventListener('mouseover', function(evt) {
    if (evt.target.classList[2] === "whiteFigure" || 
    evt.target.classList[2] === "blackFigure" ||
    (evt.target.childNodes.length != 0 && 
    evt.target.childNodes[0].className === 'dot')) {
        colorYellow(evt.target);
    }
    else if (evt.target.className === 'dot') {
        colorYellow(evt.target.parentNode);
    }
    
});

board.addEventListener('mouseout', function(evt) {
    if (evt.target.classList[2] === "whiteFigure" || 
    evt.target.classList[2] === "blackFigure" ||
    (evt.target.childNodes.length != 0 && 
        evt.target.childNodes[0].className === 'dot')) {
        colorBack(evt.target);
    }
    else if (evt.target.className === 'dot') {
        colorBack(evt.target.parentNode);
    }
})



function captureCell() {
    const figureType = htmlToFigures[this.innerText.codePointAt(0)];
    const figureHTML = '&' + '#' + this.innerText.codePointAt(0) + ';';
    let capturedFigure = new Figure(this.id, figureType, figureHTML);
    if (!capturedFigure.equals(game.getPrevCaptured())) {
        game.setPrevCaptured(capturedFigure);
        capturedFigure.possibleMoves(game);
    }
}

function colorYellow(cell) {
    let wrongColor = false;
    if (cell.classList[2] === "whiteFigure" && game.getTurn() === "black" ||
    cell.classList[2] === "blackFigure" && game.getTurn() === "white") {
        wrongColor = true;
    }
    if (cell.innerHTML === "" || wrongColor) return;
    cell.style.background = 'yellow';
}


function colorBack(cell) {
    if (cell.innerHTML === "") return;
    const cellType = cell.className.split(" ")[0] + " " + cell.className.split(" ")[1];
    if (cellType === "cell white") {
        cell.style.background = "bisque";
    }
    else {
        cell.style.background = 'goldenrod';
    }
}
