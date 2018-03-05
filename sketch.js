let waves = [];
var time;
var scrollbar;
var speedOfSound = 343;
var groundHeight = 60;
var person;
var imgJet, imgHappy, imgSad;

//TODO! Text as you increase the speed which points to the different things that happen as you increase the speed
// 0 m/s: Instructions to increase the volocity of the jet.
// 1m/s: 100m/s as the jet moves forward the air in front of it is compressed and the pressure wave escapes at the speed of speedOfSound
// 101 m/s to 200m/s the air in front of the craft is compressed
// 201 m/s 343 the
//TODO! get a better image for the person, what about clip arts?

var start = {
  x: 500,
  y: 200
}
function setup() {
  time = millis();
  // put setup code here
  createCanvas(1000,400);
  waves.push(new waveFront(start.x,start.y));
  scrollbar = new createScrollBar(height - 10, 20);
  imgJet = loadImage("./tornado-jet-plane.png");
  imgHappy = loadImage("./happy.png");
  imgSad = loadImage("./annoyed.png");
  person = new Person(500, 290);
}


var diameter = 0;
var speed = 0

function draw() {
  // put drawing code here
  background (135,206,250);
  image(imgJet,width/2-imgJet.width/5,height/2-imgJet.height/10,imgJet.width/5,imgJet.height/5);
  speed = map(scrollbar.xVal-2,0,width,0,3);
  if (millis()> time + 500){
    waves.push(new waveFront(start.x,start.y));
    time = millis();
  }
  person.draw();
  waves.forEach(function(item,index){
    if (item.a <= 0 ){
      waves.splice(index,1);
    }
    //print(waves.length);
    item.draw();
  })

  //Ground
  stroke(96,128,56)
  fill(96,128,56);


  rect(0,height-groundHeight,width,groundHeight);

  scrollbar.draw();

  // Text
  displayTxt();

  // Text with the wind speed
  textSize(20);
  text(Math.round(speed * speedOfSound) + " m/s",scrollbar.h - 10,scrollbar.y - 20);
}

function mouseClicked(){
  if (!scrollbar.overEvent()){
    waves = [];
  }
}

class Person{
  constructor(x, y){
    this.x = x
    this.y = y
    this.width = 50
    this.height = 50
  }

  draw(){
    this.x -= speed *2;
    if (this.x <= 0-this.width){
      this.x = width;
    };

    if(Math.round(speed * speedOfSound) > 343){
      image(imgSad,this.x,this.y,this.width,this.height);
    } else {
      image(imgHappy,this.x,this.y,this.width,this.height);
    };

  }
}

class waveFront{
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.diameter = 0;
    this.a = 255;
    this.fadeSpeed = 0.5
  }

  draw(){
    noFill();
    strokeWeight(3);
    stroke(0,0,0,this.a);
    this.x -= speed;
    ellipse(this.x ,this.y,this.diameter,this.diameter);
    this.diameter += 2;
    this.a -= this.fadeSpeed;
  }

}

function displayTxt(){
  let xStart = 0.6
  let txtWidth = (1-xStart)*width;
  let x = width * xStart;
  let y = 30;
  var txt;
  var speedMS = Math.round(speed * speedOfSound);
  if (speedMS < 50){
    txt =
      "Welcome! \n" +
      "Use the scroll bar to increase the jet's speed.\n"+
      "Click the canvas to clear the wave fronts.";
  } else if (speedMS<150){
    txt =
      "As an object travels through the atmosphere, "+
      "it compresses the air in front of it, "+
      "producing a pressure wave. "+
      "This pressure wave dissipates at the speed of sound.";
  } else if (speedMS<300){
    txt =
      "As the speed increases, because the waves in front cannot get out of the way of each other, they are forced together or compressed."
  } else if (speedMS<400){
    txt =
      "At the speed of sound,  a critical speed known as Mach 1 (343m/s), they eventually merge into a single shock wave."
  } else if (speedMS<600){
    txt =
      "Once the speed of sound is exceeded the object leaves behind a “Mach Cone”, a pressure cone where the edges constructively interfere and create the shock wave or the characteristic sonic boom heard on the ground."
  } else {
    txt =
      "The point where this shock wave meets, the ground is described as the “boom carpet” and moves along at the same velocity as the object.  Contrary to popular belief there is no one boom, the boom is continuous and is merely experienced as such when it passes the observer.";
  }

  text(txt, x, y, txtWidth)
}

class createScrollBar{
  constructor(y, h){
    this.y = y;
    this.xVal = 2//width/2;
    this.h = h;
    this.loose = 4;
  }

  update(){
    if(this.overEvent() && mouseIsPressed){
      var actualX;
      if (mouseX < 0){
        actualX = 0;
      } else if (mouseX > width) {
        actualX = width;
      } else {
        actualX = mouseX;
      }
      this.xVal = Math.round(this.xVal + (actualX-this.xVal)/this.loose);
    }
  }

  overEvent(){
    if (mouseY< this.y + this.h/2 && mouseY > this.y - this.h -2){
      return true;
    }
  }

  draw(){
    this.update()
    //Draw the bar
    strokeWeight(2);
    stroke(200);
    fill(200);
    rect(0,this.y-(this.h/2),width, this.h);

    // Draw this box
    stroke(50);
    fill(50);
    rect(this.xVal-10,this.y-(this.h/2)+1,20, this.h - 4);
  }
}
