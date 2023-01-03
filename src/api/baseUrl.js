import config from "./config";

const branch = config.prod_deploy;
export const baseUrl = branch.baseUrl;
export const fileUrl = branch.fileUrl;

export const authToken = localStorage.userToken;
