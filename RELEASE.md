# Release Procedure

> The release process doesn't run tests. Make sure you run integration tests before releasing the library.

Go to [GitHub Actions](https://github.com/Teradata/nodejs-driver/actions/workflows/cd-release.yml), enter the new release number and run the release job. The job bumps the release version in multiple files, creates a tag, and adds a release on GitHub. It also resets `CHANGELOG.md` in preparation for the next release.
