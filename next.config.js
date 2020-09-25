export async function redirects() {
  return [
    {
      source: '/web-frontpage',
      destination: '/',
      permanent: true
    }
  ];
}
