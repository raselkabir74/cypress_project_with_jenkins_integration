import LoginPage from '../../pages/loginPage'
import CreativePage from '../../pages/creativePage'
import CreativeSetPage from '../../pages/creativeSetPage'
import BasePage from '../../pages/basePage'

const LOGIN_PAGE = new LoginPage()
const BASE_PAGE = new BasePage()

describe('Verify video type creative creation', () => {
  let creative

  afterEach(function () {
    if (this.currentTest.state === 'failed') {
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
      BASE_PAGE.deleteCreativeSetAndCreative(creative).then(() => {
        throw new Error(errorMessage)
      })
    }
  })

  describe('Create video type creative', () => {
    before(() => {
      LOGIN_PAGE.logIn()
    })

    it('Create video type creative', () => {
      cy.fixture('creatives/video_type_creative.json').as('creative')

      cy.get('@creative').then((creativeData) => {
        const CREATIVE_PAGE = new CreativePage(creativeData)
        CREATIVE_PAGE.createVideoCreativeAndVerify().then(() => {
          creative = CREATIVE_PAGE.getCreativeData()
        })
      })
    })
  })

  describe('Verify and delete created video type creative', () => {
    before(() => {
      LOGIN_PAGE.logIn()
    })

    it('Verify created creative', () => {
      const CREATIVE_SET_PAGE = new CreativeSetPage(creative)
      CREATIVE_SET_PAGE.verifyCreative()
    })

    after(() => {
      BASE_PAGE.deleteCreativeSetAndCreative(creative)
    })
  })
})
