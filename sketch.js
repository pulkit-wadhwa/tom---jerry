var PLAY = 1;
var END = 0;
var gameState = PLAY;

var pc, pc_running;
var npc,npcImg;
var ground, invisibleGround, groundImage;


var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  pc_running = loadAnimation("tom.png");
  npcImg = loadAnimation("jerry (1).png","jerry (2).png","jerry (3).png","jerry (4).png")
  
  groundImage = loadImage("ground2.png");
  
  obstacle1 = loadImage("table.png");
  obstacle2 = loadImage("chair.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);

  var message = "This is a message";
 console.log(message)
  
  pc = createSprite(50,160,20,50);
  pc.addAnimation("running", pc_running);
  pc.scale = 0.1;
  
  npc = createSprite(100,160,20,50);
  npc.addAnimation(npcImg);
  npc.scale=1;

  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  

  obstaclesGroup = createGroup();
  

  
  pc.setCollider("rectangle",0,0,pc.width,pc.height);
  pc.debug = false
  
  score = 0;
  
}

function draw() {
  
  background(180);
  
  text("Score: "+ score, 500,50);
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    
    score = score + Math.round(getFrameRate()/40);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    
    if(keyDown("space")&& pc.y >= 100) {
        pc.velocityY = -12;
        jumpSound.play();
    }
    
    
    pc.velocityY = pc.velocityY + 0.8
  
    
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(pc)){        
        jumpSound.play();
        gameState = END;
        dieSound.play()
    }

    if (obstaclesGroup.isTouching(npc)) {
      npc.velocityY = -12;
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
      ground.velocityX = 0;
      pc.velocityY = 0

    obstaclesGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     
     if(mousePressedOver(restart)) {
      reset();
    }
   }
  
 
  
  pc.collide(invisibleGround);

  drawSprites();
}

function reset(){
  gameState=PLAY;
  gameOver.visible=false;
  restart.visible=false;
  
  obstaclesGroup.destroyEach();
  
  
  pc.changeAnimation("running", pc_running);
  
  score=0;
}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      default: break;
    }
   
    obstacle.scale = 0.1;
    obstacle.lifetime = 300;
   
   
    obstaclesGroup.add(obstacle);
 }
}

