type AxiosMockType = {
    get: jest.Mock;
    post: jest.Mock;
    put: jest.Mock;
    patch: jest.Mock;
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
    patch: jest.fn(), //added patch
    delete: jest.fn(),
    create: undefined as unknown as jest.Mock,
    interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
    },
};

axios.create = jest.fn(() => axios);

export default axios;
