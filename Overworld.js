class Overworld {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.map = null;
    }

    startGameLoop() {
        const step = () => {
            //Clear screen
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            //Establish camera person
            const cameraPerson = this.map.gameObjects.hero;            

            //update all objects
            Object.values(this.map.gameObjects).forEach(object =>{
                object.update({
                    arrow: this.directionInput.direction,
                    map: this.map,
                });
            
            })
            

            //Draw lower layer
            this.map.drawLowerImage(this.ctx, cameraPerson);

            //Draw Game objects
            Object.values(this.map.gameObjects).sort((a,b) => {
                return a.y - b.y;
            }).forEach(object =>{
                object.sprite.draw(this.ctx,cameraPerson);
            }) 
            
            //Draw upper layer
            this.map.drawUpperImage(this.ctx,cameraPerson);
           
            requestAnimationFrame(() => {
                step();
            });
        }
        step();
    }

    bindActionInput() {
        new KeyPressListener("Enter", () => {
            //is there a person to talk to???
            this.map.checkForActionCutscene()
        })
    }

    bindHeroPositionCheck() {
        document.addEventListener("PersonWalkingComplete", e => {
            if (e.detail.whoId === "hero") {
                // console.log("mf moved!!!")
                //hero has moved 
                this.map.checkForFootstepCutscene();
            }
        });
    }
    
    startMap(mapConfig) {
        this.map = new OverworldMap(
            mapConfig
        );
        this.map.overworld = this;
        this.map.mountObjects();
    }
    
    init(){
        this.startMap(window.OverworldMaps.DemoRoom);

        this.bindActionInput();
        this.bindHeroPositionCheck();
        
        this.directionInput = new DirectionInput();
        this.directionInput.init();
        this.directionInput.direction;
        
        this.startGameLoop();
        // this.map.startCutscene([
        //     {who: "hero", type: "walk", direction: "down"},
        //     {who: "npcA", type: "walk", direction: "left"},
        //     {who: "npcA", type: "walk", direction: "left"},
        //     {who: "npcA", type: "stand", direction: "up", time: 1000},
        // ]);
    }
}
