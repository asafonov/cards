window.asafonov = {}
window.asafonov.version = '0.1'
window.asafonov.messageBus = new MessageBus()
window.asafonov.events = {
  MY_UPDATED: 'myUpdated',
  OPPONENT_UPDATED: 'opponentUpdated',
  TRUMP_UPDATED: 'trumpUpdated',
  GAME_UPDATED: 'gameUpdated',
  CARD_CLICKED: 'cardClicked',
  TAKE_BTN_UPDATE: 'takeBtnUpdate',
  TAKE_BTN_CLICKED: 'takeBtnClicked',
  DONE_BTN_UPDATE: 'doneBtnUpdate',
  DONE_BTN_CLICKED: 'doneBtnClicked'
}
window.asafonov.settings = {
}
window.onerror = (msg, url, line) => {
  alert(`${msg} on line ${line}`)
}
