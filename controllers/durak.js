class DurakController {
  constructor (deck) {
    this.deck = deck
    this.my = []
    this.opponent = []
    this.main = []
    this.trump = null

    this.addCards(this.my, 6)
    asafonov.messageBus.send(asafonov.events.MY_UPDATED, this.my)
    this.addCards(this.opponent, 6)
    asafonov.messageBus.send(asafonov.events.OPPONENT_UPDATED, this.opponent)
    this.trump = this.deck.getCard()
    asafonov.messageBus.send(asafonov.events.TRUMP_UPDATED, this.opponent)
  }

  addCards (arr, cnt) {
    for (let i = arr.length; i < cnt; ++i) {
      arr.push(this.deck.getCard())
    }
  }
}
