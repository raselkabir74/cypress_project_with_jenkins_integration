import * as path from 'path'

export default class SaveFile {
  saveAdmValue(inputStr, videoXMLResponse = false, nativeJSONResponse = false) {
    let filePathAndName
    inputStr = this.formatFileBody(inputStr)
    if (videoXMLResponse) {
      filePathAndName = path.join(__dirname, '../fixtures/bid_response/bid-response.xml')
    } else if (nativeJSONResponse) {
      filePathAndName = path.join(__dirname, '../fixtures/bid_response/bid-response.json')
    } else {
      filePathAndName = path.join(__dirname, '../fixtures/bid_response/bid-response.html')
    }
    this.saveFile(inputStr, filePathAndName)
  }

  saveBidResponseJSON(responseBody, requestNo = 1) {
    const constantJsonFilePath = path.join(__dirname, `../fixtures/bid_response_json/bid-response-${requestNo}.json`)
    cy.task('deleteFiles', './cypress/fixtures/bid_response_json/*')
    cy.task('writeFile', {
      filename: constantJsonFilePath,
      content: JSON.stringify(responseBody),
    })
    cy.wait(500)
  }

  formatFileBody(inputStr) {
    return inputStr.replace(/\\\"/g, '"')
  }

  saveFile(inputStr, filePathAndName) {
    cy.task('deleteFiles', './cypress/fixtures/bid_response/*')
    cy.task('writeFile', { filename: filePathAndName, content: inputStr })
  }

  saveCampaign(campaign) {
    const constantCampaignJsonFilePath = path.join(__dirname, '../fixtures/campaign_json/campaign.json')
    cy.task('deleteFiles', './cypress/fixtures/campaign_json/*')
    cy.task('writeFile', {
      filename: constantCampaignJsonFilePath,
      content: JSON.stringify(campaign),
    })
  }
}
