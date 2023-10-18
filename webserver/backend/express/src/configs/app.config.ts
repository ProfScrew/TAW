import { config } from "dotenv";

const options = config();

export const URL_DATABASE   = options.parsed?.URL_DATABASE;
export const PORT_DATABASE  = options.parsed?.PORT_DATABASE || 27017;
export const NAME_DATABASE  = options.parsed?.NAME_DATABASE;

export const PORT_BACKEND   = options.parsed?.PORT || 8080;
export const JWT_SECRET     = options.parsed?.JWT_SECRET;
export const JWT_EXPIRATION = options.parsed?.JWT_EXPIRATION || '168h';