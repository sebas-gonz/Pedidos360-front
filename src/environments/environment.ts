export const environment = {
  production: false,
  msalConfig: {
    auth: {
      clientId: '3e4f2a5e-fc6f-465b-bece-9a036469797d',
      authority: 'https://login.microsoftonline.com/38d3da59-de9f-41b2-8e22-64e7660d479d',
      redirectUri: 'http://localhost:4200/',
    }
  },
  apiConfig: {
    scopes: ['api://3e4f2a5e-fc6f-465b-bece-9a036469797d/access_as_user'],
    uri: 'http://localhost:8080/api'
  }
};
