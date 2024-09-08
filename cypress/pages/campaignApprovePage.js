import { CAMPAIGN_APPROVE, COMMON } from '../support/locators'
import { CONSTANTS } from '../support/constants'
import BasePage from './basePage'

const BASE_PAGE = new BasePage()

export default class CampaignApprovePage {
  constructor(campaign) {
    this.campaign_id = campaign.campaign_id
    this.campaign_platform_type = campaign.platform_type
    this.creative_type = campaign.creative_type
    this.campaign_type = campaign.campaign_type
    this.campaign_type_id = campaign.campaign_type_id
    this.campaign_name = campaign.campaign_name
    this.campaign_goal = campaign.campaign_goal
    this.primary_objective = campaign.primary_objective
    this.primary_objective_value = campaign.primary_objective_value
    this.date_range = campaign.date_range
    this.bid_cpm = campaign.bid_cpm
    this.daily_budget = campaign.daily_budget
    this.total_budget = campaign.total_budget
    this.country_name = campaign.country_name
    this.package = campaign.package
    this.package_id = campaign.package_id
    this.package_include = campaign.package_include
    this.click_url_type = campaign.click_url_type
    this.click_url = campaign.click_url
    this.ad_domain = campaign.ad_domain
    this.creative = campaign.creative
    this.creative_set_id = campaign.creative_set_id
    this.advertiser = campaign.campaign_approve.advertiser
    this.advertiser_category = campaign.campaign_approve.advertiser_category
      ? campaign.campaign_approve.advertiser_category
      : null
    this.exchange = campaign.campaign_approve.exchange
  }

  approveCampaignAndVerifyCampaignStatus() {
    BASE_PAGE.goToCampaignApprove(this.campaign_id)
    cy.get(CAMPAIGN_APPROVE.DEMOGRAPHIC_NO_SYNC_CHECK).click()
    cy.get(CAMPAIGN_APPROVE.ADVERTISER_NAME_SELECT).then(($advertiser) => {
      $advertiser.val(this.advertiser).click()
    })
    this.advertiser_category ? this.selectAdvertisementCategory() : null
    cy.get(CAMPAIGN_APPROVE.INCLUDE_ADVERTISEMENT_CATEGORIES).click({ force: true })
    cy.get(CAMPAIGN_APPROVE.CAMPAIGN_UNCHECK_DOMAIN_SPOOFERS).click({ force: true })
    cy.get(CAMPAIGN_APPROVE.ALLOW_MULTIPLE_BIDS).click()
    cy.get(CAMPAIGN_APPROVE.EXCHANGE_UNCHECK_ALL_BTN).click()
    cy.get(CAMPAIGN_APPROVE.BIDSWITCH_UNCHECK_ALL_BTN).click()
    cy.get(CAMPAIGN_APPROVE.EXCHANGE(CONSTANTS.EXCHANGES[this.exchange])).click()
    cy.get(CAMPAIGN_APPROVE.CAMPAIGN_APPROVE_BTN).click()
    cy.get(COMMON.WARN_MODAL_CANCEL_BTN).click()
    BASE_PAGE.goToCampaigns()
    //necessary evil, takes some time to update campaign status
    cy.wait(2000)
    BASE_PAGE.goToCampaigns()
    cy.get(CAMPAIGN_APPROVE.SEARCH_INPUT_FIELD).type(this.campaign_id)
    cy.get(CAMPAIGN_APPROVE.CAMPAIGN_LIST_TABLE_ROW).first().should('contain.text', this.campaign_id)
    cy.get(CAMPAIGN_APPROVE.CAMPAIGN_LIST_TABLE_ROW).first().should('contain.text', this.campaign_name)
    cy.get(CAMPAIGN_APPROVE.CAMPAIGN_LIST_TABLE_ROW).first().should('contain.text', 'Live')
  }

  selectAdvertisementCategory() {
    cy.get(CAMPAIGN_APPROVE.ADVERTISEMENT_CATEGORIES).select(this.advertiser_category, { force: true })
  }
}
