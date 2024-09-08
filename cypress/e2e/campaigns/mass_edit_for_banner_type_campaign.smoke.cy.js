import LoginPage from '../../pages/loginPage'
import DashAPIRequest from '../../support/dash_api_requests'
import CampaignMassEditPage from '../../pages/campaignMassEditPage'

const LOGIN_PAGE = new LoginPage()

describe('Verify mass edit function successfully updates campaigns', () => {
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

  describe('Campaign creation and mass edit', () => {
    before(() => {
      LOGIN_PAGE.logIn()
    })
    it('Create multiple campaigns using API', () => {
      cy.fixture('campaign_creation_test_data_for_dash_api.json').as('campaign')
      cy.get('@campaign').then((campaignData) => {
        const CAMPAIGN_CREATION = new DashAPIRequest(campaignData)
        CAMPAIGN_CREATION.createBannerTypeCampaign(2)
      })
    })

    it('Mass edit campaigns and verify campaign data', () => {
      cy.fixture('../campaign_json/campaign.json').as('createdCampaign')
      cy.fixture('campaign_test_data_for_mass_edit.json').as('campaignEditData')
      cy.get('@createdCampaign').then((campaign) => {
        cy.get('@campaignEditData').then((campaignEdit) => {
          const CAMPAIGN_MASS_EDIT_PAGE = new CampaignMassEditPage(campaignEdit, campaign)
          CAMPAIGN_MASS_EDIT_PAGE.massEditCampaignAndVerifySuccessMsg().then(() => {
            CAMPAIGN_MASS_EDIT_PAGE.verifyMassEditCampaignData()
          })
        })
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
