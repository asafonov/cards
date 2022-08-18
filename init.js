document.addEventListener("DOMContentLoaded", function (event) {
  window.asafonov.deck = new Deck()
  const board = new GameBoardView()
  const c = new DurakController(window.asafonov.deck)
})
