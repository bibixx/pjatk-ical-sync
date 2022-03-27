<div id="top"></div>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/bibixx/pjatk-ical-sync">
    <img src="images/logo.svg" alt="" width="80" height="80">
  </a>

  <h3 align="center">PJAIT Class Schedule Sync</h3>

  <p align="center">
    Sync your calendar with <a href="https://www.pja.edu.pl/en/">PJAIT</a>'s schedule
    <br />
  </p>
</div>

<p align="center">
  <a href="https://deploy.cloud.run?git_repo=https://github.com/bibixx/pjatk-ical-sync" target="_blank">
    <img src="https://deploy.cloud.run/button.svg" alt="Run on Google Cloud" height="40" />
  </a>
  <br />
  <a href="#deploy-to-google-cloud-platform-gcp">
    <strong>For help with the deployment see Deploy to Google Cloud Platform (GCP) section</strong>
  </a>
</p>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#deploy-to-google-cloud-platform-gcp">
      Deploy to Google Cloud Platform (GCP) section
      </a>
    </li>
    <li>
      <a href="#setup">Setup</a>
      <ul>
        <li><a href="#docker">Docker</a></li>
        <li><a href="#host">Host</a></li>
      </ul>
    </li>
    <li><a href="#options">Options</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project
[PJAIT's schedule page](https://planzajec.pjwstk.edu.pl/) allows only to download the schedule in iCal format, but doesn't offer periodical syncing and integration with calendar apps. This project aims to solve this by creating a simple proxy that stands between the calendar apps and the PJAIT's page. \
It logs you in, downloads the schedule in iCal format, fixes the format (as the exported file doesn't confront to iCal's specification hence eg. Apple Calendar on the iPhone doesn't want to sync it) as well as the issue with offsetted events in the day the time changes.

<p align="right">(<a href="#top">back to top</a>)</p>

## Deploy to Google Cloud Platform (GCP)
1. Log in to your Google Account
2. Go to https://console.cloud.google.com/projectcreate to create a project (You can leave all of the settings default)
3. Set up billing account on GCP https://console.cloud.google.com/billing/create<br />
    **IMPORTANT! The GCP has a free tier for the Cloud Run functions which we'll be using. This application will definitely not exceed this tier.**<br />
    <em>NOTE: This software and guide are provided "as is", without warranty of any kind.</em>
4. Click on the button below and follow the instructions. <br />
  <div align="center">
    <a href="https://deploy.cloud.run?git_repo=https://github.com/bibixx/pjatk-ical-sync" target="_blank">
      <img src="https://deploy.cloud.run/button.svg" alt="Run on Google Cloud" height="32" />
    </a>
  </div>

5. Done 🎉

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- SETUP -->
## Setup

This project is fully dockerized and can be deployed in the matter of minutes. The [Docker](#docker) section describes how to do it.

Alternatively you can run the whole app on the host. This is described in the [Host section](#host).

### Docker
#### Prerequisites
| Name         | Earliest tested version |
|--------------|------------------------:|
| Docker       | 20.0                    |

#### Usage
1. Create a `.env` file in the following format
  ```bash
  USERNAME="USERNAME" # Your PJAIT username (sXXXXX)
  PASSWORD="PASSWORD" # Your PJAIT password
  CALENDAR_PASSWORD="CALENDAR_PASSWORD" # Password for the subscription endpoint. Set only if you want to have it
  ```
2. Duplicate and rename `docker-compose.local.yml` to `docker-compose.yml` and adjust it to your needs.
3. Run `docker-compose up` (please note that the app has to be constantly running and be available for the sync to be working)
4. Add the calendar subscription to your calendar app of choice. The url for the subscription is `http://localhost:3000`. For additional options to this endpoint please see the [Options section](#options)
    * Apple Calendar: [support.apple.com](https://support.apple.com/en-us/HT202361)
    * Google Calendar, _Use a link to add a public calendar_ section: [support.google.com](https://support.google.com/calendar/answer/37100?hl=en)
    * Outlook, _Subscribe to a calendar_ section: [support.microsoft.com](https://support.microsoft.com/en-us/topic/cff1429c-5af6-41ec-a5b4-74f2c278e98c)

<p align="right">(<a href="#top">back to top</a>)</p>

### Host
#### Prerequisites
| Name         | Earliest tested version |
|--------------|------------------------:|
| Node         | 16.14.0                 |
| Yarn         | 1.22.17                 |

1. Install the npm dependencies
  ```bash
  yarn install
  ```
1. Create a `.env` file in the following format
  ```bash
  USERNAME="USERNAME" # Your PJAIT username (sXXXXX)
  PASSWORD="PASSWORD" # Your PJAIT password
  CALENDAR_PASSWORD="CALENDAR_PASSWORD" # Password for the subscription endpoint. Set only if you want to have it
  ```
2. Build the app using
  ```bash
  yarn build
  ```
3. Start the app using
  ```bash
  yarn start
  ```
4. Add the calendar subscription to your calendar app of choice. The url for the subscription is `http://localhost:3000`. For additional options to this endpoint please see the [Options section](#options).
    * Apple Calendar: [support.apple.com](https://support.apple.com/en-us/HT202361)
    * Google Calendar, _Use a link to add a public calendar_ section: [support.google.com](https://support.google.com/calendar/answer/37100?hl=en)
    * Outlook, _Subscribe to a calendar_ section: [support.microsoft.com](https://support.microsoft.com/en-us/topic/cff1429c-5af6-41ec-a5b4-74f2c278e98c)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- Options -->
## Options

The subscription endpoint accepts the following query parameters (so you can call the endpoint with eg. `http://localhost:3000/?password=CALENDAR_PASSWORD&from=2020-01-01`)

| Option         | Description                                                                               | Type                      | Default value           |
|----------------|-------------------------------------------------------------------------------------------|---------------------------|-------------------------|
| from           | Specifies the start date from which the data from PJAIT schedule page will be downloaded. | Date string in format YYYY-MM-DD | One year back    |
| to             | Specifies the end date to which the data from PJAIT schedule page will be downloaded.     | Date string in format YYYY-MM-DD | One year forward |
| password       | Used when `CALENDAR_PASSWORD` variable is set. Needed for authentication to the endpoint. | String                           | Empty            |

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development
The project is build using TypeScript hence needs the transpilation to JavaScript to be able to be run using Node.js. The `yarn dev` command runs the [`esbuild`](https://esbuild.github.io/) in a watch mode and starts the app with `node` using [`nodemon`](https://nodemon.io/) which provides automatic restarts when the files change.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the MIT License. See [`LICENSE.md`](./LICENSE.md) for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Bartek Legięć - [@bibix1999](https://twitter.com/bibix1999) - [legiec.io](https://legiec.io)

Project Link: [https://github.com/bibixx/pjatk-ical-sync](https://github.com/bibixx/pjatk-ical-sync)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/bibixx/pjatk-ical-sync.svg?style=flat-square
[contributors-url]: https://github.com/bibixx/pjatk-ical-sync/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/bibixx/pjatk-ical-sync.svg?style=flat-square
[forks-url]: https://github.com/bibixx/pjatk-ical-sync/network/members
[stars-shield]: https://img.shields.io/github/stars/bibixx/pjatk-ical-sync.svg?style=flat-square
[stars-url]: https://github.com/bibixx/pjatk-ical-sync/stargazers
[issues-shield]: https://img.shields.io/github/issues/bibixx/pjatk-ical-sync.svg?style=flat-square
[issues-url]: https://github.com/bibixx/pjatk-ical-sync/issues
[license-shield]: https://img.shields.io/github/license/bibixx/pjatk-ical-sync.svg?style=flat-square
[license-url]: https://github.com/bibixx/pjatk-ical-sync/blob/master/LICENSE.md
[product-screenshot]: images/screenshot.png
