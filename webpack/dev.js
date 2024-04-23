import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import { devServerConfig } from "./config";

export default process.env.WEBPACK_IS_DEV_SERVER === "true"
  ? {
      devtool: "cheap-module-source-map",
      plugins: [new ReactRefreshWebpackPlugin()],
      devServer: devServerConfig,
    }
  : {};
