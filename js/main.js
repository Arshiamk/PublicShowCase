import { World } from "./world.js";
import { Track } from "./track.js";
import { Vehicle } from "./vehicle.js";
import { Input } from "./input.js";
import { clamp } from "./math.js";

// Attract-mode input: the car cruises gently under the title card.
const ATTRACT_INPUT = { throttle: true, brake: false, steer: 0 };

class Game {
  constructor() {
    const canvas = document.getElementById("gameCanvas");
    this.world = new World(canvas);
    this.track = new Track(this.world.scene);
    this.vehicle = new Vehicle(this.world.scene);
    this.input = new Input();
    this.state = "title"; // title → running (game over arrives with scoring)

    this.el = {
      speed: document.getElementById("speed-display"),
      dist: document.getElementById("dist-display"),
      startScreen: document.getElementById("start-screen"),
    };
    this.startS = 0;

    this.last = performance.now();
    requestAnimationFrame((t) => this._loop(t));
  }

  _start() {
    this.state = "running";
    this.el.startScreen.classList.add("hidden");
    this.startS = this.vehicle.s;
    this.vehicle.reset();
  }

  // One fixed-size simulation step. Kept separate from the rAF loop so the
  // automated smoke test can drive the game deterministically.
  step(dt) {
    if (this.state === "title") {
      ATTRACT_INPUT.throttle = this.vehicle.speed < 16;
      this.vehicle.update(ATTRACT_INPUT, dt, this.track);
      if (this.input.consumeStart()) this._start();
    } else {
      this.vehicle.update(this.input, dt, this.track);
      this.el.speed.textContent = Math.round(this.vehicle.kmh);
      this.el.dist.textContent = Math.round(this.vehicle.s - this.startS);
    }

    this.track.update(this.vehicle.s);
    this.world.updateCamera(this.track, this.vehicle);
  }

  _loop(now) {
    const dt = clamp((now - this.last) / 1000, 0, 0.05);
    this.last = now;
    this.step(dt);
    this.world.render();
    requestAnimationFrame((t) => this._loop(t));
  }
}

// Exposed for debugging and the automated smoke test.
window.game = new Game();
