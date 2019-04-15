## Setup Fastcall

### NPM
* Ensure you have **Node 8.x+** (on a Mac use Homebrew and `brew install node@8.9.4`)
* Ensure you have **npm 3.x+** installed.

## Building prebuilt fastcall dependency and publish to npm

* Install **cmake**
  * [https://cmake.org/download/](https://cmake.org/download/)
  * You may need to point your Path to the bin dir for cmake
     * **(Mac only)** `export PATH=$PATH:/Applications/CMake.app/Contents/bin`
* Install Node packages:
  *  `cd scripts/fastcall`
  *  `npm install`
* Build os specific fastcall and publish binary to npm:
  * `npm run publish-fastcall`
