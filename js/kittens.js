///FEATURES TO ADD:
// 1: Add a start screen
//--- DONE! 2: Add an end screen (w/ Game Over Message, Press to Restart, New Image, Final Score)
//--- DONE! 3: Press Enter to restart on game-over
//--- DONE! 4: Have 2 different Yeezy Boosts (safe/"real" ones + fake ones that ends the game)
//--- DONE! 5: Add 'bonus' sprite which adds points to conuter
//--- DONE! 6: Add music during gameplay, sound on game-over and when crossing the safe enemy
//--- DONE! 7: Redesign Game-Over screen
//--- DONE! 8: Add Background Music
//--- DONE! 9: Add multiple lives to player
//--- DONE! 10: Player = Kanye
// 11: Make background image pan horizontally


// 10 ELEMENTS FROM EACH YE ALBUM:
// College Dropout: (1)"Two Words Game Over" message in reference to "Two Words" (track 18)
// Late Registration: (2)Jamie Foxx sample from "Gold Digger" (track 4) & (3)Game elements are 'touching' the sky BG image... "Touch The Sky" (track 3)
// Graduation: (4)Bonus Bear +350 Points - Kanye Bear illustration from Graduation
// 808s & Heartbreaks: (5)'Heart' User Lives or Bullets
// My Beautiful Dark Twisted Fantasy: (6)Scream sampled from "Monster" (track 6) + (7)Background Image is a zoom in of 1 of the 9 official alternate album covers
// Yeezus: (8)Game Over song "Bound 2" (track 10) + (9)Red Square motif on the right references album cover's red tape design
// The Life of Pablo: (10)Game Play Background song "Fade" (track 19)


// This sectin contains some game constants. It is not super interesting
var GAME_WIDTH = 750;
var GAME_HEIGHT = 550;

var ENEMY_WIDTH = 75;
var ENEMY_HEIGHT = 156;
var MAX_ENEMIES = 4;

var FRIENDLY_WIDTH = 75;
var FRIENDLY_HEIGHT = 156;
var MAX_FRIENDLY = 1.5;

var BONUS_WIDTH = 75;
var BONUS_HEIGHT = 119;
var MAX_BONUS = 1;

var GOLD_WIDTH = 75;
var GOLD_HEIGHT = 156;
var MAX_GOLD = .5;

var HEART_WIDTH = 75;
var HEART_HEIGHT = 62;
var MAX_HEARTS = 3;

var PLAYER_WIDTH = 75;
var PLAYER_HEIGHT = 54;

var COUNTER = 60;

// Game music and sounds
var BGM = document.getElementById('bgm');
BGM.volume = .6;
var END_SONG = document.getElementById('end_song');
END_SONG.volume = .6;
var KNYE_1 = document.getElementById('kanye1');
var KNYE_2 = document.getElementById('kanye2');
var KNYE_3 = document.getElementById('scream');
KNYE_3.volume = .3;
var GOD = document.getElementById('god');

// These constants keep us from using "magic numbers" in our code
var LEFT_ARROW_CODE = 37;
var RIGHT_ARROW_CODE = 39;
var UP_ARROW_CODE = 38;
var DOWN_ARROW_CODE = 40;
var SPACE_CODE = 32;
var ENTER_CODE = 13;

// These constants allow us to DRY
var MOVE_LEFT = 'left';
var MOVE_RIGHT = 'right';
var MOVE_UP = 'up';
var MOVE_DOWN = 'down';
var SPACE = 'space'
var ENTER = 'enter'

// Preload game images
var images = {};
['bonus.png', 'stars2.png', 'fakes.png', 'boosts.png', 'player2.png', 'jesus.png', 'heart.png'].forEach(imgName => {
    var img = document.createElement('img');
    img.src = 'images/' + imgName;
    images[imgName] = img;
});


// This section is where you will be doing most of your coding
class Entity {
    render(ctx) {
        ctx.drawImage(this.sprite, this.x, this.y);
    }
}

class Enemy extends Entity {
    constructor(xPos) {
        super();
        this.x = xPos;
        this.y = -ENEMY_HEIGHT;
        this.sprite = images['fakes.png'];

        // Each enemy should have a different speed
        this.speed = Math.random() / 2 + 0.25;
    }

    update(timeDiff) {
        this.y = this.y + timeDiff * this.speed;
    }
}

class Bonus extends Entity {
    constructor(xPos) {
        super();
        this.x = xPos;
        this.y = -BONUS_HEIGHT;
        this.sprite = images['bonus.png'];

        // Each enemy should have a different speed
        this.speed = Math.random() / 4 + 0.25;
    }
    update(timeDiff) {
        this.y = this.y + timeDiff * this.speed;
    }
}

class Gold extends Bonus {
    constructor(xPos) {
        super();
        this.x = xPos;
        this.y = -GOLD_HEIGHT;
        this.sprite = images['jesus.png'];

        // Each enemy should have a different speed
        this.speed = Math.random() / 4 + 0.25;
    }
    update(timeDiff) {
        this.y = this.y + timeDiff * this.speed;
    }
}

class Friend extends Entity {
    constructor(xPos) {
        super();
        this.x = xPos;
        this.y = -FRIENDLY_HEIGHT;
        this.sprite = images['boosts.png'];

        // Each enemy should have a different speed
        this.speed = Math.random() / 10 + 0.25;
    }

    update(timeDiff) {
        this.y = this.y + timeDiff * this.speed;
    }
}

class Player extends Entity {
    constructor() {
        super();
        this.x = 5 * PLAYER_WIDTH;
        this.y = GAME_HEIGHT - 150;
        this.sprite = images['player2.png'];
    }

    // This method is called by the game engine when left/right/up/down arrows are pressed
    move(direction) {
        if (direction === MOVE_LEFT && this.x > 0) {
            this.x = this.x - PLAYER_WIDTH;

        } else if (direction === MOVE_RIGHT && this.x < GAME_WIDTH - PLAYER_WIDTH) {
            this.x = this.x + PLAYER_WIDTH;

        } else if (direction === MOVE_UP && this.y > 0) {
            this.y = this.y - PLAYER_HEIGHT;

        } else if (direction === MOVE_DOWN && this.y < GAME_HEIGHT - PLAYER_HEIGHT) {
            this.y = this.y + PLAYER_HEIGHT;
        }
    }
}

/*
This section is a tiny game engine.
This engine will use your Enemy and Player classes to create the behavior of the game.
The engine will try to draw your game at 60 frames per second using the requestAnimationFrame function
*/
class Engine {
    constructor(element) {

        // Setup enemies, making sure there are always three
        this.setupEnemies();
        this.setupFriends();
        this.setupBonus();
        this.setupGold();

        // Setup the player
        this.player = new Player();

        // Setup the <canvas> element where we will be drawing
        var canvas = document.createElement('canvas');
        canvas.width = GAME_WIDTH;
        canvas.height = GAME_HEIGHT;
        element.appendChild(canvas);

        this.ctx = canvas.getContext('2d');

        // Since gameLoop will be called out of context, bind it once here.
        this.gameLoop = this.gameLoop.bind(this);
    }

    /*
     The game allows for 5 horizontal slots where an enemy can be present.
     At any point in time there can be at most MAX_ENEMIES enemies otherwise the game would be impossible
     */
    setupEnemies() {
        if (!this.enemies) {
            this.enemies = [];
        }

        while (this.enemies.filter(e => !!e).length < MAX_ENEMIES) {
            this.addEnemy();
        }
    }

    // This method finds a random spot where there is no enemy, and puts one in there
    addEnemy() {
        var enemySpots = GAME_WIDTH / ENEMY_WIDTH;

        var enemySpot;
        // Keep looping until we find a free enemy spot at random
        while (enemySpot === true || this.enemies[enemySpot]) {
            enemySpot = Math.floor(Math.random() * enemySpots);
        }
        this.enemies[enemySpot] = new Enemy(enemySpot * ENEMY_WIDTH);
    }

    setupFriends() {
        if (!this.friends) {
            this.friends = [];
        }

        while (this.friends.filter(e => !!e).length < MAX_FRIENDLY) {
            this.addFriend();
        }
    }

    // This method finds a random spot where there is no enemy, and puts one in there
    addFriend() {
        var friendSpots = GAME_WIDTH / FRIENDLY_WIDTH;

        var friendSpot;
        // Keep looping until we find a free enemy spot at random
        while (friendSpot === true || this.friends[friendSpot]) {
            friendSpot = Math.floor(Math.random() * friendSpots);
        }
        this.friends[friendSpot] = new Friend(friendSpot * FRIENDLY_WIDTH);
    }

    setupBonus() {
        if (!this.bonus) {
            this.bonus = [];
        }

        while (this.bonus.filter(e => !!e).length < MAX_BONUS) {
            this.addBonus();
        }
    }

    addBonus() {
        var bonusSpots = GAME_WIDTH / BONUS_WIDTH;

        var bonusSpot;
        // Keep looping until we find a free enemy spot at random
        while (bonusSpot === true || this.bonus[bonusSpot]) {
            bonusSpot = Math.floor(Math.random() * bonusSpots);
        }
        this.bonus[bonusSpot] = new Bonus(bonusSpot * BONUS_WIDTH);
    }

    setupGold() {
        if (!this.gold) {
            this.gold = [];
        }

        while (this.gold.filter(e => !!e).length < MAX_GOLD) {
            this.addGold();
        }
    }

    addGold() {
        var goldSpots = GAME_WIDTH / GOLD_WIDTH;

        var goldSpot;
        // Keep looping until we find a free enemy spot at random
        while (goldSpot === true || this.gold[goldSpot]) {
            goldSpot = Math.floor(Math.random() * goldSpots);
        }
        this.gold[goldSpot] = new Gold(goldSpot * GOLD_WIDTH);
    }

    // This method kicks off the game
    start() {
        this.score = 0;
        this.lastFrame = Date.now();

        // Listen for keyboard left/right and update the player
        document.addEventListener('keydown', e => {
            if (e.keyCode === LEFT_ARROW_CODE) {
                this.player.move(MOVE_LEFT);
            } else if (e.keyCode === RIGHT_ARROW_CODE) {
                this.player.move(MOVE_RIGHT);
            } else if (e.keyCode === UP_ARROW_CODE) {
                this.player.move(MOVE_UP);
            } else if (e.keyCode === DOWN_ARROW_CODE) {
                this.player.move(MOVE_DOWN);
            } else if (e.keyCode === ENTER_CODE) {
                document.location.reload();
            }

        });

        this.gameLoop();
        BGM.play();
    }

    /*
    This is the core of the game engine. The `gameLoop` function gets called ~60 times per second
    During each execution of the function, we will update the positions of all game entities
    It's also at this point that we will check for any collisions between the game entities
    Collisions will often indicate either a player death or an enemy kill

    In order to allow the game objects to self-determine their behaviors, gameLoop will call the `update` method of each entity
    To account for the fact that we don't always have 60 frames per second, gameLoop will send a time delta argument to `update`
    You should use this parameter to scale your update appropriately
     */
    gameLoop() {
        // Check how long it's been since last frame
        var currentFrame = Date.now();
        var timeDiff = currentFrame - this.lastFrame;

        // Increase the score!
        this.score += timeDiff;

        // Call update on all enemies
        this.enemies.forEach(enemy => enemy.update(timeDiff));
        this.friends.forEach(friend => friend.update(timeDiff));
        this.bonus.forEach(bonus => bonus.update(timeDiff));
        this.gold.forEach(gold => gold.update(timeDiff));


        // Draw everything!
        this.ctx.drawImage(images['stars2.png'], 0, 0); // draw the sky bg
        this.enemies.forEach(enemy => enemy.render(this.ctx)); // draw the fake yeezys
        this.friends.forEach(friend => friend.render(this.ctx)); // draw the real boosts
        this.bonus.forEach(bonus => bonus.render(this.ctx)); // draw the bonus bear
        this.gold.forEach(gold => gold.render(this.ctx)); // draw the jesus piece
        this.ctx.drawImage(images['heart.png'], 575, 8); // draw the heart
        this.player.render(this.ctx); // draw kanye

        // Check if any enemies should die
        this.enemies.forEach((enemy, enemyIdx) => {
            if (enemy.y > GAME_HEIGHT) {
                delete this.enemies[enemyIdx];
            }
        });
        this.setupEnemies();

        this.friends.forEach((friend, friendIdx) => {
            if (friend.y > GAME_HEIGHT) {
                delete this.friends[friendIdx];
            }
        });
        this.setupFriends();

        this.bonus.forEach((bonus, bonusIdx) => {
            if (bonus.y > GAME_HEIGHT) {
                delete this.bonus[bonusIdx];
            }
        });
        this.setupBonus();

        this.gold.forEach((gold, goldIdx) => {
            if (gold.y > GAME_HEIGHT) {
                delete this.gold[goldIdx];
            }
        });
        this.setupGold();

        // Check if real pair of Boosts
        if (this.isGold()) {
            this.ctx.fillStyle = "red";
            this.ctx.fillRect(530, 230, 220, 200);
            this.ctx.font = 'bold 60px VT323';
            this.ctx.fillStyle = '#000000';
            this.ctx.fillText('+ 1,050', 560, 340);
            this.score += 1050;
            GOD.play();
            BGM.volume = .02;
            setTimeout(function () {
                BGM.volume = .6;
            }, 1000)
        }

        // Check if Bonus Bear
        if (this.isBonusPoint()) {
            this.ctx.fillStyle = "red";
            this.ctx.fillRect(530, 230, 220, 200);
            this.ctx.font = 'bold 75px VT323';
            this.ctx.fillStyle = '#000000';
            this.ctx.fillText('+ 350', 570, 355);
            this.score += 350;
            KNYE_1.play();
            BGM.volume = .02;
            setTimeout(function () {
                BGM.volume = .38;
            }, 400)
        }

        // Check how many lives left
        if (this.isPlayerDead()) {
            COUNTER -= 1;
            this.ctx.font = 'bold 90px VT323';
            this.ctx.fillStyle = '#000000';
            this.ctx.fillText('-1', 350, 295);

            if (COUNTER < 59) {
                GOD.pause();
                BGM.volume = 0;
                setTimeout(function () {
                    BGM.volume = .38;
                }, 550)
                KNYE_2.play();
                MAX_HEARTS = 2;
            }
            if (COUNTER < 30) {
                KNYE_2.play();
                GOD.pause();
                BGM.volume = 0;
                setTimeout(function () {
                    BGM.volume = .38;
                }, 550)
                MAX_HEARTS = 1;
            }
            if (COUNTER < 2) {
                MAX_HEARTS = 0;
            }
        }

        // Check if player is dead
        // If they are dead, then it's game over!
        if (MAX_HEARTS == 0) {
            this.ctx.fillStyle = "red";
            this.ctx.fillRect(165, 230, 425, 100);
            this.ctx.font = '700 40px VT323';
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillText('FINAL SCORE ' + this.score, 8, 40);
            this.ctx.fillText(MAX_HEARTS + " LIVES", 630, 40);
            this.ctx.fillText('TWO WORDS: GAME OVER', 218, 290);
            this.ctx.fillStyle = "black";
            this.ctx.fillRect(276, 450, 200, 45);
            this.ctx.font = '700 20px VT323';
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillText('TRY AGAIN > HIT ENTER', 291, 477);
            BGM.pause();
            GOD.pause();
            KNYE_1.pause();
            KNYE_2.pause();
            KNYE_3.play();
            setTimeout(function () {
                END_SONG.play();
                setTimeout(function () {
                    END_SONG.pause()
                }, 13400);
            }, 1390)


        } else {
            // If player is not dead, then draw the score
            this.ctx.font = 'bold 40px VT323';
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillText(this.score, 8, 40);
            this.ctx.font = 'bold 40px VT323';
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillText(MAX_HEARTS + " LIVES", 630, 40);

            // Set the time marker and redraw
            this.lastFrame = Date.now();
            requestAnimationFrame(this.gameLoop);
        }
    }

    // Element Collisions
    isPlayerDead() {
        var enemyHit = (enemy) => {
            if (enemy.x === this.player.x &&
                (enemy.y > this.player.y - ENEMY_HEIGHT) &&
                enemy.y < this.player.y) {
                return true;
            }
        };
        return this.enemies.some(enemyHit);
    }

    isFriend() {
        var friendHit = (friend) => {
            if (friend.x === this.player.x &&
                (friend.y > this.player.y - FRIENDLY_HEIGHT) &&
                friend.y < this.player.y) {
                return true;
            }
        };
        return this.friends.some(friendHit);
    }

    isBonusPoint() {
        var bonusHit = (bonus) => {
            if (bonus.x === this.player.x &&
                (bonus.y > this.player.y - BONUS_HEIGHT) &&
                bonus.y < this.player.y) {
                return true;
            }
        };
        return this.bonus.some(bonusHit);
    }

    isGold() {
        var goldHit = (gold) => {
            if (gold.x === this.player.x &&
                (gold.y > this.player.y - GOLD_HEIGHT) &&
                gold.y < this.player.y) {
                return true;
            }
        };
        return this.gold.some(goldHit);
    }
}

// This section will start the game
var gameEngine = new Engine(document.getElementById('app'));
gameEngine.start();