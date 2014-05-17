var dark = "#222";

var a = [s(1),l(0.02),,,l(0.04),,l(0.02),,,,r(0.01),s(0.5),,r(0.05),,r(0.5),,l(0.05),,s(0.5),,l(0.05),,s(0.1),l(0.1),,l(0.1),,l(0.1),,l(0.05),,l(0.1),,s(0.4),,l(0.05),,l(0.01),,l(0.02),,l(0.5),s(1.3),,s(0.1),l(0.2),,l(0.1),,l(0.06),,s(2),,];

var b = [s(1),l(0.02),,l(0.04),,l(0.05),,,s(7),,l(0.5),s(8.2),,s(1),l(0.44),,,s(0.5),r(0.02),,s(0.3),r(0.2),,r(0.2),,,r(0.06),,r(0.04),,r(0.01),,s(0.5),,,,,,l(0.5),r(0.019),s(4.6),,];

var horizontalLines = {
  ascenderHeight: 0.1,
  capHeight: 0.125,
  median: 0.35,
  baseline: { value: 0.42 },
  descenderHeight: 0.575
};

var verticalLines = {
  leftMargin: 0.1,
  lead: 0.15,
  origin: { value: 0.175 },
  advance: 0.25,
  trail: 0.275
};

var dimensions = {
  width: 300,
  height: 300
};

var ctx, state;

function clear(){
  ctx.clearRect(0,0,dimensions.width,dimensions.height);
}

function main(){
  var canvas = document.getElementById('canvas');
  if (canvas.getContext) {
    ctx = canvas.getContext('2d');
    state = newstate();
    lines(ctx,dimensions.width,dimensions.height);
  }
}

function newstate(){
  var state = new State(verticalLines.lead*dimensions.width,horizontalLines.baseline.value*dimensions.height,0,0,0,0);
  state.velocity = 1;
  state.resistance = 0.01;
  return state;
}

// Draw the glyph guides
function lines(ctx,xscale,yscale){
  var old = ctx.strokeStyle;
  ctx.strokeStyle = "#cccccc";
  var lw = ctx.lineWidth;
  for (var line in horizontalLines) {
    ctx.beginPath();
    var l = horizontalLines[line];
    if (horizontalLines[line].value) {
      l = l.value;
      ctx.strokeStyle = dark;
    } else {
      ctx.strokeStyle = "#cccccc";
    }
    ctx.moveTo(0,l*yscale);
    ctx.lineTo(xscale,l*yscale);
    ctx.stroke();
  }
  for (var line in verticalLines) {
    ctx.beginPath();
    var l = verticalLines[line];
    if (verticalLines[line].value) {
      l = l.value;
      ctx.strokeStyle = dark;
    } else {
      ctx.strokeStyle = "#cccccc";
    }
    ctx.moveTo(xscale*l,0);
    ctx.lineTo(xscale*l,yscale);
    ctx.stroke();
  }

  ctx.strokeStyle = old;
}

function turtle(ctx,state,steps){
  ctx.clearRect(0,0,dimensions.width,dimensions.height);
  state = newstate();
  lines(ctx,dimensions.width,dimensions.height);
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
      },ms);
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
  state.pressure = (state.pressure + (Math.max(0.01,0.5 * (1 - state.velocity)))) / 2;
}

function a(ratio){
  return function(state){
    state.radian = ratio * (Math.PI * 2);
    return true;
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

function s(speed){
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
