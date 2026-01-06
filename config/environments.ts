export interface Environment {
    baseURL: string;
    timeout: number;
}

export const environments: Record<string, Environment> = {
    TestEnv: {
        baseURL: process.env.BASE_URL || 'https://csp.contellect.co.za',
        timeout: 60000
    }
};

export function getEnvironment(): Environment {
    const env = process.env.TEST_ENV || 'TestEnv';
    return environments[env] || environments.TestEnv;
}

export const loginData = {
    email: process.env.TEST_EMAIL || 'saied.mohamed@contellect.com',
    password: process.env.TEST_PASSWORD || '123',
    realm: process.env.TEST_REALM || 'Mobile_QC_RMS_ECM',
    baseURL: process.env.BASE_URL || 'https://csp.contellect.co.za'
};