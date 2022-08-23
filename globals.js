window.asafonov = {}
window.asafonov.version = '0.1'
window.asafonov.messageBus = new MessageBus()
window.asafonov.events = {
  MY_UPDATED: 'myUpdated',
  OPPONENT_UPDATED: 'opponentUpdated',
  TRUMP_UPDATED: 'trumpUpdated',
  CARD_CLICKED: 'cardClicked'
}
window.asafonov.settings = {
}
window.onerror = (msg, url, line) => {
  alert(`${msg} on line ${line}`)
}
