import env from 'src/config/env';
import AppleAuth from 'apple-signin-auth'


export async function verifyAppleToken(idToken: string) {
    const response = await AppleAuth.verifyIdToken(idToken, {
        audience: "com.qahveen", // Your app's bundle ID
        ignoreExpiration: false,
    });

    // response contains user details: sub (user ID), email, etc.
    return response;
}