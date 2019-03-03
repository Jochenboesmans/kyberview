const axios = require("axios");
//const Web3 = require("web3");

const isEqual = require("lodash/isEqual");
/*const map = require("lodash/map");
const filter = require("lodash/filter");*/

const { getExchanges } = require("../exchanges");
const { setModelNeedsBroadcast } = require("../../websocketbroadcasts/modelNeedsBroadcast");

let market;
let timestamp;
const getMarket = () => market;
const getTimestamp = () => timestamp;

/*const projectID = `3623107a49ce48a9b3687ec820e8a222`;
const web3 = new Web3(`wss://mainnet.infura.io/ws/v3/${projectID}`);
const factoryAddress = `0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95`;
const factoryABI = [{
	"name": "NewExchange",
	"inputs": [{
		"type": "address",
		"name": "token",
		"indexed": true
	}, {
		"type": "address",
		"name": "exchange",
		"indexed": true
	}],
	"anonymous": false,
	"type": "event"
}, {
	"name": "initializeFactory",
	"outputs": [],
	"inputs": [{
		"type": "address",
		"name": "template"
	}],
	"constant": false,
	"payable": false,
	"type": "function",
	"gas": 35725
}, {
	"name": "createExchange",
	"outputs": [{
		"type": "address",
		"name": "out"
	}],
	"inputs": [{
		"type": "address",
		"name": "token"
	}],
	"constant": false,
	"payable": false,
	"type": "function",
	"gas": 187911
}, {
	"name": "getExchange",
	"outputs": [{
		"type": "address",
		"name": "out"
	}],
	"inputs": [{
		"type": "address",
		"name": "token"
	}],
	"constant": true,
	"payable": false,
	"type": "function",
	"gas": 715
}, {
	"name": "getToken",
	"outputs": [{
		"type": "address",
		"name": "out"
	}],
	"inputs": [{
		"type": "address",
		"name": "exchange"
	}],
	"constant": true,
	"payable": false,
	"type": "function",
	"gas": 745
}, {
	"name": "getTokenWithId",
	"outputs": [{
		"type": "address",
		"name": "out"
	}],
	"inputs": [{
		"type": "uint256",
		"name": "token_id"
	}],
	"constant": true,
	"payable": false,
	"type": "function",
	"gas": 736
}, {
	"name": "exchangeTemplate",
	"outputs": [{
		"type": "address",
		"name": "out"
	}],
	"inputs": [],
	"constant": true,
	"payable": false,
	"type": "function",
	"gas": 633
}, {
	"name": "tokenCount",
	"outputs": [{
		"type": "uint256",
		"name": "out"
	}],
	"inputs": [],
	"constant": true,
	"payable": false,
	"type": "function",
	"gas": 663
}];*/

const tokens = {
	BAT: {
		symbol: "BAT",
		address: "0x0d8775f648430679a709e98d2b0cb6250d2887ef",
		exchangeAddress: "0x2E642b8D59B45a1D8c5aEf716A84FF44ea665914",
	},
	DAI: {
		symbol: "DAI",
		address: "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359",
		exchangeAddress: "0x09cabEC1eAd1c0Ba254B09efb3EE13841712bE14",
	},
	MKR: {
		symbol: "MKR",
		address: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
		exchangeAddress: "0x2C4Bd064b998838076fa341A83d007FC2FA50957",
	},
	SPANK: {
		symbol: "SPANK",
		address: "0x42d6622dece394b54999fbd73d108123806f6a18",
		exchangeAddress: "0x4e395304655F0796bc3bc63709DB72173b9DdF98",
	},
	ZRX: {
		symbol: "ZRX",
		address: "0xe41d2489571d322189246dafa5ebde1f4699f498",
		exchangeAddress: "0xaE76c84C9262Cdb9abc0C2c8888e62Db8E22A0bF",
	},
};

//const factoryContract = new web3.eth.Contract(factoryABI, factoryAddress);
//const getExchangeAddress = async (tokenAddress, factoryContract) => await factoryContract.methods.getExchange(tokenAddress).call();

const initialize = async () => {
	/*await fetchExchangeAddresses();*/
	await tryUpdateMarket();
	setInterval(async () => {
		await tryUpdateMarket();
	}, 5 * 1000);
};

/*const fetchExchangeAddresses = async () => {
	_.forEach(tokens, async token => {
		token.exchangeAddress = await getExchangeAddress(token.address, factoryContract);
		console.log(token);
	});
};*/

const tryUpdateMarket = async () => {
	try {
		const newPairs = await Promise.all(Object.keys(tokens).map(async tKey => {
			const t = tokens[tKey];
			const p = (await axios.get(`https://uniswap-analytics.appspot.com/api/v1/ticker?exchangeAddress=${t.exchangeAddress}`)).data;
			if (p.symbol) {
				 return {
					b: "ETH",
					q: p.symbol,
					m: {
						l: Math.pow(p.lastTradePrice, -1),
						b: p.invPrice,
						a: p.invPrice,
						v: p.tradeVolume / Math.pow(10, 18),
					}
				};
			}
		}));
		const newMarket = newPairs.filter(el => el);
		if (newMarket && !isEqual(newMarket, market)) {
			market = newMarket;
			timestamp = Date.now();
			setModelNeedsBroadcast(true);
		}
	} catch(error) {
		console.log(`Error while trying to fetch market from ${getExchanges().UNISWAP.name} API: ${error}`);
	}

};

module.exports = {
	initialize,
	getMarket,
	getTimestamp
};
