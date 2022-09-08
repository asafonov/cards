class GameBoardView {
  constructor() {
    this.compactCount = 8
    this.myContainer = document.querySelector('.board .me')
    this.opponentContainer = document.querySelector('.board .opponent')
    this.trumpContainer = document.querySelector('.board .trump')
    this.gameContainer = document.querySelector('.board .game')
    this.takeBtn = document.querySelector('.take')
    this.doneBtn = document.querySelector('.done')
    this.addEventListeners()
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
    asafonov.messageBus[add ? 'subscribe' : 'unsubscribe'](asafonov.events.GAME_UPDATED, this, 'onGameUpdated')
    asafonov.messageBus[add ? 'subscribe' : 'unsubscribe'](asafonov.events.TAKE_BTN_UPDATE, this, 'onTakeBtnUpdate')
    asafonov.messageBus[add ? 'subscribe' : 'unsubscribe'](asafonov.events.DONE_BTN_UPDATE, this, 'onDoneBtnUpdate')
    asafonov.messageBus[add ? 'subscribe' : 'unsubscribe'](asafonov.events.GAME_OVER, this, 'onGameOver')
    this.takeBtn[add ? 'addEventListener' : 'removeEventListener']('click', () => this.onTakeBtnClick())
    this.doneBtn[add ? 'addEventListener' : 'removeEventListener']('click', () => this.onDoneBtnClick())
  }

  onMyCardClick (index) {
    asafonov.messageBus.send(asafonov.events.CARD_CLICKED, index)
  }

  onTakeBtnClick() {
    asafonov.messageBus.send(asafonov.events.BTN_CLICKED, {type: 'take'})
  }

  onDoneBtnClick() {
    asafonov.messageBus.send(asafonov.events.BTN_CLICKED, {type: 'done'})
  }

  onMyUpdated (list) {
    this.myContainer.innerHTML = ''
    this.myContainer.classList[list.length > this.compactCount ? 'add' : 'remove']('compact')

    for (let i = 0; i < list.length; ++i) {
      const cardView = new CardView(list[i])
      const div = cardView.getElement()
      div.addEventListener('click', () => this.onMyCardClick(i))
      this.myContainer.appendChild(div)
      cardView.destroy()
    }
  }

  onOpponentUpdated (list) {
    this.opponentContainer.innerHTML = ''
    this.opponentContainer.classList[list.length > this.compactCount ? 'add' : 'remove']('compact')

    for (let i = 0; i < list.length; ++i) {
      const cardView = new CardView()
      this.opponentContainer.appendChild(cardView.getElement())
      cardView.destroy()
    }
  }

  onGameUpdated (list) {
    this.gameContainer.innerHTML = ''
    this.gameContainer.classList[list.length > this.compactCount ? 'add' : 'remove']('compact')

    for (let i = 0; i < list.length; ++i) {
      const cardView = new CardView(list[i])
      this.gameContainer.appendChild(cardView.getElement())
      cardView.destroy()
    }
  }

  onTrumpUpdated (card) {
    this.trumpContainer.innerHTML = ''

    if (card) {
      const cardView = new CardView(card)
      this.trumpContainer.appendChild(cardView.getElement())
      cardView.destroy()
    }
  }

  onTakeBtnUpdate (visible) {
    this.takeBtn.style.display = visible ? 'block' : 'none'
  }

  onDoneBtnUpdate (visible) {
    this.doneBtn.style.display = visible ? 'block' : 'none'
  }

  onGameOver (isWon) {
    if (isWon) {
      alert('Congratulations! You won!')
    } else {
      alert('You lose. Maybe next time?')
    }

    location.reload()
  }

  destroy() {
    this.removeEventListeners()
  }
}
