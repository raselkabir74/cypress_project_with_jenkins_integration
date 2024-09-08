import { CAMPAIGN_MASS_EDIT, COMMON, CAMPAIGN_CREATION } from '../support/locators'
import BasePage from './basePage'
import { CONSTANTS } from '../support/constants'

const BASE_PAGE = new BasePage()

export default class CampaignMassApprovePage {
  constructor(campaignEditData, campaign) {
    this.campaign = campaign
    this.campaign_name = campaignEditData.campaign_name
    this.bid_amount = campaignEditData.bid_amount
    this.daily_budget = campaignEditData.daily_budget
    this.total_budget = campaignEditData.total_budget
    this.landing_url = campaignEditData.landing_url
    this.ad_domain_url = campaignEditData.ad_domain_url
    this.package = campaignEditData.package
    this.package_type = campaignEditData.package_type

    this.package_items = campaignEditData.package_items
    this.packages = campaignEditData.packages
  }

  massEditCampaignAndVerifySuccessMsg() {
    BASE_PAGE.goToCampaignMassEdit(this.campaign)
    cy.get(CAMPAIGN_MASS_EDIT.MASS_NAME_INPUT).type(this.campaign_name)
    cy.get(CAMPAIGN_MASS_EDIT.MASS_BID_INPUT).type(this.bid_amount)
    cy.get(CAMPAIGN_MASS_EDIT.MASS_DAILY_BUDGET_INPUT).type(this.daily_budget)
    cy.get(CAMPAIGN_MASS_EDIT.MASS_TOTAL_BUDGET_INPUT).type(this.total_budget)
    cy.get(CAMPAIGN_MASS_EDIT.MASS_LANDING_INPUT).type(this.landing_url)
    cy.get(CAMPAIGN_MASS_EDIT.MASS_AD_DOMAIN_ARROW).click({ force: true })
    cy.wait(1000)
    cy.get(CAMPAIGN_MASS_EDIT.MASS_AD_DOMAIN_INPUT).type(this.ad_domain_url).type('{enter}')
    cy.get(CAMPAIGN_MASS_EDIT.MASS_PACKAGE_BTN).click()
    cy.get(CAMPAIGN_MASS_EDIT.MASS_PACKAGE_UNCHECK_ALL_BTN).click()
    cy.get(CAMPAIGN_MASS_EDIT.PACKAGE(CONSTANTS.PACKAGES[this.package])).click()
    cy.get(CAMPAIGN_MASS_EDIT.PACKAGE_TYPE(CONSTANTS.PACKAGE_ITEMS[this.package_type])).click()
    cy.get(CAMPAIGN_MASS_EDIT.MASS_PACKAGE_OK_BTN).click()
    cy.get(CAMPAIGN_MASS_EDIT.MASS_SAVE_BTN).click()
    return cy.get(COMMON.ALERT).should('contain', 'Changes saved successfully')
  }

  verifyMassEditCampaignData() {
    this.campaign.campaign_id.forEach((item) => {
      BASE_PAGE.goToCampaignEdit(item)
      cy.get(CAMPAIGN_CREATION.CAMPAIGN_NAME_INPUT).invoke('val').should('eq', this.campaign_name)
      cy.get(CAMPAIGN_CREATION.CAMPAIGN_BID_INPUT).invoke('val').should('eq', this.bid_amount)
      cy.get(CAMPAIGN_CREATION.CAMPAIGN_DAILY_BUDGET).invoke('val').should('eq', this.daily_budget)
      cy.get(CAMPAIGN_CREATION.CAMPAIGN_TOTAL_BUDGET).invoke('val').should('eq', this.total_budget)
      this.packages.forEach((item) => {
        item !== this.package
          ? cy.get(CAMPAIGN_CREATION.CAMPAIGN_PACKAGE_CHECK(CONSTANTS.PACKAGES[item])).should('not.be.checked')
          : cy.get(CAMPAIGN_CREATION.CAMPAIGN_PACKAGE_CHECK(CONSTANTS.PACKAGES[item])).should('be.checked')
      })
      this.package_items.forEach((item) => {
        item !== this.package_type
          ? cy
              .get(
                CAMPAIGN_CREATION.CAMPAIGN_PACKAGE_INCLUDE_CHECK(
                  CONSTANTS.PACKAGE_ITEMS[item],
                  CONSTANTS.PACKAGES[this.package],
                ),
              )
              .should('not.be.checked')
          : cy
              .get(
                CAMPAIGN_CREATION.CAMPAIGN_PACKAGE_INCLUDE_CHECK(
                  CONSTANTS.PACKAGE_ITEMS[item],
                  CONSTANTS.PACKAGES[this.package],
                ),
              )
              .should('be.checked')
      })
      cy.get(CAMPAIGN_CREATION.CAMPAIGN_LANDING_PAGE).invoke('val').should('eq', this.landing_url)
      cy.get(CAMPAIGN_CREATION.CAMPAIGN_AD_DOMAIN_SELECT)
        .invoke('val')
        .then((selectedValue) => {
          expect(selectedValue).to.equal(this.ad_domain_url)
        })
    })
  }
}
