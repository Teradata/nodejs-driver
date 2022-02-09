# Release Procedure

Go to [GitHub Actions](https://github.com/Teradata/nodejs-driver/actions/workflows/cd-release.yml) and run the release job. The job bumps the release version in multiple files, creates a tag, and adds a release on GitHub. It also resets `CHANGELOG.md` in preparation for the next release.
