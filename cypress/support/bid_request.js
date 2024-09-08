import { v4 as uuidv4 } from 'uuid'
import SaveFile from './save_file'

export default class BidRequest extends SaveFile {
  constructor(bid_request_body) {
    super()
    this.bid_request_body = bid_request_body
  }

  changeRequestIds(updateUserId = true) {
    this.bid_request_body.id = uuidv4()
    this.bid_request_body.user.id = updateUserId ? uuidv4() : this.bid_request_body.user.id
    this.bid_request_body.user.buyeruid = this.bid_request_body.user.id
  }

  sendRequest() {
    return cy.request({
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      url: Cypress.env('BID_REQUEST_ENDPOINT'),
      body: this.bid_request_body,
      failOnStatusCode: false,
    })
  }

  createAndSaveBidResponse({
    requestNo = 1,
    updateUserId = true,
    successBidResponse = true,
    videoXMLResponse = false,
    nativeJSONResponse = false,
  }) {
    const MAX_RETRIES = 10
    let attempts = 0
    const tryRequest = () => {
      this.changeRequestIds(updateUserId)
      this.sendRequest().then((response) => {
        if (response.status === 200 && response.body.seatbid && response.body.seatbid.length !== 0) {
          if (successBidResponse) {
            this.saveAdmValue(response.body.seatbid[0].bid[0].adm, videoXMLResponse, nativeJSONResponse)
            this.saveBidResponseJSON(response.body, requestNo)
          } else {
            expect(successBidResponse, 'Test failed: returned success bid response').to.be.true
          }
        } else if (attempts < MAX_RETRIES) {
          attempts++
          cy.wait(500)
          tryRequest()
        } else if (attempts === MAX_RETRIES) {
          if (successBidResponse) {
            expect(successBidResponse, 'Test failed: success bid response was not returned after 10 retries').to.be
              .false
          }
        }
      })
    }
    tryRequest()
  }
}
