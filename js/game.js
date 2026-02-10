class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
        
        this.input = new Input();
        this.road = new Road();
        this.car = new Car();
        
        this.lastTime = 0;
        this.playing = false;
        
        // UI Elements
        this.elements = {
            speed: document.getElementById('speed-display'),
            dist: document.getElementById('dist-display'),
            startScreen: document.getElementById('start-screen'),
            ui: document.getElementById('ui-layer')
        };

        this.resize();
        window.addEventListener('resize', () => this.resize());

        this.loop = this.loop.bind(this);
        requestAnimationFrame(this.loop);
    }

    resize() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
    }

    start() {
        this.playing = true;
        this.elements.startScreen.classList.add('hidden');
        this.road.reset();
        this.car.speed = 0;
        this.car.x = 0;
        this.car.z = 0;
    }

    update(dt) {
        if (!this.playing) {
            if (this.input.start) {
                this.start();
            }
            return;
        }

        this.car.update(this.input, dt);
        
        // Update UI
        this.elements.speed.innerText = Math.floor(this.car.speed / 100);
        this.elements.dist.innerText = Math.floor(this.car.z / 1000);
    }

    render() {
        // Clear background
        this.ctx.fillStyle = COLORS.sky;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw Sun/Moon or Horizon logic could go here
        
        // Render Road
        // We pass the car's Z position to the road to handle the scrolling loop
        this.road.render(this.ctx, this.car.z, this.car.x, this.width, this.height);

        // Render Car
        this.car.render(this.ctx, this.width, this.height);
    }

    loop(timestamp) {
        const dt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        this.update(dt);
        this.render();

        requestAnimationFrame(this.loop);
    }
}

// Start the game instance
window.onload = () => {
    const game = new Game();
};
