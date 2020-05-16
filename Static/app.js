document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const scoreDisplay = document.querySelector('#Score');
    const pausePlay = document.querySelector('#pause_play');
   // const rotate = document.querySelector('#rotate');
    let timerId
    const colors = [
        'orange',
        'red',
        'purple',
        'green',
        'blue'
    ]

    const w = 10;
    const ltet = [
        [1, 2, w + 1, 2 * w + 1],
        [w, w * 1 + 1, w * 1 + 2, w * 2 + 2],
        [w * 2, 1, w + 1, 2 * w + 1],
        [w, w * 2, w * 2 + 1, w * 2 + 2]
    ];
    const ztet = [
        [w * 2, w + 1, w * 2 + 1, w + 2],
        [0, w, w + 1, w * 2 + 1],
        [w * 2, w * 2 + 1, w + 1, w + 2],
        [0, w, w + 1, w * 2 + 1]
    ];
    const ttet = [
        [1, w, w + 1, w + 2],
        [1, w + 1, w * 2 + 1, w + 2],
        [w, w + 1, 2 * w + 1, w + 2],
        [w, 1, w + 1, 2 * w + 1]
    ];
    const otet = [
        [0, 1, w, w + 1],
        [0, 1, w, w + 1],
        [0, 1, w, w + 1],
        [0, 1, w, w + 1]
    ];
    const itet = [
        [1, w + 1, 2 * w + 1, 3 * w + 1],
        [w, w + 1, w + 2, w + 3],
        [1, w + 1, 2 * w + 1, 3 * w + 1],
        [w, w + 1, w + 2, w + 3],
    ];
    const tets = [ltet, ztet, ttet, otet, itet];
    // let filled=new Array(210);
    // function reset(){
    //     for(let i=0;i<200;i++)
    //     filled[i]=0;
    //     for(let i=0;i<10;i++)
    //     filled[200+i]=1;
    // }

    // reset();

    let random = Math.floor(Math.random() * tets.length);
    let nextRandom = 0;
    let currposition = 4;
    let currrotation = 0;
    let score=0

    let current = tets[random][currrotation];


    // rotate.addEventListener("click", rotate())

    function draw() {
        current.forEach(index => {
            squares[currposition + index].classList.add('tetromino');
            squares[currposition + index].style.backgroundColor = colors[random]
        })
    }

    function undraw() {
        current.forEach(index => {
            squares[currposition + index].classList.remove('tetromino');
            squares[currposition + index].style.backgroundColor = ''
        });
    }
    function moveDown() {
        undraw()
        currposition += w;
        draw()
        freeze()
    }
    function rotate() {
        undraw();
        currrotation = (currrotation + 1) % 4;
        current = tets[random][currrotation];
        draw();
    }

    function moveLeft() {
        undraw()
        const isAtLeft = current.some(index => (currposition + index) % w === 0)
        if (!isAtLeft) currposition -= 1
        if (current.some(index => squares[currposition + index].classList.contains('taken'))) {
            currposition += 1;
        }
        draw()
    }

    function moveRight() {
        undraw()
        const isAtRight = current.some(index => (currposition + index) % w === w - 1)
        if (!isAtRight) currposition += 1
        if (current.some(index => squares[currposition + index].classList.contains('taken'))) {
            currposition -= 1;
        }
        draw()
    }

    function freeze() {
        if (current.some(index => squares[currposition + index + w].classList.contains('taken'))) {

            current.forEach(index => squares[currposition + index].classList.add('taken'))
            // undraw()
            random = nextRandom
            nextRandom = Math.floor(Math.random() * tets.length)
            // currrotation = 0

            current = tets[random][currrotation]
            currposition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }


    function control(e) {
        if (e.keyCode === 37) {
            moveLeft()
        } else if (e.keyCode === 38) {
            rotate()
        } else if (e.keyCode === 39) {
            moveRight()
        } else if (e.keyCode === 40) {
            moveDown()
        }
    }
    document.addEventListener('keydown', control)



    const displaySquares =Array.from( document.querySelectorAll('.mini-grid div'))
    const displayWidth = 4
    const displayIndex = 0

    const upNextTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lTetromino
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //zTetromino
        [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetromino
        [0, 1, displayWidth, displayWidth + 1], //oTetromino
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] //iTetromino
    ]

    function displayShape() {
        //remove any trace of a tetromino form the entire grid
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
        })
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }


    // document.addEventListener(".pause_play")
    pausePlay.addEventListener('click', () => {
        if (timerId) {

            clearInterval(timerId)
            timerId = null
        }
        else {
            draw()
            timerId = setInterval(moveDown, 1000);
            nextRandom = Math.floor(Math.random() * 4);
            displayShape()
        }
    })

    function addScore() {
        for (let i = 0; i < 200; i += w) {
            let row = new Array(w);
            for (let j = 0; j < w; j++)
                row[j] = i + j;

            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10;
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.background = ''
                })
                const squaresRemoved = squares.splice(i, w)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }
    function gameOver() {
        if (current.some(index => squares[currposition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'end'
            clearInterval(timerId)
        }
    }
})
