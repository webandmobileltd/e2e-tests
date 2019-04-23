# E2E tests

## Debugging test failures on CI

Video recordings of failed E2E test runs on CI are saved to Google Cloud
storage. To watch the videos:

1. Find the archive URL from the `test-results` step of the E2E CI job
   - The URL will look like
     `gs://boclips-test-results/backoffice/results.tar#xyz`
2. Use `gcs-tar-view <% archive URL %>` to fetch the archive
   - On provisioned machines [`gcs-tar-view`] should be on the PATH
3. Locate the MP4 for the failed test

[`gcs-tar-view`]: https://github.com/boclips/infrastructure/blob/master/bin/gcs-tar-view


## Running locally

`./run`

Cypress can crash if running a long journey, for now the number of tests kept in memory is set to 0 so cypress doesn't crash chrome. However this can be annoying when you want to see test state for small tests. If you want to have this functionality in `cypress.json` remove `numTestsKeptInMemory` field. Also you can use `specify.only` to only run one test, that can be super useful so you don't have to run the whole journey each time
