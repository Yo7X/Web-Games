let canPlaceTower;
let towerType;
let showPlaceableTower;

let gracePediod = true;

let cash = 500;

document.addEventListener("mousemove", () => {
    if (canPlaceTower == true) {
        showPlaceableTower.style.left = event.clientX + 'px'
        showPlaceableTower.style.top = event.clientY + 'px'
        showPlaceableTower.classList.add('floating')
        showPlaceableTower.classList.add('beingPlaced')
    }
})


document.addEventListener("mouseup", () => {
    if (canPlaceTower == true) {
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
        }

        document.getElementById('body').appendChild(showPlaceableTower)

        canPlaceTower = true

        cash = cash - cost
        document.getElementById('cashDisplay').innerHTML = 'Cash: ' + cash

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

                    if (parseInt(element.style.left) > parseInt(tower.style.left) && parseInt(element.style.left) < parseInt(tower.style.left) + tower.offsetWidth) {
                        canstop = true
                    } else if (parseInt(element.style.left) + element.offsetWidth < parseInt(tower.style.left) + tower.offsetWidth && parseInt(element.style.left) + element.offsetWidth > parseInt(tower.style.left)) {
                        canstop = true
                    }

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

            let bulletBound = bullet.getBoundingClientRect()

            document.querySelectorAll('.enemy').forEach((enemy) => {
                let enemyBound = enemy.getBoundingClientRect()

                if (
                    bulletBound.right < enemyBound.left ||
                    bulletBound.left > enemyBound.right ||
                    bulletBound.bottom < enemyBound.top ||
                    bulletBound.top > enemyBound.bottom
                ) {} else {
                    bullet.remove()
                    enemy.remove()

                    cash = cash + 20
                    document.getElementById('cashDisplay').innerHTML = 'Cash: ' + cash

                    let sound = new Audio('tdSound/enemyKilled.mp3');
                    sound.play()
                }
            })
        })
    },10)
})

let enemyTimer = 10000;
let enemyAmountRandomizer = 2;

function startEnemyWaves() {
    clock2 = setInterval(() => {
        enemyAmount = Math.floor(Math.random() * enemyAmountRandomizer) + 1

        for (let i = 0; i < enemyAmount; i++) {
            enemy = document.createElement('div')
            enemy.classList.add('enemy')

            enemy.style.top = '0px'
            enemy.style.left = Math.floor(Math.random() * window.innerWidth - enemy.offsetWidth) + 'px'

            document.getElementById('body').appendChild(enemy)
        }

        enemyAmountRandomizer++
        enemyTimer--
        
    }, Math.floor(Math.random() * enemyTimer) + 1)
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
                document.querySelectorAll('.enemy').forEach((enemy) => {
                    if (parseInt(enemy.style.top) + enemy.offsetHeight > besttargetTop) {
                        besttargetTop = parseInt(enemy.style.top) + enemy.offsetHeight
                        bestTarget = enemy
                    }
                })

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
                document.querySelectorAll('.enemy').forEach((enemy) => {
                    if (parseInt(enemy.style.top) + enemy.offsetHeight > besttargetTop) {
                        besttargetTop = parseInt(enemy.style.top) + enemy.offsetHeight
                        bestTarget = enemy
                    }
                })

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
                document.querySelectorAll('.enemy').forEach((enemy) => {
                    if (parseInt(enemy.style.top) + enemy.offsetHeight > besttargetTop) {
                        besttargetTop = parseInt(enemy.style.top) + enemy.offsetHeight
                        bestTarget = enemy
                    }
                })

                bestTarget.style.outline = '1px solid white'

                bullet.destinationLeft = parseInt(bestTarget.style.left) + bestTarget.offsetWidth
                bullet.destinationTop = parseInt(bestTarget.style.top) + bestTarget.offsetHeight

                document.getElementById('body').appendChild(bullet)
            })

            let sound = new Audio('tdSound/gunnerShot.mp3');
            sound.play()

        }
    }, 250)
}