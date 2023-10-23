import { URL_REDIS, PORT_REDIS } from "../configs/app.config";
import { createClient, RedisClientType } from "redis";

export class Redis {
    private static instance: Redis;
    private static client: RedisClientType;

    private constructor() {}

    public async init() {
        console.log("🎒 ⚒\tInitializing Redis");


        Redis.client = createClient({
            url: "redis://" + URL_REDIS + ":" + PORT_REDIS,
        });
        
        Redis.client.on('ready', () => {
            console.log("🎒 ✅\tRedis initialized");
        });
    
        Redis.client.on('error', (err) => {
            console.error("Error initializing Redis:", err);
        });

        Redis.client.connect();

        
        return Redis.client;
    }

    public static getInstance() {
        if (!Redis.instance) Redis.instance = new Redis();
        console.log("🎒\tRedis instance");
        return Redis.instance;
    }
    public static async set(key: string, value: string) {
        console.log("👉 🎒\tset: " + key + " value: " + value);
        await Redis.client.set(key, value);
    }
    public static async get(key: string) {
        const reply = await Redis.client.get(key);
        console.log("🎒 👉\tget: " + key + " value: " + reply);
        return reply;
    }
    public static async delete(key: string) {
        console.log("🎒 ❌\tdelete: " + key);
        await Redis.client.del(key);
    }
    public static async expire(key: string, seconds: number) {
        console.log("🎒 ⌛\texpire: " + key + " seconds: " + seconds);
        await Redis.client.expire(key, seconds);
    }


    

}

