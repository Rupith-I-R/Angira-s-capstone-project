var boy_running, boy_collided;
var boy_runningImg, boy_collidedImg;
var PLAY=1;
var END=0;
var gameState = PLAY;
var bg, bgImg;
var obstacleImg, obstacle, obstacle2Img, obstaclesGroup;
var coin, coinImg, coinsGroup;
var gameOver, gameOverImg;
var restart, restartImg;
var invisibleGround;
var score = 0;


function preload(){
    boy_runningImg = loadImage("boyRunning.gif");
    boy_collidedImg = loadImage("boyCollide.png");
    obstacleImg = loadImage("trafficcone.png");
    obstacle2Img = loadImage("barrier.png");
    gameOverImg = loadImage("gameOver.png")
    restartImg = loadImage("restartImg.png")
    bgImg = loadImage("bg.jpg");
    coinImg = loadAnimation("spinning_coin.gif")
    
}
  
  function setup() {
    createCanvas(windowWidth, windowHeight);
    
    boy_running = createSprite(50,height-70,20,50);
    
    boy_running.addImage("running", boy_runningImg);
    //boy_collided.addImage("accident", boy_collidedImg);
    boy_running.scale = 0.5;
    
    /*bg = createSprite(width/2,300,width,150);
    bg.addImage("ground",bgImg);
    bg.x = bg.width /2;
    bg.velocityX = -(6 + 3*score/100);*/
    
    gameOver = createSprite(width/2,height/2-50);
    gameOver.addImage(gameOverImg);
    
    restart = createSprite(width/2,height/2);
    restart.addImage(restartImg);
    
    gameOver.scale = 0.5;
    restart.scale = 0.5;
  
    gameOver.visible = false;
    restart.visible = false;
    
    invisibleGround = createSprite(width/2,height-10,width,80);
    invisibleGround.visible = false;
    
    coinsGroup = new Group();
    obstaclesGroup = new Group();
    
    score = 0;
  }
  
  function draw() {
    
    background(bgImg);
    text("Score: "+ score, 500,50);
    
    if (gameState===PLAY){
      score = score + Math.round(getFrameRate()/60);
      bg.velocityX = -(6 + 3*score/100);
    
      if((touches.length > 0 || keyDown("space")) && boy_running.y >= height-120) {
        boy_running.velocityY = -12;
        touches = [];
      }
    
      boy_running.velocityY = boy_running.velocityY + 0.8
    
      if (bg.x < 0){
        bg.x = bg.width/2;
      }
    
      boy_running.collide(invisibleGround);
      spawnCoins();
      spawnObstacles();
    
      if(obstaclesGroup.isTouching(boy_running)){
          gameState = END;
      }
    }
    else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
      
      //set velcity of each game object to 0
      bg.velocityX = 0;
      boy_running.velocityY = 0;
      obstaclesGroup.setVelocityXEach(0);
      coinsGroup.setVelocityXEach(0);
      
      //change the trex animation
      boy_running.changeAnimation("collided",boy_collided);
      
      //set lifetime of the game objects so that they are never destroyed
      obstaclesGroup.setLifetimeEach(-1);
      coinsGroup.setLifetimeEach(-1);
      
      if(touches.length > 0 || keyDown("space") || mousePressedOver(restart)) {
        reset();
        
      }
    }
    
    
    drawSprites();
  }
  
  function spawnCoins() {
    //write code here to spawn the coins
    if (frameCount % 45 === 0) {
      coin = createSprite(width+20,height-300,40,10);
      coin.y = Math.round(random(10,50));
      coin.addImage(coinImg);
      coin.scale = 0.5;
      coin.velocityX = -3;
      
       //assign lifetime to the variable
      coin.lifetime = 200;
      
      //adjust the depth
      coin.depth = boy_running.depth;
     
      
      //add each cloud to the group
      coinsGroup.add(coin);
    }
    
  }
  
  function spawnObstacles() {
    if(frameCount % 60 === 0) {
      obstacle = createSprite(600,height-70,10,40);
      //obstacle.debug = true;
      obstacle.velocityX = -(6 + 3*score/100);
      
      //generate random obstacles
      var rand = Math.round(random(1,2));
      switch(rand) {
        case 1: obstacle.addImage(obstacleImg);
                break;
        case 2: obstacle.addImage(obstacle2Img);
                break;
        
        default: break;
      }
      
      //assign scale and lifetime to the obstacle           
      obstacle.scale = 0.5;
      obstacle.lifetime = 300;
      //add each obstacle to the group
      obstaclesGroup.add(obstacle);
    }
  }
  
  function reset(){
    gameState = PLAY;
    gameOver.visible = false;
    restart.visible = false;
    
    obstaclesGroup.destroyEach();
    coinsGroup.destroyEach();
    
    boy_collided.changeAnimation("running",boy_running);
    
   
    
    score = 0;
    
  }