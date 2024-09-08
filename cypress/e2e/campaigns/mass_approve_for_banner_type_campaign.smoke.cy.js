import LoginPage from '../../pages/loginPage'
import DashAPIRequest from '../../support/dash_api_requests'
import CampaignMassApprovePage from '../../pages/campaignMassApprovePage'

const LOGIN_PAGE = new LoginPage()

describe('Verify mass approval function successfully approves campaigns', () => {
  afterEach(function () {
    if (this.currentTest.state === 'failed') {
      cy.fixture('../campaign_json/campaign.json').as('createdCampaign')
      cy.get('@createdCampaign')
        .then((campaign) => {
          const DASH_API_REQUEST = new DashAPIRequest(campaign)
          DASH_API_REQUEST.deleteCampaign()
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

  describe('Campaign creation and Mass approve', () => {
    before(() => {
      LOGIN_PAGE.logIn()
    })
    it('Create campaign using API', () => {
      cy.fixture('campaign_creation_test_data_for_dash_api.json').as('campaign')
      cy.get('@campaign').then((campaignData) => {
        const CAMPAIGN_CREATION = new DashAPIRequest(campaignData)
        CAMPAIGN_CREATION.createBannerTypeCampaign(2)
      })
    })

    it('Mass approve campaign and verify campaigns status', () => {
      cy.fixture('../campaign_json/campaign.json').as('createdCampaign')
      cy.get('@createdCampaign').then((campaign) => {
        const CAMPAIGN_APPROVE_PAGE = new CampaignMassApprovePage(campaign)
        CAMPAIGN_APPROVE_PAGE.massApproveCampaignAndVerifyCampaignStatus()
      })
    })

    after(() => {
      cy.fixture('../campaign_json/campaign.json').as('createdCampaign')
      cy.get('@createdCampaign').then((campaign) => {
        const DASH_API_REQUEST = new DashAPIRequest(campaign)
        DASH_API_REQUEST.deleteCampaign()
      })
    })
  })
})
