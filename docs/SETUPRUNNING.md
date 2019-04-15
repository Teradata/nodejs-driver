## Setup

### NPM
* Ensure you have **Node 8.x+** (on a Mac use Homebrew and `brew install node@8.9.4`)
* Ensure you have **npm 3.x+** installed.
* Add the dependency to your project. In the dependencies section of the package.json add:

```
"dependencies": {
  ...
  "teradata-nodejs-driver": "1.0.0-beta.1"
  ...
```

* Install the driver npm package into a project

` npm install`

#### MSVC Redistributables 2015 (Microsoft Windows only)
* MSVC Redistributables are required to run the Teradata Node.js Driver on Microsoft Windows
* If when running an error occurs for finding the `ref.node` native module then run the following command as an administrator to install MSVC Redistributables 2015
  * `npm install --global windows-build-tools --vs2015`

## Examples
* [Examples](examples/README.md)

## Running Tests
* [Tests](docs/RUNNINGTESTS.md)
