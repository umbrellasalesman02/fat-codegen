import { FMServerConnection } from "@proofkit/fmodata";

export const connection = new FMServerConnection({
  serverUrl: process.env.FM_SERVER ?? "",
  auth: {
    username: process.env.FM_USERNAME ?? "",
    password: process.env.FM_PASSWORD ?? "",
  },
});