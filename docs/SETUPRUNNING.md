## Setup

### NPM
* Ensure you have a supported version of Node installed (on a Mac use Homebrew and `brew install node@x.x.x` or `nvm install x.x.x`).
* Add the dependency to your project. In the dependencies section of the package.json add:

For Node.js 8.x, 9.x, 10.x, 11.x use:
```
...
"dependencies": {
  "teradata-nodejs-driver": "1.0.0-beta.2"
}
...
```

For Node.js 12.x, 17.x use:
```
...
"dependencies": {
  "teradata-nodejs-driver": "1.0.0-rc.14"
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
