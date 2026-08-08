// lib/auth/passkey.ts
// WebAuthn/Passkey implementation

import { generateRegistrationOptions, verifyRegistrationResponse, generateAuthenticationOptions, verifyAuthenticationResponse } from "@simplewebauthn/server";

const RP_NAME = "Door.id";
const RP_ID = new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://door.id").hostname;
const ORIGIN = process.env.NEXT_PUBLIC_BASE_URL || "https://door.id";

export async function createPasskeyRegistrationOptions(user: { id: string; username: string; email: string }) {
    return generateRegistrationOptions({
        rpName: RP_NAME,
        rpID: RP_ID,
        userID: new TextEncoder().encode(user.id),
        userName: user.email,
        userDisplayName: user.username || user.email,
        attestationType: "none",
        authenticatorSelection: {
            residentKey: "preferred",
            userVerification: "preferred"
        }
    });
}

export async function verifyPasskeyRegistration(registrationInfo: any, expectedChallenge: string) {
    return verifyRegistrationResponse({
        response: registrationInfo,
        expectedChallenge,
        expectedOrigin: ORIGIN,
        expectedRPID: RP_ID
    });
}

export async function createPasskeyAuthenticationOptions(userIds?: string[]) {
    return generateAuthenticationOptions({
        rpID: RP_ID,
        allowCredentials: userIds?.map(id => ({
            id: new TextEncoder().encode(id),
            type: "public-key" as const
        })),
        userVerification: "preferred"
    });
}

export async function verifyPasskeyAuthentication(authenticationInfo: any, expectedChallenge: string, publicKey: any, counter: number) {
    return verifyAuthenticationResponse({
        response: authenticationInfo,
        expectedChallenge,
        expectedOrigin: ORIGIN,
        expectedRPID: RP_ID,
        credential: {
            id: publicKey.id,
            publicKey: publicKey.publicKey,
            counter
        }
    });
}
