import BasePage from './basePage'
import { CREATIVE_CREATION, SIDE_MENU_BAR } from '../support/locators'

const BASE_PAGE = new BasePage()

export default class CreativePage {
  constructor(creative) {
    this.creative_set_id = undefined
    this.creative_id = undefined
    this.creative_set_title = `${creative.creative_set_title}_${BASE_PAGE.generateRandomString()}`
    this.creative_format = creative.creative_format
    this.creative_subtype = creative.creative_subtype
    this.description = creative.description ? creative.description : null
  }

  createBannerCreativeAndVerify = () => {
    cy.get(SIDE_MENU_BAR.CREATIVE_SET).click()
    cy.get(CREATIVE_CREATION.ADD_CREATIVE_SET_BTN).click()
    cy.get(CREATIVE_CREATION.CREATIVE_SET_TITLE_INPUT).type(this.creative_set_title)
    cy.get(CREATIVE_CREATION.CREATIVE_FORMAT_SELECT).select(this.creative_format, { force: true })
    cy.get(CREATIVE_CREATION.CREATIVE_SET_SAVE_BTN).click()
    cy.get(CREATIVE_CREATION.CREATIVE_SUBTYPE_SELECT).select(this.creative_subtype, { force: true })
    cy.get(CREATIVE_CREATION.ADD_CREATIVE_CONTINUE_BTN).click()
    cy.get(CREATIVE_CREATION.ENABLE_SAFEFRAME_CHECK).click({ force: true })
    const assetDirectory = Cypress.config('fileServerFolder') + '/cypress/fixtures/prod/assets/banner.png'
    cy.get(CREATIVE_CREATION.UPLOAD_BANNER_INPUT).selectFile(assetDirectory, { force: true })
    cy.wait(1000)
    cy.get(CREATIVE_CREATION.CREATIVE_SUBMIT_BTN).click()
    cy.get(CREATIVE_CREATION.CREATIVE_TABLE_ROW, { timeout: 60000 }).should('exist').should('be.visible')

    return cy.url().then((url) => {
      const params = new URL(url).searchParams
      this.creative_set_id = params.get('creative_set_id')
    })
  }

  createVideoCreativeAndVerify = () => {
    cy.get(SIDE_MENU_BAR.CREATIVE_SET).click()
    cy.get(CREATIVE_CREATION.ADD_CREATIVE_SET_BTN).click()
    cy.get(CREATIVE_CREATION.CREATIVE_SET_TITLE_INPUT).type(this.creative_set_title)
    cy.get(CREATIVE_CREATION.CREATIVE_FORMAT_SELECT).select(this.creative_format, { force: true })
    cy.get(CREATIVE_CREATION.CREATIVE_SET_SAVE_BTN).click()
    cy.get(CREATIVE_CREATION.CREATIVE_SUBTYPE_SELECT).select(this.creative_subtype, { force: true })
    cy.get(CREATIVE_CREATION.ADD_CREATIVE_CONTINUE_BTN).click()
    const assetDirectory = Cypress.config('fileServerFolder') + '/cypress/fixtures/prod/assets/video.mp4'
    cy.get(CREATIVE_CREATION.UPLOAD_BANNER_INPUT).eq(0).selectFile(assetDirectory, { force: true })
    cy.wait(1000)
    cy.get(CREATIVE_CREATION.VIDEO_DESCRIPTION_TEXTAREA).type(this.description)
    cy.get(CREATIVE_CREATION.CREATIVE_SUBMIT_BTN).click()
    cy.get(CREATIVE_CREATION.CREATIVE_TABLE_ROW, { timeout: 120000 }).should('exist').should('be.visible')

    return cy.url().then((url) => {
      const params = new URL(url).searchParams
      this.creative_set_id = params.get('creative_set_id')
    })
  }

  getCreativeData() {
    const CREATIVE = Object.assign({}, this)
    return CREATIVE
  }
}
