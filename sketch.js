var PLAY = 1;
var END = 0;
var gameState = PLAY;

var frisk, frisk_running, frisk_collided;
var sans, sans_running, sans_standing, sans_still;
var ground, invisibleGround, groundImage;
var forest, forestImage;
var cloudsGroup, cloudImage;
var bonesGroup, bone1, bone2, bone3, bone4, bone5, bone6;

var score = 0;
var gameOverImg, restartImg;

function preload(){
  frisk_running = loadAnimation("friskStand.png", "friskWalk.png");
  frisk_collided = loadAnimation("friskCollided.png");
  sans_running = loadAnimation("sansStand.png", "sansWalk.png");
  sans_still = loadAnimation("sansStill.png");
  
  forestImage = loadImage("forest.png");
  
  bone1 = loadImage("bone1.png");
  bone2 = loadImage("bone2.png");
  bone3 = loadImage("bone3.png");
  bone4 = loadImage("bone4.png");
  bone5 = loadImage("bone5.png");
  bone6 = loadImage("bone6.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
}

function setup() {
  createCanvas(800, 450);

  var message = "You have been filled with Determination ❤";
 console.log(message);
  
  frisk = createSprite(300, 300, 20, 50);
  frisk.addAnimation("friskRunning", frisk_running);
  frisk.addAnimation("friskCollided", frisk_collided);
  frisk.scale = 0.1;

  sans = createSprite(50, 300, 20, 50);
  sans.addAnimation("sansRunning", sans_running);
  sans.addAnimation("sansStill", sans_still);
  sans.scale = 0.3;
  
  forest = createSprite(200, 180, 400, 20);
  forest.addImage(forestImage);
  forest.x = forest.width /2;
  
  gameOver = createSprite(300, 100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300, 140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.2;
  
  invisibleGround = createSprite(360, 360, 720, 20);
  invisibleGround.visible = false;
  
  //create Bone Groups
  bonesGroup = new Group();

  frisk.setCollider("rectangle", 0, 100, frisk.width, frisk.height);
  frisk.debug = false;

  sans.setCollider("rectangle", 0, 0, 200, sans.height);
  sans.debug = false;
}

function draw() {
  
  background(225);

  //displaying score
  textSize(21);
  text("Score: " + score, 650, 440);
  
  
  if(gameState === PLAY){

    score = score + Math.round(getFrameRate()/60);

    forest.velocityX = -(4 + 3* score/100)
    
    if (forest.x < 0){
      forest.x = forest.width/2;
    }

    frisk.changeAnimation("friskRunning", frisk_running);
    sans.changeAnimation("sansRunning", sans_running);

    //jump when the space key is pressed
    if(keyDown("space") && frisk.y >= 100) {
      frisk.velocityY = -12;
    }

  //    if(bonesGroup.isTouching(sans)) {
  //    sans.velocityY = -12;
  //  }

    //add gravity
    frisk.velocityY = frisk.velocityY + 0.8;
    sans.velocityY = sans.velocityY + 0.8;
    
    frisk.collide(invisibleGround);
    sans.collide(invisibleGround);

    //spawn bones on the ground
    spawnBones();
    
    if(bonesGroup.isTouching(frisk)){
        //frisk.velocityY = -12;
        gameState = END;
      
    }

    gameOver.visible = false;
    restart.visible = false;

  }
   else if (gameState === END) {

      gameOver.visible = true;
      restart.visible = true;
     
     //change the frisk animation
      frisk.changeAnimation("friskCollided", frisk_collided);
      frisk.velocityX = 0;
      frisk.velocityY = 0;
      sans.changeAnimation("sansStill", sans_still);
      sans.velocityX = 0;
      sans.velocityY = 0;
      sans.setLifetimeEach = -1;
    
      forest.velocityX = 0;
      forest.velocityY = 0;

      bonesGroup.setVelocityXEach(0);        
     
      //set lifetime of the game objects so that they are never destroyed
      bonesGroup.setLifetimeEach(-1);
      
      if(mousePressedOver(restart)) {
        console.log("Reset the Game")
        reset();
        } 
      }
  
  drawSprites();
}

function reset(){
  gameState = PLAY
  gameOver.visible = false;
  restart.visible = false;
  bonesGroup.destroyEach();
  frisk_collided.visible = false;
  frisk.changeAnimation("friskRunning", frisk_running);
  sans.changeAnimation("sansRunning", sans_running);
  score = 0;
}


function spawnBones(){
 if (frameCount % 60 === 0){
   var bone = createSprite(750, 320, 10, 40);
   bone.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: bone.addImage(bone1);
              break;
      case 2: bone.addImage(bone2);
              break;
      case 3: bone.addImage(bone3);
              break;
      case 4: bone.addImage(bone4);
              break;
      case 5: bone.addImage(bone5);
              break;
      case 6: bone.addImage(bone6);
              break;
      default: break;
    }
    
    forest.depth = frisk.depth;
    frisk.depth = frisk.depth + 1;
   
    //assign scale and lifetime to the obstacle           
    bone.scale = 0.2;
    bone.lifetime = 300;
   
   //add each obstacle to the group
    bonesGroup.add(bone);
 }
}