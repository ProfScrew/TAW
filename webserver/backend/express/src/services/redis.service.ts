import { URL_REDIS, PORT_REDIS, CACHE_EXPIRATION } from "../configs/app.config";
import { createClient, RedisClientType } from "redis";

export class Redis {
    private static instance: Redis;
    private static client: RedisClientType;

    private constructor() { }

    public async init() {
        console.log("🎒 🔨\tInitializing Redis");


        Redis.client = createClient({
            url: "redis://" + URL_REDIS + ":" + PORT_REDIS,
        });

        Redis.client.on('ready', () => {
            console.log("🎒 ✨\tRedis initialized");
        });

        Redis.client.on('error', (err) => {
            console.error("Error initializing Redis: ", err);
        });

        Redis.client.connect();


        return Redis.client;
    }

    public static getInstance() {
        if (!Redis.instance) Redis.instance = new Redis();
        //console.log("🎒 \tRedis instance");
        return Redis.instance;
    }


    public static async set<T>(key: string, value: T, expirationSeconds?: number) {
        console.log("👉 🎒\tset: " + key + " value: " + value);
        await Redis.client.set(key, JSON.stringify(value));
        if (expirationSeconds !== undefined) {
            await Redis.client.expire(key, expirationSeconds);
        }else{
            await Redis.client.expire(key, CACHE_EXPIRATION);
        }
    }
    

    public static async get<T>(key: string, updateExpire?: boolean) {
        const reply = await Redis.client.get(key);
        console.log("🎒 👉\tget: " + key + " value: " + reply);
        if (reply === null) return null;
        const parsedReply: T = JSON.parse(reply);
        if (updateExpire) {
            Redis.client.expire(key, CACHE_EXPIRATION);
        }
        return parsedReply;
    }

    public static async delete(key: string) {
        console.log("🗑️ 🎒\tDeleting key: " + key);
        await Redis.client.del(key);
    }
}


