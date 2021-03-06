import React, { useState, useContext, FC } from "react";

import Grid from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography/Typography";

import {
	MarketPageDispatchContext,
	SearchFilterDispatchContext,
	ActivePageDispatchContext, CurrenciesPageDispatchContext,
} from "../../state/contexts/contexts";

const Title: FC = () => {
	const [hover, setHover] = useState(false);

	const activePageDispatch = useContext(ActivePageDispatchContext);
	const marketPageDispatch = useContext(MarketPageDispatchContext);
	const searchFilterDispatch = useContext(SearchFilterDispatchContext);
	const currenciesPageDispatch = useContext(CurrenciesPageDispatchContext);

	const style = hover ? { cursor: "pointer", color: "grey" } : {};
	const title = "ΣDEX";

	/* Resets user session. */
	const handleClick = () => {
		activePageDispatch({type: "RESET"});
		searchFilterDispatch({type: "RESET"});
		marketPageDispatch({type: "RESET"});
		currenciesPageDispatch({type: "RESET"});
	};

	return (
		<Grid
			item
			onMouseLeave={() => setHover(false) }
			onMouseEnter={() => setHover(true) }
		>
			<Typography
				variant="h1"
				align="center"
				onClick={handleClick}
				style={style}
			>
				{title}
			</Typography>
		</Grid>
	);
};

export default Title;