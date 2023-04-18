import { useParams, useHistory } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Game.scss";
import { useEffect, useState } from "react";
import * as SockJS from "sockjs-client";
import * as Stomp from "stompjs";
import Game from "models/Game";

const Lobby = () => {
  const gameId = useParams().gameId;
  const [game, setGame] = useState(new Game());
  const [connected, setConnected] = useState(false);
  const socket = new SockJS("http://localhost:8080/websocket");
  const stompClient = Stomp.over(socket);
  const history = useHistory();


  function connect() {
    const playerId = parseInt(localStorage.getItem("userId"));

    stompClient.connect({}, function (frame) {
      console.log("Connected: " + frame);
      stompClient.subscribe("/topic/game/" + gameId, function (data) {
        updateGame(JSON.parse(data.body));
      });
      stompClient.send(
        "/game/join/" + gameId,
        {},
        JSON.stringify({ playerId })
      );
    });
    setConnected(true);
  }

  const updateGame = (data) => {
    console.log("game data received:", data);
    setGame(new Game(data));
    if (data.gameStatus === "CONNECTED") {
      startGame();
    }
  };

  const startGame = () => {
    stompClient.send("/game/start/" + gameId, {});
    history.push(`/game/${gameId}`);
  };

  useEffect(() => {
    if (!connected) {
      console.log("Use Effect starting connection.");
      connect();
    }
  });

  //useEffect(() => {}, [game]);

  let content = (
    <div className="profile overview">
      <div>Game id: {gameId}</div>
      <div>Host Status: {game.hostStatus}</div>
      <div>Guest Status: {game.guestStatus}</div>
      <div>Game Status: {game.gameStatus}</div>
      {game.hostStatus === "CONNECTED" && game.guestStatus === "CONNECTED" && (
        <div>Both players are in the lobby. The game will start soon.</div>
      )}
    </div>
  );

  return (
    <BaseContainer className="game container">
      <h2>Lobby for Game {gameId} </h2>
      {content}
    </BaseContainer>
  );
};

export default Lobby;