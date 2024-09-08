const { defineConfig } = require("cypress")
const { configureVisualRegression } = require('cypress-visual-regression/dist/plugin');

module.exports = defineConfig({
  screenshotsFolder: 'results/',
  screenshotOnRunFailure: false,
  env: {
    visualRegressionType: 'regression',
    visualRegressionBaseDirectory: './cypress/snapshots/base/campaigns',
    visualRegressionDiffDirectory: 'results/diff',
    visualRegressionGenerateDiff: 'fail',
    visualRegressionFailSilently: false
  },
  trashAssetsBeforeRuns: true,
  viewportWidth: 1920,
  viewportHeight: 1080,
  experimentalMemoryManagement: true,
  numTestsKeptInMemory: 3,
  reporter: 'mocha-junit-reporter',
  reporterOptions: {
    mochaFile: 'results/test-results-[hash].xml',
    attachments: true,
  },
  e2e: {
    specPattern: 'cypress/e2e/**/*.smoke.cy.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      const fs = require('fs')
      const path = require('path')
      const glob = require('glob')
      const archiver = require('archiver');
      let specCount = 0;
      let completedSpecs = 0;

      configureVisualRegression(on);
      
      on('before:browser:launch', (browser = {}, launchOptions) => {
      launchOptions.args.push('--in-process-gpu')

      return launchOptions
      })

      on('task', {
        writeFile ({filename, content = ''}) {
          const dir = path.dirname(filename)
          
          if (!fs.existsSync(dir)){
              fs.mkdirSync(dir, { recursive: true }) // recursive: true ensures all nested dirs are created
          }
          
          fs.writeFileSync(filename, content)
          return null
        },
        clearFileContent({filename}) {
            if (fs.existsSync(filename)) {
                fs.writeFileSync(filename, '') // Overwrite with empty content
            }
            return null
        },
        deleteFiles(relativePath) {
          const absolutePath = path.join(__dirname, relativePath)
          const files = glob.sync(absolutePath)
          files.forEach((file) => {
            if (fs.existsSync(file)) {
              fs.unlinkSync(file)
            }
          })
          return null
        }
      })

      on('before:run', (details) => {
        specCount = details.specs.length;
      });

      on('after:spec', () => {
        completedSpecs++;
        if (completedSpecs === specCount) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              const output = fs.createWriteStream(path.join(__dirname, 'results/screenshot_results.zip'));
              const archive = archiver('zip', {
                zlib: { level: 9 } // Sets the compression level.
              });
      
              output.on('close', function() {
                console.log(archive.pointer() + ' total bytes');
                console.log('archiver has been finalized and the output file descriptor has closed.');
                resolve();
              });
      
              archive.on('error', function(err) {
                console.log('An error occurred:', err);
                reject(err);
              });
      
              archive.pipe(output)
      
              archive.glob('**/*.png', {
                cwd: path.join(__dirname, 'results')
              });
      
              archive.finalize();
            }, 5000); // wait for 5 seconds before starting the archiving process
          });
        }
      })
    }
  },
})
