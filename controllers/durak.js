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
    const trumps = this.my.filter(a => a.suit === this.trump.suit).sort((a, b) => a.valueD > b.valueD ? 1 : -1)
    const ordinaries = this.my.filter(a => a.suit !== this.trump.suit).sort((a, b) => a.valueD > b.valueD ? 1 : -1)
    this.my = ordinaries.concat(trumps)
  }

  playerMove (index) {
    let cardAllowed = false

    if (this.game.length % 2 === 0) {
      cardAllowed = this.playerContinue(index)
    } else {
      cardAllowed = this.playerReply(index)
    }

    if (cardAllowed) {
      asafonov.messageBus.send(asafonov.events.GAME_UPDATED, this.game)
      asafonov.messageBus.send(asafonov.events.MY_UPDATED, this.my)
      setTimeout(() => this.opponentMove(), Math.random() * 1000 + 500)
    }
  }

  playerContinue (index) {
    const card = this.my[index]
    let cardAllowed = this.game.length === 0

    for (let i = 0; i < this.game.length; ++i) {
      if (card.valueD === this.game[i].valueD) {
        cardAllowed = true
        break
      }
    }

    if (cardAllowed) {
      this.my.splice(index, 1)
      this.game.push(card)
    }

    return cardAllowed
  }

  playerReply (index) {
  }

  opponentMove() {
    let card

    if (this.game.length % 2 === 0) {
      card = this.opponentContinue()
    } else {
      card = this.opponentReply()
    }

    if (card) {
      this.opponent.splice(this.opponent.indexOf(card), 1)
      this.game.push(card)
      asafonov.messageBus.send(asafonov.events.OPPONENT_UPDATED, this.opponent)
    } else {
      this.opponent = this.opponent.concat(this.game)
      this.game = []
      this.addCardsFromDeck(['my', 'opponent'])
    }

    asafonov.messageBus.send(asafonov.events.GAME_UPDATED, this.game)
  }

  opponentContinue() {
  }

  opponentReply() {
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

    return minCard || minTrumpCard
  }

  addCardsFromDeck (order) {
    for (let i = 0; i < order.length; ++i) {
      const arr = this[order[i]]

      for (let j = 0; j < 6 - arr.length; ++j) {
        arr.push(this.deck.getCard())
      }
    }

    asafonov.messageBus.send(asafonov.events.OPPONENT_UPDATED, this.opponent)
    asafonov.messageBus.send(asafonov.events.MY_UPDATED, this.my)
  }

  destroy() {
    this.removeEventListeners()
  }
}
