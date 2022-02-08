# Release Procedure

## Bump version

1. Create a release branch, e.g.:
    ```
    git checkout -b releases/1.0.0
    ```
1. Increment version in the following locations:
    * `version` in `package.json`
    * `teradata-nodejs-driver` version in `README.md`
    * `teradata-nodejs-driver` version in `docs/SETUPRUNNING.md`
1. Push changes to origin:
    ```
    git push origin
    ```

## Run tests

* Go to [GitHub Actions](https://github.com/Teradata/nodejs-driver/actions/workflows/ci-integration-tests.yml) and run the CI test on the release branch.

## npmjs

1. Create a tag in git and push it to origin:
    ```
    git tag v1.0.0
    git push origin --tags
    ```
1. Build and publish a release:
    ```
    npm run build-and-publish
    ```

## GitHub

1. Go to [new release GitHub page](https://github.com/Teradata/nodejs-driver/releases/new)
1. Type `v{semantic_version}` as the "tag version" (e.g., `v1.0.0`)
1. Leave the "target" as `main`
1. Type `teradata-nodejs-driver {semantic_version}` as the "release title" (e.g. `teradata-nodejs-driver 1.0.0`)
1. For pre-releases:
    - leave the description blank
    - Tick the "this is a pre-release" checkbox
1. Click the "publish release" button

## Prepare the repo for the next release

1. Merge the release branch into `develop` branch:
    ```
    git checkout develop
    git merge releases/1.0.0
    ```
