# Pareto Operating System (ParetOS)

Archive Note: In the days before ChatGPT, the ParetOS was an open-source project from 2019-2021 that worked to create a digital mentorship system for aspiring developers, as they worked through a series of practical, experience-based learning modules part of a curriculum sometimes called the Full-Stack Apprenticeship. Before I continue, I wanted to give a shoutout to the 32 developers who contributed their time and code to the project, especially [Jaye Clark](https://github.com/jayeclark) who spearheaded a large scale redesign of the UI in 2020 & was the finest open-source developer I've had the pleasure of working with. 

To run an offline-only, static-data-only 'archive' of the ParetOS, simply clone the repository and run `pnpm install && pnpm start` - thanks to the magic of locked dependencies (no carets in your package.json), as of October 30th 2025, the dependencies still install just like they did 2+ years ago. 

The modules of the 'Experience' section were designed to work alongside a set of offline paper products and a workbook I designed for aspiring software developers, as the prototype of an educational business. In addition, we had an online, multi-player habit tracker meant to incentivize aspiring developers to improve their study and life habits to help them increase their chance of breaking into the industry. We also had a 'Library of Context', a collection of links and resources curated to guide developers to the right places, but whose data model was designed by me in 2018 in a terrible, inneficient way abstracting types and ids to a headless CMS, resulting in a lack of filterable search for the filters today without that secondary data schema available to us. A simple search of all 600+ resources is available in the Context page.

Perhaps I will write a blog post about this sometime, but it certainly feels odd looking at this in the age of AI development. With the benefit of hindsight and experience, what took 32 people, could probably be done by one person in less time, with access to the latest in AI tooling. It makes me wonder what the future of software development would be; 'back in the day' you actually had to write the code and develop muscle memory & debugging skills. Now, you just lean back in your chair and guide it to the point you want. What a time to be alive.

## Original README below 

The ParetOS is a browser-based, high-level operating system designed to maximize human potential. It is designed to give you the 20% of software you need on a day-to-day basis that gives you 80% of the benefits modern tech has to offer.

Live at [https://paret0.com](https://paret0.com) **note** as of October 2025 the landing page here works, but the sign-in likely doesn't.

## The Arena

A multiplayer, competitive habit tracking competition where you and your friends can see who has the best work ethic. Or who spends the most time playing videogames. Or who makes the most outbound sales call in your company. You can create your own template, and invite friends to play and see your friends progress in real time.

![The Pareto Arena](/screenshots/sprint.png "The Pareto Arena")

## Pareto Learning

Focus on learning the 20% of a skill that gives you 80% of the value. In the ParetOS, we start with offering Full-Stack JavaScript Development as a proof of concept for mentorship-guided, self-study learning through building. Included is a fully featured curriculum for you to start from the basics of creating a GitHub account, through building your first project and tackling technical interviews.

![Learn Full-Stack JS](/screenshots/learning.png "Pareto Learning - JavaScript")

## Library of Context

A crowd-sourced & curated collection of resources that help decrease the barriers to success in the tech industry. Discover job boards you didn't know about, understand the players and heavy hitters in your local area & read curated tutorials, articles and resources designed to help you learn full-stack development in an optimized way. We encourage people to introduce themselves in our Discussions thread, so that we can add new regions, cities and countries to our Library for our community to contribute towards.

![Library of Context](/screenshots/context.png "The Library of Context")

## We are live folks

Signup is open at https://paret0.com - for those making an account, you may notice that the 'Training' that focuses on Full-Stack JavaScript Development is hiding behind a paywall. This is what I call the 'Paywall Puzzle' - based entirely on the code in this front-end repository, after forking it, you can modify the code and freely gain access to all the educational curriculum without paying. It requires changing a couple of values, commenting out a couple of functions while executing something. Believe it or not, this is a generous hint. If you can figure out how to do that - congratulations, you probably don't need to buy access to the curriculum! If you can't figure it out, you should seriously consider investing in your education. Included in the $89 is the Full-Stack Starter Kit, a set of laminated paper cheat-sheets, stikers, workbooks and playing cards that help teach you the 20% of JavaScript you need to know to get 80% of the actionable information needed to start writing code. In addition to the online curriculum. If you cannot make that payment (for example, living in Uganda and don't have VISA/Mastercard payment option) - open an Issue, and explain your situation! We will find a creative solution.

It's also a great way of supporting this project, and you get real value that you can either use yourself to prepare for technical interviewing, or donate to a friend/colleague/connection who needs it.

### Open-Source Development

Want to contribute? Great! We have quite some issues in the repository, and I have tried to mark the easier ones as 'good first issue'. There are also issues marked as 'ownership' - these issues cover an item on our product backlog, a discrete, end to end piece of functionality that requires polish and a significant amount of work to implement. Completing one of these ownership tasks qualifies you to become a maintainer of the project, pending your availability and desire to do so. You will be a member of our Open-Source Hall of Fame as well!

To fix a bug or contribute a new feature, follow these steps:

- Fork the repo
- Install the pnpm package manager `brew install pnpm` or `npm i -g pnpm`
  - a. Why pnpm? It uses an 'offline caching' approach, where you keep all of your download dependencies in an offline repository, and automatically put them into other projects that need to install them. This way, we are limiting the amount of hard drive space being used. This creates two major benefits.
  - 1. We can theoretically run `pnpm install` when troubleshooting while fully offline.
  - 2. When reviewing forks of ParetOS, we do not need to redownload 150mb of node_modules every time. This is beneficial for some of our international contributors, who pay for data by the GB. If they integrate pnpm into their dev workflow, it will save them a lot of space.
  - 3. For the record, `yarn install` and `npm install` still work for now (I think). However, `pnpm` is the package manager that will have first class support. Lock files will be removed in a separate PR.
- Run `pnpm install` to install the dependencies, once you have `cd`'d into the directory
    a. There is a known issue where Puppeteer's install script may hang indefinitely. In this case, first try updating to Node 16 and running again.
    b. If this does not work, this will sound weird, but try using a different wireless connection. Yours may be too slow, or have some weird configuration settings. `https://github.com/puppeteer/puppeteer/issues/5611`
- Run `pnpm start` to start the dev server
  a. `pnpm add <package_name>` to add a new npm dependency to the project.
- You will get an es-lint error about some config - go to `package.json`, and press Command+S - the error should go away.
- Create a new branch (`git checkout -b improve-feature`)
- Make the appropriate changes in the files
- Add Git changes to reflect the changes made
- Commit your changes (`git commit -m 'Improve feature'`)
- Push to the branch
- Send a PR, and become a legend

### Notes for Ubuntu

- At this time, developers using Ubuntu 22 with Node 16 have encountered an issue when installing dependencies. Please attempt the following and if assistance is needed, please feel free to reach out.

```bash
pnpm install
node node_modules/puppeteer/install.js
```

### Bug / Feature Request

If you find a bug, have a great idea or just a question - please open an issue [here](https://github.com/mikhael28/paretOS/issues/new)!

## Built with

- [React + JavaScript](https://reactjs.org/) - The classics, the essentials..
- [Progressive Web Application](https://web.dev/progressive-web-apps/) - Better than investing time into a mobile application, I figure that having the offline functionality of a PWA will give us the right balance of features and accessibility. Right now, the PWA service-worker is disabled - it will be re-enabled after a truly stable build is ready for launch (Product Hunt, Show HN, all that jazz)
- [AWS Lambda](https://aws.amazon.com/lambda/) - Serverless first
- MongoDB + other services.

- There is a separate, not quite fully featured admin platform.
- We can create mentees, mentors, match them, and a host of other options.
- Currently hidden from view, along with the APIs, to prevent foul play. This open-source repository focuses strictly on the front-end - trusted contributors will be invited to collaborate on the back-end.

## Admin

## Intellectual Property Notice

- This CODE is open-source.
- The intellectual property in regards to the branding of the Pareto logos, the educational curriculum inside the Full-Stack Starter Kit, and the knowledge base belongs to Michael Litchev.

## Team

[![Michael 'Misha' Litchev](https://avatars.githubusercontent.com/u/15205259?s=400&u=64ad9374b8d98f09dc5709fcc737e5ec4f2447f3&v=4)](https://github.com/mikhael28)

## [License](https://github.com/mikhael28/paretOS/blob/main/LICENSE)

GNU General Public License Version 2 Only © [Michael 'Misha' Litchev](https://github.com/mikhael28)
