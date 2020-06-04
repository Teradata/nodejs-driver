## Setup

### NPM
* Ensure you have **Node 12.x+** (on a Mac use Homebrew and `brew install node@12.18.0`)
* Ensure you have **npm 6.x+** installed.
* Add the dependency to your project. In the dependencies section of the package.json add:

For Node.js 8.x, 9.x, 10.x, 11.x use:
```
...
"dependencies": {
  "teradata-nodejs-driver": "1.0.0-beta.2"
}
...
```

For Node.js 12.x and greater use:
```
...
"dependencies": {
  "teradata-nodejs-driver": "1.0.0-rc.2"
}
...
```

* Install the driver npm package into a project

` npm install`

#### MSVC Redistributables 2015 (Microsoft Windows only)
* MSVC Redistributables are required to run the Teradata Node.js Driver on Microsoft Windows
* If when running an error occurs for finding the `ref.node` native module then run the following command as an administrator to install MSVC Redistributables 2015
  * `npm install --global windows-build-tools --vs2015`

## Examples
* [Examples](../examples/README.md)

## Running Tests
* [Tests](RUNNINGTESTS.md)
