import Grid from "@material-ui/core/Grid";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import React, { Fragment } from "react";
import { connect } from "react-redux";

import * as actions from "./actions";

import { BottomBar } from "./components/Footer/BottomBar";
import { Header } from "./components/Header/Header";
import { Main } from "./components/Main/Main";
import { TopBar } from "./components/TopBar";

import { theme } from "./themes/App";

const unconnectedApp = ({ updateTime }) => {
	setInterval(() => updateTime(), 100);
	return (<div className="App">
		<MuiThemeProvider theme={theme}>
			<Grid container
			      direction="column"
			      alignItems="center"
			      justify="space-between"
			>
				<>
					<Grid
						container
						direction="column"
						alignItems="center"
						justify="space-between"
						style={{ width: "80vw" }}
						spacing={16}
					>
						<Grid item>
							<TopBar/>
						</Grid>
						<Grid item>
							<Header/>
						</Grid>
						<Grid item>
							<Main/>
						</Grid>
						<Grid item>
							<BottomBar/>
						</Grid>
					</Grid>
				</>
			</Grid>
		</MuiThemeProvider>
	</div>);
};

const App = connect(null, actions)(unconnectedApp);
export { App };
