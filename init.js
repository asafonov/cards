document.addEventListener("DOMContentLoaded", function (event) {
  window.asafonov.deck = new Deck()
  const c = new DurakController(window.asafonov.deck)
  const board = new GameBoardView(c.getBoardParams())
  c.initBoard()
  const updaterView = new UpdaterView('https://raw.githubusercontent.com/asafonov/cards/master/VERSION.txt', 'https://github.com/asafonov/cards.apk/releases/download/{VERSION}/app-release.apk')
  updaterView.showUpdateDialogIfNeeded()
})
