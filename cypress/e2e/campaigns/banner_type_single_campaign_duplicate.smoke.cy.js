import LoginPage from '../../pages/loginPage'
import CampaignSingleDuplicatePage from '../../pages/campaignSingleDuplicatePage'
import BasePage from '../../pages/basePage'

const LOGIN_PAGE = new LoginPage()
const BASE_PAGE = new BasePage()

describe('Verify that campaign single duplication is successfully working', () => {
  afterEach(function () {
    if (this.currentTest.state === 'failed') {
      cy.fixture('../campaign_json/campaign.json').as('createdCampaign')
      cy.get('@createdCampaign')
        .then((campaign) => {
          BASE_PAGE.deleteSingleCampaign(campaign.campaign_id)
          if (!Cypress.config('isInteractive')) {
            let testError = {
              title: this.currentTest.title,
              errMessage: this.currentTest.err ? this.currentTest.err.message : null,
              errStack: this.currentTest.err ? this.currentTest.err.stack : null,
            }
            const errorMessage = `
              Test failed:
              Title: ${testError.title}
              Error message: ${testError.errMessage || 'Error message not available'}
              Stack trace: ${testError.errStack || 'Stack trace not available'}
            `
            console.error(errorMessage)
          }
        })
        .then(() => {
          Cypress.runner.stop()
        })
    }
  })

  describe('Duplicate a campaign and verify the duplicated campaign data', () => {
    before(() => {
      LOGIN_PAGE.logIn()
    })

    it('Duplicate campaign and verify', () => {
      cy.fixture('campaign_test_data_for_single_duplicate.json').as('campaignData')
      cy.get('@campaignData').then((campaignDiplicateData) => {
        const CAMPAIGN_DUPLICATE_PAGE = new CampaignSingleDuplicatePage(campaignDiplicateData)
        CAMPAIGN_DUPLICATE_PAGE.duplicateCampaignAndVerifySuccessMsg().then(() => {
          CAMPAIGN_DUPLICATE_PAGE.verifyDuplicateCampaignData()
        })
      })
    })

    after(() => {
      cy.fixture('../campaign_json/campaign.json').as('createdCampaign')
      cy.get('@createdCampaign').then((campaign) => {
        BASE_PAGE.deleteSingleCampaign(campaign.campaign_id)
      })
    })
  })
})
