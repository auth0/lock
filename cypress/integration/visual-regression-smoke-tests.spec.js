describe('Visual Regression - Smoke Tests', () => {
  beforeEach(() => {
    cy.eyesOpen({
      appName: 'Auth0 Lock',
      testName: 'Visual Regression - Smoke Tests',
      browser: [
        {
          name: 'chrome',
          width: 1280,
          height: 800
        },
        {
          name: 'firefox',
          width: 1280,
          height: 800
        }
      ]
    });
  });

  afterEach(() => {
    cy.eyesClose();
  });

  it('Should render each lock style correctly', () => {
    cy.visit(`http://localhost:8080/support/design/`);
    //Delay DOM grab till locks render
    cy.wait(2000);

    cy.get('.lock-container').then($nodes => {
      for (let i = 0, l = $nodes.length; i < l; i++) {
        cy.eyesCheckWindow({
          sizeMode: 'selector',
          selector: {
            type: 'xpath',
            selector: `//*[@id='${$nodes.eq(i).get(0).id}'][1]`
          },
          tag: $nodes.eq(i).get(0).id
        });
      }
    });
  });
});
