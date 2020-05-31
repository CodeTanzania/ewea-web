# ewea-web

[![Build Status](https://travis-ci.com/CodeTanzania/ewea-web.svg?branch=develop)](https://travis-ci.org/CodeTanzania/ewea-web)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)

<img src="docs/images/logo.svg" 
alt="EWEA Logo" width="100" height="auto" />

## About EWEA

EWEA web is an Early Warning, Early Action tool that facilitates the disseminationn of warnings, communication and actions associated with the warnings.

Information that is shared with the tool can be analyzed in order generate insights for local authorities and communities to better manage disasters and increase resilience to disaster risk. The data is organized in core components as shown below.

![EWEA Homepage](docs/images/home.png 'EWEA Homepage')

## EWEA Components

#### Issued Alerts

Issued Alerts consists of alerts have been sent to stakeholders. These alerts are normally sent with actions to be taken.

See API source code [repository](https://github.com/CodeTanzania/emis-alert).

#### Actions Taken

Actions Taken is a set of visualizations that show activity for actions that have been dispatched with issued alerts

See API source code [repository](https://github.com/CodeTanzania/emis-stakeholder).

#### Emergency Functions

Emergency Functions is a collection of all major activities that are expected to take place during emergency management.

See API source code [repository](https://github.com/CodeTanzania/emis-stakeholder).

#### Action Catalog

Action Catalog is a collection of all tasks that can take place when an alert is issued.

See API source code [repository](https://github.com/CodeTanzania/emis-stakeholder).

#### Stakeholders

EWEA Stakeholders contains an up to date database of all stakeholders responsible for emergency/disaster management within a specific area. They are categorized into three groups

- Focal People - Individual personnel who has a responsibility in disaster management.
- Agencies - Organizations that carry out disaster management activities.
- Roles - These are configured functions that a focal person or agency is part of.

See API source code [repository](https://github.com/CodeTanzania/emis-stakeholder).

#### Alert Types

Alert Types are configured names of all expected events

See API source code [repository](https://github.com/CodeTanzania/emis-alert).

#### Geographical Features

Geographical Features provides an up to date geographical database of all features of interest that can be used to study and control the expected and the actual extent of impact that may be caused in case of an emergency/disaster. It includes administrative boundaries of regions, districts, wards, subwards (streets), evacuation centers, facilities, warehouses and critical infrastructures.

See API source code [repository](https://github.com/CodeTanzania/emis-feature).

#### Dashboards

EWEA dashboards consists of maps used for visualization and analysis of warnings and areas of interest.

See API source code [repository]().

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
- [A collection of references for ewea]()
- [Http client for EWEA API](https://github.com/CodeTanzania/ewea-api-client)
- [Redux state manager for EWEA](https://github.com/CodeTanzania/ewea-api-states)

## References

- [Create React App](https://create-react-app.dev/)
- [Add a web app manifest](https://web.dev/add-manifest/)
- [Adaptive icon support in PWAs](https://web.dev/maskable-icon/)
- [Web App Manifest Generator](https://app-manifest.firebaseapp.com/)
- [awesome-meta-and-manifest](https://github.com/gokulkrishh/awesome-meta-and-manifest)

## License

MIT License

Copyright (c) 2019 - present Code Tanzania & Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
