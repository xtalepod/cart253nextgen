"use strict";

//a game about cake
//by christale
//a simple game about eating cake or not and what it'll all means
//to exist
//******************************************************
//states

let state = "START";

//sounds for PLAY and GAMEOVER states
let playSound;

//background images for START and PLAY states
let backgroundImage;
let backgroundPlayImage;

// Track whether the game is over
let gameOver = false;

//Details regarding the player
let playerImage;
// Player position, size, velocity
let playerX;
let playerY;
//larger player radius manages to make it so the players face has to overlap 
let playerRadius = 200;
let playerVX = 0;
let playerVY = 0;
//removed player max speed and adding variables for sprint speed
let playerSprintSpeed = 6;
let playerNormalSpeed = 3;
let playerSpeed;
//adding player health variables for normal and sprint mode, removing player max health

let playerHealth;
//this variable for whether being shifted or not
let playerHealthPenalty;
let playerHealthNormalPenalty = 0.1;
let playerHealthSprintPenalty = 0.5;
let playerMaxHealth = 255;

//details regarding the prey
let preyImage;
// Prey position, size, velocity
let preyX;
let preyY;
let preyRadius = 25;
let preyVX;
let preyVY;
let preyMaxSpeed = 4;
let ty;
let tx;
// Prey health
let preyHealth;
let preyMaxHealth = 100;
// Prey fill color
let preyFill = 200;

// Amount of health obtained per frame of "eating" (overlapping) the prey
let eatHealth = 10;
// Number of prey eaten during the game (the "score")
let preyEaten = 0;


//preload
function preload() {

  backgroundImage = loadImage("assets/images/chocolate.jpg");
  playerImage = loadImage("assets/images/tom3.png");
  preyImage = loadImage("assets/images/cake2.png");
  backgroundPlayImage = loadImage("assets/images/cloud.png");
  //Sound for play state
  playSound = loadSound("assets/sounds/theme.mp3");
}
// setup()
//
// Sets up the basic elements of the game
function setup() {
  console.log("Help! I'm not doing anything");
  createCanvas(600, 600);
  // We're using simple functions to separate code out
  setupPrey();
  setupPlayer();
}

// setupPrey()
//
// Initialises prey's position, velocity, and health
function setupPrey() {
  preyX = width / 5;
  preyY = height / 2;
  preyVX = -preyMaxSpeed;
  preyVY = preyMaxSpeed;
  preyHealth = preyMaxHealth;
  tx = random(0, 1000);
  ty = random(0, 1000);
}
// setupPlayer()
//
// Initialises player position and health
function setupPlayer() {
  playerX = 4 * width / 5;
  playerY = height / 2;
  playerHealth = playerMaxHealth;
}

// draw()
//
// While the game is active, checks input
// updates positions of prey and player,
// checks health (dying), checks eating (overlaps)
// displays the two agents.
// When the game is over, shows the game over screen.
function draw() {
  console.log("Help! I'm stuck inside a program!");
  image(backgroundPlayImage, 0, 0);
  backgroundPlayImage.resize(600, 600);

  //the game is started
  if (state === "START") {
    displayStartScreen();
  } else if (state === "PLAY") {
    handleInput();

    movePlayer();
    movePrey();

    updateHealth();
    checkEating();

    drawPrey();
    drawPlayer();
  } else if (state === "GAMEOVER") {
    showGameOver();
  }
}

//setting up the buttons to go from start state to play state
/// Checking play button
function mousePressed() {

  //click rectangle to start game and sound
  if (state === "START") {
    if (mouseX > 230 && mouseX < 380 && mouseY > 500 && mouseY < 550) {
      rect(305, 550, 150, 50);
      playSound.loop();
      state = "PLAY";
    }
  }
}

// handleInput()
//
// Checks arrow keys and adjusts player velocity accordingly
function handleInput() {

  //check for player sprint speed
  if (keyIsDown(SHIFT)) {
    playerSpeed = playerSprintSpeed;
    playerHealthPenalty = playerHealthSprintPenalty;
  }
  //to make it reset when shift is no longer pressed
  else {
    playerSpeed = playerNormalSpeed;
    playerHealthPenalty = playerHealthNormalPenalty;
  }
  // Check for horizontal movement
  if (keyIsDown(LEFT_ARROW)) {
    playerVX = -playerSpeed;
  } else if (keyIsDown(RIGHT_ARROW)) {
    playerVX = playerSpeed;
  } else {
    playerVX = 0;
  }

  // Check for vertical movement
  if (keyIsDown(UP_ARROW)) {
    playerVY = -playerSpeed;
  } else if (keyIsDown(DOWN_ARROW)) {
    playerVY = playerSpeed;
  } else {
    playerVY = 0;
  }
}

// movePlayer()
//
// Updates player position based on velocity,
// wraps around the edges.
function movePlayer() {
  // Update position
  playerX = playerX + playerVX;
  playerY = playerY + playerVY;

  // Wrap when player goes off the canvas
  if (playerX < 0) {
    // Off the left side, so add the width to reset to the right
    playerX = playerX + width;
  } else if (playerX > width) {
    // Off the right side, so subtract the width to reset to the left
    playerX = playerX - width;
  }

  if (playerY < 0) {
    // Off the top, so add the height to reset to the bottom
    playerY = playerY + height;
  } else if (playerY > height) {
    // Off the bottom, so subtract the height to reset to the top
    playerY = playerY - height;
  }
}

// updateHealth()
//
// Reduce the player's health (happens every frame)
// Check if the player is dead
function updateHealth() {

  // Reduce player health remove the things to make it look fancy ;p
  //player health pentalty will be equal to either playerHealthNormalPenalty or
  //playerHealthSprintPenalty which are set in handleInput

  playerHealth -= playerHealthPenalty;
  // Constrain the result to a sensible range
  playerHealth = constrain(playerHealth, 0, playerMaxHealth);
  // Check if the player is dead (0 health)
  if (playerHealth === 0) {
    // If so, the game is over
    state = "GAMEOVER"
  }
}

// checkEating()
//
// Check if the player overlaps the prey and updates health of both
function checkEating() {
  // Get distance of player to prey
  let d = dist(playerX, playerY, preyX, preyY);
  // Check if it's an overlap
  if (d < playerRadius + preyRadius) {
    // Increase the player health
    playerHealth = playerHealth + eatHealth;
    // Constrain to the possible range
    playerHealth = constrain(playerHealth, 0, playerMaxHealth);
    // Reduce the prey health
    preyHealth = preyHealth - eatHealth;
    // Constrain to the possible range
    preyHealth = constrain(preyHealth, 0, preyMaxHealth);

    // Check if the prey died (health 0)
    if (preyHealth === 0) {
      // Move the "new" prey to a random position
      preyX = random(0, width);
      preyY = random(0, height);
      // Give it full health
      preyHealth = preyMaxHealth;
      // Track how many prey were eaten
      preyEaten = preyEaten + 1;
    }
  }
}

// movePrey()
//
// Moves the prey based on random velocity changes
function movePrey() {
  //remove the preys random velocity movement and instead make it move with noise function
  // Use map() to convert from the 0-1 range of the random() function
  // to the appropriate range of velocities for the prey
  preyVX = map(noise(tx), 0, 1, -preyMaxSpeed, preyMaxSpeed);
  preyVY = map(noise(ty), 0, 1, -preyMaxSpeed, preyMaxSpeed);
  //include something to ensure that the noise keeps moving
  tx += 0.02;
  ty += 0.01;

  // Update prey position based on velocity
  preyX = preyX + preyVX;
  preyY = preyY + preyVY;

  // Screen wrapping
  if (preyX < 0) {
    preyX = preyX + width;
  } else if (preyX > width) {
    preyX = preyX - width;
  }

  if (preyY < 0) {
    preyY = preyY + height;
  } else if (preyY > height) {
    preyY = preyY - height;
  }
}

// drawPrey()
//
// Draw the prey as an ellipse with alpha based on health
function drawPrey() {
  image(preyImage, preyX, preyY, preyHealth);
  preyImage.resize(40, 40);
}

// drawPlayer()
//
// Draw the player as an ellipse with alpha value based on health
function drawPlayer() {
  push();
  image(playerImage, playerX, playerY, playerHealth);
  tint(255, 105, 180, playerHealth);
  image(playerImage, playerX, playerY, playerHealth);
  pop();
}

//start state
function displayStartScreen() {
  image(backgroundImage, 0, 0, width, height);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  fill(255, 105, 180);
  textSize(40);
  text("LIFE IS LIKE", 305, 40); // Title
  fill(20);
  textSize(10);
  textStyle(BOLD);
  text("a box of chocolates you always know what you're going to get", 305, 60); // easy button
  textSize(20);
  textStyle(ITALIC, BOLD);
  rectMode(CENTER, CENTER);
  fill(255);
  rect(305, 550, 150, 50);
  fill(0);
  text("NEVER KNOW", 305, 550);
}

// display GAMEOVER state
//
// Display text about the game being over!
function showGameOver() {
  // Set up the font
  textSize(20);
  textAlign(CENTER, CENTER);
  fill(0);
  // Set up the text to display
  let gameOverText = "YOU CANNOT HAVE YOUR\n CAKE AND EAT IT TOO\n"; // \n means "new line"
  gameOverText = gameOverText + "You ate " + preyEaten + "slices\n";
  gameOverText = gameOverText + "before you died."
  // Display it in the centre of the screen
  text(gameOverText, width / 2, height / 2);
}
