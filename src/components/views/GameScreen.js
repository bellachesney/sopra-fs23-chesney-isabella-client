import { useParams, useHistory } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/GameScreen.scss";
import { useEffect, useState } from "react";
import Game from "models/Game";
import { Button } from "components/ui/Button";
import sockClient from "helpers/sockClient";
import { api, handleError } from "helpers/api";

const GameScreen = () => {
  const gameId = useParams().gameId;

  // these datapoints are set through the websocket
  const [game, setGame] = useState(null);
  // end of round contains points for the round and total points
  const [endOfRound, setEndOfRound] = useState(false);
  // end of game contains total points and winner
  const [endOfGame, setEndOfGame] = useState(false);
  // contains all cards from the player and on the discard
  const [playerCards, setPlayerCards] = useState(null);
  const [playerDiscards, setPlayerDiscardCards] = useState(null);
  // contains number of cards of the opponent
  const [opponentCards, setOpponentCards] = useState(null);
  const [opponentDiscard, setOpponentDiscard] = useState(null)
  // contains the cards on the table as array
  const [tableCards, setTableCards] = useState(null);
  // whether or not there are still cards in the deck
  const [deckCards, setDeckCards] = useState(true);
  // contains id of the player who's turn it is
  const [playerTurn, setPlayerTurn] = useState(null);
  // true if the opponent has left
  const [opponentLeft, setOpponentLeft] = useState(false);
  // set reason for why the player has left (e.g. unexpected disconnect, surrender)
  const [opponentLeftReason, setOpponentLeftReason] = useState(null);

  // these datapoints are set by the player when playing to form the move
  const [selectedCard, setSelectedCard] = useState(null);

  const history = useHistory();

  function printStuff() {
    console.log(game);
    console.log(game.currentRound.tableCards[0].code);
  }


  const updateGame = (data) => {
    // json data from server doesn't match class variables on server so be careful when parsing
    // classes for round, player and card exist according to json if smaller objects are needed
    console.log("game data received:", data);
    setGame(new Game(data));
  };

  const fetchGame = async () => {
    try {
      const response = await api.get("/games/" + gameId);
      console.log("REST Response:", response);
      setGame(new Game(response.data));
    } catch (error) {
      console.error(
        `Something went wrong while fetching the game: \n${handleError(error)}`
      );
      console.error("Details:", error);
      alert(
        "Something went wrong while fetching the game! See the console for details."
      );
    }
  };

  const checkWebsocket = () => {
    // check that the websocket remains connected and add the updateGame function
    console.log("websocket status:", sockClient.isConnected());
    sockClient.addOnMessageFunction("Game", updateGame);
  };

  //use this function to change values!
  const setTestingValues = () => {
    setEndOfRound(false);
    setEndOfGame(true);
    setPlayerCards(game.)

  }


  useEffect(() => {
    console.log("Use Effect started");
    checkWebsocket();

    // fetch the game data if it is not there yet
    if (!game) {
      fetchGame();
    }

    // handle user leaving page
    const unlisten = history.listen(() => {
      console.log("User is leaving the page");
      sockClient.disconnect();
      sockClient.removeMessageFunctions();
    });

    setTestingValues();

    return () => {
      console.log("Component is unmounting");
      unlisten();
    };
  });

  let playerHand = (
    <div className="card-container">
      {/* Placeholder for player hand */}
      <div className="card"></div>
      <div className="card"></div>
      <div className="card"></div>
    </div>
  );

  let opponentHand = (
    <div className="card-container">
      {/* Placeholder for opponent hand */}
      <div className="card"></div>
      <div className="card"></div>
      <div className="card"></div>
    </div>
  );

  let deck = (
    <div className="card-container">
      {/* Placeholder for deck */}
      <div className="card back"></div>
    </div>
  );

  let table = (
    <div className="card-container">
      {/* Placeholder for table cards */}
      <div className="card"></div>
      <div className="card"></div>
      <div className="card"></div>
    </div>
  );

  let content = (
    <div className="game-container">
      <div className="player-hand">{playerHand}</div>
      <div className="opponent-hand">{opponentHand}</div>
      <div className="table-cards">{table}</div>
      <div className="deck">{deck}</div>
    </div>
  );

  return (
    <BaseContainer className="gamescreen container">
      <h2>Game {gameId} </h2>
      <h1> {gameId} </h1>
      {content}
      <Button width="100%" onClick={() => printStuff()}>
        Print to console
      </Button>
    </BaseContainer>
  );
};

export default GameScreen;
