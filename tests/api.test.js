const axios = require('axios');
API_URL = "http://localhost:5000/api"

test('test device array', () => {
    expect.assertions(1);
    return axios.get(`${API_URL}/devices`)
        .then(device => device.data)
        .then(device => {
            expect(device[0].name).toEqual('Device 2');
        });
});

test('test light array', () => {
    expect.assertions(1);
    return axios.get(`${API_URL}/light`)
        .then(lights => lights.data)
        .then(lights => {
            expect(lights[0].light).toEqual(3);
        });
});

test('test AC array', () => {
    expect.assertions(1);
    return axios.get(`${API_URL}/ac`)
        .then(acs => acs.data)
        .then(acs => {
            expect(acs[0].id).toEqual(1);
        });
});

test('test Security array', () => {
    expect.assertions(1);
    return axios.get(`${API_URL}/security`)
        .then(security => security.data)
        .then(security => {
            expect(security[0].name).toEqual('Saksham');
        });
});

