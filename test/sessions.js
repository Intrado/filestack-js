require('dotenv').config();

const fsUrls = {
    fileApiUrl: 'https://www.filestackapi.com/api/file',
    uploadApiUrl: 'https://upload.filestackapi.com',
    cloudApiUrl: 'https://cloud.filestackapi.com',
    cdnUrl: 'https://cdn.filestackcontent.com',
};

const session = {
    apikey: process.env.TEST_APIKEY || 'fakekey',
    urls: fsUrls,
    handle: 'W1LOh6RdqHqolomhqMUQ',
    filelink: 'W1LOh6RdqHqolomhqMUQ',
    externalImage: 'https://cdn.filestackcontent.com/V7uHUPY9QxeoPy3Y7PSs'
};

const sessionSecure = {
    apikey: process.env.TEST_SECURE_APIKEY || 'fakekey',
    filelink: 'W1LOh6RdqHqolomhqMUQ',
    urls: fsUrls,
    externalImage: 'https://cdn.filestackcontent.com/V7uHUPY9QxeoPy3Y7PSs',
    signature: process.env.TEST_SIGNATURE || 'fakesignature',
    policy: process.env.TEST_POLICY || 'fakepolicy',
};

module.exports = {
    session,
    sessionSecure,
};
