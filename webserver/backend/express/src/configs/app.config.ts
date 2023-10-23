import { config } from "dotenv";

const options = config();

export const URL_DATABASE           = options.parsed?.URL_DATABASE;
export const PORT_DATABASE          = options.parsed?.PORT_DATABASE || 27017;
export const NAME_DATABASE          = options.parsed?.NAME_DATABASE;

//redis
export const URL_REDIS              = options.parsed?.URL_REDIS;
export const PORT_REDIS             = options.parsed?.PORT_REDIS || 6379;

export const PORT_BACKEND           = options.parsed?.PORT || 8080;
export const JWT_SECRET             = options.parsed?.JWT_SECRET;
export const JWT_EXPIRATION         = options.parsed?.JWT_EXPIRATION || '48h';

const jwtExpirationInSeconds = options.parsed?.JWT_EXPIRATION_SECONDS;
export const JWT_EXPIRATION_SECONDS = jwtExpirationInSeconds ? parseInt(jwtExpirationInSeconds, 10) : 172800;

export const HASH_METHOD            = options.parsed?.HASH_METHOD || 'sha512';