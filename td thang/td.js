let canPlaceTower = false;
let towerType;
let showPlaceableTower;
let cancelPlacement = false;

let gracePediod = true;

let tut = 0;
let lockTutForward = false;
let lockTutBack = false;

let cash = 1000;

let playList = [
    `chill01.wav`,
    `chill02.wav`,
    `chill03.wav`,
    `chill04.wav`,
    `chill05.wav`,
    `chill06.wav`,
    `chill07.wav`,
    `chill08.wav`,
    `chill09.wav`,
    `chill10.wav`,
];

document.addEventListener("mousemove", () => {
    if (canPlaceTower == true) {
        showPlaceableTower.style.left = event.clientX + 'px'
        showPlaceableTower.style.top = event.clientY + 'px'
        showPlaceableTower.classList.add('floating')
        showPlaceableTower.classList.add('beingPlaced')
    }
})

document.addEventListener('contextmenu', (event) => {
    console.log(canPlaceTower)
    if (canPlaceTower == true) {
        event.preventDefault();
        cash = cash + showPlaceableTower.cost
        showPlaceableTower.remove()
        document.getElementById('cashDisplay').innerHTML = 'Cash: ' + cash
        canPlaceTower = false
    }
})

document.addEventListener('keydown', (e) => {
    if (e.key == 'q') {
        sideBarToggleLogic()
    }

    if (e.key == 'r') {
        window.location.reload()
    }
})

function closeTut() {
    document.getElementById('tutorialBox').remove()
}

function tutTextChange(direction) {
    
    if (tut == 0) {
        lockTutBack = true
    } else {
        lockTutBack = false
    }

    if (tut == 6) {
        lockTutForward = true
    } else {
        lockTutForward = false
    }

    if (direction == 'forward' && lockTutForward == false) {
        tut++
    } else if (direction == 'back' && lockTutBack == false) {
        tut--
    }

    if (tut == 0) {
        document.getElementById('tutBackstep').style.background = 'grey'
    } else {
        document.getElementById('tutBackstep').style.background = 'red'
    }

    if (tut == 6) {
        document.getElementById('tutAdvance').style.background = 'grey'
    } else {
        document.getElementById('tutAdvance').style.background = 'green'
    }

    console.log(tut)

    switch(tut) {
        case 0:
            document.getElementById('tutText').innerHTML = '<h1>Tetrigun</h1> <h3>A game about shooting stuff</h3> <p>Use the bottons bellow to navigate tutorial and learn important information :)</p>'
            break;
        case 1:
            document.getElementById('tutText').innerHTML = '<h1>Strategie</h1> <p>Place various space stations to defend against ever increasing enemy waves. Stations are able to stack on top of each other to create a powerful defence in a consentrated area however spreading out your firepower is usually a better options.</p>'
            break;
        case 2:
            document.getElementById('tutText').innerHTML = '<h1>Station placement</h1> <p>To place a station click on its picture in the shop, drag it to the desired place on screen, and left click to place. When placing a tower you may right click at any time to cancel its placement and will be refunded.</p>'
            break;
        case 3:
            document.getElementById('tutText').innerHTML = '<h1>Cash</h1> <p>Each station requires money to build which is earned by defeating invaders. The more powerful the inavder is the more cash you will earn by deafeating it.</p>'
            break;
        case 4:
            document.getElementById('tutText').innerHTML = '<h1>Knoledge</h1> <p>Each station has diferent strengths and weaknesses. By hovering over each station in the shop you will be able to see a brief description of what it does and how it can help you.</p>'
            break;
        case 5:
            document.getElementById('tutText').innerHTML = '<h1>Hotkeys</h1> <p>Use Q to open and close the station shop. Lmk what other hotkeys to add please xd</p>'
            break;
        case 6:
            document.getElementById('tutText').innerHTML = '<h1>Developement</h1> <p>For now this is it give me feedback to make it better please :p <br> Time spent on this project: 5h 10m</p>'
            break;
    }
}


document.addEventListener("mouseup", (event) => {

    if (event.button == 0) {
        if (canPlaceTower == true) {

            console.log(canPlaceTower)

            blocked = false

            let trialTower = showPlaceableTower.getBoundingClientRect();

            document.querySelectorAll('.tower').forEach((element) => {
                if (element != showPlaceableTower) {
                    let checkTower = element.getBoundingClientRect()

                    if (
                        trialTower.right < checkTower.left ||
                        trialTower.left > checkTower.right ||
                        trialTower.bottom < checkTower.top ||
                        trialTower.top > checkTower.bottom
                    ) { } else {
                        blocked = true
                    }
                }
            })

            if (blocked == false) {
                showPlaceableTower.classList.remove('beingPlaced')
                canPlaceTower = false
                sideBarToggleLogic()

                let sound = new Audio('tdSound/placed2.mp3');
                sound.play()
            }

            if (gracePediod == true) {
                gracePediod = false

                startEnemyWaves()
                startBulletClock()
            }

            // if (tut == 0) {
            //     document.getElementById('defaultTut').remove()

            //     nextStep = document.createElement('div')
            //     nextStep.id = 'tut' + tut
            //     nextStep.innerHTML = 'Open the menu on the top left to place another tower.'
            //     document.getElementById('tutorialBox').appendChild(nextStep)
            //     tut++
            // }

            //document.getElementById('cancelTowerPlacement').style.display = 'none'

            console.log(canPlaceTower)
        }
    }
    
})

function chooseTower(element, cost) {

    if (cash >= cost) {
        showPlaceableTower = document.createElement('div')
        showPlaceableTower.classList.add('tower')

        switch (element) {
            case 'default':
                showPlaceableTower.classList.add('defaultTower')
                showPlaceableTower.health = 10
                showPlaceableTower.innerHTML = 10
                break;
            case 'sniper':
                showPlaceableTower.classList.add('sniperTower')
                showPlaceableTower.health = 3
                showPlaceableTower.innerHTML = 3
                break;
            case 'gunner':
                showPlaceableTower.classList.add('gunnerTower')
                showPlaceableTower.health = 5
                showPlaceableTower.innerHTML = 5
                break;
            case 'bomber':
                showPlaceableTower.classList.add('bomberTower')
                showPlaceableTower.health = 25
                showPlaceableTower.innerHTML = 25
                break;
            case 'wall':
                showPlaceableTower.classList.add('wallTower')
                showPlaceableTower.health = 110
                showPlaceableTower.innerHTML = 110
                break;
        }

        document.getElementById('body').appendChild(showPlaceableTower)

        canPlaceTower = true

        cash = cash - cost
        document.getElementById('cashDisplay').innerHTML = 'Cash: ' + cash

        showPlaceableTower.cost = cost

        sideBarOpen = true
        sideBarToggleLogic()

        //document.getElementById('cancelTowerPlacement').style.display = 'block'

    } else {
        alert('Not enough cash')
    }

    
    
}

document.addEventListener('DOMContentLoaded', () => {
    clock = setInterval(() => {
        document.querySelectorAll('.floating:not(.beingPlaced)').forEach((element) => {
            element.style.top = parseInt(element.style.top) + 1 + 'px'

            document.querySelectorAll('.tower:not(.floating)').forEach((tower) => {
                if (tower != element) {
                    canstop = false

                    let checkTower = tower.getBoundingClientRect()
                    let twer = element.getBoundingClientRect()

                    if (
                        twer.right < checkTower.left ||
                        twer.left > checkTower.right ||
                        twer.bottom < checkTower.top ||
                        twer.top > checkTower.bottom
                    ) { } else {
                        canstop = true
                    }

                    // Old logic just in case
                    // if (parseInt(element.style.left) > parseInt(tower.style.left) && parseInt(element.style.left) < parseInt(tower.style.left) + tower.offsetWidth) {
                    //     canstop = true
                    // } else if (parseInt(element.style.left) + element.offsetWidth < parseInt(tower.style.left) + tower.offsetWidth && parseInt(element.style.left) + element.offsetWidth > parseInt(tower.style.left)) {
                    //     canstop = true
                    // }

                    if (canstop == true && parseInt(element.style.top) + element.offsetHeight >= parseInt(tower.style.top)) {
                        if (element.classList.contains('floating')) {
                            element.classList.remove('floating')
                            let sound = new Audio('tdSound/placed.mp3');
                            sound.play()
                        }
                    }
                }
            })

            if (parseInt(element.style.top) == window.innerHeight - element.offsetHeight) {
                element.classList.remove('floating')
                let sound = new Audio('tdSound/placed.mp3');
                sound.play()
            }
        })

        document.querySelectorAll('.enemy').forEach((element) => {
            if (element.skipMove == false) {
                console.log(element.speed)
                element.style.top = parseInt(element.style.top) + element.speed + 'px'
            }

            if (parseInt(element.style.top) + element.offsetHeight >= window.innerHeight) {
                clearInterval(clock)
                clearInterval(clock2)

                clearInterval(defaultBulletClock)
                clearInterval(sniperBulletClock)
                clearInterval(gunnerBulletClock)
            }

            let enemyBound = element.getBoundingClientRect()
            document.querySelectorAll('.bullet').forEach((bullet) => {
                let bulletBound = bullet.getBoundingClientRect()
                if (
                    bulletBound.right < enemyBound.left ||
                    bulletBound.left > enemyBound.right ||
                    bulletBound.bottom < enemyBound.top ||
                    bulletBound.top > enemyBound.bottom
                ) { } else {
                    temphealth = element.health - bullet.power

                    if (temphealth <= 0) {
                        bullet.remove()
                        element.remove()
                        cash = cash + (element.ogHealth * 2)
                        document.getElementById('cashDisplay').innerHTML = 'Cash: ' + cash

                        let sound = new Audio('tdSound/enemyKilled.mp3');
                        //sound.play()
                    } else {
                        bullet.remove()
                        element.health = temphealth
                        element.innerHTML = temphealth
                        let sound = new Audio('tdSound/enemyHit.mp3');
                        //sound.play()
                    }
                }
            })
        })

        document.querySelectorAll('.bullet').forEach((bullet) => {
            if (!bullet.direction) {
                let dx = bullet.destinationLeft - parseInt(bullet.style.left);
                let dy = bullet.destinationTop - parseInt(bullet.style.top);
                let magnitude = Math.sqrt(dx * dx + dy * dy);
                bullet.direction = {
                    x: dx / magnitude,
                    y: dy / magnitude
                };
            }

            bullet.style.left = parseInt(bullet.style.left) + bullet.direction.x * bullet.speed + 'px';
            bullet.style.top = parseInt(bullet.style.top) + bullet.direction.y * bullet.speed + 'px';

            if (parseInt(bullet.style.top) <= 0 || parseInt(bullet.style.top) >= window.innerHeight || parseInt(bullet.style.left) <= 0 || parseInt(bullet.style.left) >= window.innerWidth) {
                bullet.remove()
            }
        })
    },10)

    towerColClock = setInterval(() => {
        document.querySelectorAll('.tower').forEach((tower) => {

            let towerBound = tower.getBoundingClientRect()
            document.querySelectorAll('.enemy').forEach((enemy) => {
                let enemyBound = enemy.getBoundingClientRect()
                if (
                    towerBound.right < enemyBound.left ||
                    towerBound.left > enemyBound.right ||
                    towerBound.bottom < enemyBound.top ||
                    towerBound.top > enemyBound.bottom
                ) {} else {


                    if (tower.classList.contains('floating')) {
                        console.log('floater')
                    } else {
                        enemy.skipMove = true
                    }

                    temp = tower.health - enemy.dammage

                    if(temp <= 0) {
                        tower.remove()
                        enemy.skipMove = false
                    }

                    tower.health = temp
                    tower.innerHTML = Math.round(temp)
                }

            })
        })
    }, 50)

    // function selectBackgroundMusic() {
    //     let music = new Audio(`music/${playList[Math.floor(Math.random() * playList.length)]}`)
    //     music.play()

    //     music.addEventListener('ended', () => {
    //         selectBackgroundMusic();
    //     });
    // }
    // selectBackgroundMusic()

    document.getElementById('sideBarToggle').addEventListener('click', () => {
        sideBarToggleLogic()
    })
})

let sideBarOpen = true;

function sideBarToggleLogic() {
    if (sideBarOpen == true) {
        document.getElementById('sideBar').style.display = 'none'
        document.getElementById('sideBarToggle').style.left = '0.5%'
        document.getElementById('sideBarToggle').style.backgroundImage = 'url(images/toggleSideBarRight.png)'
        sideBarOpen = false
    } else {
        document.getElementById('sideBar').style.display = 'block'
        document.getElementById('sideBarToggle').style.left = '20.5%'
        document.getElementById('sideBarToggle').style.backgroundImage = 'url(images/toggleSideBarLeft.png)'
        sideBarOpen = true
    }
}

let enemyTimer = 10000;
let minEnemyTimer = 5000;
let enemyAmountRandomizer = 2;
let minEnemyHealth = 1;
let maxEnemyHealth = 5;
let minEnemyDamage = 0.2;
let maxEnemyDamage = 0.3;
let minEnemySpeed = 1;
let maxEnemySpeed = 0.1;
let wave = 0;
let playerTargeted;

let nextWaveTime = 5000

function startEnemyWaves() {
    clock2 = setInterval(() => {
        enemyAmount = Math.floor(Math.random() * enemyAmountRandomizer) + 1

        for (let i = 0; i < enemyAmount; i++) {
            enemy = document.createElement('div')
            enemy.classList.add('enemy')

            size = 50

            enemy.style.top = '0px'
            enemy.style.width = size + 'px'
            enemy.style.height = size + 'px'

            pos = Math.floor(Math.random() * window.innerWidth - size)
            if (pos < 0) { pos = pos + size }
            enemy.style.left = pos + 'px'

            enemy.health = Math.floor(Math.random() * maxEnemyHealth) + minEnemyHealth
            enemy.ogHealth = enemy.health
            enemy.innerHTML = enemy.health

            enemy.dammage = Math.floor(Math.random() * maxEnemyDamage) + minEnemyDamage

            enemy.speed = Math.floor(Math.random() * maxEnemySpeed) + minEnemySpeed

            enemy.skipMove = false
            

            enemy.addEventListener('click', () => {
                playerTargeted = enemy
            })

            document.getElementById('body').appendChild(enemy)
        }

        if (enemyAmountRandomizer < 11 && wave % 2 == 0) {
            enemyAmountRandomizer++
        }

        upgrade = Math.floor(Math.random() * 3)

        switch(upgrade) {
            case 0:
                if (Math.floor(Math.random() * 2) == 0) {
                    minEnemyHealth = minEnemyHealth + 2
                } else {
                    maxEnemyHealth = maxEnemyHealth + 2
                }
                break;
            case 1:
                if (Math.floor(Math.random() * 2) == 0) {
                    minEnemyDamage = minEnemyDamage + 0.1
                } else {
                    maxEnemyDamage = maxEnemyDamage + 0.1
                }
                break;
            case 2:
                if (Math.floor(Math.random() * 2) == 0) {
                    minEnemySpeed = minEnemySpeed + 0.1
                } else {
                    maxEnemySpeed = maxEnemySpeed + 0.1
                }
                break;
        }

        wave++
        document.getElementById('WaveDisplay').innerHTML = `Wave: ${wave}`

        if (nextWaveTime > 300 && Math.floor(Math.random() * 2) == 0) {
            nextWaveTime = nextWaveTime - Math.floor(Math.random() * 5)
        } else {
            nextWaveTime = nextWaveTime + Math.floor(Math.random() * 5)
        }

        console.log(nextWaveTime)
        
    }, nextWaveTime)
}

function getCenter(rect) {
    return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
    };
}

function startBulletClock() {
    defaultBulletClock = setInterval(() => {
        if (document.querySelectorAll('.enemy').length != 0 && document.querySelectorAll('.defaultTower').length != 0) {

            document.querySelectorAll('.defaultTower').forEach((tower) => {
                bullet = document.createElement('div')
                bullet.classList.add('bullet')
                bullet.style.background = 'grey'
                bullet.power = 5
                bullet.speed = 5
                bullet.style.left = parseInt(tower.style.left) + parseInt(tower.offsetWidth) / 2 + 'px'
                bullet.style.top = parseInt(tower.style.top) + 'px'

                let bestTarget = null;

                if (playerTargeted) {
                    bestTarget = playerTargeted
                    playerTargeted = null
                } else {

                    const towerPosition = tower.getBoundingClientRect();
                    const towerCenter = getCenter(towerPosition);

                    let closestDistance = Infinity;

                    document.querySelectorAll('.enemy').forEach((enemy) => {
                        const enemyRect = enemy.getBoundingClientRect();
                        const enemyCenter = getCenter(enemyRect);

                        const distance = Math.sqrt(
                            Math.pow(enemyCenter.x - towerCenter.x, 2) +
                            Math.pow(enemyCenter.y - towerCenter.y, 2)
                        );

                        if (distance < closestDistance) {
                            closestDistance = distance;
                            bestTarget = enemy;
                        }
                    });
                }

                bestTarget.style.outline = '1px solid white'

                bullet.destinationLeft = parseInt(bestTarget.style.left) + bestTarget.offsetWidth
                bullet.destinationTop = parseInt(bestTarget.style.top) + bestTarget.offsetHeight

                document.getElementById('body').appendChild(bullet)
            })

            let sound = new Audio('tdSound/defaultShot.mp3');
            //sound.play()

        }
    },1500)

    sniperBulletClock = setInterval(() => {
        if (document.querySelectorAll('.enemy').length != 0 && document.querySelectorAll('.sniperTower').length != 0) {

            document.querySelectorAll('.sniperTower').forEach((tower) => {
                bullet = document.createElement('div')
                bullet.classList.add('bullet')
                bullet.style.background = 'yellow'
                bullet.power = 20
                bullet.speed = 15
                bullet.style.left = parseInt(tower.style.left) + parseInt(tower.offsetWidth) / 2 + 'px'
                bullet.style.top = parseInt(tower.style.top) + 'px'

                let bestTarget = null;

                if (playerTargeted) {
                    bestTarget = playerTargeted
                    playerTargeted = null
                } else {

                    const towerPosition = tower.getBoundingClientRect();
                    const towerCenter = getCenter(towerPosition);

                    let closestDistance = Infinity;

                    document.querySelectorAll('.enemy').forEach((enemy) => {
                        const enemyRect = enemy.getBoundingClientRect();
                        const enemyCenter = getCenter(enemyRect);

                        const distance = Math.sqrt(
                            Math.pow(enemyCenter.x - towerCenter.x, 2) +
                            Math.pow(enemyCenter.y - towerCenter.y, 2)
                        );

                        if (distance < closestDistance) {
                            closestDistance = distance;
                            bestTarget = enemy;
                        }
                    });
                }

                bestTarget.style.outline = '1px solid white'

                bullet.destinationLeft = parseInt(bestTarget.style.left) + bestTarget.offsetWidth
                bullet.destinationTop = parseInt(bestTarget.style.top) + bestTarget.offsetHeight

                document.getElementById('body').appendChild(bullet)
            })

            let sound = new Audio('tdSound/sniperShot.mp3');
            //sound.play()

        }
    }, 3000)

    gunnerBulletClock = setInterval(() => {
        if (document.querySelectorAll('.enemy').length != 0 && document.querySelectorAll('.gunnerTower').length != 0) {

            document.querySelectorAll('.gunnerTower').forEach((tower) => {
                bullet = document.createElement('div')
                bullet.classList.add('bullet')
                bullet.style.background = 'purple'
                bullet.power = 2
                bullet.speed = 5
                bullet.style.left = parseInt(tower.style.left) + parseInt(tower.offsetWidth) / 2 + 'px'
                bullet.style.top = parseInt(tower.style.top) + 'px'

                bullet.destinationLeft = Math.floor(Math.random() * window.innerWidth)
                bullet.destinationTop = Math.floor(Math.random() * window.innerHeight / 4)

                document.getElementById('body').appendChild(bullet)
            })

            let sound = new Audio('tdSound/gunnerShot.mp3');
            //sound.play()

        }
    }, 200)

    bomberBulletClock = setInterval(() => {
        if (document.querySelectorAll('.enemy').length != 0 && document.querySelectorAll('.bomberTower').length != 0) {

            document.querySelectorAll('.bomberTower').forEach((tower) => {
                bullet = document.createElement('div')
                bullet.classList.add('bullet')
                bullet.style.background = 'rgb(0, 128, 109)';
                bullet.power = 50
                bullet.speed = 3
                bullet.style.left = parseInt(tower.style.left) + parseInt(tower.offsetWidth) / 2 + 'px'
                bullet.style.top = parseInt(tower.style.top) + 'px'

                let bestTarget = null;

                if (playerTargeted) {
                    bestTarget = playerTargeted
                    playerTargeted = null
                } else {

                    const towerPosition = tower.getBoundingClientRect();
                    const towerCenter = getCenter(towerPosition);

                    let closestDistance = Infinity;

                    document.querySelectorAll('.enemy').forEach((enemy) => {
                        const enemyRect = enemy.getBoundingClientRect();
                        const enemyCenter = getCenter(enemyRect);

                        const distance = Math.sqrt(
                            Math.pow(enemyCenter.x - towerCenter.x, 2) +
                            Math.pow(enemyCenter.y - towerCenter.y, 2)
                        );

                        if (distance < closestDistance) {
                            closestDistance = distance;
                            bestTarget = enemy;
                        }
                    });
                }

                bestTarget.style.outline = '1px solid white'

                bullet.destinationLeft = (parseInt(bestTarget.style.left) + bestTarget.offsetWidth) - 50
                bullet.destinationTop = (parseInt(bestTarget.style.top) + bestTarget.offsetHeight) - 50

                document.getElementById('body').appendChild(bullet)
            })
        }
    }, 5000)
}