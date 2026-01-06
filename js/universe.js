window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame;

// Variables
var canva = document.getElementById("universe");
var universe = canva.getContext("2d");
var width = window.innerWidth;
var height = window.innerHeight;
var starDensity = 0.217;
var starCount = width * starDensity;
var circleRadius = width > height ? height / 2 : width / 2;
var circleCenter = {
  x: width / 2,
  y: height / 2,
};
var starColor = "255, 255, 255";
var giantColor = "255, 255, 175";
var cometColor = "226, 225, 224";
var first = true;

// Star class
function Star() {
  this.reset();
}

Star.prototype.reset = function() {
  this.giant = getProbability(3);
  this.comet = this.giant || first ? false : getProbability(10);
  this.x = getRandInterval(0, width);
  this.y = getRandInterval(0, height);
  this.r = getRandInterval(1.1, 2.6);
  this.dx = getRandInterval(-0.5, 0.5);
  this.dy = getRandInterval(-0.5, 0.5);
  this.fadingOut = null;
  this.opacity = 0;
  this.opacityTresh = getRandInterval(0.2, 1 - (this.comet || this.giant ? 0.5 : 0));
};

Star.prototype.draw = function() {
  universe.beginPath();

  if (this.giant) {
    universe.fillStyle = "rgba(" + giantColor + "," + this.opacity + ")";
    universe.arc(this.x, this.y, 2, 0, 2 * Math.PI, false);
  } else if (this.comet) {
    universe.fillStyle = "rgba(" + cometColor + "," + this.opacity + ")";
    universe.arc(this.x, this.y, 1.5, 0, 2 * Math.PI, false);

    //comet tail
    for (var i = 0; i < 30; i++) {
      universe.fillStyle =
        "rgba(" +
        cometColor +
        "," +
        (this.opacity - (this.opacity / 20) * i) +
        ")";
      universe.rect(
        this.x - (this.dx / 4) * i,
        this.y - (this.dy / 4) * i - 2,
        2,
        2
      );
      universe.fill();
    }
  } else {
    universe.fillStyle = "rgba(" + starColor + "," + this.opacity + ")";
    universe.rect(this.x, this.y, this.r, this.r);
  }

  universe.closePath();
  universe.fill();
};

Star.prototype.move = function() {
  this.x += this.dx;
  this.y += this.dy;
  if (this.fadingOut === false) {
    this.reset();
  }
  if (this.x > width - width / 4 || this.y < 0) {
    this.fadingOut = true;
  }
};

(function() {
  setTimeout(function() {
    first = false;
  }, 50);
})();

function getProbability(percents) {
  return Math.floor(Math.random() * 1000) + 1 < percents * 10;
}

function getRandInterval(min, max) {
  return Math.random() * (max - min) + min;
}

function windowResizeHandler() {
  width = window.innerWidth;
  height = window.innerHeight;
  starCount = width * starDensity;
  circleRadius = width > height ? height / 2 : width / 2;
  circleCenter = {
    x: width / 2,
    y: height / 2,
  };

  canva.setAttribute("width", width);
  canva.setAttribute("height", height);
}

// Initialize canvas
canva.setAttribute("width", width);
canva.setAttribute("height", height);

// Create stars
var stars = [];
for (var i = 0; i < starCount; i++) {
  stars.push(new Star());
}

// Animation loop
function animate() {
  universe.clearRect(0, 0, width, height);
  
  stars.forEach(function(star) {
    star.opacity += star.fadingOut ? -0.015 : 0.015;
    
    if (star.opacity > star.opacityTresh) {
      star.fadingOut = true;
    } else if (star.opacity < 0) {
      star.fadingOut = false;
    }
    
    star.move();
    star.draw();
  });
  
  requestAnimationFrame(animate);
}

// Handle window resize
window.addEventListener("resize", windowResizeHandler);

// Start animation
animate();
