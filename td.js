let canPlaceTower;
let towerType;
let showPlaceableTower;
let cancelPlacement = false;

let gracePediod = true;

let tut = 0;

let cash = 1000;

let playList = [
    `chill01.wav`,
    `chill02.wav`,
    `chill03.wav`
];

document.addEventListener("mousemove", () => {
    if (canPlaceTower == true) {
        showPlaceableTower.style.left = event.clientX + 'px'
        showPlaceableTower.style.top = event.clientY + 'px'
        showPlaceableTower.classList.add('floating')
        showPlaceableTower.classList.add('beingPlaced')
    }
})

document.getElementById('cancelTowerPlacement').addEventListener('mouseover', () => {
    cancelPlacement = true
})

document.getElementById('sideBarToggle').addEventListener('mouseover', () => {
    cancelPlacement = false
})


document.addEventListener("mouseup", () => {
    if (canPlaceTower == true) {
        if (cancelPlacement == true) {
            cash = cash + showPlaceableTower.cost
            showPlaceableTower.remove()
            document.getElementById('cashDisplay').innerHTML = 'Cash: ' + cash
            document.getElementById('cancelTowerPlacement').style.display = 'none'
            return;
        }

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
                ) {} else {
                    blocked = true
                }
            }
        })

        if (blocked == false) {
            canPlaceTower = false
            showPlaceableTower.classList.remove('beingPlaced')

            let sound = new Audio('tdSound/placed2.mp3');
            sound.play()
        }

        if (gracePediod == true) {
            gracePediod = false

            startEnemyWaves()
            startBulletClock()
        }

        if (tut == 0) {
            document.getElementById('defaultTut').remove()

            nextStep = document.createElement('div')
            nextStep.id = 'tut' + tut
            nextStep.innerHTML = 'Open the menu on the top left to place another tower.'
            document.getElementById('tutorialBox').appendChild(nextStep)
            tut++
        }

        document.getElementById('cancelTowerPlacement').style.display = 'none'
    }
})

function chooseTower(element, cost) {

    if (cash >= cost) {
        showPlaceableTower = document.createElement('div')
        showPlaceableTower.classList.add('tower')

        switch (element) {
            case 'default':
                showPlaceableTower.classList.add('defaultTower')
                break;
            case 'sniper':
                showPlaceableTower.classList.add('sniperTower')
                break;
            case 'gunner':
                showPlaceableTower.classList.add('gunnerTower')
                break;
            case 'bomber':
                showPlaceableTower.classList.add('bomberTower')
                break;
        }

        document.getElementById('body').appendChild(showPlaceableTower)

        canPlaceTower = true

        cash = cash - cost
        document.getElementById('cashDisplay').innerHTML = 'Cash: ' + cash

        showPlaceableTower.cost = cost

        sideBarOpen = true
        sideBarToggleLogic()

        document.getElementById('cancelTowerPlacement').style.display = 'block'

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

                    // Old logic hst in case
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
            element.style.top = parseInt(element.style.top) + 1 + 'px'

            if (parseInt(element.style.top) + element.offsetHeight == window.innerHeight) {
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
                        sound.play()
                    } else {
                        bullet.remove()
                        element.health = temphealth
                        element.innerHTML = temphealth
                        let sound = new Audio('tdSound/enemyHit.mp3');
                        sound.play()
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

    function selectBackgroundMusic() {
        let music = new Audio(`music/${playList[Math.floor(Math.random() * playList.length)]}`)
        music.play()

        music.addEventListener('ended', () => {
            selectBackgroundMusic();
        });
    }
    selectBackgroundMusic()

    document.getElementById('sideBarToggle').addEventListener('click', () => {
        sideBarToggleLogic()
    })
})

let sideBarOpen = true;

function sideBarToggleLogic() {
    if (sideBarOpen == true) {
        document.getElementById('sideBar').style.display = 'none'
        document.getElementById('sideBarToggle').style.left = '0.5%'
        document.getElementById('sideBarToggle').innerHTML = '>>'
        sideBarOpen = false
    } else {
        document.getElementById('sideBar').style.display = 'block'
        document.getElementById('sideBarToggle').style.left = '30.5%'
        document.getElementById('sideBarToggle').innerHTML = '<<'
        sideBarOpen = true
    }
}

let enemyTimer = 10000;
let minEnemyTimer = 5000;
let enemyAmountRandomizer = 2;
let minEnemyHealth = 1;
let maxEnemyHealth = 5;
let wave = 0;
let playerTargeted;

function startEnemyWaves() {
    clock2 = setInterval(() => {
        enemyAmount = Math.floor(Math.random() * enemyAmountRandomizer) + 1

        for (let i = 0; i < enemyAmount; i++) {
            enemy = document.createElement('div')
            enemy.classList.add('enemy')

            enemy.style.top = '0px'
            enemy.style.left = Math.floor(Math.random() * window.innerWidth - enemy.offsetWidth) + 'px'
            enemy.health = Math.floor(Math.random() * maxEnemyHealth) + minEnemyHealth
            enemy.ogHealth = enemy.health
            enemy.innerHTML = enemy.health

            enemy.addEventListener('click', () => {
                playerTargeted = enemy
            })

            document.getElementById('body').appendChild(enemy)
        }

        if (enemyAmountRandomizer < 11) {
            enemyAmountRandomizer++
        }
        enemyTimer--
        minEnemyTimer--

        maxEnemyHealth = maxEnemyHealth + Math.floor(Math.random() * 4)
        minEnemyHealth = minEnemyHealth + Math.floor(Math.random() * 2)


        wave++
        document.getElementById('WaveDisplay').innerHTML = `Wave: ${wave}`
        
    }, Math.floor(Math.random() * enemyTimer) + minEnemyTimer)
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

                let besttargetTop = 0;
                let bestTarget;

                if (playerTargeted) {
                    bestTarget = playerTargeted
                    playerTargeted = null
                } else {
                    document.querySelectorAll('.enemy').forEach((enemy) => {
                        if (parseInt(enemy.style.top) + enemy.offsetHeight > besttargetTop) {
                            besttargetTop = parseInt(enemy.style.top) + enemy.offsetHeight
                            bestTarget = enemy
                        }
                    })
                }

                bestTarget.style.outline = '1px solid white'

                bullet.destinationLeft = parseInt(bestTarget.style.left) + bestTarget.offsetWidth
                bullet.destinationTop = parseInt(bestTarget.style.top) + bestTarget.offsetHeight

                document.getElementById('body').appendChild(bullet)
            })

            let sound = new Audio('tdSound/defaultShot.mp3');
            sound.play()

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

                let besttargetTop = 0;
                let bestTarget;

                if (playerTargeted) {
                    bestTarget = playerTargeted
                    playerTargeted = null
                } else {
                    document.querySelectorAll('.enemy').forEach((enemy) => {
                        if (parseInt(enemy.style.top) + enemy.offsetHeight > besttargetTop) {
                            besttargetTop = parseInt(enemy.style.top) + enemy.offsetHeight
                            bestTarget = enemy
                        }
                    })
                }

                bestTarget.style.outline = '1px solid white'

                bullet.destinationLeft = parseInt(bestTarget.style.left) + bestTarget.offsetWidth
                bullet.destinationTop = parseInt(bestTarget.style.top) + bestTarget.offsetHeight

                document.getElementById('body').appendChild(bullet)
            })

            let sound = new Audio('tdSound/sniperShot.mp3');
            sound.play()

        }
    }, 3000)

    gunnerBulletClock = setInterval(() => {
        if (document.querySelectorAll('.enemy').length != 0 && document.querySelectorAll('.gunnerTower').length != 0) {

            document.querySelectorAll('.gunnerTower').forEach((tower) => {
                bullet = document.createElement('div')
                bullet.classList.add('bullet')
                bullet.style.background = 'purple'
                bullet.power = 2
                bullet.speed = 2
                bullet.style.left = parseInt(tower.style.left) + parseInt(tower.offsetWidth) / 2 + 'px'
                bullet.style.top = parseInt(tower.style.top) + 'px'

                let besttargetTop = 0;
                let bestTarget;
                
                if (playerTargeted) {
                    bestTarget = playerTargeted
                    playerTargeted = null
                } else {
                    document.querySelectorAll('.enemy').forEach((enemy) => {
                        if (parseInt(enemy.style.top) + enemy.offsetHeight > besttargetTop) {
                            besttargetTop = parseInt(enemy.style.top) + enemy.offsetHeight
                            bestTarget = enemy
                        }
                    })
                }

                bestTarget.style.outline = '1px solid white'

                bullet.destinationLeft = parseInt(bestTarget.style.left) + bestTarget.offsetWidth
                bullet.destinationTop = parseInt(bestTarget.style.top) + bestTarget.offsetHeight

                document.getElementById('body').appendChild(bullet)
            })

            let sound = new Audio('tdSound/gunnerShot.mp3');
            sound.play()

        }
    }, 250)

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

                let besttargetTop = 0;
                let bestTarget;
                
                if (playerTargeted) {
                    bestTarget = playerTargeted
                    playerTargeted = null
                } else {
                    document.querySelectorAll('.enemy').forEach((enemy) => {
                        if (parseInt(enemy.style.top) + enemy.offsetHeight > besttargetTop) {
                            besttargetTop = parseInt(enemy.style.top) + enemy.offsetHeight
                            bestTarget = enemy
                        }
                    })
                }

                bestTarget.style.outline = '1px solid white'

                bullet.destinationLeft = (parseInt(bestTarget.style.left) + bestTarget.offsetWidth) - 50
                bullet.destinationTop = (parseInt(bestTarget.style.top) + bestTarget.offsetHeight) - 50

                document.getElementById('body').appendChild(bullet)
            })
        }
    }, 5000)
}