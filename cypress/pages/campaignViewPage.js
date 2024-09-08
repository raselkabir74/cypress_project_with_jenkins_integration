import BasePage from './basePage'
import { CAMPAIGN_VIEW } from '../support/locators'

const BASE_PAGE = new BasePage()

export default class CampaignPage {
  constructor(campaign) {
    this.campaign_id = campaign.campaign_id
  }

  verifyCampaignImpressions = (impressionAndClickCount = 0) => {
    //necessary evil to wait for statistics
    cy.wait(60000)
    BASE_PAGE.goToCampaignView(this.campaign_id)
    cy.get(CAMPAIGN_VIEW.CAMPAIGN_IMPRESSIONS)
      .invoke('text')
      .then((text) => {
        let number = parseInt(text.replace(/\D/g, ''), 10)
        expect(number).to.be.gt(impressionAndClickCount)
      })

    cy.get(CAMPAIGN_VIEW.CAMPAIGN_CLICKS)
      .invoke('text')
      .then((text) => {
        let number = parseInt(text.replace(/\D/g, ''), 10)
        expect(number).to.be.gt(impressionAndClickCount)
      })
  }
}
