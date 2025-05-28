class OverworldMap {
  constructor(config) {
    this.gameObjects = config.gameObjects;
    this.walls = config.walls || {};
    
    this.cutSceneSpaces = config.cutSceneSpaces || {};
    
    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;   

    this.isCutScenePlaying = false;
  }

  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(this.lowerImage,utils.withGrid(10.5) - cameraPerson.x, utils.withGrid(6) - cameraPerson.y)
  }
  
  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(this.upperImage,utils.withGrid(10.5) - cameraPerson.x,utils.withGrid(6) - cameraPerson.y)
  }

  isSpaceTaken(currentX, currentY, direction) {
    const{x,y} = utils.nextPosition(currentX, currentY, direction);
    return this.walls[`${x},${y}`] || false;
  }
  
  mountObjects() {
    Object.keys(this.gameObjects).forEach(key => {
      let object = this.gameObjects[key];
      object.id = key;
      object.mount(this);
    })    
  }
    
  async startCutscene(events) {
    this.isCutScenePlaying = true;

    for(let i=0; i<events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map:this,
      })
      await eventHandler.init();
    }
    
    this.isCutScenePlaying = false;
    //reset npc behaviour
    Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this));
  }
  
  checkForActionCutscene() {
    const hero = this.gameObjects["hero"];
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find(object => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
    });
    if (!this.isCutScenePlaying && match && match.talking.length) {
      this.startCutscene(match.talking[0].events);
    }
  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects["hero"];    
    const match = this.cutSceneSpaces[ `${hero.x},${hero.y}` ]
    console.log({match});
  }
  
  addWall(x,y) {
    this.walls[`${x},${y}`] = true;
  }
  
  removeWall(x,y) {
    delete this.walls[`${x},${y}`];
  }

  moveWall(wasX,wasY,direction) {
    this.removeWall(wasX, wasY);
    const {x,y} = utils.nextPosition(wasX, wasY, direction);
    this.addWall(x,y);
  }
}
 window.OverworldMaps = {
  DemoRoom: {
    lowerSrc: "/images/maps/DemoLower.png",
    upperSrc: "/images/maps/DemoUpper.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x:utils.withGrid(5),
        y:utils.withGrid(6)
      }),
      npcA: new Person({
        x:utils.withGrid(7),
        y:utils.withGrid(8),
        src:"/images/characters/people/npc1.png",
        behaviorLoop: [
          {type: "stand", direction: "up", time: 800},
          {type: "stand", direction: "down", time: 800},
          {type: "stand", direction: "left", time: 800},
          {type: "stand", direction: "right", time: 800},
        ],
        talking: [
          {
            events: [
            { type: "textMessage", text: "Hi!", faceHero: "npcA"},
            { type: "textMessage", text: "Now go away"},
            ]
          }
        ]
      }),
      npcB: new Person({
        x:utils.withGrid(2),
        y:utils.withGrid(7),
        src:"/images/characters/people/npc2.png",
        behaviorLoop: [
          {type: "walk", direction: "left"},
          {type: "stand", direction: "up", time: 800},
          {type: "walk", direction: "down"},
          {type: "walk", direction: "right"},
          {type: "walk", direction: "up"},
        ]
      }),
    },
    walls: {
      [utils.asGridCoord(7,6)]: true,
      [utils.asGridCoord(8,6)]: true,
      [utils.asGridCoord(7,7)]: true,
      [utils.asGridCoord(8,7)]: true,
    },
    cutSceneSpaces: {
      [utils.asGridCoord(7,4)]: [
        {
          events: [
            {who: "npcB", type: "walk", direction: "down"},
            { type: "textMessage", text: "no buoy!", faceHero: "npcB"},
          ] 
        }
      ]
    }
  },
  Kitchen: {
    lowerSrc: "/images/maps/KitchenLower.png",
    upperSrc: "/images/maps/KitchenUpper.png",
    gameObjects: {
      hero: new GameObject({
        x:3,
        y:5,
      }),
      npcA: new GameObject({
        x:9,
        y:6,
        src:"/images/characters/people/npc1.png"
      }),
      npcB: new GameObject({
        x:10,
        y:8,
        src:"/images/characters/people/npc3.png"
      }),
    }
  }
     
 }
