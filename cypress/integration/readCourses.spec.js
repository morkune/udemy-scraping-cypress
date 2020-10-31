/// <reference types="cypress" />

function readPage(results, length) {
  return cy.get('.udlite-custom-focus-visible').each((link) => {
    if (results.length >= length) {
      return;
    }
    const url = `${window.location.origin}${link.attr('href')}`;
    const title = link.find('.course-card--course-title--2f7tE').text();

    results.push({ title, url });
  });
}

function readAndMoveOn(results, length) {
  return readPage(results, length).then(() => {
    if (results.length < length) {
      cy.get('[data-page="+1"]').click().then(() => {
        return readAndMoveOn(results, length);
      });
    }
  });
}

describe('Udemy automation', () => {
  const results = [];
  const entriesCount = 100;

  it('Visit the Udemy website', () => {
    cy.visit('https://www.udemy.com/');
    cy.get('.js-header-search-field').type('free');
    cy.get('.header--header--3sK1h > .udlite-search-form-autocomplete > .udlite-search-form-autocomplete-input-group > .udlite-btn > .udlite-icon').click();
  })

  it('Show latest free courses', () => {
    cy.get('[form="filter-form"]').select('Newest')
  });

  it('Write courses to a text file results.txt', () => {
    readAndMoveOn(results, entriesCount).then(() => {
      cy.writeFile('cypress/fixtures/results.txt', results.map((x, i) => `${i + 1}. ${x.title}\n${x.url}\n`).join("\n"));
    });
  });
});
