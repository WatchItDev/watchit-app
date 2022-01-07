import {join} from "path";
import {rootDir} from '../utils/env'
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");

export const workBoxSW = new WorkboxWebpackPlugin.InjectManifest({
    swDest: "sw.js",
    swSrc: join(rootDir, "/src/render/src-sw.js"),
    maximumFileSizeToCacheInBytes: 4000000000
})