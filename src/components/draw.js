export default function Draw(canvas) {

  this.ctx; this.component;
  this.canvas = canvas;
  this.init = function(component) {
    this.ctx = this.canvas.getContext("2d");
    this.component = component;
    return this;
  }


  this.drawRect = function(x, y, width, height) {
    this.ctx.beginPath();
    this.ctx.rect(x, y, width, height);
    this.ctx.stroke();
  }

  this.drawOval = function(x, y, r) {

  }

  this.drawRoundRect = function(x, y, width, height, corner) {

  }

  this.drawImage = function(x, y, width, height, data) {

  }


}
