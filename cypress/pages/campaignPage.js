import BasePage from './basePage'
import { CAMPAIGN_CREATION, COMMON } from '../support/locators'
import { CONSTANTS } from '../support/constants'
import SaveFile from '../support/save_file'

const BASE_PAGE = new BasePage()
const SAVE_FILE = new SaveFile()

export default class CampaignPage {
  constructor(campaign) {
    this.campaign_id = campaign.campaign_id ? campaign.campaign_id : []
    this.campaign_user_id = campaign.userId ? campaign.userId : null
    this.autoStart = campaign.autoStart ? campaign.autoStart : null
    this.campaign_platform_type = campaign.name_and_type ? campaign.name_and_type.platform_type : null
    this.creative_type = campaign.name_and_type ? campaign.name_and_type.creative_type : null
    this.campaign_type = campaign.name_and_type ? campaign.name_and_type.campaign_type : null
    this.campaign_type_id = campaign.name_and_type ? campaign.name_and_type.creative_type : null
    this.campaign_name = campaign.name_and_type
      ? `${campaign.name_and_type.campaign_name}_${BASE_PAGE.generateRandomString()}`
      : null
    this.campaign_goal = campaign.campaign_goal_info ? campaign.campaign_goal_info.campaign_goal : null
    this.primary_objective = campaign.campaign_goal_info ? campaign.campaign_goal_info.primary_objective : null
    this.primary_objective_value = campaign.campaign_goal_info
      ? campaign.campaign_goal_info.primary_objective_value
      : null
    this.sec_imp_capping_impressions = campaign.campaign_goal_info
      ? campaign.campaign_goal_info.sec_imp_capping_impressions
      : null
    this.sec_imp_capping_clicks = campaign.campaign_goal_info
      ? campaign.campaign_goal_info.sec_imp_capping_clicks
      : null
    this.impression_capping_amount = campaign.campaign_goal_info
      ? campaign.campaign_goal_info.impression_capping_amount
      : null
    this.impression_capping_time_type = campaign.campaign_goal_info
      ? campaign.campaign_goal_info.impression_capping_time_type
      : null
    this.date_range = campaign.launch_date_and_budget ? campaign.launch_date_and_budget.date_range : null
    this.bid_cpm = campaign.launch_date_and_budget ? campaign.launch_date_and_budget.bid_cpm : null
    this.daily_budget = campaign.launch_date_and_budget ? campaign.launch_date_and_budget.daily_budget : null
    this.total_budget = campaign.launch_date_and_budget ? campaign.launch_date_and_budget.total_budget : null
    this.budget_pacing = campaign.launch_date_and_budget ? campaign.launch_date_and_budget.budget_pacing : null
    this.country_name = campaign.location_and_audiences ? campaign.location_and_audiences.country_name : null
    this.brand_safety = campaign.brand_safety ? campaign.brand_safety.keywords : null
    this.brand_safety_topic = campaign.brand_safety ? campaign.brand_safety.app_sites_topics : null
    this.brand_safety_category = campaign.brand_safety ? campaign.brand_safety.app_sites_category : null
    this.contextual_targeting = campaign.contextual_targeting ? campaign.contextual_targeting.keywords : null
    this.package = campaign.deals_and_packages ? campaign.deals_and_packages.package : null
    this.package_id = campaign.deals_and_packages ? campaign.deals_and_packages.package_id : null
    this.package_include = campaign.deals_and_packages ? campaign.deals_and_packages.package_include : null
    this.device_os = campaign.platform_telco_and_devices ? campaign.platform_telco_and_devices.device_os : null
    this.device_brand = campaign.platform_telco_and_devices ? campaign.platform_telco_and_devices.device_brand : null
    this.device_model = campaign.platform_telco_and_devices ? campaign.platform_telco_and_devices.device_model : null
    this.device_browsers = campaign.platform_telco_and_devices
      ? campaign.platform_telco_and_devices.device_browsers
      : null
    this.click_url_type = campaign.landing_and_creatives ? campaign.landing_and_creatives.click_url_type : null
    this.click_url = campaign.landing_and_creatives ? campaign.landing_and_creatives.click_url : null
    this.ad_domain = campaign.landing_and_creatives ? campaign.landing_and_creatives.ad_domain : null
    this.creative = campaign.landing_and_creatives ? campaign.landing_and_creatives.creative : null
    this.creative_set_id = campaign.landing_and_creatives ? campaign.landing_and_creatives.creative_set_id : null
    this.creative_id = campaign.custom_tracking ? campaign.custom_tracking.creative_id : null
    this.creative_bid_cpm = campaign.custom_tracking ? campaign.custom_tracking.bid_cpm : null
    this.creative_click_url = campaign.custom_tracking ? campaign.custom_tracking.click_url : null
    this.campaign_approve = campaign.campaign_approve ? campaign.campaign_approve : null
  }

  createCampaignAndVerifySuccessMsg = () => {
    BASE_PAGE.goToCampaigns()
    cy.get(CAMPAIGN_CREATION.NEW_CAMPAIGN_BTN).click()
    this.campaign_platform_type.length > 1 ? this.selectPlatforms() : null
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_CREATIVE_TYPE).select(
      CONSTANTS.CREATIVE_TYPES[this.creative_type.toLowerCase()],
      { force: true },
    )
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_CHANNEL_TYPE).select(CONSTANTS.CHANNEL_TYPE[this.campaign_type.toLowerCase()], {
      force: true,
    })
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_NAME_INPUT).type(this.campaign_name)
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_GOAL(CONSTANTS.CAMPAIGN_GOALS[this.campaign_goal.toLowerCase()])).click()
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_PRIMARY_GOALS(this.primary_objective.toLowerCase())).click()
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_PRIMARY_GOALS_INPUT).type(this.primary_objective_value)
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_PRIMARY_GOALS_SAVE_BTN).click()
    this.sec_imp_capping_impressions ? this.selectImpCappImpressions() : null
    this.sec_imp_capping_clicks
      ? cy.get(CAMPAIGN_CREATION.IMPRESSION_CAPPING_CLICKS_INPUT).type(this.sec_imp_capping_clicks)
      : null
    this.impression_capping_time_type ? this.setCappingAmountAndTimeType() : null
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_DATE_RANGE_FIELD).click()
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_DATE_PICKER_QUICKLINK(this.date_range.toLowerCase())).click()
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_BID_INPUT).type(this.bid_cpm)
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_DAILY_BUDGET).type(this.daily_budget)
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_TOTAL_BUDGET).type(this.total_budget)
    this.selectBudgetPacing()
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_COUNTRY_SELECT).select(CONSTANTS.COUNTRY[this.country_name.toLowerCase()], {
      force: true,
    })
    this.brand_safety ? this.selectBrandSafety() : null
    this.brand_safety_category ? this.selectAppSiteCatExclude() : null
    this.contextual_targeting ? this.selectContextualTargeting() : null
    this.package ? this.selectPackage() : null
    this.device_os ? this.selectDeviceOS() : null
    this.device_os ? cy.wait(1000) : null
    this.device_brand ? this.selectDeviceBrand() : null
    this.device_browsers ? this.selectDeviceBrowsers() : null
    this.device_browsers ? cy.wait(1000) : null
    this.device_brand ? cy.wait(1000) : null
    this.device_model ? this.selectDeviceModel() : null
    this.click_url_type === 'landing_page' ? null : this.selectClickUrlType()
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_LANDING_PAGE).type(this.click_url)
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_AD_DOMAIN_SELECT).select(this.ad_domain, { force: true })
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_CREATIVE_SET).select(this.creative, { force: true })
    this.creative_id ? this.addCustomClickURL() : null
    this.checkCreativeValidationFinished()
    this.verifyAdDomainErrorIsNotVisible()
    //necessary evil, otherwise creatives fails during campaign approve
    cy.wait(1000)
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_PUBLISH_BTN).click()
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_APPROVE_LINK).invoke('attr', 'href').as('campaignUrl')
    cy.get(COMMON.ALERT).should('contain', 'Saved successfully. Click here to approve the campaign.')
    cy.get('@campaignUrl').then((link) => {
      const URL_PARAMS = new URLSearchParams(new URL(link).search)
      this.campaign_id = URL_PARAMS.get('id')
      const CAMPAIGN = Object.assign({}, this)
      SAVE_FILE.saveCampaign(CAMPAIGN)
    })
  }

  selectPlatforms() {
    this.platform_type.forEach((element) => {
      let el = element.toLowerCase()
      el !== 'eskimi' ? cy.get(CAMPAIGN_CREATION.CAMPAIGN_PLATFORM_TYPE(element.toLowerCase())).click() : null
    })
  }

  selectImpCappImpressions() {
    cy.get(CAMPAIGN_CREATION.IMPRESSION_CAPPING_SECTION).click()
    cy.get(CAMPAIGN_CREATION.DEFAULT_COUNTRY_IMPRESSION_CAPPING_CHECK).click()
    cy.get(CAMPAIGN_CREATION.IMPRESSION_CAPPING_IMPRESSION_INPUT).type(this.sec_imp_capping_impressions)
  }

  setCappingAmountAndTimeType() {
    cy.get(CAMPAIGN_CREATION.CAPPING_AMOUNT_INPUT).type(this.impression_capping_amount)
    cy.get(CAMPAIGN_CREATION.CAPPING_TIME_TYPE_SELECT).select(this.impression_capping_time_type, { force: true })
  }

  selectPackage() {
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_DEALS_AND_PACKAGE_SECTION).click()
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_PACKAGE_BOX).click()
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_PACKAGE_CHECK(this.package_id)).check()
    this.checkPackageTypesInclude()
  }

  selectDeviceOS() {
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_PLATFORMS_TELCO_AND_DEVICES_SECTION).click()
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_DEVICE_OS_SELECT).invoke('val', [])
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_DEVICE_OS_SELECT).select(this.device_os, { force: true })
  }

  selectDeviceBrowsers() {
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_DEVICE_BROWSERS_SELECT).invoke('val', [])
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_DEVICE_BROWSERS_SELECT).select(this.device_browsers, { force: true })
  }

  selectDeviceBrand() {
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_DEVICE_BRAND_SECTION).click()
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_DEVICE_BRAND_SELECT).select(this.device_brand, { force: true })
  }

  selectDeviceModel() {
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_DEVICE_MODEL_SECTION).click()
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_DEVICE_MODEL_SELECT).select(this.device_model, { force: true })
  }

  checkPackageTypesInclude() {
    this.package_include.forEach((element) => {
      cy.get(
        CAMPAIGN_CREATION.CAMPAIGN_PACKAGE_INCLUDE_CHECK(CONSTANTS.PACKAGE_TYPE_OPTION[element], this.package_id),
      ).click()
    })
  }

  verifyAdDomainErrorIsNotVisible() {
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_AD_DOMAIN_ERROR).then(($element) => {
      if ($element.is(':visible')) {
        cy.get(CAMPAIGN_CREATION.CAMPAIGN_AD_DOMAIN_SELECT_OPTION).then((options) => {
          const FIRST_LABEL_INDEX = Object.keys(options).find((key) => {
            const option = options[key]
            return option.label === this.ad_domain
          })
          cy.get(CAMPAIGN_CREATION.CAMPAIGN_AD_DOMAIN_SELECT).select(parseInt(FIRST_LABEL_INDEX), { force: true })
          cy.get(CAMPAIGN_CREATION.CAMPAIGN_HTTP_STATUS_OK).should('be.visible')
        })
      }
    })
  }

  selectClickUrlType() {
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_CLICK_URL_SELECT).select(CONSTANTS.CLICK_URL_TYPES[this.click_url_type], {
      force: true,
    })
  }

  getCampaignData() {
    const CAMPAIGN = Object.assign({}, this)
    return CAMPAIGN
  }

  selectBrandSafety() {
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_BRAND_SAFETY_SELECT).select(this.brand_safety, { force: true })
  }

  selectContextualTargeting() {
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_CONTEXTUAL_TARGETING_SELECT).select(this.contextual_targeting, { force: true })
  }

  addCustomClickURL() {
    cy.wrap(this.creative_id).each((creativeId) => {
      cy.get(CAMPAIGN_CREATION.CAMPAIGN_CREATIVE_TOGGLE_BTN(creativeId)).click()
      cy.get(CAMPAIGN_CREATION.CAMPAIGN_CREATIVE_CLICK_URL(creativeId)).click()
      cy.get(CAMPAIGN_CREATION.CAMPAIGN_CREATIVE_CLICK_URL_INPUT(creativeId)).invoke('val', this.creative_click_url)
    })
  }

  checkCreativeValidationFinished() {
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_HTTP_STATUS_LOADING, { timeout: 10000 }).should('not.exist')
  }

  selectBudgetPacing() {
    switch (this.budget_pacing.toLowerCase()) {
      case 'none':
        cy.get(CAMPAIGN_CREATION.NONE_BUDGET_PACING).click({ force: true })
        break
      case 'even':
        cy.get(CAMPAIGN_CREATION.EVEN_BUDGET_PACING).click({ force: true })
        break
    }
  }

  selectAppSiteCatExclude() {
    let topic = CONSTANTS.APP_SITES_TOPICS[this.brand_safety_topic.toLowerCase()]
    let category = CONSTANTS.APP_SITES_CATEGORIES[this.brand_safety_category.toLowerCase()]
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_BRAND_SAFETY_EXCLUDE_APP_SITES_CATEGORIES).click({ force: true })
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_BRAND_SAFETY_EXCLUDE_APP_SITES_CATEGORIES_TOPICS(topic)).click({ force: true })
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_BRAND_SAFETY_EXCLUDE_APP_SITES_CATEGORIES_CHECK(topic, category)).click({ force: true })
  }
}
