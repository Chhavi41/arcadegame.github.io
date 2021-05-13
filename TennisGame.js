var canvasContext;
var canvas;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 4;

var player1score = 0;
var computerscore = 0;
var paddle1Y = 250;
var paddle2Y = 250;

var winScreen = false;

const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;
const WINNING_SCORE = 5;

function handleMouseClick(evt) {
    if(winScreen) {
        player1score =0;
        computerscore =0;
        winScreen = false;
    }
}

window.onload = function() {
canvas = document.querySelector("#gameCanvas");
canvasContext = canvas.getContext('2d');
var framesPerSecond = 40;
setInterval(callBooth, 1000/framesPerSecond);

this.canvas.addEventListener('mousedown',handleMouseClick);

canvas.addEventListener('mousemove',function(evt){
      var mousePos = calculateMousePos(evt);
      paddle1Y = mousePos.y-(PADDLE_HEIGHT/2);
    });
}

function calculateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x:mouseX,
        y:mouseY
    };
}


function callBooth() {
    everythingMotion();
    drawEverything();
}

function ballReset() {
    if(player1score >= WINNING_SCORE || computerscore >= WINNING_SCORE) {
        winScreen = true;
    }

    ballSpeedX = -ballSpeedX;
    ballX = canvas.width/2;
    ballY = canvas.height/2;
}

function computerMovement() {
    var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
    if(paddle2YCenter < ballY - 35)
            paddle2Y +=6;
    if(paddle2YCenter > ballY + 35)
            paddle2Y -= 6;
}

function everythingMotion() {
    if(winScreen) {
        return;
    }
    computerMovement();

    ballX = ballX + ballSpeedX; 
    ballY = ballY + ballSpeedY;
    if(ballX < 0) {
        if(ballY > paddle1Y && ballY < paddle1Y+PADDLE_HEIGHT) {
            ballSpeedX=-ballSpeedX;
        var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT/2);
        ballSpeedY = deltaY * 0.35;
        }else {
            computerscore += 1; //must be before ballReset
            ballReset();
        }
    }
      
    if(ballX > canvas.width){
        if(ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT){
            ballSpeedX = - ballSpeedX;
            var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * 0.35;
        }else{
            player1score += 1;
            ballReset();
        }
    }
    if(ballY < 0)
        ballSpeedY = -ballSpeedY;
    if(ballY > canvas.height)
        ballSpeedY = -ballSpeedY;
}

function drawNet() {
	for(var i=0;i<canvas.height;i+=40) {
        canvasContext.fillStyle = '#b1cbf2';
		canvasContext.fillRect(canvas.width/2-1,i,2,20);
	}
}


function drawEverything() {
    canvasContext.fillStyle = 'rgb(25, 33, 56)';
    canvasContext.fillRect(0,0,canvas.width,canvas.height);

    if(winScreen) {
        canvasContext.fillStyle = 'salmon';
        canvasContext.fillText("Click to continue",420,500);
        canvasContext.font = "10px Arial";
        (player1score>=WINNING_SCORE) ? canvasContext.fillText("YOU WON!!",420,280) : canvasContext.fillText("COMPUTER WON",410,280);
        return;
    }

    //net
    drawNet();

    // Left Player
    canvasContext.fillStyle = '#b1cbf2';
    canvasContext.fillRect(0,paddle1Y,PADDLE_WIDTH,PADDLE_HEIGHT);

    //Right Player(Computer)
    canvasContext.fillStyle = '#b1cbf2';
    canvasContext.fillRect(canvas.width-PADDLE_WIDTH,paddle2Y,PADDLE_WIDTH,PADDLE_HEIGHT);

    canvasContext.fillStyle = 'salmon';
    canvasContext.beginPath();
    canvasContext.arc(ballX,ballY,8,0,Math.PI*2,true);
    canvasContext.fill();

    canvasContext.fillText("Player1::"+player1score,100,100);
    canvasContext.font = "12px Arial";
    canvasContext.fillText("Computer::"+computerscore,canvas.width-120,100);
    canvasContext.font = "12px Arial";
    canvasContext.fillText("MAX SCORE::"+WINNING_SCORE,canvas.width/2-6,canvas.height/2);
}
