let gameOver = 1
let minesLeft = 10
let secondsElapsed = -1
let minutesElapsed = 0
let safeSq = 71
const playGrid =
[[0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0]]

for (let i = 0; i <= 8; ++i) {
    for (let j = 0; j <= 8; ++j) {
        document.getElementById("minefield").innerHTML += '\
        <div class="button" id="' + i + ''+ j +'" revealed="0" onclick="revealButton(id)">\
        </div>'
    }
}

function setMines() {
    let minesPlaced = 0
    while (minesPlaced < 10) {
    let row = Math.floor(Math.random() * 8)
    let column = Math.floor(Math.random() * 8)
        if (playGrid[row][column] == 0) {
            playGrid[row][column] = 9
            ++minesPlaced
        }
    }
}

function setClueboxes() {
    for (let i = 0; i <= 8; ++i) {
        for (let j = 0; j <= 8; ++j) {
            if (playGrid[i][j] >= 9) {
                incrementAround(i, j)
            }
        }
    }
}

function incrementAround(row, col) {
    for (let i = -1 ; i <= 1; ++i) {
        for (let j = -1; j <= 1; ++j) {
            if (i == 0 && j == 0) {
                continue
            }
            if (row + i >= 0 && row + i <= 8 && col + j >= 0 && col + j <= 8) {
                ++playGrid[row + i][col + j]
            }
        }
    }       
}

function startGame() {
    gameOver = 0
    stopWatch()
    setMines()
    updateMines()
    setClueboxes()
    document.getElementById("startBtn").innerText = "Reset"
    document.getElementById("startBtn").setAttribute("onclick", "gameReset()")
}

function revealButton(id) {
    if (gameOver){
        return
    }
    let row = id[0]
    let column = id[1]
    if (playGrid[row][column] == 0) {
        document.getElementById(id).style.backgroundColor = "#b8b8b8"
        document.getElementById(id).innerText = ""
        playGrid[row][column] = -1
        if ((document.getElementById(id).getAttribute("revealed")) == 0) {
            --safeSq
        }
        document.getElementById(id).setAttribute("revealed", 1)
        revealAround(id)
    } else if (playGrid[row][column] == -1) {
        document.getElementById(id).innerText = ""
    } else if (playGrid[row][column] < 9) {
        document.getElementById(id).style.backgroundColor = "#b8b8b8"
        document.getElementById(id).innerText = playGrid[row][column]
        if ((document.getElementById(id).getAttribute("revealed")) == 0) {
            --safeSq
        }
        document.getElementById(id).setAttribute("revealed", 1)
    } else {
        gameOver = 1
        revealMines()
        displayLoss()
        return
    }
    updateMines()
    checkWin()
}

function revealAround(id) {
    let row = Number(id[0])
    let col = Number(id[1])
    for (let i = -1 ; i <= 1; ++i) {
        for (let j = -1; j <= 1; ++j) {
            if (i == 0 && j == 0) {
                continue
            }
            if (row + i >= 0 && row + i <= 8 && col + j >= 0 && col + j <= 8) {
                revealButton("" + (row + i) + "" + (col + j) + "")
            }
        }
    }   
}

function revealMines() {
    for (let i = 0; i <= 8; ++i) {
        for (let j = 0; j <= 8; ++j) {
            if (playGrid[i][j] >= 9) {
                document.getElementById(""+ i + "" + j + "").innerHTML = '\
                <img id="mine" src="red-minesweeper.png">'
            }
        }
    }
}

document.getElementById("minefield").addEventListener('contextmenu', (event) => {
    event.preventDefault()
    toggleFlag(event.target.id)
})

function toggleFlag(id) {
    if (gameOver) {
        return
    }
    if ((document.getElementById(id).getAttribute("revealed")) == 1) {
        return
    }
    if ((document.getElementById(id).innerText == "") && id[2] != "f") {
        document.getElementById(id).innerHTML = '\
        <img id="'+ id +'f" class="flag" src="flag.png">'

        document.getElementById(id).setAttribute("onclick", null)
    } else if (id[2] == "f") {
        document.getElementById((id.slice(0, -1))).innerHTML = ""
        document.getElementById((id.slice(0, -1))).setAttribute("onclick", "revealButton(id)")
    }
    updateMines()
}

function updateMines() {
    let nrFlags = document.querySelectorAll(".flag").length
    document.getElementById("minesLeft").innerText = minesLeft - nrFlags
}

function gameReset() {
    window.location.reload()
}

function checkWin() {
    if (safeSq == 0) {
        document.getElementById("infoArea").style.fontSize = "26px"
        document.getElementById("infoArea").innerHTML = "WIN"
        gameOver = 1
    }
}

function displayLoss() {
    document.getElementById("infoArea").style.fontSize = "18px"
    document.getElementById("infoArea").innerHTML = "GAME OVER"
}

function stopWatch() {
    if (gameOver == 1) {
        return
    }
    ++secondsElapsed
    let zeroSec = ""
    let zeroMin = ""
    if (secondsElapsed > 59) {
        secondsElapsed = 0
        ++minutesElapsed
    }
    if (secondsElapsed < 10) {
        zeroSec = "0"
    }
    if (minutesElapsed < 10) {
        zeroMin = "0"
    }
    document.getElementById("timer").innerText = ""+ zeroMin +"" + minutesElapsed + ":" + zeroSec + "" + secondsElapsed+ "";
    setTimeout(stopWatch, 1000)
}