class CardView {
  constructor(card) {
    this.element.createElement('div')
  }

  getElement() {
    return this.element
  }

  removeElement() {
    this.element.parentNode.removeChild(this.element)
    this.element = null
  }
}
