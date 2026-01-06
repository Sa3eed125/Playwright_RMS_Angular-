import 'dotenv/config';
export function getEnvironment() {
    return {
        timeout: parseInt(process.env.TEST_TIMEOUT || '30000', 10), // default to 30 seconds
    };
}
export const loginData = {
    email: process.env.TEST_EMAIL,
    password: process.env.TEST_PASSWORD ,
    realm: process.env.TEST_REALM,
    baseURL: process.env.BASE_URL ,
};