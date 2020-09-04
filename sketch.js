//Create variables here
var dog, happyDog, database,foodS, foodStock,milk1;
var feed,addFood;
var feedTime,lastFed;
var foodObj,readGameState,changingGameState;
var Washroom,bedRoom,garden,sadDog;

function preload()
{
  //load images here
  Dog=loadImage("dog.png");
  happyDog=loadImage("dogimg.png");
  Washroom=loadImage("Wash Room.png");
  bedRoom=loadImage("Bed Room.png");
  garden=loadImage("Garden.png");
  sadDog=loadImage("deadDog.png")
 
}

function setup() {
   
  createCanvas(displayWidth - 20, displayHeight-30);
  database = firebase.database();

 dog = createSprite(500,500,5,5);
 dog.addImage(Dog);

 foodObj = new Food();

 feed=createButton("Feed The Dog");
 feed.position(700,95);
 feed.mousePressed(feedDog);


 addFood=createButton("addfood");
 addFood.position(800,95);
 addFood.mousePressed(addFoods);


  
  foodStock = database.ref('food');
  foodStock.on("value",readStock);

  readGameState=database.ref('gameState');
  readGameState.on("value",function(data){
    gameState=data.val();
  });

  
feedTime= database.ref('feedTime');
feedTime.on("value",function(data){
  lastFed= data.val();
});
}


function draw() {  

  currentTime=hour();
  if(currentTime==(lastFed+1)){
    update("Playing");
    foodObj.garden();
  }else if(currentTime==(lastFed+2)){
    update("Sleeping");
    foodObj.bedRoom();
  }else if(currentTime==(lastFed+2)&& currentTime==(lastFed+4)){
    update("Bathing");
    foodObj.Washroom();
  }else{
    update("Hungry");
    foodObj.display();
  }

fill(255,255,254);
textSize(15);
if(lastFed>=12){
  text("last Feed : " +lastFed%12+ "PM",350,30);
} else if(lastFed==0) {
  text("last Feed : 12 Am",350,30);
} else{
  text("last Feed : "+lastFed+"AM",350,30);
}

if(gameState!="Hungry"){
  feed.hide();
  addFood.hide();
  dog.remove();
}else{
  feed.show();
  addFood.show();
  dog.addImage(sadDog);
}



  drawSprites();
  //add styles here
  

stroke(255);
textSize(40);
fill("yellow");
text("food: " + foodS,380,150);



}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}

function feedDog(){
dog.addImage(HappyDog);
foodObj.updateFoodStock(foodObj.getFoodStock()-1);
foodS=foodObj.getFoodStock();
console.log(foodS);
database.ref('/').update({
 food: foodObj.getFoodStock(),
 feedTime:hour(),
 gameState:"Hungry"
})
}



function addFoods(){
  foodS++;
  database.ref('/').update({
    food:foodS
  });
}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}


 
