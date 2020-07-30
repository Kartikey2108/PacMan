  let font;
  let gameState = "SS";
  let score = 0;
  let open = 1.98;
  let sign = "add";
  let end_text = "GAME OVER";
  let pacman;
  let standardSize;
  let Blocks = [];
  let Foods = [];
  let Powers = [];
  let Enemies = [];
  let Gate;
  let firedtwice = false;
  let pinky, inky, blinky, clyde, vulnerable;

  function preload() {
    blinky = loadImage('assets/Ghost-blinky.png');
    pinky = loadImage('assets/ghost-pinky.png')
    inky = loadImage('assets/Ghost-inky.png');
    clyde = loadImage('assets/Ghost-Clyde.png');
    vulnerable = loadImage('assets/Ghost-Vunerable.png');
    font = loadFont("Lora-Regular.ttf");
  };
  function setup() {
    var vw, vh;
    if (11 * windowHeight / 7 < windowWidth) {
      standardSize = windowHeight / 14;
      vw = standardSize * 22;
      vh = standardSize * 14;
    } else {
      standardSize = windowWidth / 22;
      vw = standardSize * 22;
      vh = standardSize * 14;
    }
    createCanvas(vw, vh, WEBGL);
    textFont(font);
    textAlign(CENTER);
    textSize(standardSize * 0.5);
    fill(252);
    // strokeWeight(0);
    maze();
  };
  function draw() {
    background(0)
    if (gameState === "Portrait") {
      Rotate();
    } else if (gameState === "SS") {
      StartScreen();
    } else if (gameState === "game") {
      GameScreen();
    } else if (gameState === "go") {
      GameOver();
    }
  };

  function Rotate() {
    console.log(windowWidth, windowHeight);
    text("Try rotating the screen..", 0, 0);
  };

  function StartScreen() {
    text("PRESS ENTER TO START", 0, 0)
  };

  function GameScreen() {
    fill(255, 255, 255)
    text('Score: ' + score, 0, -25 * standardSize / 4);
    if (sign === "add") {
      open += 0.01;
      if (open >= 1.95) sign = "sub";
    } else if (sign === "sub") {
      open -= 0.01;
      if (open <= 1.85) sign = "add";
    }
    createMaze();
    if (Foods.length === 0) {
      gameState = "go";
      end_text = "YOU WIN";
    }
  };

  function GameOver() {
    fill(255);
    text(end_text, 0, -standardSize / 2);
    text("Score: " + score, 0, standardSize / 2);
    text("Press Enter To restart", 0, 6 * standardSize);
  }

  function windowResized() {
    var vw, vh;
    if (11 * windowHeight / 7 < windowWidth) {
      standardSize = windowHeight / 14;
      vw = standardSize * 22;
      vh = standardSize * 14;
      gameState = "SS";
      textSize(standardSize * 0.5);
    } else {
      standardSize = windowWidth / 22;
      vw = standardSize * 22;
      vh = standardSize * 14;
      gameState = "SS";
      textSize(standardSize * 0.5);
    }
    resizeCanvas(vw, vh);
  };

  function Start_Resume() {
    gameState = "game";
    setInterval(() => {
      moveEnemies();
    }, 200);
    setTimeout(() => { activateEnemies() }, 5000);
  }

  function touchStarted() {
    if (!firedtwice) {
      if (gameState === "SS") {
        Start_Resume();
      } else if (gameState === "go") {
        gameState = "SS";
        score = 0;
        maze();
      } else if (gameState === "game") {
        var newx = pacman.x;
        var newy = pacman.y;
        if (windowWidth > windowHeight) {
          if (mouseX < width / 6) {
            pacman.mouth = PI;
            if (pacman.x > -21 / 2) newx -= 1;
          } else if (mouseX > 5 * width / 6) {
            pacman.mouth = 0;
            if (pacman.x < 21 / 2) newx += 1;
          } else if (mouseY < height / 2) {
            pacman.mouth = 3 * HALF_PI;
            if (pacman.y > -11 / 2) newy -= 1;
          } else {
            pacman.mouth = HALF_PI;
            if (pacman.y < 6) newy += 1;
          }
        } else {
          console.log(mouseX, mouseY);
          if (mouseX < width / 4) {
            pacman.mouth = PI;
            if (pacman.x > -21 / 2) newx -= 1;
          } else if (mouseX > 3 * width / 4) {
            pacman.mouth = 0;
            if (pacman.x < 21 / 2) newx += 1;
          } else if (mouseY < height) {
            pacman.mouth = 3 * HALF_PI;
            if (pacman.y > -11 / 2) newy -= 1;
          } else {
            pacman.mouth = HALF_PI;
            if (pacman.y < 6) newy += 1;
          }
        }
        movePac( newx, newy);
      }
      firedtwice = true;
      setTimeout(() => { firedtwice = false }, 100);
    }
  }

  function keyPressed() {
    if (keyCode === ENTER) {
      if (gameState === "SS") { Start_Resume(); }
      else if (gameState === "go") { gameState = "SS"; score = 0; maze(); }
    } else if (gameState === "game") {
      var newx = pacman.x;
      var newy = pacman.y;
      if (keyCode === LEFT_ARROW) {
        pacman.mouth = PI;
        if (pacman.x > -21 / 2) newx -= 1;
      } else if (keyCode === RIGHT_ARROW) {
        pacman.mouth = 0;
        if (pacman.x < 21 / 2) newx += 1;
      } else if (keyCode === UP_ARROW) {
        pacman.mouth = 3 * HALF_PI;
        if (pacman.y > -11 / 2) newy -= 1;
      } else if (keyCode === DOWN_ARROW) {
        pacman.mouth = HALF_PI;
        if (pacman.y < 6) newy += 1;
      }
      movePac( newx, newy);
    }
  }

  function movePac( newx, newy) {
    var flag = true;
    for (var i = 0; i < Blocks.length; i++) {
      var dis = dist(newx * standardSize, newy * standardSize, Blocks[i].x * standardSize, Blocks[i].y * standardSize);
      if (dis < 1) {
        flag = false;
      }
    }
    if (flag === true) {
      pacman.x = newx;
      pacman.y = newy;
    }
    for (i = 0; i < Foods.length; i++) {
      dis = dist(newx * standardSize, newy * standardSize, Foods[i].x * standardSize, Foods[i].y * standardSize);
      if (dis < 1) {
        score += 1;
        Foods.splice(i, 1);
        i--;
      }
    }
    for (i = 0; i < Powers.length; i++) {
      dis = dist(newx * standardSize, newy * standardSize, Powers[i].x * standardSize, Powers[i].y * standardSize);
      if (dis < 1) {
        score += 5;
        pacman.power = true;
        Powers.splice(i, 1);
        i--;
      }
    }
    for (i = 0; i < Enemies.length; i++) {
      dis = dist(newx * standardSize, newy * standardSize, Enemies[i].x * standardSize, Enemies[i].y * standardSize);
      if (dis < 1) {
        if (pacman.power) {
          Enemies[i].state = 0;
          Enemies[i].x = Enemies[i].init.x;
          Enemies[i].y = Enemies[i].init.y;
          score += 100;
          pacman.power = false;
        } else {
          gameState = "go";
          end_text = "YOU LOSE";
        }
      }
    }
  };

  function activateEnemies() {
    for (var i = 0; i < Enemies.length; i++) {
      if (Enemies[i].state === 0) {
        Enemies[i].x = Gate.x;
        Enemies[i].y = Gate.y;
        Enemies[i].state = 1;
      }
    }
  }

  function moveEnemies() {
    for (var i = 0; i < Enemies.length; i++) {
      var newx = Enemies[i].x;
      var newy = Enemies[i].y;
      let dir = int(random(0, 4));
      if (dir === 0) {
        if (newx > -21 / 2) newx -= 1;
      } else if (dir === 1) {
        if (newx < 21 / 2) newx += 1;
      } else if (dir === 2) {
        if (newy > -11 / 2) newy -= 1;
      } else if (dir === 3) {
        if (newy < 6) newy += 1;
      }

      var flag = true;
      for (var j = 0; j < Blocks.length; j++) {
        var dis = dist(newx * standardSize, newy * standardSize, Blocks[j].x * standardSize, Blocks[j].y * standardSize);
        if (dis < 1) {
          flag = false;
        }
      }
      for (j = 0; j < Enemies.length; j++) {
        dis = dist(newx * standardSize, newy * standardSize, Enemies[j].x * standardSize, Enemies[j].y * standardSize);
        if (dis < 1 && i !== j) {
          flag = false;
        }
      }
      if (flag === true) {
        Enemies[i].x = newx;
        Enemies[i].y = newy;
      }
      dis = dist(newx * standardSize, newy * standardSize, pacman.x * standardSize, pacman.y * standardSize);
      if (dis < 1) {
        if (pacman.power) {
          Enemies[i].state = 0;
          Enemies[i].x = Enemies[i].init.x;
          Enemies[i].y = Enemies[i].init.y;
          score += 100;
          pacman.power = false;
        } else {
          gameState = "go";
          end_text = "YOU LOSE";
        }
      }
    }
  }

  function maze() {
    Blocks = [];
    Foods = [];
    Powers = [];
    Enemies = [];
    var fCount = 172;
    var pCount = 8;
    var addedPac = false;
    var level = [
      ['*', '*', '*', '*', '', '', '', '', '*', '*', '*', '*', '*', '*', '', '', '', '', '*', '*', '*', '*'],
      ['*', '', '', '', '', '', '', '', '', '', '*', '*', '', '', '', '', '', '', '', '', '', '*'],
      ['*', '', '*', '*', '', '', '', '*', '*', '', '*', '*', '', '*', '*', '', '', '', '*', '*', '', '*'],
      ['*', '', '*', '*', '', '', '', '', '', '*', '', '', '*', '', '', '', '', '', '*', '*', '', '*'],
      ['*', '', '*', '', '', '', '', '*', '*', '', '', '', '', '*', '*', '', '', '', '', '*', '', '*'],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '*', '*', '', '', '', '*', '', '', '*', '*', '*', '*', '', '', '*', '', '', '', '', '*', ''],
      ['', '', '', '', '', '', '*', '*', '*', '', '*', '*', '', '*', '*', '*', '', '', '', '', '', '*'],
      ['', '*', '*', '', '', '', '*', '', '', '', 'eout', 'eout', '', '', '', '*', '', '', '', '', '', '*'],
      ['*', '', '*', '', '', '', '*', '', '*', '*', '*', '*', '*', '*', '', '*', '', '', '', '', '', '*'],
      ['*', '', '*', '', '', '', '', '', '*', 'e', 'e', 'e', 'e', '*', '', '', '', '', '*', '', '*', ''],
      ['', '', '', '', '', '', '*', '', '*', '*', '*', '*', '*', '*', '', '*', '', '', '', '', '', ''],
      ['', '*', '', '', '*', '', '*', '', '', '', '', '', '', '', '', '*', '', '', '*', '', '', '*'],
      // ['', '*', '', '', '*', '', '*', '', '', '', '', '', '', '', '', '*', '', '', '*', '', '', '*']
    ]
    for (var i = 0; i < 13; i++) {
      for (var j = 0; j < 22; j++) {
        if (level[i][j] === '*') {
          Blocks.push({ x: (j - 11 + 1 / 2), y: (i - 6 + 1 / 2) });
        }
        else if (level[i][j] === '') {
          let r = int(random(0, 20));
          if ((r === 1 || fCount === 0) && pCount > 0) {
            Powers.push({ x: (j - 11 + 1 / 2), y: (i - 6 + 1 / 2) });
            pCount--;
          } else if (r === 2 && !addedPac) {
            pacman = { x: (j - 11 + 1 / 2), y: (i - 6 + 1 / 2), mouth: 0, power: false }
            addedPac = true;
          } else {
            Foods.push({ x: (j - 11 + 1 / 2), y: (i - 6 + 1 / 2) });
            fCount--;
          }
        }
        else if (level[i][j] === 'e') {
          Enemies.push({ x: (j - 11 + 1 / 2), y: (i - 6 + 1 / 2), state: 0, init: { x: (j - 11 + 1 / 2), y: (i - 6 + 1 / 2) } });
        }
        else {
          Gate = { x: (j - 11 + 1 / 2), y: (i - 6 + 1 / 2) };
        }
      }
    }
  }

  function createMaze() {
    fill(255, 255, 100);
    strokeWeight(1);
    arc(pacman.x * standardSize, pacman.y * standardSize, standardSize, standardSize, pacman.mouth - open * PI, pacman.mouth + open * PI, PIE);
    fill(0, 61, 153)
    for (var i = 0; i < Blocks.length; i++) square((Blocks[i].x - 1 / 2) * standardSize, (Blocks[i].y - 1 / 2) * standardSize, standardSize, 20);
    fill(180, 180, 200);
    strokeWeight(0); 
    for (i = 0; i < Foods.length; i++) ellipse(Foods[i].x * standardSize, Foods[i].y * standardSize, standardSize / 4);
    fill(0, 127, 255)
    for (i = 0; i < Powers.length; i++) ellipse(Powers[i].x * standardSize, Powers[i].y * standardSize, 5 * standardSize / 8);
    fill(240, 20, 20)
    image(pacman.power ? vulnerable : blinky, (Enemies[0].x -1/2) * standardSize, (Enemies[0].y -1/2) * standardSize, 7 * standardSize / 8, 7*standardSize /8);
    image(pacman.power ? vulnerable : inky, (Enemies[1].x -1/2) * standardSize, (Enemies[1].y -1/2) * standardSize, 7 * standardSize / 8, 7*standardSize /8);
    image(pacman.power ? vulnerable : pinky, (Enemies[2].x -1/2) * standardSize, (Enemies[2].y -1/2) * standardSize, 7 * standardSize / 8, 7*standardSize /8);
    image(pacman.power ? vulnerable : clyde, (Enemies[3].x -1/2) * standardSize, (Enemies[3].y -1/2) * standardSize, 7 * standardSize / 8, 7*standardSize /8);
  }
