const exampleExperience  = {
    xp: 3000,
    xpEarned: 0,
    achievements: 15,
    completed: false,
    approved: false,
    authorId: 'memberId',
    studentId: 'bc382b6b-b3fc-4f9c-8f41-88280779ced0',
    id: 'onboarding-experience',
    title: 'Onboarding Experience',
    description: 'Get your development environment setup and ready to go!',
    github: '',
    pricePaid: 19900,
    price: {
      amount: 19900,
      promotional: 149000,
    },
    modules: [
      {
        
        title: 'Set-up your dev environment',
        language: 'en',
        overview: [`Requirements to successfully do so:
        
        Download Homebrew, and install through the terminal using the following command
        
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        
        Download Visual Studio Code.
        
        Install Node (JavaScript runtime), Yarn (a package manager, similar to NPM), and the Amazon Web Services Command Line through brew using these commands
        
        $ brew install nodejs
        
        Optional: This will install the latest version of Node, which at the time of this writing is 15.x - as Node relies heavily on open-source packages and build processes, you may encounter a situation where you are trying to work with an older open-source build and it inexplicably doesn't build when running 'npm install' or 'yarn install' or doesn't run. The issue may be the newer version of Node - in that case you will want to install the Node Version Manager (NVM) and use an older version (12 is recommended). That's what we do! This is
        
        Installation is in two parts - the first, to download and install, run the command 
        
        $ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
        
        Secondly, we need to enable NVM in our bash profile. "bash" is the name of the programming language that our Terminal in MacOS and Linux operates - it's "profile" is essentially a list of commands and shortcuts that it listens to. 
        
        What we need to do, is add the shortcuts for the Node Version Manager, so that we can use it anywhere in the terminal's file system, and it will automatically route the command to the folder where the nvm executable lives. Otherwise, we would have to navigate to '/usr/bin/etc/nvm' to activate it - this way, we can use it any time in the terminal. Hope that makes sense.
        
        Open your terminal. Run the command: 
        
        $ ls  
        
        This will give you a list of all the files in the directory you are in. Now, run:
        
        $ ls -a 
        
        The dash a is an extra argument in the 'ls' command, that shows all hidden files - you should see some stuff like '.bash_rc' but you will notice there is no file called '.bash_profile' - so we will have to make one.
        
        $ brew install node
        
        $ brew install yarn
        
        $ brew install awscli 
        
        Create a 'free-tier' Amazon Web Services Account, which you can register for here.
        
        Download, install and configure the Amazon Command Line Interface using the IaM interface - full instructions, from creating the account, to creating an IaM user, to configuring the Command-Line, can be found here. 
        
        In Amazon Web Services, create an S3 bucket. It can have any name, doesn't matter.
        
        For proof of completion, submit a screenshot of what your terminal responds with when you run the command 
        
        $ aws s3 ls s3:// 
        
        It should have the name of all buckets in your S3 service, including the one you just made.
        
        
        [Image]
        
        If on Windows:
        
        Our first recommendation is to partition your hard-drive, and install Ubuntu Linux on half your hard-drive space. Why? Because there will be so many glitches and buggy comptability issues along the way with Windows, that its worth the investment up front. 
        
        Do you think partitioning your hard-drive sounds like a pain in the ass or too difficult? Try debugging your Gatsby build, to understand why it's not working, only to see your colleague clone your repository, install it, run it on their Mac - only to find it working perfectly.
        
        For those who are determined, so be it.
        
        We are going to use a Package Manager for Powershell called Chocalatey to handle installation of some scripts. Refer to these instructions.​ 
        
        Make sure to you ALWAYS open Powershell as an Administrator - otherwise, things won't work very well.
        
        Once that's finished, you can run 'choco install nodejs' and 'choco install awscli' - you may have to close Powershell and re-open it, but it should theoretically work. There may be problems along the road, I've seen it happen a couple different ways.
        
        If on Linux (Ubuntu Reccomended)
        
        We will be using a package manager called 'apt' extensively in this process. We will often be running it alongside the command 'sudo' which stands for super-user do. It will ask you for your password, before running the command. For privacy reasons, as you type your password, it will not show up on the screen - it is however there, so you will have to type it without mistakes! You can delete letters with the delete button, it's just hard to keep track of.
        
        First, run the command 
        
        $ sudo apt update to refresh apt so that is has the latest package indexes.
        
        Install Node.js by running $ sudo apt install nodejs 
        
        Node may or may not come with NPM, the Node Package Manager. Run $ npm in the command line - if it works, great, if not:
        
        Run the command $ sudo apt install npm to get it.
        
        You can also use the instructions above in the MacOS onboarding for installing with NVM, if you experience difficulty. Based on the version of Linux you are running, you may not have apt - you may have yum, or another package manager. Google will help you find the answers you are looking for.
        
        Installing the aws-cli will be pretty straight-forward - go ahead and follow the instructions on Amazon's documentation for installing on Linux.
        
        If on a Chromebook:
        
        Instructions are similar to Linux, in many ways. Google has a good page where it talks about how Chrome OS essentially has access to all the things that most operating systems do, when it comes to tools like localhost.
        
        You will need to manually enable Linux (Beta) from your settings- instructions here​  It will install all the necessary dependencies and open a terminal window.
        
        From there, you can dowload a Debian based Visual Studio Code installation, and follow essentially the same instructions as the Linux instructions for finishing your onboarding.
        
        If on an M1 Mac Mini or MacBook​ 
        
        First, install Google Chrome using the Apple Chip for Mac.
        
        Start installing XCode, which you can grab through the Apple Mac Store. The reason we want to do this, is because we want to ultimately have Node.js running natively on Apple Silicon for the performance boost during development.
        
        This is achieved additionally by downloading NVM, the Node Version Manager. Installing has a few steps, which you should review from the Intel-based Mac onboarding instructions above
        
        Next, we want to install MacPorts 
        
        After installing MacPorts through a downloadable, run this terminal command: $ sudo port install git curl openssl automake
        
        This will download necessary dependencies (such as Python 3) for the next step.
        
        After this, go ahead and run to install the latest version of Node with $ nvm install v15 
        
        NVM will attempt to find Node.js binaries that are built for Apple Silicon, and as of this writing (December 7th, 2020) it will fail and will then proceed to download the Node.js source and compiling it for native Apple Silicon.
        
        If you encounter some issues using the newest version of 15 (like I did), you can always go back to a more stable version like 12 and run. This won't have the performance benefits necessarily, but it's blazing fast anyway.
        
        Now, we can go on Amazon's documentation to go download the aws-cli
        
        Our official recommendations are to use a MacBook, especially an M1 machine. A brand new, entry level M1 will be more than sufficient to guide you through getting your first job or building your product. A secondary recommendation would be buying an older MacBook Pro, or a Chromebook (if you are a die hard Android user, for example). The PixelBook Go i5 processor should be good enough. Honestly, for most training and build excercises in this program, you can get away with an entry-level Chromebook. It will be slow when installing new applications, as well as compiling code from time to time, but it will work just fine.
        
        We do not recommend using Windows as your main development environment, though you can install things like Node, the Amazon Web Services CLI and more through a Powershell Package Manager called 'Chocolatey'. Just to be nice, we will include some basic information to get you started.`],
        external: [],
        amount: 100,
        priority: 1,
        completed: false,
        revisionsNeeded: false,
        approved: false,
        athleteNotes: [],
        coachNotes: [],
        athleteAttachment: [],
        coachAttachment: [],
        github: '',
        prLink: '',
      },
      {
        
        title: 'Create your Github Account',
        language: 'en',
        overview: [`A GitHub account is one of the essential tools of a developer - it allows you to store and modify your code with ease, and enables seamless cooperation in a code-base by integrating Git. You can create a public account to share your story, showcase projects/open source libraries you have contributed to, and highlight your commit county! Those sweet, sweet green boxes.

        What you will need to do:
        
        Signup for a GitHub Account!
        
        Add a profile picture, along with a bio of yourself.
        
        Create a repository that is called your username. For example, my username is 'mikhael28' - that means the name of the repository I need to create would be 'mikhael28/mikhael28' and click 'Initialize with README'.
        
        From there, you can edit the README to have it server as a part of your profile!
        
        For proof, submit a link to your GitHub profile with those items completed!`],
        external: [],
        amount: 100,
        priority: 1,
        completed: false,
        revisionsNeeded: false,
        approved: false,
        athleteNotes: [],
        coachNotes: [],
        athleteAttachment: [],
        coachAttachment: [],
        github: '',
        prLink: '',
      },
      {
        
        title: 'Hello world!',
        language: 'en',
        overview: [`The goal of this Achievement is to simply have you spin up a basic web-server using Express.js that returns the string 'Hello World' when you send an HTTP request to the route '/hello/world' - not the root route ('/').

        For review, please create a public Git repository called 'pareto-hello-world' on your GitHub profile, and include a link to the finished repository. I will likely send you a pull-request, to request a couple of changes - after responding to them, you will re-submit the Achievement with a new pull-request to your 'main' branch that includes the requested changes, and send the link through the submission screen.
        
        This achievment is less about the code - because it is 'trivial', so to speak - this achievment is mostly about working through process of code review from the very beginning, to set good engineering habits.`],
        external: [],
        amount: 100,
        priority: 1,
        completed: false,
        revisionsNeeded: false,
        approved: false,
        athleteNotes: [],
        coachNotes: [],
        athleteAttachment: [],
        coachAttachment: [],
        github: '',
        prLink: '',
      },
      {
        
        title: 'Nodeschool Modules',
        language: 'en',
        overview: [`NodeSchool provides open-source digital workshops to help you learn and solidify the basics of Node, JavaScript & beyond. 

        For this achievement, please complete the workshops called 'javascripting' and ‘learnyounode’ and submit a link to a GitHub repository with your finished answers to all of the workshop's challenges.
        
        It is highly recommended that you record a commit for each of the individual excercises, so as to create a more impressive number of commits.`],
        external: [],
        amount: 100,
        priority: 1,
        completed: false,
        revisionsNeeded: false,
        approved: false,
        athleteNotes: [],
        coachNotes: [],
        athleteAttachment: [],
        coachAttachment: [],
        github: '',
        prLink: '',
      },
      {
        
        title: 'Complete Ideation Workbook',
        language: 'en',
        overview: [`Included in your Pareto Starter kit is an Ideation workbook - a set of exercises that you will complete either by yourself, or preferably with your coach. There are a number of good excercises:

        - Doing an extended brainstorm about what opportunities are available for you based on your past work experience, family, friends, your particular city, a set of hobbies, etcetera. The point is that the project should be related to something uniquely you.
        
        - Once you've settled on the top two ideas, it's time to think through the business case - why is this piece of software worth someones time? How does it help them? Is there a business model worth exploring? If not, how can this piece of software be helpful to society or to your friends and family?
        
        - Once you have thought through those pieces of software, now is the time to do some light prototyping. We will have you sketch out pictures of what the user interface might look like, on a mobile, tablet and desktop dimension.
        
        - Now it's time to think through the data - what kind of information do I need to be able to store and modify, in order to add value to the users? Saving their names and simple personal information is a good start, but what other information and business logic would be helpful the the people your software is designed for?
        
        For review, upload pictures of each of the pages as files into a github repository and send the link for review. Either that, or pictures can be reviewed over video call.`],
        external: [],
        amount: 100,
        priority: 1,
        completed: false,
        revisionsNeeded: false,
        approved: false,
        athleteNotes: [],
        coachNotes: [],
        athleteAttachment: [],
        coachAttachment: [],
        github: '',
        prLink: '',
      },
      {
        
        title: 'Watch Pareto React Video Series',
        language: 'en',
        overview: [`Watch the Pareto React, Node and AWS video series to completion! It's a video series that the founder of Pareto made as an introduction to React programming, and just generally showing how things work.

        Watch the Playlist on YouTube here​.
        
        For proof - send your coach a screenshot of the YouTube playlist, showing that the red bars across the videos reach the end of each episode - and leave a comment on each episode mentioning what you learned by watching.`],
        external: [],
        amount: 100,
        priority: 1,
        completed: false,
        revisionsNeeded: false,
        approved: false,
        athleteNotes: [],
        coachNotes: [],
        athleteAttachment: [],
        coachAttachment: [],
        github: '',
        prLink: '',
      },
      {
        
        title: 'My First Meetup',
        language: 'en',
        overview: [`Meetups are one of the most magical things about the tech-industry in my opinion. A lot is said online about how tech pushes us further away, dividing us into little corners. Meetup is something that brings people together - a place where you can meet future colleagues & friends, bonding over shared interest in programming.

        The most effective events to go to are those based around JavaScript, web-development, Amazon Web Services, product management or more . If there is a particular stack or language that is extremely popular in your home-town, go to that one! If there is no JavaScript/Node meetup in your city, you have the perfect opportunity to start one yourself and build some street cred.
        
        To prove you attended a Meetup, included in your proof for your mentor, include a picture/selfie/screenshot of you attending a in-person (preferably) or virtual Meetup (one that is not an official Pareto meetup). We understand due to COVID, that the most available meetups will be remote for the time-being.`],
        external: [],
        amount: 100,
        priority: 1,
        completed: false,
        revisionsNeeded: false,
        approved: false,
        athleteNotes: [],
        coachNotes: [],
        athleteAttachment: [],
        coachAttachment: [],
        github: '',
        prLink: '',
      },
      {
        
        title: 'Serverless Stack Tutorial',
        language: 'en',
        overview: [`The first step in your journey is to walk through part 1 of the Serverless-Stack tutorial - an open-source project by the good people at Anomaly Innovations. This tutorial will walk you through creating an AWS account, building a serverless CRUD API with Node.js, building a React web application to integrate your API, and then how to deploy & host your front-end using AWS S3 & CloudFront.

        Requirements:
        
        Please create a public GitHub repository and commit/push your progress as you go along. This will be used to verify that you walked through the entire process.
        
        Do not copy and paste any code - write it all out by hand.
        
        Please include a link at the end to your deployed, finished tutorial application.`],
        external: [],
        amount: 100,
        priority: 1,
        completed: false,
        revisionsNeeded: false,
        approved: false,
        athleteNotes: [],
        coachNotes: [],
        athleteAttachment: [],
        coachAttachment: [],
        github: '',
        prLink: '',
      },
      {
        
        title: 'My First Sprint',
        language: 'en',
        overview: [`Your first software development sprint is a vital part of your growth - the sprint is the standard style of most software development today, following in the wake of the Agile revolution in the mid 2000's. The idea is simple: at the beginning of the week (Monday morning, usually, sometimes over the weekend depending on how hard your team works) your team get's together for the 'Sprint Planning' meeting to take a look at the product backlog and assign 'ticket items' to the team members. During this process, each team member 'estimates' how much time/work-units it will take for a member to complete the item. Based on the team-members availability (you have meetings, lunch, unexpected things), an appropriate amount of work is assigned. 

        During the week, you have a daily 'stand-up' meeting that you attend every morning to briefly check-in with team members. It doesn't mean that you ignore everyone the rest of the day and work silently - you will be in communication with your team throughout the day, if only to banter and post in the #random channel. The real purpose of the stand-up meeting is to give team members an opportunity to seek help for a specific issue, or identify a roadblock that requires other team members, leads or management stepping in to move past the problem. 
        
        For example: 'My Gatsby build magically stopped working, and I can't identify the reason. I've look at the source code from the previous commit, cannot identify smoking guns - can someone pair (program) with me for a couple of minutes after stand-up to identify the issue?'
        
        The standup meeting is not the time for a comprehensive discussion regarding the issue - it's simply to identify it, and make a plan to resolve it ASAP. Spending too much time talking about one issue takes away from everyone elses time, and can definitely lead to eye-rolls if someone rambles on.
        
        After attending those five meetings, on Friday we have what's called a 'Product Showcase' where you demo the results of your work. It's not a time to really answer questions - that can happen after everyone has finished presenting, after the meeting ends, or on Slack. The last meeting of the week is the 'Sprint Retrospective' - this is where the team gathers to take a look at how their work output compared with the planning they did in their initial sprint planning. This is a time to reflect on the things that went well, the things that didn't, and make a couple of action items for next week (one or two to start, don't get over-ambitious) and then break for the weekend!
        
        The requirements for succeeding in this Achievement
        
        Attend the Sprint Planning Meeting that Saturday/Sunday to estimate the ticket items and work that needed to accomplish.
        
        Attend all of the scheduled stand-up meetings during the week. If you are unable to make it to the meeting, if you have a good reason and communicate ahead of time, we are all reasonable people.
        
        Present a 'showcase' on Friday, prior to the 'Sprint Retrospective'.
        
        Attend the sprint retrospective meeting that Friday to review our original estimates and suggest improvements for the following week`],
        external: [],
        amount: 100,
        priority: 1,
        completed: false,
        revisionsNeeded: false,
        approved: false,
        athleteNotes: [],
        coachNotes: [],
        athleteAttachment: [],
        coachAttachment: [],
        github: '',
        prLink: '',
      },
      {
        
        title: 'My First Arena Challenge',
        language: 'en',
        overview: [`Complete your first 5-Day Arena Challenge, and record the results online! 

        For proof, have a video chat with your coach to review performance over the course of the week, and how it can be improved over the coming weeks.`],
        external: [],
        amount: 100,
        priority: 1,
        completed: false,
        revisionsNeeded: false,
        approved: false,
        athleteNotes: [],
        coachNotes: [],
        athleteAttachment: [],
        coachAttachment: [],
        github: '',
        prLink: '',
      },
      {
        
        title: 'Absorb Context Through the Resource Library',
        language: 'en',
        overview: [`The Context Builder is the foundational knowledge base of Pareto and It covers a lot of the context you need to understand what full-stack development entails, and what you need to learn to break into the tech industry.

        It is meant to be a living document - it will be added to and expanded, as time goes on. Here are some updates on what enhancements are in the Product Timeline for improving the Context Builder.
        
        1. Add in a 'Suggested Resource' from the community, to be able to add to the knowledge base of the world in regards to breaking into the tech industry. This will be especially important on a 'City by City' basis.
        
        2. Building a tracking system, that will record when you read through a page. You will earn EXP for this, and a badge when you've read through all of the pieces. This functionality will first be available on https://pareto.education and afterwards on https://arena.pareto.education
        
        3. Extensive UX Design resources.
        
        If this is completed before the tracking system is implemented, your mentor will simply ask you a few questions about some of the resources.`],
        external: [],
        amount: 100,
        priority: 1,
        completed: false,
        revisionsNeeded: false,
        approved: false,
        athleteNotes: [],
        coachNotes: [],
        athleteAttachment: [],
        coachAttachment: [],
        github: '',
        prLink: '',
      },
      {
        
        title: 'Pop Quiz',
        language: 'en',
        overview: [`Your coach will test you on the common JavaScript methods for Strings, Objects, Arrays and assorted React, HTML and CSS knowledge.

        This will happen through a video call. Please use the Pareto study sheets included in our Starter Pack as the study guide, since all of those questions will be available for your mentor to ask. You must score an 80% or higher on the quiz to pass.
        
        Submit your result to your mentor, and once they approve, you will receive the Experience points.`],
        external: [],
        amount: 100,
        priority: 1,
        completed: false,
        revisionsNeeded: false,
        approved: false,
        athleteNotes: [],
        coachNotes: [],
        athleteAttachment: [],
        coachAttachment: [],
        github: '',
        prLink: '',
      },
      {
        
        title: 'My First Freelance Gig',
        language: 'en',
        overview: [`Money makes the world go around, and unless you really really like coding for a hobby, chances are that you are here because you sense some profit. A freelance client is a great thing, because it does wonders for your confidence and psyche. 

        When you get your first contract, even if it's for $50 dollars (or $5000, don't sell yourself short) - you have become a professional. You have gotten paid for the work. More than that, you have some who can refer you, and something to put on your resume (which will be light at the beginning).
        
        Once you secure your first payment, you will earn the experience points by submitting the proof of payment to your mentor.`],
        external: [],
        amount: 100,
        priority: 1,
        completed: false,
        revisionsNeeded: false,
        approved: false,
        athleteNotes: [],
        coachNotes: [],
        athleteAttachment: [],
        coachAttachment: [],
        github: '',
        prLink: '',
      },
      {
        
        title: 'Technical Resume',
        language: 'en',
        overview: [`Its important to start thinking about your resume early on, especially to have a template that you can add to as you complete more achievments, integrate new NPM modules into your projects, and use more AWS services (such as AWS Lambda).

        Please put together a resume template that starts with any relevant previous technical experience, and send it to your coach for review. 
        
        For education include ‘Pareto Technical Training’, unless you are currently studying to obtain a Bachelors Degree in Computer Science at an accredited university. If studying at a boot camp, include it above or below or your boot camp - the choice is up to you to decide which of the experiences has been or will be more valuable.`],
        external: [],
        amount: 100,
        priority: 1,
        completed: false,
        revisionsNeeded: false,
        approved: false,
        athleteNotes: [],
        coachNotes: [],
        athleteAttachment: [],
        coachAttachment: [],
        github: '',
        prLink: '',
      },
      {
        
        title: 'Portfolio Product',
        language: 'en',
        overview: [`The key to the Pareto Training Camp is to empower you to learn how to build software that will help you reach your goals and dreams. The most important part of the program is building your portfolio product. 

        This isn't a basic CRUD API, a calculator or Tic-Tac-Toe game - this should be a theoretically profitable product that has a chance of gaining users & revenue, or that must be useful to society in some way that does not require monetization. Useful is the keyword here - we aren't here to waste our time.
        
        Not only that, but it should be something that should reflect your inner personality and desires. Previously work in Food Service? Perhaps an application to help track orders, or report when you have excess food that can be donated to the homeless instead of tosses away.
        
        This will demonstrate to potential employers that you are able to build a product for the market - that you are able to write professional level software. This achievement is worth 2000 points, and each step of the process is broken down in a separate achievement module that breaks down the 15 steps towards building the product.
        
        For proof (and review, there will be multiple rounds) - submit a link to the GitHub repository or specific pull-request you would like to see reviewed. `],
        external: [],
        amount: 100,
        priority: 1,
        completed: false,
        revisionsNeeded: false,
        approved: false,
        athleteNotes: [],
        coachNotes: [],
        athleteAttachment: [],
        coachAttachment: [],
        github: '',
        prLink: '',
      },

    ],
  };