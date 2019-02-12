const _ = require("lodash");
const axios = require("axios");
// const WebSocket = require("ws");

const { IDEX } = require("../../exchanges");
const { setModelNeedsBroadcast } = require("../../../websocketbroadcasts/modelNeedsBroadcast");

let retrievedMarket = {};

const initializeIdexFetcher =  async () => {
	await updateIdexMarket();
	setInterval( async () => {
		await updateIdexMarket();
	}, 15 * 1000);

};

const updateIdexMarket = async () => {
	try {
		retrievedMarket = (await axios.post("https://api.idex.market/returnTicker", { json: {} })).data;
		setModelNeedsBroadcast(true);
	} catch(error) {
		console.log(`Error while trying to fetch market from ${IDEX.name} API: ${error}`);
	}
};


/* TODO: Implement WebSocket client.
The current IDEX WebSocket API doesn't currently provide a straight forward way to fetch ticker, volume data directly.
There'd have to be a maintained copy of the orderbook on this application's side.
Perhaps best to wait for the upcoming "v2" rollout.

let retrievedMarket = {};

const wsURL = "wss://v1.idex.market";
const ws = new WebSocket(wsURL);
ws.on("open", async () => {
	ws.send(JSON.stringify(  {
		                         "method": "handshake",
		                         "payload": {
			                         "type": "client",
			                         "version": "2.0",
			                         "key": "17paIsICur8sA0OBqG6dH5G1rmrHNMwt4oNk4iX9"
		                         }
	                         }));
	ws.onmessage = (message) => {
		const data = JSON.parse(message.data);
		if (data.type === "subscriptions") {
			subscribedChannels = data.channels;
		} else if (data.type === "ticker") {
			retrievedMarket[data.marketId] = data;
		}
	}
});*/

const getIdexMarket = () => _.reduce(Object.keys(retrievedMarket), (result, key) => {
	const pair = retrievedMarket[key];
	if((parseFloat(pair.last) && parseFloat(pair.highestBid) && parseFloat(
		pair.lowestAsk) && parseFloat(pair.high) && parseFloat(pair.low) && parseFloat(
		pair.baseVolume))) {
		result.push({
			base_symbol: key.split("_")[0], quote_symbol: key.split("_")[1], market_data: {
				exchange: IDEX,
				last_traded: parseFloat(pair.last),
				current_bid: parseFloat(pair.highestBid),
				current_ask: parseFloat(pair.lowestAsk),
				volume: parseFloat(pair.baseVolume)
			}
		});
	}
	return result;
}, []);

module.exports = { initializeIdexFetcher, getIdexMarket };