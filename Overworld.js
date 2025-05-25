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
                    
            //Draw lower map
            this.map.drawLowerImage(this.ctx);

            //Draw Game objects
            Object.values(this.map.gameObjects).forEach(object =>{
                object.x += 0.02;
                object.sprite.draw(this.ctx);
            }) 
            
            //Draw upper map
            this.map.drawUpperImage(this.ctx);
           
            requestAnimationFrame(() => {
                step();
            })
        }
        step();
    }
    init(){
        // console.log("Launching Overworld :",this);
        this.map = new OverworldMap(
            window.OverworldMaps.Kitchen
        );
        this.startGameLoop();
    }
}
