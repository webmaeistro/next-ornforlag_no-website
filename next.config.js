module.exports = {
  async redirects() {
    return [
      {
        source: '/_web-frontpage',
        destination: '/',
        permanent: true
      }
    ];
  }
};
