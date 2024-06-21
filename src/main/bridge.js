// if bridge is set return the bridge else create a new
// when preload is called by electron preload process, the global.bridge is set
// when this file is imported and works as a singleton import
// export const { DB, Broker } = window.bridge || (await (
//     import("./core/preload")
// )).default

export {DB, Broker} from "./core/preload"
