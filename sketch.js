var dog, dogImg, happyDog, happyDogImg, database, foodS, foodStock, lastFed, fedTime, foodObj;

var food, hours;

function preload(){
  dogImg = loadImage("dogImg.png");
  happyDogImg = loadImage("dogImg1.png");
}

function setup() {
	createCanvas(1000, 500);
 
  database = firebase.database();

  foodObj = new Food();

  dog = createSprite(700, 250, 50, 50);
  dog.addImage(dogImg);
  dog.scale = 0.2;
  
  foodStock = database.ref('Food');
  foodStock.on("value", readstock, showError)

  feed = createButton("FEED DRAGO");
  feed.position(850,125);
  feed.mousePressed(FeedDog);
  add = createButton("ADD FOOD");
  add.position(750,125);
  add.mousePressed(AddFood);
}


function draw() {  
  background(46, 139, 87);

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 425,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",425,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 425,30);
   }
   
  feed.mousePressed(function(){
    writeStock(foodS);
    dog.addImage(happyDogImg);
    FeedDog();
  })

  fill(255, 255, 255);
  textSize(15);
  text("Food Remaning : "+foodS,425,150);

  foodObj.display();

  drawSprites();
}

function readstock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function writeStock(x){
  if(x <= 0){
    x = 0;
  }
  else{
    x = x-1;
  }
    database.ref("/").update({
      Food : x,
    });
}

function showError(){
  console.log("Error in writing to the database");
}

function FeedDog(){

  var d = new Date();
  hours = d.getHours();

  dog.addImage(happyDogImg);
  foodObj.updateFoodStock(foodObj.getFoodStock());
   database.ref('/').update({
     Food:foodObj.getFoodStock(),
     FeedTime:hours
   })
  }

function AddFood(){
  foodS++
  database.ref('/').update({
  Food:foodS
  })
}