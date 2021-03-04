[![Gitter](https://badges.gitter.im/watchit-app/community.svg)](https://gitter.im/watchit-app/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

# WatchIt App


WatchIt decentralizes the way you watch your movies. In short, it is a "collective entertainment methodology" in which each user consumes movies from 
the network and at the same time shares movies with other users.

Indeed, Watchit is a movie playback system, in its most basic form it allows you to filter, search, play movies.
Well, in order to decentralize our movies so that everyone can have access to them, we resorted to incredible tools such as [IPFS](https://github.com/ipfs/go-ipfs)
and [OrbitDB](https://orbitdb.org/), which allowed us to have created a DAPP (Decentralized App). In simple words, 
Watchit is an application that does not require external resources, but rather everyone helps everyone to make it work.

It is also possible that WatchIt can be synchronized through different movie channels opening the possibility to many libraries with different content across the network.


[![screenshot](src/media/img/layout/screen.png?raw=true)]()


## Build your network
Migrate your own content and share it with community. WatchIt gateway provides simple tools for the generation and fetching of content. 
Please look at our [gateway](https://github.com/ZorrillosDev/watchit-gateway) 's readme.

##  More info
* Visit our site [watchitapp.site](http://watchitapp.site).
* Read our post in [dev.to](https://dev.to/geolffreym/watchit-2b88).
* Check out [the roadmap](https://github.com/ZorrillosDev/watchit-desktop/projects/1) to future features.
* Get in touch with us in [gitter](https://gitter.im/watchit-app/community).


<details>
  <summary>Installation & Usage</summary>
  
##Install

Please run `npm i` to install dependencies and add `.env` file variables:

```js
BROWSER=none
```

## Usage

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

</details>

