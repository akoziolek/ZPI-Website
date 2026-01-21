module.exports = {
  e2e: {
    baseUrl: process.env.CYPRESS_baseUrl || 'http://frontend:5174',
    supportFile: false,
    specPattern: 'cypress/e2e/*.cy.{js,ts}'
  }
};
