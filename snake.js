const gameCanvas = document.getElementById("gameCanvas");
const ctx = gameCanvas.getContext("2d");

let snake = [  {x: 150, y: 150},  {x: 140, y: 150},  {x: 130, y: 150},  {x: 120, y: 150},  {x: 110, y: 150},];
let dx = 10; //velocité en X
let dy = 0; //vélocité en y

let score =0;


//Cadre
function clearCanvas(){
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}

//------ SERPENT ---------

//Dessin du corps serpent Vert
function drawSnakePart (snakePart) {
    ctx.fillStyle = "lightgreen";
    ctx.strokeStyle = "darkgreen";
    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    ctx.strokeRect(snakePart.x, snakePart.y, 10,10);
}

//Cumul des elements corps serpent
function drawSnake() {  
    snake.forEach(drawSnakePart);
}

//Tête du serpent avec notion de vélocité 
function advanceSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy}; //modifie les coordonnées du 1er element du tableau snake
    snake.unshift(head); // insère la tete au début du serpent
    const didEatFood = snake[0].x === foodX && snake[0].y === foodY; //boolean true si tete serpent est sur pomme
    if(didEatFood) {
        score +=10; //augmente le score
        document.getElementById('score').innerHTML = score; //augmente le score
        createFood(); // crée une nouvelle pomme simangée par le t^té et ne retire pas le dernier élément (comme si on ajoutait un element)
    }
    else {
        snake.pop(); //si la pomme n'est pas mangée retire le dernier élément car en crée un à chaque mouvement de tête
    }
}

//définition des touches clavier et direction
function changeDirection(event) {  
    const LEFT_KEY = 37;  
    const RIGHT_KEY = 39;  
    const UP_KEY = 38;  
    const DOWN_KEY = 40;
    const keyPressed = event.keyCode;
    const goingUp = dy === -10;  
    const goingDown = dy === 10;  
    const goingRight = dx === 10;  
    const goingLeft = dx === -10;
    if (keyPressed === LEFT_KEY && !goingRight) {dx = -10; dy = 0;} //permet eviter demi tour
    if (keyPressed === UP_KEY && !goingDown) {dx = 0; dy = -10;}//permet eviter demi tour
    if (keyPressed === RIGHT_KEY && !goingLeft) {dx = 10; dy = 0;}//permet eviter demi tour
    if (keyPressed === DOWN_KEY && !goingUp) {dx = 0; dy = 10;}//permet eviter demi tour
}




//------ NOURITURE ---------

//chiffre aleatoire
function randomTen(min,max) {
    return Math.round((Math.random()*(max-min)+min)/10)*10;
}

//chiffre aleatoire X et Y dans canvas & fonction pour éviter de créer une pomme sur le serpent
function createFood() {
        foodX = randomTen(0, gameCanvas.width-10);
        foodY = randomTen(0, gameCanvas.height-10);
        snake.forEach(function isFoodOnSnake(part) {
            const foodIsOnSnake = part.x == foodX && part.y == foodY 
            if (foodIsOnSnake) createFood(); //si la pomme est sur le serpent relance X et Y aléatoire
            }
        );
}

//Dessin de la pomme rouge
function drawFood() {
    ctx.fillStyle = "red";
    ctx.strokestyle = "darkred";
    ctx.fillRect(foodX, foodY, 10, 10);
    ctx.strokeRect(foodX, foodY, 10, 10);
}


//fonction Game Over
function didGameEnd() {
    for(let i=4; i<snake.length; i++) { //si le serpent se mange lui meme = true
        const didCollide = snake[i].x === snake[0].x && snake[i].y === snake[0].y  
            if(didCollide)
                return true
            }
    const hitLeftWall = snake[0].x<0; //si le serpent cogne un mur = true
    const hitRightWall = snake[0].x > gameCanvas.width - 10;  
    const hitTopWall = snake[0].y<0;  
    const hitBottomWall = snake[0].y > gameCanvas.height - 10;
    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall
}



function main() {
    if (didGameEnd()) {
        return;
    }
    setTimeout(function onTick() {
        clearCanvas();
        drawFood();
        advanceSnake();
        drawSnake();
        main(); //fonction qui s'appelle elle même
        },
    100)
};

document.addEventListener("keydown", changeDirection);
createFood();
main();
