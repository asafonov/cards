class Deck {
  constructor(numCards) {
    this.suits = ['hearts', 'spades', 'diamonds', 'clubs'] 
    this.views = ['two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'jack', 'queen', 'king', 'ace']
    const numViews = (numCards || 36) / this.suits.length
    this.deck = []

    for (let i = 0; i < this.suits.length; ++i) {
      for (let j = 0; j < numViews; ++j) {
        this.deck.push({
          suit: this.suits[i],
          view: this.views[this.views.length - 1 - j]
        })
      }
    }

    this.deck.sort(() => Math.random() > 0.5 ? 1 : -1)
  }

  getCard() {
    return this.deck.pop()
  }
}
