// lib/auth/hash.ts
// Password hashing using Node.js crypto (scrypt)

import { randomBytes, scrypt } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

const SALT_LENGTH = 16;
const KEY_LENGTH = 64;

export async function hashPassword(password: string): Promise<string> {
    const salt = randomBytes(SALT_LENGTH).toString("hex");
    const key = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
    return `${salt}:${key.toString("hex")}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
    const [salt, key] = storedHash.split(":");
    const keyBuffer = Buffer.from(key, "hex");
    const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
    return keyBuffer.equals(derivedKey);
}
