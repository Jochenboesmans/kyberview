import React from "react";
import { object }from "prop-types";
import reduce from "lodash/reduce";

import TableCell from "@material-ui/core/TableCell/TableCell";
import Typography from "@material-ui/core/Typography/Typography";

import { formatVolume } from "../../../../../util/format";

const MarketPairVolume = ({ p }) => {
	const combinedVolume = reduce(p.m, (sum, emd) => sum + emd.v, 0);

	const pairVolume = `${formatVolume(combinedVolume)}`;
	return (
		<TableCell align="right">
			<Typography>
				{pairVolume}
			</Typography>
		</TableCell>
	);
};

MarketPairVolume.propTypes = {
	p: object.isRequired,
};

export default MarketPairVolume;