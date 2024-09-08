import BasePage from './basePage'
import { CAMPAIGN_CREATION, COMMON, CAMPAIGN_LIST } from '../support/locators'
import { CONSTANTS } from '../support/constants'
import SaveFile from '../support/save_file'

const BASE_PAGE = new BasePage()
const SAVE_FILE = new SaveFile()

export default class CampaignSingleDuplicatePage {
  constructor(campaign_duplicate) {
    this.campaign_id = undefined
    this.campaign_duplicate = campaign_duplicate
    this.existing_campaign_id = campaign_duplicate.existing_campaign_info.existing_campaign_id
    this.platform_type = campaign_duplicate.name_and_type.platform_type
    this.non_selected_platform_type = campaign_duplicate.name_and_type.non_selected_platform_type
    this.creative_type = campaign_duplicate.name_and_type.creative_type
    this.campaign_type = campaign_duplicate.name_and_type.campaign_type
    this.campaign_name = campaign_duplicate.name_and_type.campaign_name

    this.campaign_goal = campaign_duplicate.campaign_goal_info.campaign_goal
    this.primary_objective = campaign_duplicate.campaign_goal_info.primary_objective
    this.primary_objective_value = campaign_duplicate.campaign_goal_info.primary_objective_value
    this.sec_imp_capping_impressions = campaign_duplicate.campaign_goal_info.sec_imp_capping_impressions
    this.sec_imp_capping_clicks = campaign_duplicate.campaign_goal_info.sec_imp_capping_clicks
    this.impression_capping_amount = campaign_duplicate.campaign_goal_info.impression_capping_amount
    this.impression_capping_time_type = campaign_duplicate.campaign_goal_info.impression_capping_time_type

    this.date_range = campaign_duplicate.launch_date_and_budget.date_range
    this.bid_cpm = campaign_duplicate.launch_date_and_budget.bid_cpm
    this.daily_budget = campaign_duplicate.launch_date_and_budget.daily_budget
    this.total_budget = campaign_duplicate.launch_date_and_budget.total_budget

    this.country_name = campaign_duplicate.location_and_audiences.country_name

    this.ad_palcement_type_site_check = campaign_duplicate.platform_telco_and_devices.ad_palcement_type_site_check
    this.ad_palcement_type_app_check = campaign_duplicate.platform_telco_and_devices.ad_palcement_type_app_check
    this.mobile_operator = campaign_duplicate.platform_telco_and_devices.mobile_operator
    this.ip_address = campaign_duplicate.platform_telco_and_devices.ip_address
    this.device_type = campaign_duplicate.platform_telco_and_devices.device_type
    this.device_os = campaign_duplicate.platform_telco_and_devices.device_os
    this.device_brand = campaign_duplicate.platform_telco_and_devices.device_brand
    this.device_model = campaign_duplicate.platform_telco_and_devices.device_model
    this.device_browser = campaign_duplicate.platform_telco_and_devices.device_browser
    this.device_cost_ranges = campaign_duplicate.platform_telco_and_devices.device_cost_ranges
    this.sim_amount_2_sims_check = campaign_duplicate.platform_telco_and_devices.sim_amount_2_sims_check
    this.sim_amount_3_sims_check = campaign_duplicate.platform_telco_and_devices.sim_amount_3_sims_check
    this.sim_amount_4_sims_check = campaign_duplicate.platform_telco_and_devices.sim_amount_4_sims_check
    this.sim_amount_1_sim_check = campaign_duplicate.platform_telco_and_devices.sim_amount_1_sim_check
    this.device_conn_2g_check = campaign_duplicate.platform_telco_and_devices.device_conn_2g_check
    this.device_conn_4g_check = campaign_duplicate.platform_telco_and_devices.device_conn_4g_check
    this.device_conn_3g_check = campaign_duplicate.platform_telco_and_devices.device_conn_3g_check
    this.network_conn_2g_check = campaign_duplicate.platform_telco_and_devices.network_conn_2g_check
    this.network_conn_3g_check = campaign_duplicate.platform_telco_and_devices.network_conn_3g_check
    this.network_conn_4g_check = campaign_duplicate.platform_telco_and_devices.network_conn_4g_check
    this.multiple_operator_sim_card = campaign_duplicate.platform_telco_and_devices.multiple_operator_sim_card
    this.mobile_data_consumption = campaign_duplicate.platform_telco_and_devices.mobile_data_consumption
    this.operator_churn = campaign_duplicate.platform_telco_and_devices.operator_churn

    this.ad_exchanges = campaign_duplicate.deal_and_packages.ad_exchanges
    this.ad_placemenet_positions = campaign_duplicate.deal_and_packages.ad_placemenet_positions
    this.packages = campaign_duplicate.deal_and_packages.packages
    this.private_marketplace = campaign_duplicate.deal_and_packages.private_marketplace
    this.package_items = campaign_duplicate.deal_and_packages.package_items
    this.package = campaign_duplicate.deal_and_packages.package
    this.custom_bid_amount = campaign_duplicate.deal_and_packages.custom_bid_amount
    this.custom_daily_budget = campaign_duplicate.deal_and_packages.custom_daily_budget

    this.click_url_type = campaign_duplicate.landing_and_creatives.click_url_type
    this.click_url = campaign_duplicate.landing_and_creatives.click_url
    this.ad_domain = campaign_duplicate.landing_and_creatives.ad_domain
    this.creative = campaign_duplicate.landing_and_creatives.creative
  }

  duplicateCampaignAndVerifySuccessMsg() {
    BASE_PAGE.goToCampaigns()
    cy.get(CAMPAIGN_LIST.SEARCH_INPUT).type(this.existing_campaign_id)
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_ITEM_ACTION(this.existing_campaign_id)).click({ force: true })
    cy.get(CAMPAIGN_LIST.CAMPAIGN_SINGLE_DUPLICATE(this.existing_campaign_id)).click({ force: true })
    //necessary evil, otherwise unable to publish
    cy.wait(5000)
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_PUBLISH_BTN, { timeout: 5000 }).click()
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_APPROVE_LINK).invoke('attr', 'href').as('campaignUrl')
    cy.get(COMMON.ALERT).should('contain', 'Saved successfully. Click here to approve the campaign.')
    return cy.get('@campaignUrl').then((link) => {
      const URL_PARAMS = new URLSearchParams(new URL(link).search)
      this.campaign_id = URL_PARAMS.get('id')
      const CAMPAIGN = Object.assign({}, this)
      SAVE_FILE.saveCampaign(CAMPAIGN)
    })
  }

  verifyDuplicateCampaignData() {
    BASE_PAGE.goToCampaignEdit(this.campaign_id)
    this.verifyNameAndTypeSectionData()
    this.verifyCampaignGoalSectionData()
    this.verifyLaunchDateAndBudgetSectionData()
    this.verifyLocationAndAudiencesSectionData()
    this.verifyPlatformsTelcoAndDevicesSectionData()
    this.verifyDealsAndPackagesSectionData()
    this.verifyLandingAndCreativesSectionData()
  }

  verifyNameAndTypeSectionData() {
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_PLATFORM_TYPE(this.platform_type.toLowerCase()))
      .invoke('attr', 'class')
      .should('contain', 'active')
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_PLATFORM_TYPE(this.non_selected_platform_type.toLowerCase()))
      .invoke('attr', 'class')
      .should('eq', 'campaign-platform-icon')
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_CREATIVE_TYPE)
      .invoke('val')
      .should('eq', CONSTANTS.CREATIVE_TYPES[this.creative_type.toLowerCase()] + '')
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_CHANNEL_TYPE)
      .invoke('val')
      .should('eq', CONSTANTS.CHANNEL_TYPE[this.campaign_type.toLowerCase()] + '')
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_NAME_INPUT).invoke('val').should('eq', this.campaign_name)
  }

  verifyCampaignGoalSectionData() {
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_GOAL(CONSTANTS.CAMPAIGN_GOALS[this.campaign_goal.toLowerCase()]))
      .invoke('attr', 'class')
      .should('contain', 'active')
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_PRIMARY_GOALS(this.primary_objective.toLowerCase()))
      .invoke('attr', 'class')
      .should('contain', 'active')
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_PRIMARY_GOAL_AMOUNT(this.primary_objective.toLowerCase()))
      .invoke('text')
      .should('contain', this.primary_objective_value)
    cy.get(CAMPAIGN_CREATION.DEFAULT_COUNTRY_IMPRESSION_CAPPING_CHECK).should('not.be.checked')
    cy.get(CAMPAIGN_CREATION.IMPRESSION_CAPPING_IMPRESSION_INPUT)
      .invoke('val')
      .should('eq', this.sec_imp_capping_impressions)
    cy.get(CAMPAIGN_CREATION.IMPRESSION_CAPPING_CLICKS_INPUT).invoke('val').should('eq', this.sec_imp_capping_clicks)
    cy.get(CAMPAIGN_CREATION.CAPPING_AMOUNT_INPUT).invoke('val').should('eq', this.impression_capping_amount)
    cy.get(CAMPAIGN_CREATION.CAPPING_TIME_TYPE_SELECT)
      .invoke('val')
      .should('eq', CONSTANTS.CAPPING_TIME_TYPE[this.impression_capping_time_type])
  }

  verifyLaunchDateAndBudgetSectionData() {
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_DATE_RANGE_FIELD).invoke('val').should('eq', this.date_range)
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_BID_INPUT).invoke('val').should('eq', this.bid_cpm)
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_DAILY_BUDGET).invoke('val').should('eq', this.daily_budget)
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_TOTAL_BUDGET).invoke('val').should('eq', this.total_budget)
  }

  verifyLocationAndAudiencesSectionData() {
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_COUNTRY_SELECT)
      .invoke('val')
      .then((selectedValue) => {
        const value = selectedValue[0]
        expect(value).to.equal(CONSTANTS.COUNTRY[this.country_name.toLowerCase()])
      })
  }

  verifyPlatformsTelcoAndDevicesSectionData() {
    cy.get(
      CAMPAIGN_CREATION.AD_PLACEMENT_TYPE_CHECK(CONSTANTS.AD_PLACEMENT_TYPE[this.ad_palcement_type_site_check]),
    ).should('be.checked')
    cy.get(
      CAMPAIGN_CREATION.AD_PLACEMENT_TYPE_CHECK(CONSTANTS.AD_PLACEMENT_TYPE[this.ad_palcement_type_app_check]),
    ).should('not.be.checked')
    cy.get(CAMPAIGN_CREATION.MOBILE_OPERATORS_SELECT)
      .invoke('val')
      .then((selectedValue) => {
        const value = selectedValue[0]
        expect(value).to.equal(CONSTANTS.MOBILE_OPERATORS_ISPS[this.mobile_operator] + '')
      })
    cy.get(CAMPAIGN_CREATION.IP_ADDRESSES_TEXTAREA).invoke('text').should('eq', this.ip_address)
    cy.get(CAMPAIGN_CREATION.IP_ADDRESSES_INCLUDE_INPUT).should('not.be.checked')
    cy.get(CAMPAIGN_CREATION.IP_ADDRESSES_EXCLUDE_INPUT).should('be.checked')
    cy.get(CAMPAIGN_CREATION.DEVICE_TYPE_SELECT)
      .invoke('val')
      .then((selectedValue) => {
        const value = selectedValue[0]
        expect(value).to.equal(CONSTANTS.DEVICEE_TYPE[this.device_type] + '')
      })
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_DEVICE_OS_SELECT)
      .invoke('val')
      .then((selectedValue) => {
        const value = selectedValue[0]
        expect(value).to.equal(CONSTANTS.DEVICEE_OS[this.device_os] + '')
      })
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_DEVICE_BRAND_SELECT)
      .invoke('val')
      .then((selectedValue) => {
        const value = selectedValue[0]
        expect(value).to.equal(CONSTANTS.DEVICE_BRAND[this.device_brand] + '')
      })
    cy.get(CAMPAIGN_CREATION.DEVICE_BRAND_INCLUDE_INPUT).should('be.checked')
    cy.get(CAMPAIGN_CREATION.DEVICE_BRAND_EXCLUDE_INPUT).should('not.be.checked')
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_DEVICE_MODEL_SELECT)
      .invoke('val')
      .then((selectedValue) => {
        const value = selectedValue[0]
        expect(value).to.equal(CONSTANTS.DEVICE_MODEL[this.device_model] + '')
      })
    cy.get(CAMPAIGN_CREATION.DEVICE_MODEL_INCLUDE_INPUT).should('not.be.checked')
    cy.get(CAMPAIGN_CREATION.DEVICE_MODEL_EXCLUDE_INPUT).should('be.checked')
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_DEVICE_BROWSERS_SELECT)
      .invoke('val')
      .then((selectedValue) => {
        const value = selectedValue[0]
        expect(value).to.equal(CONSTANTS.DEVICE_BROWSER[this.device_browser] + '')
      })
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_DEVICE_COST_SELECT)
      .invoke('val')
      .then((selectedValue) => {
        const value = selectedValue[0]
        expect(value).to.equal(CONSTANTS.DEVICE_COST[this.device_cost_ranges] + '')
      })
    cy.get(CAMPAIGN_CREATION.SIM_AMOUNT_CHECK(CONSTANTS.SIM_AMOUNT[this.sim_amount_2_sims_check])).should('be.checked')
    cy.get(CAMPAIGN_CREATION.SIM_AMOUNT_CHECK(CONSTANTS.SIM_AMOUNT[this.sim_amount_1_sim_check])).should(
      'not.be.checked',
    )
    cy.get(CAMPAIGN_CREATION.SIM_AMOUNT_CHECK(CONSTANTS.SIM_AMOUNT[this.sim_amount_3_sims_check])).should(
      'not.be.checked',
    )
    cy.get(CAMPAIGN_CREATION.SIM_AMOUNT_CHECK(CONSTANTS.SIM_AMOUNT[this.sim_amount_4_sims_check])).should(
      'not.be.checked',
    )
    cy.get(CAMPAIGN_CREATION.DEVICE_CONNECTION_CHECK(CONSTANTS.DEVICE_CONNECTION[this.device_conn_2g_check])).should(
      'be.checked',
    )
    cy.get(CAMPAIGN_CREATION.DEVICE_CONNECTION_CHECK(CONSTANTS.DEVICE_CONNECTION[this.device_conn_3g_check])).should(
      'be.checked',
    )
    cy.get(CAMPAIGN_CREATION.DEVICE_CONNECTION_CHECK(CONSTANTS.DEVICE_CONNECTION[this.device_conn_4g_check])).should(
      'be.checked',
    )
    cy.get(CAMPAIGN_CREATION.DEVICE_CONN_EXCLUDE_INPUT(CONSTANTS.DEVICE_CONNECTION[this.device_conn_2g_check])).should(
      'be.checked',
    )
    cy.get(CAMPAIGN_CREATION.DEVICE_CONN_EXCLUDE_INPUT(CONSTANTS.DEVICE_CONNECTION[this.device_conn_3g_check])).should(
      'be.checked',
    )
    cy.get(CAMPAIGN_CREATION.DEVICE_CONN_EXCLUDE_INPUT(CONSTANTS.DEVICE_CONNECTION[this.device_conn_4g_check])).should(
      'not.be.checked',
    )
    cy.get(CAMPAIGN_CREATION.DEVICE_CONN_ONLY_INPUT(CONSTANTS.DEVICE_CONNECTION[this.device_conn_2g_check])).should(
      'not.be.checked',
    )
    cy.get(CAMPAIGN_CREATION.DEVICE_CONN_ONLY_INPUT(CONSTANTS.DEVICE_CONNECTION[this.device_conn_3g_check])).should(
      'not.be.checked',
    )
    cy.get(CAMPAIGN_CREATION.DEVICE_CONN_ONLY_INPUT(CONSTANTS.DEVICE_CONNECTION[this.device_conn_4g_check])).should(
      'be.checked',
    )
    cy.get(CAMPAIGN_CREATION.NETWORK_CONNECTION_CHECK(CONSTANTS.NETWORK_CONNECTION[this.network_conn_2g_check])).should(
      'be.checked',
    )
    cy.get(CAMPAIGN_CREATION.NETWORK_CONNECTION_CHECK(CONSTANTS.NETWORK_CONNECTION[this.network_conn_3g_check])).should(
      'be.checked',
    )
    cy.get(CAMPAIGN_CREATION.NETWORK_CONNECTION_CHECK(CONSTANTS.NETWORK_CONNECTION[this.network_conn_4g_check])).should(
      'be.checked',
    )
    cy.get(
      CAMPAIGN_CREATION.NETWORK_CONN_EXCLUDE_INPUT(CONSTANTS.NETWORK_CONNECTION[this.network_conn_2g_check]),
    ).should('be.checked')
    cy.get(
      CAMPAIGN_CREATION.NETWORK_CONN_EXCLUDE_INPUT(CONSTANTS.NETWORK_CONNECTION[this.network_conn_3g_check]),
    ).should('not.be.checked')
    cy.get(
      CAMPAIGN_CREATION.NETWORK_CONN_EXCLUDE_INPUT(CONSTANTS.NETWORK_CONNECTION[this.network_conn_4g_check]),
    ).should('be.checked')

    cy.get(CAMPAIGN_CREATION.NETWORK_CONN_ONLY_INPUT(CONSTANTS.NETWORK_CONNECTION[this.network_conn_2g_check])).should(
      'not.be.checked',
    )
    cy.get(CAMPAIGN_CREATION.NETWORK_CONN_ONLY_INPUT(CONSTANTS.NETWORK_CONNECTION[this.network_conn_3g_check])).should(
      'be.checked',
    )
    cy.get(CAMPAIGN_CREATION.NETWORK_CONN_ONLY_INPUT(CONSTANTS.NETWORK_CONNECTION[this.network_conn_4g_check])).should(
      'not.be.checked',
    )
    cy.get(CAMPAIGN_CREATION.MULTIPLE_OPERATOR_SIM_CARD_SELECT)
      .invoke('val')
      .then((selectedValue) => {
        const value = selectedValue[0]
        expect(value).to.equal(CONSTANTS.MULTIPLE_OPERATOR_SIM_CARD[this.multiple_operator_sim_card] + '')
      })
    cy.get(CAMPAIGN_CREATION.MOBILE_DATA_CONSUMPTION_SELECT)
      .invoke('val')
      .then((selectedValue) => {
        const value = selectedValue[0]
        expect(value).to.equal(CONSTANTS.MOBILE_DATA_CONSUMPTION[this.mobile_data_consumption] + '')
      })
    cy.get(CAMPAIGN_CREATION.OPERATOR_CHURN_SELECT)
      .invoke('val')
      .then((selectedValue) => {
        const value = selectedValue[0]
        expect(value).to.equal(CONSTANTS.OPERATOR_CHURN[this.operator_churn] + '')
      })
  }

  verifyDealsAndPackagesSectionData() {
    this.ad_exchanges.forEach((item) => {
      item !== '_Test QA'
        ? cy.get(CAMPAIGN_CREATION.AD_EXCHANGE_CHECK(CONSTANTS.AD_EXCHANGES[item])).should('not.be.checked')
        : cy.get(CAMPAIGN_CREATION.AD_EXCHANGE_CHECK(CONSTANTS.AD_EXCHANGES[item])).should('be.checked')
    })
    this.ad_placemenet_positions.forEach((item) => {
      item !== 'Below the Fold'
        ? cy
            .get(CAMPAIGN_CREATION.AD_PLACEMENT_POSITION_CHECK(CONSTANTS.AD_PLACEMENT_POSITION[item]))
            .should('not.be.checked')
        : cy
            .get(CAMPAIGN_CREATION.AD_PLACEMENT_POSITION_CHECK(CONSTANTS.AD_PLACEMENT_POSITION[item]))
            .should('be.checked')
    })
    this.packages.forEach((item) => {
      item !== 'automation_testing_100_sites (Open Auction only)'
        ? cy.get(CAMPAIGN_CREATION.CAMPAIGN_PACKAGE_CHECK(CONSTANTS.PACKAGES[item])).should('not.be.checked')
        : cy.get(CAMPAIGN_CREATION.CAMPAIGN_PACKAGE_CHECK(CONSTANTS.PACKAGES[item])).should('be.checked')
    })
    this.package_items.forEach((item) => {
      cy.get(
        CAMPAIGN_CREATION.CAMPAIGN_PACKAGE_INCLUDE_CHECK(
          CONSTANTS.PACKAGE_ITEMS[item],
          CONSTANTS.PACKAGES[this.package],
        ),
      ).should(($checkbox) => {
        const shouldBeChecked = item === 'Custom bid' || item === 'Custom daily budget'
        expect($checkbox).to.have.prop('checked', shouldBeChecked)
      })
    })
    cy.get(CAMPAIGN_CREATION.PRIVATE_MARKETPLACE_SELECT)
      .invoke('val')
      .then((selectedValue) => {
        const value = selectedValue[0]
        expect(value).to.equal(CONSTANTS.PRIVATE_MARKETPLACE[this.private_marketplace] + '')
      })

    cy.get(
      CAMPAIGN_CREATION.CAMPAIGN_PACKAGE_TYPE_INPUT(
        CONSTANTS.PACKAGE_ITEMS['Custom bid'],
        CONSTANTS.PACKAGES[this.package],
      ),
    )
      .invoke('val')
      .should('eq', this.custom_bid_amount)
    cy.get(
      CAMPAIGN_CREATION.CAMPAIGN_PACKAGE_TYPE_INPUT(
        CONSTANTS.PACKAGE_ITEMS['Custom daily budget'],
        CONSTANTS.PACKAGES[this.package],
      ),
    )
      .invoke('val')
      .should('eq', this.custom_daily_budget)
    cy.get(CAMPAIGN_CREATION.PRIVATE_MARKETPLACE_INCLUDE_INPUT).should('be.checked')
    cy.get(CAMPAIGN_CREATION.PRIVATE_MARKETPLACE_ONLY_INPUT).should('not.be.checked')
  }

  verifyLandingAndCreativesSectionData() {
    cy.get(CAMPAIGN_CREATION.CLICK_URL_TYPE_SELECT)
      .invoke('val')
      .then((selectedValue) => {
        const value = selectedValue[0]
        expect(value).to.equal(CONSTANTS.CLICK_URL_TYPE[this.click_url_type] + '')
      })
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_AD_DOMAIN_SELECT)
      .invoke('val')
      .then((selectedValue) => {
        expect(selectedValue).to.equal(this.ad_domain)
      })
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_CREATIVE_SET)
      .invoke('val')
      .then((selectedValue) => {
        const value = selectedValue[0]
        expect(value).to.equal(CONSTANTS.CREATIVE[this.creative] + '')
      })
    cy.get(CAMPAIGN_CREATION.CAMPAIGN_LANDING_PAGE).invoke('val').should('eq', this.click_url)
  }

  getCampaignData() {
    const CAMPAIGN = Object.assign({}, this)
    return CAMPAIGN
  }
}
