import GoogleAuth from 'google-auth-library'
import env from 'src/config/env';
const client = new GoogleAuth.OAuth2Client({
    client_id: env.GoogleClientIdIos,
})

export async function verifyGoogleTokenIos(idToken: string) {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: env.GoogleClientIdIos,
    });
    const payload = ticket.getPayload();
    return payload; // contains email, name, sub (Google user ID)
}
