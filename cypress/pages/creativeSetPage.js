import BasePage from './basePage'
import { CREATIVE_CREATION } from '../support/locators'

const BASE_PAGE = new BasePage()

export default class CreativeSetPage {
  constructor(creative) {
    this.creative_set_id = creative.creative_set_id
    this.creative_set_title = creative.creative_set_title
    this.creative_format = creative.creative_format
    this.banner_creative_format = creative.banner_creative_format
  }

  verifyCreative() {
    BASE_PAGE.goToCreativeSet()
    cy.get(CREATIVE_CREATION.CREATIVE_SET_SEARCH_INPUT).type(this.creative_set_title)
    cy.wait(1000)
    cy.get(CREATIVE_CREATION.CREATIVE_SET_TITLE_ROW(this.creative_set_id))
      .invoke('text')
      .then((text) => {
        expect(text).to.include(this.creative_set_title)
      })
  }
}
