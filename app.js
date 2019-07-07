
var vec=new Float32Array(4096);
var am=new AM(4096,32,0);
var img;
var trainingData=[];
var training=false;
var trainingCount=0;

function preload(){
  img=loadImage('Lübeck.jpg');
}

function setup(){
 createCanvas(800,600);
}

function draw(){
  if(trainingData.length===0) background('grey');
  image(img,0,0); 
  if(training){
    trainingCount++;
    fill(255).strokeWeight(10).textSize(30);
    text('Training Cycles:'+trainingCount,5,30);
    for(var i=0;i<trainingData.length;i++){
      am.train(trainingData[i],trainingData[i]);
    } 
    return;
  }
  fill(0,0).strokeWeight(1);
  if(mouseX<600-33 && mouseY<400-33){
    square(mouseX-1,mouseY-1,34);    
  }  
  if(mouseX===pmouseX  && mouseY===pmouseY){
    getData(vec,mouseX,mouseY);
    am.recall(vec,vec);
    setData(vec,5,405);
    copy(5,405,32,32,50,405,128,128);
  }
}

function mouseClicked(){
  if(trainingData.length<32){  // new training square   
    var x=trainingData.length;
    var y=int(x/4);
    x %=4;
    copy(mouseX,mouseY,32,32,x*40+610,y*40+10,32,32);
    var d=new Float32Array(4096);
    getData(d,mouseX,mouseY);
    trainingData.push(d);
  }
}

function keyPressed(){ 
  if(keyCode===49){ // 1  train
    if(training){
      training=false;
    }else{
      training=trainingData.length>0; 
      trainingCount=0;
    }
  }
  if(keyCode===48){ // 0 delete training squares
     trainingData=[];  
  }
}

function getData(d,x,y){
  var idx=0;
  for(var px=0;px<32;px++)
    for(var py=0;py<32;py++){
      var c=img.get(x+px,y+py);
      d[idx++]=red(c)-127.5;
      d[idx++]=green(c)-127.5;
      d[idx++]=blue(c)-127.5;
      d[idx++]=0;
    }
}
        
function setData(d,x,y){
  var idx=0;
  for(var px=0;px<32;px++)
    for(var py=0;py<32;py++){
      var r=min(max(d[idx++]+127.5,0),255);
      var g=min(max(d[idx++]+127.5,0),255);
      var b=min(max(d[idx++]+127.5,0),255);
      idx++;
      set(x+px,y+py,color(r,g,b))
    }
  updatePixels();
}