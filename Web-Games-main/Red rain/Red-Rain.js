
player = document.getElementById('player')
enemy = document.getElementById('enemy')

moveingRight = false
moveingLeft = false

winx = window.innerWidth
winy = window.innerHeight
player.style.top = winy - 120 + "px"
player.style.left = winx /2 + "px"

enemy.style.top = winy - 120 + "px"
enemy.style.left = "1000px"

let score = 0
let bestScore = 0
let enemyWidth = 50
playing = false

document.addEventListener("keydown", function(e) {
    if (e.key == "d" || e.key == "D") {
        moveingRight = true

        player.style.backgroundImage = "url(Resources/blueCube002.png)"
    }
    if (e.key == "a" || e.key == "A") {
        moveingLeft = true

        player.style.backgroundImage = "url(Resources/blueCube003.png)"
    }

    // if (e.key == "p") {
    //     score = score + 1000
    // }
})

document.addEventListener("keyup", function (e) {
    if (e.key == "d" || e.key == "D") {
        moveingRight = false

        player.style.backgroundImage = "url(Resources/blueCube001.png)"
    }
    if (e.key == "a" || e.key == "A") {
        moveingLeft = false

        player.style.backgroundImage = "url(Resources/blueCube001.png)"
    }
})

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('start').addEventListener("click", function() {
        score = 0
        playing = true
        document.getElementById('start').classList.add("hidden")
        document.getElementById('best').classList.add("hidden")
        document.getElementById('title').classList.add("hidden")
        document.getElementById('version').classList.add("hidden")
        document.getElementById('score').classList.remove("hidden")

        player.classList.remove("hidden")
    })


    setInterval(function() {
        if (moveingRight && parseInt(player.style.left) < winx - 100) {
            player.style.left = parseInt(player.style.left) + 20 + 'px'
        }

        if (moveingLeft && parseInt(player.style.left) > 0) {
            player.style.left = parseInt(player.style.left) - 20 + 'px'
        }

        document.querySelectorAll(".enemy").forEach(element => {
            element.style.top = parseInt(element.style.top) + 10 + 'px'

            

            if (parseInt(player.style.left) < parseInt(element.style.left) + parseInt(element.style.width) 
            && parseInt(player.style.left) > parseInt(element.style.left) 
            && parseInt(player.style.top) < parseInt(element.style.top) + 1 
            || parseInt(player.style.left) + parseInt(player.style.width) < parseInt(element.style.left) + parseInt(element.style.width) 
            && parseInt(player.style.left) + parseInt(player.style.width) > parseInt(element.style.left) 
            && parseInt(player.style.top) < parseInt(element.style.top) + 1
            || parseInt(player.style.left) + parseInt(player.style.width) - 50 < parseInt(element.style.left) + parseInt(element.style.width)
            && parseInt(player.style.left) + parseInt(player.style.width) - 50 > parseInt(element.style.left)
            && parseInt(player.style.top) < parseInt(element.style.top) + 1) {
                restart()
            }


            if (parseInt(element.style.top) > winy) {
                element.remove();
                score = score + 100
            }
        })

        score++
        document.getElementById('score').innerHTML = `${score} points`
    }, 20)

    spawnrate = 1000
    spnrate()

    spawnAmount = 1

    faces = [
        "url(Resources/redCube001.png)",
        "url(Resources/redCube002.png)",
        "url(Resources/redCube003.png)",
        "url(Resources/redCube004.png)",
        "url(Resources/redCube005.png)",
        "url(Resources/redCube006.png)",
        "url(Resources/redCube007.png)",
        "url(Resources/redCube008.png)",
        "url(Resources/redCube009.png)",
        "url(Resources/redCube010.png)",
        
    ]

    function spnrate() {
        let clock = setInterval(function () {
            if (playing) {
                for (let i = 0; i < spawnAmount; i++) {
                    x = Math.floor(Math.random() * winx - parseInt(enemy.style.width)) + 1

                    let div = document.createElement("div");
                    div.style.left = x + 'px';
                    div.style.top = "0px"
                    div.style.width = enemyWidth + "px"
                    div.style.height = enemyWidth + "px"
                    div.classList.add('enemy')
                    x = Math.floor(Math.random() * faces.length)
                    div.style.backgroundImage = faces[x]
                    div.style.backgroundSize = `${enemyWidth}px ${enemyWidth}px`
                    document.getElementById("bdy").appendChild(div);
                    console.log(spawnAmount)
                }
            }

            if  (score < 200) {
                clearInterval(clock)
                spawnrate = 900
                spnrate()
            }else if (score > 200 && score < 1000) {
                clearInterval(clock)
                spawnrate = 900
                spnrate()
            } else if (score > 1000 && score < 1500) {
                spawnAmount = 2
                enemyWidth = 70
                clearInterval(clock)
                spawnrate = 800
                spnrate()
            } else if (score > 1500 && score < 2500) {
                enemyWidth = 100
            } else if (score > 2500 && score < 5500) {
                enemyWidth = 110
                clearInterval(clock)
                spawnrate = 600
                spnrate()
            } else if (score > 5500 && score < 8000) {
                spawnAmount = 3
            } else if (score > 8000 && score < 13000) {
                enemyWidth = 130
                clearInterval(clock)
                spawnrate = 500
                spnrate()
            } else  if (score > 13000 && score < 20000) {
                clearInterval(clock)
                spawnrate = 300
                spnrate()
            } else if (score > 20000) {
                spawnAmount = 5
                enemyWidth = 175
                clearInterval(clock)
                spawnrate = 200
                spnrate()
            }
        }, spawnrate)
    }
})

function restart() {
    player.classList.add("hidden")
    playing = false

    spawnAmount = 1
    enemyWidth = 50
    if (score > bestScore) {
        bestScore = score
        document.getElementById('best').innerHTML = `Best score: ${score}`
    }

    document.getElementById('score').classList.add("hidden")
    document.getElementById('best').classList.remove("hidden")
    document.getElementById('title').classList.remove("hidden")
    document.getElementById('start').classList.remove("hidden")
    document.getElementById('version').classList.remove("hidden")
}