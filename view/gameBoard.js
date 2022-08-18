class GameBoardView {
  constructor() {
    this.myContainer = document.querySelector('.board .me')
    this.opponentContainer = document.querySelector('.board .opponent')
    this.addEventListeners(true)
  }

  addEventListeners() {
    this.updateEventListeners(true)
  }

  removeEventListeners() {
    this.removeEventListeners(false)
  }

  updateEventListeners (add) {
    asafonov.messageBus[add ? 'subscribe' : 'unsubscribe'](asafonov.events.MY_UPDATED, this, 'onMyUpdated')
    asafonov.messageBus[add ? 'subscribe' : 'unsubscribe'](asafonov.events.OPPONENT_UPDATED, this, 'onOpponentUpdated')
    asafonov.messageBus[add ? 'subscribe' : 'unsubscribe'](asafonov.events.TRUMP_UPDATED, this, 'onTrumpUpdated')
  }

  onMyUpdated (list) {
    this.myContainer.innerHTML = ''

    for (let i = 0; i < list.length; ++i) {
      const cardView = new CardView(asafonov.deck.getCard())
      this.myContainer.appendChild(cardView.getElement())
      cardView.destroy()
    }
  }

  onOpponentUpdated (list) {
    this.opponentContainer.innerHTML = ''

    for (let i = 0; i < list.length; ++i) {
      const cardView = new CardView(asafonov.deck.getCard())
      this.opponentContainer.appendChild(cardView.getElement())
      cardView.destroy()
    }
  }

  onTrumpUpdated (card) {
  }

  destroy() {
    this.removeEventListeners()
  }
}
