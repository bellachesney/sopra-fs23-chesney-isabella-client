import Round from "models/Round";
import TutorialStep from "models/TutorialStep";

export const matchOne_2 = () => {
  let roundInfo = new Round({
    myCardsInHand: [
      {
        code: "AC",
        image: "https://deckofcardsapi.com/static/img/AC.png",
        value: "ACE",
        suit: "CLUBS",
      },
      {
        code: "JD",
        image: "https://deckofcardsapi.com/static/img/JD.png",
        value: "JACK",
        suit: "DIAMONDS",
      },
      {
        code: "QD",
        image: "https://deckofcardsapi.com/static/img/QD.png",
        value: "QUEEN",
        suit: "DIAMONDS",
      },
      {
        code: "7D",
        image: "https://deckofcardsapi.com/static/img/7D.png",
        value: "7",
        suit: "DIAMONDS",
      },
      {
        code: "0H",
        image: "https://deckofcardsapi.com/static/img/0H.png",
        value: "10",
        suit: "HEARTS",
      },
      {
        code: "2C",
        image: "https://deckofcardsapi.com/static/img/2C.png",
        value: "2",
        suit: "CLUBS",
      },
      {
        code: "6D",
        image: "https://deckofcardsapi.com/static/img/6D.png",
        value: "6",
        suit: "DIAMONDS",
      },
      {
        code: "8S",
        image: "https://deckofcardsapi.com/static/img/8S.png",
        value: "8",
        suit: "SPADES",
      },
    ],
    myCardsInDiscard: [],
    myLastCapture: [],
    oppCards: 8,
    cardsOnTable: [
      {
        code: "QH",
        image: "https://deckofcardsapi.com/static/img/QH.png",
        value: "QUEEN",
        suit: "HEARTS",
      },
      {
        code: "4D",
        image: "https://deckofcardsapi.com/static/img/4D.png",
        value: "4",
        suit: "DIAMONDS",
      },
      {
        code: "6S",
        image: "https://deckofcardsapi.com/static/img/6S.png",
        value: "6",
        suit: "SPADES",
      },
      {
        code: "8C",
        image: "https://deckofcardsapi.com/static/img/8C.png",
        value: "8",
        suit: "CLUBS",
      },
    ],
    myTurn: true,
    oppLastCapture: [],
  });
  let stepData = new TutorialStep({
    round: roundInfo,
    prompt: ["Now, select the Queen of Diamonds from your hand to match it"],
    selectionRequired: true,
    selectableCardsTable: null,
    selectableCardHand: "QD",
  });
  console.log("returning step data: ", stepData);
  return stepData;
};
