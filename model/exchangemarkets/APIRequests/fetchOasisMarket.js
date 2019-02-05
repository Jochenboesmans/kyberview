const _ = require("lodash");
const axios = require("axios");

const { OASIS } = require("../../exchanges");

/**
 * (GET) Retrieve in-depth information about price and other information about assets.
 *  More info at [MakerDAO Docs]{@link https://developer.makerdao.com/oasis/api/1/markets}.
 */
module.exports = async () => {
	try {
		return (await getOasisMarkets());
	} catch(error) {
		console.log(`Error while trying to fetch pairs from ${OASIS.name} API: ${error.message}`);
	}
};

const getOasisMarkets = async () => {
	const activeOasisPairs = [{ base: "MKR", quote: "ETH" },
		{ base: "ETH", quote: "DAI" },
		{ base: "MKR", quote: "DAI" }];
	const oasisMarketPromises = _.map(activeOasisPairs, async p => {
		const m = await retrieveOasisMarket(p);
		if(m && parseFloat(m.price) && parseFloat(m.bid) && parseFloat(m.ask) && parseFloat(m.high) && parseFloat(m.low) && parseFloat(
			m.vol)) {
			return formatOasisMarket(p, m);
		}
	});

	return _.filter((await Promise.all(oasisMarketPromises)), m => m);
};

const retrieveOasisMarket = async (p) => (await axios.get(`http://api.oasisdex.com/v1/markets/${p.base}/${p.quote}`)).data.data;

const formatOasisMarket = (p, m) => ({
	base_symbol: p.quote, quote_symbol: p.base, market_data: {
		exchange: OASIS,
		last_traded: parseFloat(m.last),
		current_bid: parseFloat(m.bid),
		current_ask: parseFloat(m.ask),
		past_24h_high: parseFloat(m.high),
		past_24h_low: parseFloat(m.low),
		volume: parseFloat(m.vol) * twentyFourHourAverage(m)
	}
});

const twentyFourHourAverage = (m) => (parseFloat(m.high) + parseFloat(m.low)) / 2;