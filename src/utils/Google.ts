import GoogleAuth from 'google-auth-library'
import env from 'src/config/env';
import { verifyGoogleTokenIos } from './IosGoogle';
const client = new GoogleAuth.OAuth2Client({
    client_id: env.GoogleClientId,
})

export async function verifyGoogleToken(idToken: string) {
    try {

        const ticket = await client.verifyIdToken({
            idToken,
            audience: env.GoogleClientId,
        });
        const payload = ticket.getPayload();
        return payload; // contains email, name, sub (Google user ID)
    } catch (error) {
        console.error("Error verifying Google token:", error);
        return await verifyGoogleTokenIos(idToken);

    }
}
