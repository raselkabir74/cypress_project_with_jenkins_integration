import { CAMPAIGN_APPROVE } from '../support/locators'
import BasePage from './basePage'

const BASE_PAGE = new BasePage()

export default class CampaignMassApprovePage {
  constructor(campaign) {
    this.campaign = campaign
  }
  massApproveCampaignAndVerifyCampaignStatus() {
    BASE_PAGE.goToCampaignMassApprove(this.campaign)
    cy.get(CAMPAIGN_APPROVE.MASS_CAMPAIGN_APPROVE_BTN).click()
    cy.get(CAMPAIGN_APPROVE.MASS_CAMPAIGN_APPROVE_WARNING_IGNORE_BTN).click()
    cy.wait(5000)
    cy.get(CAMPAIGN_APPROVE.FILTER_BY_CAMPAIGN_STATUS_SELECT).select('all', { force: true })
    this.campaign.campaign_id.forEach((item) => {
      cy.get(CAMPAIGN_APPROVE.SEARCH_INPUT_FIELD).clear().type(item)
      cy.get(CAMPAIGN_APPROVE.CAMPAIGN_LIST_TABLE_ROW).first().should('contain.text', item)
      cy.get(CAMPAIGN_APPROVE.CAMPAIGN_LIST_TABLE_ROW).first().should('contain.text', 'Ready')
    })
  }
}
