# Release Procedure


1. Create a release branch, e.g.:
    ```
    git checkout -b releases/1.0.0
    ```

1. Go to [GitHub Actions](https://github.com/Teradata/nodejs-driver/actions/workflows/ci-integration-tests.yml) and run the CI test on the release branch.

1. Go to [GitHub Actions](https://github.com/Teradata/nodejs-driver/actions/workflows/cd-release.yml) and publish a release.

1. Merge the release branch into `develop` branch:
    ```
    git checkout develop
    git merge releases/1.0.0
    ```

1. Remove entries in `CHANGELOG.md` to prepare for the next release. Commit and push the change.
