import React from 'react';
import ReactDOM from 'react-dom';
import Login from 'js/front/view/index/login-view/index';
import MovieIndex from 'js/front/view/app/movie-index-view/index';
import MoviePlayer from 'js/front/view/app/movie-player-view/index';
import DragBar from 'js/front/view/global/drag-bar/index'
import * as serviceWorker from './serviceWorker';
import {createBrowserHistory} from 'history';
import {HashRouter, Switch, Route, Redirect} from "react-router-dom";
import './index.sass';
import 'plyr/dist/plyr.css';

const hist = createBrowserHistory({
	basename: "/", // The base URL of the app (see below)
	forceRefresh: false, // Set true to force full page refreshes
	hashType: 'slash'
});

//Require logged
function DragBarHOC(Component, navigate) {
	return <DragBar>
		<Component {...navigate}/>
	</DragBar>
}

ReactDOM.render(
	<HashRouter history={hist}>
		<Switch>
			<Route name="login" exact path="/"
				   render={(n) => !window.Auth.isLogged()
					   ? DragBarHOC(Login, n) : (<Redirect to="/app/movies"/>)}/>
			<Route name="movies" exact path="/app/movies"
				   render={(n) => (DragBarHOC(MovieIndex, n))}/>
			<Route name="player"
				   path="/play/:resource/:sub"
				   render={(n) => (DragBarHOC(MoviePlayer, n))}/>
		</Switch>
	</HashRouter>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

//LISTENERS
const preventDefault = (e) => e.preventDefault()
// Prevent dropping files into the window
window.addEventListener("dragover", preventDefault, false);
window.addEventListener("drop", preventDefault, false);
// Prevent dragging files outside the window
window.addEventListener("dragstart", preventDefault, false);
//Avoid right click
document.addEventListener('contextmenu', preventDefault, false);
//Prevent default reload, devtools
document.addEventListener('keydown', (e) => {
	let keyCode = !window.event ? (e.which || e.keyCode) : window.event.keyCode;
	let avoidReload = (e.ctrlKey && keyCode === 82 && process.env.NODE_ENV !== 'development')
	// this code handles the F5/Ctrl+F5/Ctrl+R
	if (keyCode === 116 || avoidReload)
		e.preventDefault();
	if (keyCode === 122 || keyCode === 123)
		e.preventDefault()
	
});
