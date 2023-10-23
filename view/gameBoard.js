class GameBoardView {
  constructor (options) {
    const defaultOptions = {
      containers: {
        my: true,
        opponent: true,
        trump: true,
        left: true
      },
      buttons: {
        take: true,
        done: true
      },
      maxCardsInRow: 0
    }
    this.compactCount = 8
    this.options = {...defaultOptions, ...(options || {})}
    this.myContainer = document.querySelector('.board .me')
    this.opponentContainer = document.querySelector('.board .opponent')
    this.trumpContainer = document.querySelector('.board .trump')
    this.leftContainer = document.querySelector('.board .left')
    this.gameContainer = document.querySelector('.board .game')
    this.takeBtn = document.querySelector('.take')
    this.doneBtn = document.querySelector('.done')
    this.hideUnusedComponents()
    this.addEventListeners()
  }

  hideUnusedComponents() {
    for (let i in this.options.containers) {
      ! this.options.containers[i] && (this[`${i}Container`].style.display = 'none')
    }

    ! this.options.containers.trump && (this.gameContainer.style.width = '100%')
  }

  addEventListeners() {
    this.updateEventListeners(true)
  }

  removeEventListeners() {
    this.removeEventListeners(false)
  }

  updateEventListeners (add) {
    this.options.containers.my && asafonov.messageBus[add ? 'subscribe' : 'unsubscribe'](asafonov.events.MY_UPDATED, this, 'onMyUpdated')
    this.options.containers.opponent && asafonov.messageBus[add ? 'subscribe' : 'unsubscribe'](asafonov.events.OPPONENT_UPDATED, this, 'onOpponentUpdated')
    this.options.containers.trump && asafonov.messageBus[add ? 'subscribe' : 'unsubscribe'](asafonov.events.TRUMP_UPDATED, this, 'onTrumpUpdated')
    asafonov.messageBus[add ? 'subscribe' : 'unsubscribe'](asafonov.events.GAME_UPDATED, this, 'onGameUpdated')
    this.options.buttons.take && asafonov.messageBus[add ? 'subscribe' : 'unsubscribe'](asafonov.events.TAKE_BTN_UPDATE, this, 'onTakeBtnUpdate')
    this.options.buttons.done && asafonov.messageBus[add ? 'subscribe' : 'unsubscribe'](asafonov.events.DONE_BTN_UPDATE, this, 'onDoneBtnUpdate')
    asafonov.messageBus[add ? 'subscribe' : 'unsubscribe'](asafonov.events.GAME_OVER, this, 'onGameOver')
    this.options.buttons.take && this.takeBtn[add ? 'addEventListener' : 'removeEventListener']('click', () => this.onTakeBtnClick())
    this.options.buttons.done && this.doneBtn[add ? 'addEventListener' : 'removeEventListener']('click', () => this.onDoneBtnClick())
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
    const rows = []

    for (let i = 0; i < list.length; ++i) {
      const rowNum = this.options.maxCardsInRow > 0 ? Math.floor(i / this.options.maxCardsInRow) : 0

      if (! rows[rowNum]) {
        rows[rowNum] = document.createElement('div')
        this.gameContainer.appendChild(rows[rowNum])
      }

      const cardView = new CardView(list[i])
      rows[rowNum].appendChild(cardView.getElement())
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
