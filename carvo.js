var baseline = 0.65;
var topline = 0.35;
var lmargin = 0.1;
var rmargin = 0.9;
var width = 300;
var height = 300;
var maxspeed = 5;
var ctx, state;

function main(){
  var canvas = document.getElementById('canvas');
  if (canvas.getContext) {
    ctx = canvas.getContext('2d');
    state = newstate();
    guides(ctx,width,height);
  }
}

function newstate(){
  var state = new State(lmargin*width,baseline*height,0,0,0,0);
  state.velocity = 1;
  state.resistance = 0.01;
  return state;
}

// Draw the glyph guides
function guides(ctx,xscale,yscale){
  var old = ctx.strokeStyle;
  ctx.strokeStyle = "#cccccc";
  ctx.beginPath();
  ctx.moveTo(0,topline*yscale);
  ctx.lineTo(1.0*xscale,topline*yscale);
  ctx.moveTo(0,baseline*yscale);
  ctx.lineTo(1.0*xscale,baseline*yscale);
  ctx.stroke();
  ctx.strokeStyle = old;
}

function turtle(ctx,state,steps){
  ctx.clearRect(0,0,width,height);
  state = newstate();
  guides(ctx,width,height);
  var len = steps.length;
  forloop(10,0,function(){return len},1,function(i,cont){
    if(steps[i]) {
      if (!steps[i](state,ctx))
        animate(ctx,state);
      cont();
    }
    else {
      for (var x = 0; x < state.velocity; x += 0.1){
        animate(ctx,state);
      }
      cont();
    }
  },function(){
  });
}

function forloop(ms,i,to,inc,body,done){
  if (i < to()) {
    body(i,function(){
      setTimeout(function(){
        forloop(ms,i+inc,to,inc,body,done);
      },5-state.velocity);
    });
  } else {
    done();
  }
}

function animate(ctx,state){
  draw(ctx,state);
  update(state);
}

function update(state){
  state.velocity = Math.max(0,state.velocity-state.resistance);
  state.x = state.x + (Math.cos(state.radian) * 1);
  state.y = state.y + (Math.sin(state.radian) * 1);
  state.pressure = (state.pressure + (Math.max(0.01,0.2 * (1 - state.velocity)))) / 2;
  if (randomIntFromInterval(0,50) == 0){
    state.radian = state.radian + (randomIntFromInterval(-5,5) / 70);
  }
}

function l(ratio){
  return function(state){
    state.radian = state.radian - (ratio * (Math.PI * 2));
  }
}

function r(ratio){
  return function(state){
    state.radian = state.radian + (ratio * (Math.PI * 2));
  }
}

function g(speed){
  return function(state){
    state.velocity = speed;
  }
}

function c(color){
  return function(state,ctx){
    // ctx.fillStyle = color;
    return false;
  }
}

function draw(ctx,state){
  ctx.beginPath();
  ctx.arc(state.x,state.y,1.5 + state.pressure,0,Math.PI*2);
  ctx.fill();
}

function State(x,y,ra,v,r,p){
  this.x = x;
  this.y = y;
  this.radian = ra;
  this.velocity = v;
  this.resistance = r;
  this.pressure = p;
}

function randomIntFromInterval(min,max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}

var a_ = [l(0.02),,l(0.02),g(3),,l(0.03),,g(0.5),r(0.05),,r(0.1),,r(0.1),,r(0.1),,r(0.1),,r(0.05),,g(0.6),,g(0.25),r(0.07),,r(0.07),,r(0.07),,g(0.3),r(0.09),,r(0.09),,r(0.06),,r(0.07),,g(0.5),,,r(0.1),,r(0.1),,r(0.1),,r(0.1),,r(0.05),,g(0.15),,l(0.09),,l(0.09),,l(0.2),,g(0.7),,l(0.01),,l(0.01),,l(0.01),,];
