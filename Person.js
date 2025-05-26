class Person extends GameObject {
  constructor(config){
    super(config);
    this.movingProgressRemaining = 0;

    // this.direction = "right";
    
    this.isPlayerControlled = config.isPlayerControlled || false;
        
    this.directionUpdate = {
      "down":["y", 1],
      "up":["y", -1],
      "left":["x", -1],
      "right":["x", 1],
    }
  }

  update(state) {
    this.updatePostion();

    if (this.isPlayerControlled && this.movingProgressRemaining === 0 && state.arrow){
      this.direction = state.arrow;
      this.movingProgressRemaining = 16;
    }
  }

  updatePostion() {
    if(this.movingProgressRemaining > 0) {
      const [property, change] = this.directionUpdate[this.direction];
      this[property] += change;
      this.movingProgressRemaining -= 1;
    }
  }
}
