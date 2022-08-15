class Swipe {

  constructor (element, minMovement) {
    this.x = null;
    this.y = null;
    this.xn = null;
    this.yn = null;
    this.minMovement = minMovement || 100;
    this.element = element;
    this.onTouchStartProxy = this.onTouchStart.bind(this);
    this.onTouchMoveProxy = this.onTouchMove.bind(this);
    this.onTouchEndProxy = this.onTouchEnd.bind(this);
    this.addEventListeners();
  }

  isMinimalMovement() {
    const xdiff = this.x - this.xn;
    const ydiff = this.y - this.yn;

    return Math.abs(xdiff) > this.minMovement || Math.abs(ydiff) > this.minMovement;
  }

  onTouchStart (event) {
    this.x = event.touches[0].clientX;
    this.y = event.touches[0].clientY;
    this.xn = this.x;
    this.yn = this.y;
    this.swipeStarted = false;
  }

  onTouchMove (event) {
    this.xn = event.touches[0].clientX;
    this.yn = event.touches[0].clientY;

    if (! this.swipeStarted && this.isMinimalMovement()) {
      this.onSwipeStart();
      this.swipeStarted = true;
    }

    this.swipeStarted && this.onSwipeMove();
  }

  onTouchEnd (event) {
    if (! this.isMinimalMovement()) {
      return ;
    }

    this.onSwipeEnd();
    const xdiff = this.x - this.xn;
    const ydiff = this.y - this.yn;

    if (Math.abs(xdiff) > Math.abs(ydiff)) {
      this[xdiff < 0 ? 'onRight' : 'onLeft']();
    } else {
      this[ydiff < 0 ? 'onDown' : 'onUp']();
    }
  }

  onLeft (f) {
    f && (this.onLeft = f);
    return this;
  }

  onRight (f) {
    f && (this.onRight = f);
    return this;
  }

  onUp (f) {
    f && (this.onUp = f);
    return this;
  }

  onDown (f) {
    f && (this.onDown = f);
    return this;
  }

  onSwipeStart (f) {
    f && (this.onSwipeStart = f);
    return this;
  }

  onSwipeMove (f) {
    f && (this.onSwipeMove = f);
    return this;
  }

  onSwipeEnd (f) {
    f && (this.onSwipeEnd = f);
    return this;
  }

  manageEventListeners (remove) {
    const action = remove ? 'removeEventListener' : 'addEventListener';
    this.element[action]('touchstart', this.onTouchStartProxy);
    this.element[action]('touchmove', this.onTouchMoveProxy);
    this.element[action]('touchend', this.onTouchEndProxy);
  }

  addEventListeners() {
    this.manageEventListeners();
  }

  removeEventListeners() {
    this.manageEventListeners(true);
  }

  destroy() {
    this.x = null;
    this.y = null;
    this.xn = null;
    this.yn = null;
    this.minMovement = null;
    this.removeEventListeners();
    this.element = null;
  }
}
