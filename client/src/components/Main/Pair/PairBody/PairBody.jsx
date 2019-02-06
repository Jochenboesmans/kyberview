import _ from "lodash";
import React from "react";

import TableBody from "@material-ui/core/TableBody/TableBody";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableRow from "@material-ui/core/TableRow/TableRow";

import { formatPercentage, formatPrice, formatVolume } from "../../../../util/formatFunctions";
import {
	highestCurrentBidEMDAcrossExchanges, lowestCurrentAskEMDAcrossExchanges, rebaseRate
} from "../../../../util/marketFunctions";

const PairBody = ({ p, market }) => {
	const sortedMarketData = p ? _.orderBy(p.market_data, [emd => emd.volume], "desc") : null;
	return (
		<TableBody>
			{_.map(sortedMarketData, emd => {
				const innerBid = rebaseRate(market, p.base_symbol, p.quote_symbol, "DAI", emd.current_bid);
				const innerAsk = rebaseRate(market, p.base_symbol, p.quote_symbol, "DAI", emd.current_ask);
				const last = rebaseRate(market, p.base_symbol, p.quote_symbol, "DAI", emd.last_traded);
				const combVol = rebaseRate(market, p.base_symbol, p.quote_symbol, "DAI", emd.volume);
				const fInnerBid = formatPrice(innerBid);
				const fInnerAsk = formatPrice(innerAsk);
				const fLast = formatPrice(last);
				const fCombVol = formatVolume(combVol);
				const spreadRatioDifference = ((innerAsk / innerBid) - 1) || 0;
				const fSpreadPercentage = formatPercentage(spreadRatioDifference);
				if (emd === lowestCurrentAskEMDAcrossExchanges(market, p.base_symbol, p.quote_symbol) &&
					emd === highestCurrentBidEMDAcrossExchanges(market, p.base_symbol, p.quote_symbol)) {
					return (
						<TableRow hover
						          onClick={() => handleClick(emd.exchange, p)}
						          key={emd.exchange.ID}
						>
							<TableCell style={{fontStyle: "italic", color: "green"}}>{emd.exchange.name}</TableCell>
							<TableCell style={{fontStyle: "italic", color: "green"}} numeric>{`${fInnerBid} - ${fInnerAsk} (${fSpreadPercentage})`}</TableCell>
							<TableCell style={{fontStyle: "italic", color: "green"}} numeric>{`${fLast}`}</TableCell>
							<TableCell style={{fontStyle: "italic", color: "green"}} numeric>{`${fCombVol}`}</TableCell>
						</TableRow>
					)
				}
				if (emd === lowestCurrentAskEMDAcrossExchanges(market, p.base_symbol, p.quote_symbol) && sortedMarketData.length > 1){
					return (
						<TableRow hover
						          onClick={() => handleClick(emd.exchange, p)}
						          key={emd.exchange.ID}
						>
							<TableCell style={{color: "green"}}>{emd.exchange.name}</TableCell>
							<TableCell style={{color: "green"}} numeric>{`${fInnerBid} - ${fInnerAsk} (${fSpreadPercentage})`}</TableCell>
							<TableCell style={{color: "green"}} numeric>{`${fLast}`}</TableCell>
							<TableCell style={{color: "green"}} numeric>{`${fCombVol}`}</TableCell>
						</TableRow>
					);
				} else if (emd === highestCurrentBidEMDAcrossExchanges(market, p.base_symbol, p.quote_symbol) && sortedMarketData.length > 1) {
					return (
						<TableRow hover
						          onClick={() => handleClick(emd.exchange, p)}
						          key={emd.exchange.ID}
						>
							<TableCell style={{color: "red"}}>{emd.exchange.name}</TableCell>
							<TableCell style={{color: "red"}} numeric>{`${fInnerBid} - ${fInnerAsk} (${fSpreadPercentage})`}</TableCell>
							<TableCell style={{color: "red"}} numeric>{`${fLast}`}</TableCell>
							<TableCell style={{color: "red"}} numeric>{`${fCombVol}`}</TableCell>
						</TableRow>
					)
				} else {
					return (
						<TableRow hover
						          onClick={() => handleClick(emd.exchange, p)}
						          key={emd.exchange.ID}
						>
							<TableCell >{emd.exchange.name}</TableCell>
							<TableCell numeric>{`${fInnerBid} - ${fInnerAsk} (${fSpreadPercentage})`}</TableCell>
							<TableCell numeric>{`${fLast}`}</TableCell>
							<TableCell numeric>{`${fCombVol}`}</TableCell>
						</TableRow>
					);
				}
			})}
		</TableBody>
	)
};

const exchangeURL = {
	"KYBER": (p) => `https://kyber.network/swap/${p.base_symbol}_${p.quote_symbol}`,
	"BANCOR": (p) => `https://www.bancor.network/tokens`,
	"OASIS": (p) => `https://oasis.direct/`,
	"PARADEX": (p) => `https://paradex.io/market/${p.quote_symbol}-${p.base_symbol}`,
	"DDEX": (p) => `https://ddex.io/trade/${p.base_symbol}-${p.quote_symbol}`,
	"IDEX": (p) => `https://idex.market/${p.base_symbol}/${p.quote_symbol}`,
	"RADAR": (p) => `https://app.radarrelay.com/${p.quote_symbol}/${p.base_symbol}`,
	"UNISWAP": (p) => `https://uniswap.exchange/swap`,
	"TOKENSTORE": (p) => `https://token.store/trade/${p.quote_symbol}`,
	"ETHERDELTA": (p) => `https://etherdelta.com/#${p.quote_symbol}-${p.base_symbol}`
};

const handleClick = (exchange, p) => {
	const URL = exchangeURL[exchange.ID](p);
	window.open(URL, "_blank");
};

export { PairBody };