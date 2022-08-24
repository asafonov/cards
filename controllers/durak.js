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
    setTimeout(() => this.opponentMove(), Math.random() * 2000)
  }

  opponentMove() {
    const cardToBeat = this.game[this.game.length - 1]
    let minCard, minTrumpCard

    for (let i = 0; i < this.opponent.length; ++i) {
      if (this.opponent[i].valueD > cardToBeat.valueD && this.opponent[i].suit === cardToBeat.suit && (! minCard || this.opponent[i].valueD < minCard.value)) {
        minCard = this.opponent[i]
      }

      if (this.opponent[i].suit === this.trump.suit && cardToBeat.suit !== this.trump.suit && (! minTrumpCard || this.opponent.valueD < minTrumpCard.valueD)) {
        minTrumpCard = this.opponent[i]
      }
    }

    minCard = minCard || minTrumpCard

    if (minCard) {
      this.opponent.splice(this.opponent.indexOf(minCard), 1)
      this.game.push(minCard)
    } else {
      this.opponent = this.opponent.concat(this.game)
      this.game = []
    }

    asafonov.messageBus.send(asafonov.events.GAME_UPDATED, this.game)
    asafonov.messageBus.send(asafonov.events.OPPONENT_UPDATED, this.opponent)    
  }

  destroy() {
    this.removeEventListeners()
  }
}
