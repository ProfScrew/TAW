import { config } from "dotenv";


const options = config();

export const PORT              = options.parsed?.PORT || 8080;
export const CONNECTION_STRING = options.parsed?.CONNECTION_STRING;
export const JWT_SECRET        = options.parsed?.JWT_SECRET;

export const DEBUG_ACTIVE      = options.parsed?.DEBUG_ACTIVE || false;
export const DEBUG_LEVEL       = options.parsed?.DEBUG_LEVEL  || 'log';