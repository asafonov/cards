document.addEventListener("DOMContentLoaded", function (event) {
  window.asafonov.deck = new Deck()
  const card1 = new CardView(window.asafonov.deck.getCard())
  document.querySelector('.board').appendChild(card1.getElement())
  const card2 = new CardView(window.asafonov.deck.getCard())
  document.querySelector('.board').appendChild(card2.getElement())
  const card3 = new CardView(window.asafonov.deck.getCard())
  document.querySelector('.board').appendChild(card3.getElement())
})
