describe('product reviews', () => {
  beforeEach(() => {
    cy.visit('/admin');
    cy.get('[id="_username"]').type('sylius');
    cy.get('[id="_password"]').type('sylius');
    cy.get('.primary').click();
  });
  // Remove .only and implement others test cases!
  it('changing rating of specify product review', () => {
    // Click in product reviews in side menu
    cy.clickInFirst('a[href="/admin/product-reviews/"]');
    // Type in value input to search for specify product review
    cy.get('[id="criteria_title_value"]').type('voluptatem');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in edit of the last product review
    cy.get('*[class^="ui labeled icon button "]').last().click();
    // Edit product review rating
    cy.get('[for="sylius_product_review_rating_4"]').scrollIntoView().click();
    // Click on Save changes button
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();

    // Assert that product review has been updated
    cy.get('body').should('contain', 'Product review has been successfully updated.');
  });

  it('test case 2: filter product reviews by title', () => {
    cy.clickInFirst('a[href="/admin/product-reviews/"]');
    cy.get('[id="criteria_title_value"]').type('consequuntur');
    cy.get('*[class^="ui blue labeled icon button"]').click();
    cy.get('tbody').should('contain', 'consequuntur');
  });

  it('test case 3: edit an existing product review', () => {
    cy.clickInFirst('a[href="/admin/product-reviews/"]');
    cy.get('[id="criteria_title_value"]').type('et quia aut');
    cy.get('*[class^="ui labeled icon button "]').last().click();
    cy.get('[id="sylius_product_review_title"]').clear().type('Titulo atualizado.');
    cy.get('[id="sylius_product_review_comment"]').clear().type('Comentário atualizado.');
    cy.get('[id="sylius_save_changes_button"]').click();

    // Assert que a avaliação foi atualizada
    cy.get('body').should('contain', 'Product review has been successfully updated.');
  });

  it('test case 4: should sort product reviews by title when clicking the title header', () => {
    cy.clickInFirst('a[href="/admin/product-reviews/"]');

    cy.get('tbody tr').then(($rowsBefore) => {
      cy.get('th').contains('Title').click();

      cy.wait(1000);

      cy.get('tbody tr').then(($rowsAfter) => {
        const rowsBeforeText = $rowsBefore
          .map((i, el) => Cypress.$(el).text())
          .get()
          .join('\n');
        const rowsAfterText = $rowsAfter
          .map((i, el) => Cypress.$(el).text())
          .get()
          .join('\n');

        expect(rowsBeforeText).to.not.equal(rowsAfterText);
      });
    });
  });

  it('test 5: Remove a Product Review and Verify Successful Deletion', () => {
    cy.clickInFirst('a[href="/admin/product-reviews/"]');

    cy.get('button.ui.red.labeled.icon.button').last().click();
    cy.get('[id="confirmation-button"]').click();

    cy.get('body').should('contain', 'Product review has been successfully deleted.');
  });

  it('test 6: exclude product reviews with a specific keyword', () => {
    cy.clickInFirst('a[href="/admin/product-reviews/"]');

    cy.get('[id="criteria_title_type"]').select('Not contains');
    cy.get('[id="criteria_title_value"]').type('voluptatem');

    cy.get('*[class^="ui blue labeled icon button"]').click();

    cy.get('tbody tr').each(($row) => {
      cy.wrap($row).find('td').eq(1).should('not.contain', 'voluptatem');
    });

    cy.get('body').should('not.contain', 'voluptatem');
  });

  // Implement the remaining test cases in a similar manner
});
