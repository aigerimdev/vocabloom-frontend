// src/__mocks__/axios.ts
type AxiosMockType = {
    get: jest.Mock;
    post: jest.Mock;
    put: jest.Mock;
    delete: jest.Mock;
    create: jest.Mock;
    interceptors: {
        request: { use: jest.Mock };
        response: { use: jest.Mock };
    };
};

const axios: AxiosMockType = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    // We'll assign create after defining axios so we can reference it
    create: undefined as unknown as jest.Mock,
    interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
    },
};

// now assign create to return this axios object
axios.create = jest.fn(() => axios);

export default axios;
