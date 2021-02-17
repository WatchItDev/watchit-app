[![Gitter](https://badges.gitter.im/watchit-app/community.svg)](https://gitter.im/watchit-app/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

# Getting started
* Decentralized [OrbitDB](https://orbitdb.org/)
* Golang [IPFS](https://github.com/ipfs/go-ipfs) implementation 
* Cross-platform [ElectronJs](https://www.electronjs.org/) apps builder 
* Bootstrap React App tool [Create React App](https://github.com/facebook/create-react-app).

# About us
Visit our [watchiapp.site](https://ipfs.io/ipns/watchitapp.site/) or
read our post in [dev.to](https://dev.to/geolffreym/watchit-2b88)

[![screenshot](src/media/img/layout/screen.png?raw=true)]()

## Setup
Please run `npm i` to install dependencies and add `.env` file variables:
```js
BROWSER=none
```


## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.<br />
Open to view it in electron.


### `npm run inspect`

Runs the app in the development mode.<br />
Open to view it in electron with inspect mode to connect to chrome-inspector.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Packaging

### `npm run package-{os}`

Build app to choosen OS. Depending on packaging OS will need pack in respective OS.

