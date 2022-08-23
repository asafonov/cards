class DurakController {
  constructor (deck) {
    this.deck = deck
    this.my = []
    this.opponent = []
    this.game = []
    this.trump = null

    this.addCards(this.my, 6)
    this.addCards(this.opponent, 6)
    this.trump = this.deck.getCard()
    this.sort()
    asafonov.messageBus.send(asafonov.events.TRUMP_UPDATED, this.trump)
    asafonov.messageBus.send(asafonov.events.MY_UPDATED, this.my)
    asafonov.messageBus.send(asafonov.events.OPPONENT_UPDATED, this.opponent)
    this.addEventListeners()
  }

  addEventListeners() {
    this.updateEventListeners(true)
  }

  removeEventListeners() {
    this.removeEventListeners(false)
  }

  updateEventListeners (add) {
    asafonov.messageBus[add ? 'subscribe' : 'unsubscribe'](asafonov.events.CARD_CLICKED, this,'playerMove')
  }

  addCards (arr, cnt) {
    for (let i = arr.length; i < cnt; ++i) {
      arr.push(this.deck.getCard())
    }
  }

  sort() {
    const trumps = this.my.filter(a => a.suit === this.trump.suit).sort((a, b) => a.valueD > b.valueD ? -1 : 1)
    const ordinaries = this.my.filter(a => a.suit !== this.trump.suit).sort((a, b) => a.valueD > b.valueD ? -1 : 1)
    this.my = ordinaries.concat(trumps)
  }

  playerMove (index) {
    const card = this.my.splice(index, 1)[0]
    this.game.push(card)
    asafonov.messageBus.send(asafonov.events.GAME_UPDATED, this.game)
    asafonov.messageBus.send(asafonov.events.MY_UPDATED, this.my)
  }

  destroy() {
    this.removeEventListeners()
  }
}
