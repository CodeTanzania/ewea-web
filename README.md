# ewea-web

[![Build Status](https://travis-ci.org/CodeTanzania/emis-web.svg?branch=develop)](https://travis-ci.org/CodeTanzania/emis-web)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)

<img src="docs/images/logo.svg" 
alt="EWEA Logo" width="100" height="auto" />

## About EWEA

EWEA web is an Early Warning, Early Action tool that facilitates the disseminationn of warnings, communication and actions associated with the warnings.

It that can be shared and analyzed in order generate insights for local authorities and communities to better manage disasters and increase resilience to disaster risk. The data is organized in core components.

![EWEA Homepage](docs/images/home.png 'EWEA Homepage')

## EWEA Components

#### Stakeholders

EWEA Stakeholders contains an up to date database of all stakeholders responsible for emergency/disaster management within a specific region.

See source code [repository](https://github.com/CodeTanzania/emis-stakeholder).


#### Alerts

EWEA alerts consists of alerts created This component consists of an up to date database of ingested emergency / disaster alerts from multiple sources in near real time and disseminating them to disaster management stakeholders.

See source code [repository](https://github.com/CodeTanzania/emis-alert).


#### Dashboards

EWEA dashboards consists of maps used for visualization and analysis of warnings and areas of interest.

See source code [repository]().

#### Geographical Features

Provides an up to date geographical database of all features of interest that can be used to study and control the expected and the actual extent of impact that may be caused in case of an emergency/disaster.

See source code [repository](https://github.com/CodeTanzania/emis-feature).

## Contribute

If you are interested in fixing issues and contributing directly to the code base, please read our [contributing guide](https://github.com/CodeTanzania/ewea-web/blob/develop/CONTRIBUTING.md).

Please also see [code of conduct](https://github.com/CodeTanzania/ewea-web/blob/develop/CONTRIBUTING.md) to know what we expect of all project participants.

When you are done, go ahead and install the project.

### Installation

Clone the project

```sh
git clone https://github.com/CodeTanzania/ewea-web.git
```

Install all required dependencies

```sh
yarn install
```

### Run it in development mode

```sh
yarn start
```

and view it on http://localhost:3000

## Documentation

- [Project website]()
- [A collection of references for EMIS]()
- [Http client for EWEA API](https://github.com/CodeTanzania/emis-api-client)
- [Redux state manager for EWEA](https://github.com/CodeTanzania/emis-api-states)


## License

MIT License

Copyright (c) 2019 - present Code Tanzania & Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
