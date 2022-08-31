class DurakController {
  constructor (deck) {
    this.deck = deck
    this.my = []
    this.opponent = []
    this.game = []
    this.trump = null
    this.trumpGone = false
    this.opponentMoveTimeout = 600

    this.addCards(this.my, 6)
    this.addCards(this.opponent, 6)
    this.trump = this.deck.getCard()
    this.sort()
    asafonov.messageBus.send(asafonov.events.TRUMP_UPDATED, this.trump)
    asafonov.messageBus.send(asafonov.events.MY_UPDATED, this.my)
    asafonov.messageBus.send(asafonov.events.OPPONENT_UPDATED, this.opponent)
    this.addEventListeners()
    this.resolveFirstMove()
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

  resolveFirstMove() {
    let firstMoveResolved = false
    let currentSuit = this.trump.suit

    while (! firstMoveResolved) {
      const myMin = this.findMinCardOfSuit(this.my, currentSuit)
      const opponentMin = this.findMinCardOfSuit(this.opponent, currentSuit)

      if (opponentMin && myMin) {
        firstMoveResolved = true
        opponentMin.valueD < myMin.valueD && this.opponentMove()
      } else if (! opponentMin && ! myMin) {
        currentSuit = deck.getNextSuit(currentSuit)
      } else {
        firstMoveResolved = true
        opponentMin && this.opponentMove()
      }
    }
  }

  findMinCardOfSuit (arr, suit) {
    let minCard

    for (let i = 0; i < arr.length; ++i) {
      if (arr[i].suit === suit && (! minCard || arr[i].valueD < minCard.valueD)) {
        minCard = arr[i]
      }
    }

    return minCard
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
      setTimeout(() => this.opponentMove(), this.opponentMoveTimeout)
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
    const card = this.my[index]
    const cardToBeat = this.game[this.game.length - 1]

    if ((card.valueD > cardToBeat.valueD && card.suit === cardToBeat.suit) || (card.suit === this.trump.suit && cardToBeat.suit !== this.trump.suit)) {
      this.my.splice(index, 1)
      this.game.push(card)
      return true
    }

    return false
  }

  playerCanMove() {
    if (this.game.length % 2 === 0) {
      const playerCanContinue = this.playerCanContinue()

      if (! playerCanContinue) {
        this.round()
        this.addCardsFromDeck(['my', 'opponent'])
        setTimeout(() => this.opponentMove(), this.opponentMoveTimeout)
      }
    } else {
      const playerCanReply = this.playerCanReply()

      if (! playerCanReply) {
        this.playerTakesCards()
        setTimeout(() => this.opponentMove(), this.opponentMoveTimeout)
      }
    }

  }

  playerCanContinue() {
    let playerCanContinue = this.game.length === 0

    for (let i = 0; i < this.game.length; ++i) {
      for (let j = 0; j < this.my.length; ++j) {
        if (this.my[j].valueD === this.game[i].valueD) {
          playerCanContinue = true
          break
        }
      }
    }

    return playerCanContinue
  }

  playerCanReply() {
    let playerCanReply = false
    const cardToBeat = this.game[this.game.length - 1]

    for (let i = 0; i < this.my.length; ++i) {
      if ((this.my[i].valueD > cardToBeat.valueD && this.my[i].suit === cardToBeat.suit)
         || (this.my[i].suit === this.trump.suit && cardToBeat.suit !== this.trump.suit)) {
        playerCanReply = true
        break
      }
    }

    return playerCanReply
  }

  playerTakesCards() {
    this.my = this.my.concat(this.game)
    this.sort()
    this.game = []
    asafonov.messageBus.send(asafonov.events.GAME_UPDATED, this.game)
    asafonov.messageBus.send(asafonov.events.MY_UPDATED, this.my)
  }

  opponentMove() {
    let card
    const opponentStarted = this.game.length % 2 === 0

    if (opponentStarted) {
      card = this.opponentContinue()
    } else {
      card = this.opponentReply()
    }

    if (card) {
      this.opponent.splice(this.opponent.indexOf(card), 1)
      this.game.push(card)
      asafonov.messageBus.send(asafonov.events.OPPONENT_UPDATED, this.opponent)
      setTimeout(() => this.playerCanMove(), this.opponentMoveTimeout)
    } else {
      ! opponentStarted && (this.opponent = this.opponent.concat(this.game))
      this.game = []
      this.addCardsFromDeck(this.game.length % 2 === 0 ? ['opponent', 'my'] : ['my', 'opponent'])
    }

    asafonov.messageBus.send(asafonov.events.GAME_UPDATED, this.game)
  }

  opponentContinue() {
    let minCard

    for (let i = 0; i < this.opponent.length; ++i) {
      if (! minCard || minCard.valueD > this.opponent[i].valueD || (this.opponent[i].suit !== this.trump.suit && minCard.suit === this.trump.suit)) {
        if (this.game.length === 0) {
          minCard = this.opponent[i]
          continue
        }

        for (let j = 0; j < this.game.length; ++j) {
          if (minCard && minCard.valueD === this.game[i].valueD) {
            minCard = this.opponent[i]
          }
        }
      }
    }

    return minCard
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

  round () {
    this.game = []
    asafonov.messageBus.send(asafonov.events.GAME_UPDATED, this.game)
  }

  giveTrumpAway (arr) {
    arr.push(this.trump)
    this.trumpGone = true
    asafonov.messageBus.send(asafonov.events.TRUMP_UPDATED, false)
  }

  addCardsFromDeck (order) {
    if (this.trumpGone) return

    for (let i = 0; i < order.length; ++i) {
      if (this.trumpGone) break

      const arr = this[order[i]]
      const length = arr.length

      for (let j = 0; j < 6 - length; ++j) {
        if (! this.deck.isEmpty()) {
          arr.push(this.deck.getCard())
        } else {
          this.giveTrumpAway(arr)
          break
        }
      }
    }

    this.sort()
    asafonov.messageBus.send(asafonov.events.OPPONENT_UPDATED, this.opponent)
    asafonov.messageBus.send(asafonov.events.MY_UPDATED, this.my)
  }

  destroy() {
    this.removeEventListeners()
  }
}
