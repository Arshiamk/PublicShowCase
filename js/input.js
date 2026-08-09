const KEYMAP = {
  ArrowUp: "throttle",
  KeyW: "throttle",
  ArrowDown: "brake",
  KeyS: "brake",
  ArrowLeft: "left",
  KeyA: "left",
  ArrowRight: "right",
  KeyD: "right",
};

export class Input {
  constructor() {
    this.throttle = false;
    this.brake = false;
    this.left = false;
    this.right = false;
    this._startPressed = false;

    window.addEventListener("keydown", (e) => this._onKey(e, true));
    window.addEventListener("keyup", (e) => this._onKey(e, false));
  }

  _onKey(e, down) {
    const action = KEYMAP[e.code];
    if (action) {
      this[action] = down;
      e.preventDefault();
    } else if (e.code === "Enter" && down) {
      this._startPressed = true;
    }
  }

  get steer() {
    return (this.right ? 1 : 0) - (this.left ? 1 : 0);
  }

  // Edge-triggered: returns true once per Enter press.
  consumeStart() {
    const pressed = this._startPressed;
    this._startPressed = false;
    return pressed;
  }
}
