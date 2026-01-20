module.exports = {
  e2e: {
    baseUrl: process.env.CYPRESS_baseUrl || 'http://zpi.local:5173',
    supportFile: false,
    specPattern: 'cypress/e2e/**/*.cy.{js,ts}'
  }
};
