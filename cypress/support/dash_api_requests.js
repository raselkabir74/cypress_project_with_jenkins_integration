import CampaignPage from '../pages/campaignPage'
import BasePage from '../pages/basePage'
import { DASH_API_ENDPOINTS } from './app_url_endpoints'
import SaveFile from './save_file'

const BASE_PAGE = new BasePage()
const SAVE_FILE = new SaveFile()

export default class DashAPIRequest extends CampaignPage {
  constructor(campaign) {
    super(campaign)
  }

  campaignCreationRequestBody(campaign_name) {
    return {
      userId: this.campaign_user_id,
      name: campaign_name,
      adDomain: this.ad_domain,
      clickUrl: this.click_url,
      autoStart: this.autoStart,
      dates: {
        from: this.date_range.from,
        to: this.date_range.to,
      },
      country: this.country_name,
      bid: this.bid_cpm,
      budget: {
        daily: this.daily_budget,
        total: this.total_budget,
      },
      creativeSetIds: [this.creative_set_id],
    }
  }

  OAuthRequestBody() {
    return {
      grant_type: 'eskimi_dsp',
      username: Cypress.env('CREDENTIALS').USERNAME,
      password: Cypress.env('CREDENTIALS').PASSWORD,
      client_id: Cypress.env('CREDENTIALS').CLIENT_ID,
      client_secret: Cypress.env('CREDENTIALS').CLIENT_SECRET,
    }
  }

  getOAuthToken() {
    cy.request({
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      url: `${Cypress.env('DASH_API_URL')}${DASH_API_ENDPOINTS.OAUTH}`,
      body: this.OAuthRequestBody(),
      failOnStatusCode: false,
    }).then((response) => {
      cy.wrap(response.body.access_token).as('access_token')
    })
  }

  createBannerTypeCampaign(numberOfCampaignToCreate = 1) {
    this.getOAuthToken()
    cy.get('@access_token').then((token) => {
      for (let i = 0; i < numberOfCampaignToCreate; i++) {
        let name = `automation_testing_api_${BASE_PAGE.generateRandomString()}`
        cy.request({
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          url: `${Cypress.env('DASH_API_URL')}${DASH_API_ENDPOINTS.BANNER_CAMPAIGN_CREATION}`,
          body: this.campaignCreationRequestBody(name),
          failOnStatusCode: true,
        }).then((response) => {
          expect(response.status).to.eq(200)
          this.campaign_id.push(response.body.id)
          const CAMPAIGN = Object.assign({}, this)
          SAVE_FILE.saveCampaign(CAMPAIGN)
        })
      }
    })
  }

  deleteCampaignUsingApi(campaign_id) {
    this.getOAuthToken()
    return cy.get('@access_token').then((token) => {
      cy.request({
        method: 'DELETE',
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        url: `${Cypress.env('DASH_API_URL')}${DASH_API_ENDPOINTS.CAMPAIGN_DELETION(campaign_id)}`,
        failOnStatusCode: true,
      }).then((response) => {
        expect(response.status).to.eq(200)
      })
    })
  }

  deleteCampaign() {
    if (Array.isArray(this.campaign_id)) {
      const lastIndex = this.campaign_id.length - 1
      this.campaign_id.forEach((item) => {
        this.deleteCampaignUsingApi(item)
        if (this.campaign_id.indexOf(item) === lastIndex) {
          return this.campaign_id
        }
      })
    } else {
      return this.deleteCampaignUsingApi(this.campaign_id)
    }
  }

  getCampaignID() {
    return this.campaign_id
  }
}
