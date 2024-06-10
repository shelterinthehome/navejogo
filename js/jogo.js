var canvas, ctx;
var ship;
var blueEnemies = [];
var bullets = [];
var keys = {};
var bulletCooldown = 0;
var animationFrameId;
var enemyKillCount = 0;  // Nova variável para contar os inimigos abatidos
var backgroundImg, bgY1, bgY2;
var heroImg, shotImg;

function startGame() {
    if (!canvas) {
        canvas = document.getElementById("gameCanvas");
        ctx = canvas.getContext("2d");
    }

    // Carregar a imagem do inimigo azul
    var blueEnemyImg = document.getElementById("blueEnemyImg");

    // Carregar a imagem de fundo
    backgroundImg = document.getElementById("backgroundImg");

    // Carregar a imagem do herói e de tiro
    heroImg = document.getElementById("heroImg");
    shotImg = document.getElementById("shotImg");

    // Inicializar as posições do fundo
    bgY1 = 0;
    bgY2 = -canvas.height;

    // Após a imagem carregar, chame a função para criar os inimigos azuis
    blueEnemyImg.onload = function() {
        createBlueEnemies(9, blueEnemyImg);
    };

    // Defina a origem da imagem
    blueEnemyImg.src = "../Nave avança/imagem/blue_enemy.png";
    heroImg.src = "../Nave avança/imagem/hero.png";
    shotImg.src = "../Nave avança/imagem/tiro.png";

    ship = {
        width: 50,
        height: 50,
        x: canvas.width / 2 - 25,
        y: canvas.height - 60,
        speed: 5,
        image: heroImg,
        color: "black"
    };

    bullets = [];
    blueEnemies = [];

    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);

    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }

    enemyKillCount = 0;

    update();
}

function createBlueEnemy(blueEnemyImg) {
    let enemy = {
        width: 50,
        height: 50,
        x: Math.random() * (canvas.width - 70),
        y: Math.random() * -canvas.height - 70,
        image: blueEnemyImg,
        speed: 2 + Math.random() * 3,
        visible: true 
    };
    blueEnemies.push(enemy);
}

function createBlueEnemies(count, blueEnemyImg) {
    for (let i = 0; i < count; i++) {
        createBlueEnemy(blueEnemyImg);
    }
}

function drawShip() {
    if (ship.image) {
        ctx.drawImage(ship.image, ship.x, ship.y, ship.width, ship.height);
    } else {
        ctx.fillStyle = ship.color;
        ctx.fillRect(ship.x, ship.y, ship.width, ship.height);
    }
}

function drawBullets() {
    for (let bullet of bullets) {
        if (bullet.visible) {
            ctx.fillStyle = 'red';
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        }
    }
}

function drawEnemies() {
    for (let enemy of blueEnemies) {
        if (enemy.visible) {
            ctx.drawImage(enemy.image, enemy.x, enemy.y, enemy.width, enemy.height);
        }
    }
}

function updateBullets() {
    let newBullets = [];
    for (let bullet of bullets) {
        bullet.y -= bullet.speed;
        if (bullet.y >= 0) {
            newBullets.push(bullet);
        }
    }
    bullets = newBullets;
}

function updateEnemies() {
    for (let enemy of blueEnemies) {
        if (enemy.visible) {
            enemy.y += enemy.speed;
            if (enemy.y > canvas.height) {
                enemy.y = 0;
                enemy.x = Math.random() * (canvas.width - enemy.width);
            }
            if (isColliding(ship, enemy)) {
                resetGame();
                return;
            }
        }
    }
}

function checkCollisions() {
    for (let enemy of blueEnemies) {
        if (enemy.visible) {
            for (let bullet of bullets) {
                if (bullet.visible && isColliding(bullet, enemy)) {
                    bullet.visible = false;
                    enemy.visible = false;
                    enemyKillCount++;
                    createBlueEnemy(enemy.image); // Cria um novo inimigo quando um inimigo é abatido
                }
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawShip();
    drawBullets();
    drawEnemies();
    drawKillCount();
}

function drawBackground() {
    ctx.drawImage(backgroundImg, 0, bgY1, canvas.width, canvas.height);
    ctx.drawImage(backgroundImg, 0, bgY2, canvas.width, canvas.height);
}

function drawKillCount() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText("Inimigos abatidos: " + enemyKillCount, 10, 30);
}

function update() {
    updateBackground();
    updateBullets();
    updateEnemies();
    updateShipPosition();
    updateCooldown();
    checkCollisions();
    draw();
    animationFrameId = requestAnimationFrame(update);
}

function updateBackground() {
    bgY1 += 2;
    bgY2 += 2;

    if (bgY1 >= canvas.height) {
        bgY1 = -canvas.height;
    }
    if (bgY2 >= canvas.height) {
        bgY2 = -canvas.height;
    }
}

function keyDownHandler(event) {
    keys[event.key] = true;

    if (event.key === 'ArrowUp' && bulletCooldown <= 0) {
        shoot();
    }

    if (event.key === 'w' || event.key === 'W') {
        ship.color = "purple";
    }

    if (event.key === 'a' || event.key === 'A') {
        ship.color = "yellow";
    }
    if (event.key === 's' || event.key === 'S') {
        ship.color = "blue";
    }
    if (event.key === 'd' || event.key === 'D') {
        ship.color = "lightblue";
    }
}

function keyUpHandler(event) {
    keys[event.key] = false;

    if (event.key === 'w' || event.key === 'W') {
        ship.color = "black";
    }
    if (event.key === 'a' || event.key === 'A') {
        ship.color = "black";
    }
    if (event.key === 's' || event.key === 'S') {
        ship.color = "black";
    }
    if (event.key === 'd' || event.key === 'D') {
        ship.color = "black";
    }
}

function updateShipPosition() {
    if (keys['w'] || keys['W']) { ship.y -= ship.speed; }
    if (keys['s'] || keys['S']) { ship.y += ship.speed; }
    if (keys['a'] || keys['A']) { ship.x -= ship.speed; }
    if (keys['d'] || keys['D']) { ship.x += ship.speed; }
    
    ship.x = Math.max(0, Math.min(ship.x, canvas.width - ship.width));
    ship.y = Math.max(0, Math.min(ship.y, canvas.height - ship.height));   
}

function shoot() {
    if (bulletCooldown <= 0) {
        let bullet = {
            width: 5,
            height: 20,
            x: ship.x + ship.width / 2 - 2.5,
            y: ship.y,
            speed: 7,
            visible: true
        };
        bullets.push(bullet);
        bulletCooldown = 6;

        // Trocar para a imagem de tiro e voltar para a imagem original após um segundo
        ship.image = shotImg;
        setTimeout(() => {
            ship.image = heroImg;
        }, 1000);
    }
}

function updateCooldown() {
    if (bulletCooldown > 0) {
        bulletCooldown--;
    }
}

function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function resetGame() {
    cancelAnimationFrame(animationFrameId);
    startGame();
}