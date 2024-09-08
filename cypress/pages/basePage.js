import { APP_URL } from '../support/app_url_endpoints'
import { CAMPAIGN_CREATION, CREATIVE_CREATION, COMMON } from '../support/locators'

export default class BasePage {
  visitPage = (appUrl) => {
    cy.setCookie(Cypress.env('USER_COOKIE'), Cypress.env('AUTH_COOKIE'))
    cy.visit(appUrl)
  }

  goToCampaigns = () => {
    this.visitPage(APP_URL.CAMPAIGN_PAGE)
  }

  goToCampaignApprove = (campaignId) => {
    this.visitPage(APP_URL.CAMPAIGN_APPROVE_PAGE(campaignId))
  }

  goToCampaignMassApprove = (campaign) => {
    const commaSeparatedString = campaign.campaign_id.join(', ')
    this.visitPage(APP_URL.CAMPAIGN_MASS_APPROVE_PAGE(commaSeparatedString))
  }

  goToCampaignMassEdit = (campaign) => {
    const commaSeparatedString = campaign.campaign_id.join(', ')
    this.visitPage(APP_URL.CAMPAIGN_MASS_EDIT_PAGE(commaSeparatedString))
  }

  goToCampaignView = (campaignId) => {
    this.visitPage(APP_URL.CAMPAIGN_VIEW_PAGE(campaignId))
  }

  goToCreativeSet = () => {
    this.visitPage(APP_URL.CREATIVE_SET_PAGE)
  }

  goToCampaignEdit = (campaignId) => {
    this.visitPage(APP_URL.CAMPAIGN_EDIT_PAGE(campaignId))
  }

  generateRandomString() {
    const length = 5
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
  }

  deleteSingleCampaign(campaignId) {
    this.goToCampaigns()
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_ITEM_ACTION(campaignId)).click({ force: true })
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_DELETE(campaignId)).click({ force: true })
    cy.get(COMMON.WARN_MODAL_CONFIRM_BTN).click({ force: true })
  }

  deleteMultipleCampaigns(campaignId1, campaignId2) {
    this.goToCampaigns()
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_ITEM_ACTION(campaignId1)).click({ force: true })
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_DELETE(campaignId1)).click({ force: true })
    cy.get(COMMON.WARN_MODAL_CONFIRM_BTN).click({ force: true })

    cy.get(CAMPAIGN_CREATION.CAMPAIGN_ITEM_ACTION(campaignId2)).click({ force: true })
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_DELETE(campaignId2)).click({ force: true })
    cy.get(COMMON.WARN_MODAL_CONFIRM_BTN).click({ force: true })
  }

  deleteCreativeSetAndCreative(creative) {
    this.goToCreativeSet()
    cy.get(CREATIVE_CREATION.CREATIVE_SET_SEARCH_INPUT).type(creative.creative_set_title)
    cy.wait(1000)
    cy.get(CREATIVE_CREATION.CREATIVE_ITEM_ACTION(creative.creative_set_id)).click({ force: true })
    cy.get(CREATIVE_CREATION.CREATIVE_DELETE(creative.creative_set_id)).click({ force: true })
    cy.get(COMMON.WARN_MODAL_CONFIRM_BTN).click({ force: true })
    cy.wait(1000)
    return cy.get(COMMON.ALERT).should('contain', 'Creative set deleted successfully')
  }
}
