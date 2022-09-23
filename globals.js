window.asafonov = {}
window.asafonov.version = '0.4'
window.asafonov.messageBus = new MessageBus()
window.asafonov.events = {
  MY_UPDATED: 'myUpdated',
  OPPONENT_UPDATED: 'opponentUpdated',
  TRUMP_UPDATED: 'trumpUpdated',
  GAME_UPDATED: 'gameUpdated',
  CARD_CLICKED: 'cardClicked',
  TAKE_BTN_UPDATE: 'takeBtnUpdate',
  DONE_BTN_UPDATE: 'doneBtnUpdate',
  BTN_CLICKED: 'btnClicked',
  GAME_OVER: 'gameOver'
}
window.asafonov.settings = {
}
window.onerror = (msg, url, line) => {
  alert(`${msg} on line ${line}`)
}
