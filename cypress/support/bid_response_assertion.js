import { AD_HTML } from './locators'

export default class BidResponseAssert {
  constructor(campaign) {
    this.campaign_id = campaign.campaign_id
  }

  verifyBidResponse({
    snapName,
    requestNo = 1,
    URLTracking = false,
    videoXMLResponse = false,
    nativeJSONResponse = false,
  }) {
    cy.fixture(`../bid_response_json/bid-response-${requestNo}.json`).as('bidResponse')
    cy.get('@bidResponse').then((responseBody) => {
      this.verifyCampaignId(responseBody.seatbid[0].bid[0].adid)
      this.setImpressions(responseBody.seatbid[0].bid[0].burl, responseBody)
      videoXMLResponse
        ? this.verifyVideoBanner()
        : nativeJSONResponse
        ? this.verifyNativeBanner()
        : this.verifyBanner(snapName, URLTracking)
    })
  }

  verifyCampaignId(campaignId) {
    expect(campaignId).to.include(this.campaign_id)
  }

  setImpressions(url, responseBody) {
    const NEW_URL = url
      .replace('${AUCTION_PRICE}', responseBody.seatbid[0].bid[0].price)
      .replace('${AUCTION_AD_ID}', responseBody.seatbid[0].bid[0].adid)
      .replace('${AUCTION_ID}', responseBody.seatbid[0].bid[0].id)
    cy.request(NEW_URL)
  }

  verifyBanner(snapName, URLTracking) {
    cy.readFile('./cypress/fixtures/bid_response/bid-response.html').then((content) => {
      cy.document().then((doc) => {
        doc.open()
        doc.write(content)
        cy.get('img')
          .should('be.visible')
          .then(($img) => {
            return new Cypress.Promise((resolve, reject) => {
              $img[0].onload = resolve
              $img[0].onerror = reject
            })
          })
          .then(() => {
            cy.compareSnapshot(snapName, {
              errorThreshold: 0.011,
            })
          })
        this.setClick(URLTracking)
        doc.close()
      })
    })
  }

  verifyVideoBanner() {
    cy.fixture(`../bid_response/bid-response.xml`).as('videoBanner')
    cy.get('@videoBanner').then((xmlContent) => {
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xmlContent, 'text/xml')
      const clickThroughUrl = xmlDoc.evaluate('//ClickThrough', xmlDoc, null, XPathResult.STRING_TYPE, null).stringValue
      cy.visit(clickThroughUrl)
    })
  }

  verifyNativeBanner() {
    cy.fixture(`../bid_response/bid-response.json`).as('nativeBanner')
    cy.get('@nativeBanner').then((jsonContent) => {
      const clickUrl = jsonContent.native.link.url
      cy.visit(clickUrl)
    })
  }

  setClick(URLTracking) {
    cy.get(AD_HTML.STATIC_AD_IMG)
      .invoke('attr', 'href')
      .then((link) => {
        cy.visit(link)
        if (URLTracking) {
          cy.location('href').as('newUrl')
          cy.get('@newUrl').then((url) => {
            const URL_PARAMS = new URLSearchParams(new URL(url).search)
            cy.request({
              method: 'GET',
              url: Cypress.env('DSP_PIXEL_API'),
              qs: {
                eucid: URL_PARAMS.get('click_id'),
              },
            })
          })
        }
      })
  }
}
