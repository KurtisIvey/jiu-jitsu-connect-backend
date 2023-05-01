<a name="readme-top"></a>

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

<!-- PROJECT LOGO -->
<div align="center">
  <h3 align="center">Odin Book Backend</h3>
  <p align="center">
    Odin book REST API 
    <br />
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

**Odin Book** is a full stack project that leverages all the programming skills I have acquired so far to create a facebook clone. It features a React Frontend that is written in TypeScript using Vite. Redux is utilized to store session info on the client and persisted using redux-persist. Styling is done via the use of Tailwind CSS as the primary focus was functionality of the web app. The backend utilizes Javascript, AWS S3 bucket, MongoDB, Supertest, Node.js, and Express.js. Both the frontend and backend are hosted on heroku. AWS S3 bucket is utilized in the backend to handle image uploading from the frontend. Authentication is handled via the use of Json Web Tokens.

**Odin-book-backend** is a REST API created to communicate with my Odin-book front end. Odin-book-backend was built using test driven development while constructing the various controllers that encompass it. In addition, mongodb-memory-server is used to mock the mongodb database for testing. This was a very challenging project that pushed my knowledge of backend development and understanding of MongoDB. Image uploading is handled via AWS S3 bucket and the corresponding url is then stored in the MongoDB database.

Client Repo [Odin-book](https://github.com/KurtisIvey/odin-book)

Fully Deployed Project [Odin-book-ki](https://odin-book-ki.herokuapp.com/)

give it about 15-30 seconds after pressing login initially as the backend may be asleep 😴

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
- ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
- ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
- ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
- ![Heroku](https://img.shields.io/badge/heroku-%23430098.svg?style=for-the-badge&logo=heroku&logoColor=white)
- ![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)
- ![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
- ![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

### Installation

This project is currently setup to only run from my mongodb database and AWS S3 bucket. You can configure it to run with your own with the proper setup of environment variables. After which, it should be able to run from local host without any issues.

##### environment variables required

- DB_URI
- SECRET
- PORT
- BUCKET
- AWS_SECRET_ACCESS_KEY
- AWS_ACCESS_KEY_ID

##### cors

- cors settings should be configured to your preferences

## Usage

This backend was primarily created to mimic many of the features present on Facebook such as registration, login, posting text, commenting text, updating usernames, updating profile photos, and adding/removing friends. If you need a reference for such code examples, you're free to use/borrow/reference any of the code present. Reach out to me if you have any questions.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

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

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Kurtis Ivey - [@IveyCodingBjj](https://twitter.com/IveyCodingBjj) - kurtiveycodes@gmail.com - [linkedin.com/in/kurtisivey/](https://www.linkedin.com/in/kurtisivey/)

Project Link: [https://odinbook-backend.herokuapp.com/](https://odinbook-backend.herokuapp.com/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

- [Tailwind](https://tailwindcss.com/)
- [Heroku](https://devcenter.heroku.com/categories/reference)
- [React Icons](https://react-icons.github.io/react-icons/search)
- [The repo for this awesome README template courtesy of Othneil Drew](https://github.com/othneildrew/Best-README-Template)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
