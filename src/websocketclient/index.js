import io from "socket.io-client";
import {updateMarket} from "../actions";
import {store} from "../index";

export const subscribeToSocketBroadcasts = () => {
  const url = "https://dexaggregate-server.herokuapp.com";

  const socket = io(url);
  socket.on("marketBroadcast", receivedMarket => {
    updateMarket(receivedMarket)(store.dispatch);
    console.log(receivedMarket);
  });
};
