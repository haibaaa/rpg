class Person extends GameObject {
  constructor(config){
    super(config);
    this.movingProgressRemaining = 0;
    this.isStanding = false;
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
    if(this.movingProgressRemaining > 0) {
      this.updatePostion();
    } else {

      //more walking states
      
      //we can move and are moving
      if (!state.map.isCutscenePlaying && this.isPlayerControlled && state.arrow){
        this.startBehavior(state, {
          type: "walk",
          direction: state.arrow
        })
      }
      this.updateSprite(state);
    }
  }

  startBehavior(state, behavior) {
    //where and how to walk
    this.direction = behavior.direction;

    if(behavior.type === "walk") {
      //no walking over illegal stuff
      if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {
        behavior.retry && setTimeout(() => {
          this.startBehavior(state, behavior);
        },10)
        return;
      }
      //ready to walk
      state.map.moveWall(this.x, this.y, this.direction);
      this.movingProgressRemaining = 16;
      this.updateSprite(state);
    }

    if(behavior.type === "stand"){
      this.isStanding = true;
      setTimeout(() => {
        utils.emitEvent("PersonStandComplete", {
          whoId: this.id
        });
        this.isStanding = false;
      }, behavior.time)
    }
  }
  
  updatePostion() {
        const [property, change] = this.directionUpdate[this.direction];
        this[property] += change;
        this.movingProgressRemaining -= 1;

        if (this.movingProgressRemaining === 0) {
          //finished walking
          utils.emitEvent("PersonWalkingComplete", {
            whoId: this.id
          })
        }
  }

  updateSprite(){
    if(this.movingProgressRemaining > 0){
      this.sprite.setAnimation("walk-"+this.direction);
      return;
    }
    this.sprite.setAnimation("idle-"+this.direction);
  }
}
