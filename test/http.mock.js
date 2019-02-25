const { Timing } = require('@pollyjs/core');

module.exports = function({ server }) {
  server.host('https://upload.filestackapi.com', () => {
    // Uploads
    server.post('/multipart/start').intercept((_, res) => {
      res.status(200).json({
        uri: '/testfile.gif',
        region: 'us-east-1',
        upload_id: 'test_upload_ud',
        location_url: 'test_upload.filestackapi.com'
      });
    });

    server
      .post('/multipart/upload')
      .intercept(async (_, res) => {
        await server.timeout(100);

        res.status(200).json({
          location_url: 'test_upload.filestackapi.com',
          url: 'test_location_url',
          headers: {
            forward: 'true'
          }
        });
      });

    server.post('/multipart/complete').intercept((_, res) => {
      res.status(200).json({
        handle: '7xSJALUhSlCDCNujt5Ku',
        url: 'https://agnostic-cdn.filestackapi.com/7xSJALUhSlCDCNujt5Ku',
        filename: 'dutton.gif',
        size: 35,
        mimetype: 'image/gif',
        status: 'Stored'
      });
    });

    server.post('/multipart/commit').intercept((_, res) => {
      res.setHeader('etag', 'some_etag').status(200);
    });

    server.put('/fakeS3').intercept((_, res) => {
      res.setHeader('etag', 'some_etag').status(200);
    });
  });

  // clouds
  server.host('https://cloud.filestackapi.com', () => {
    server.get('/prefetch').intercept((_, res) => {
      res.status(200).json({
        intelligent_ingestion: false,
        blocked: false,
        blacklisted: false,
        whitelabel: true,
        customsource: true,
        customsource_name: 'devportal-customers-assets-cs'
      });
    });

    server.post('/folder/list').intercept((_, res) => {
      res.status(200).json({
        facebook: {},
        token: 'testtoken'
      });
    });
  });

  // cdn
  server.host('https://cdn.filestackcontent.com/', () => {
    server
      .get('/:apikey/*')
      .intercept(async (_, res) => {
        await server.timeout(100);

        res.status(200).json({
          handle: '7xSJALUhSlCDCNujt5Ku',
          url: 'https://agnostic-cdn.filestackapi.com/7xSJALUhSlCDCNujt5Ku',
          filename: 'dutton.gif',
          size: 35,
          mimetype: 'image/gif'
        });
      });
  });

  server.host('https://www.filestackapi.com/', () => {
    server.delete('/api/file/*').intercept((_, res) => {
      res.status(200).json({});
    });

    server.get('/api/file/*').intercept((_, res) => {
      res.status(200).json({
        mimetype: 'image/jpeg',
        uploaded: 1504120869761.631,
        size: 120305,
        writeable: true,
        filename: 'Zanzibar_Red_Colobus_Monkey.jpg'
      });
    });

    server.head('/api/file/*').intercept((_, res) => {
      res.status(201);
    });
  });

  server.host('http://www.somebadurl.com', () => {
    server.any('/*').intercept((_, res) => {
      res.status(404).json({});
    });
  });
};
