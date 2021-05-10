import {createBrowserHistory} from 'history';
import bootstrap from './bootstrap'

const key = window.bridge.Key
const hist = createBrowserHistory({
    basename: "/", // The base URL of the app (see below)
    forceRefresh: false, // Set true to force full page refreshes
    hashType: 'slash'
});


export default () => {
    return bootstrap(hist, key)
}