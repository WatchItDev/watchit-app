import {web3AuthFactory} from "./web3AuthSettings";
import {modalConfig} from "@src/auth/context/web3Auth/config/web3AuthSettings.ts";

export const web3Auth = web3AuthFactory();
export const initWeb3Auth = async () => {
  await web3Auth.initModal({
    modalConfig,
  });
};
