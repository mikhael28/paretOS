export const productExperience = {
    xp: 3000,
    xpEarned: 0,
    achievements: 15,
    completed: false,
    approved: false,
    authorId: 'memberId',
    studentId: 'bc382b6b-b3fc-4f9c-8f41-88280779ced0',
    id: 'product-experience',
    title: 'Portfolio Product',
    description: 'Build your first product, to help you get a job & build your portfolio',
    github: '',
    pricePaid: 19900,
    price: {
      amount: 19900,
      promotional: 149000,
    },
    modules: [
        {
        
            title: 'Ideation & GitHub Project Setup',
            language: 'en',
            overview: [`Included in your Pareto Starter kit is an Ideation workbook - a set of exercises that you will complete either by yourself, or preferably with your coach. There are a number of good excercises:- Doing an extended brainstorm about what opportunities are available for you based on your past work experience, family, friends, your particular city, a set of hobbies, etcetera. The point is that the project should be related to something uniquely you.- Once you've settled on the top two ideas, it's time to think through the business case - why is this piece of software worth someones time? How does it help them? Is there a business model worth exploring? If not, how can this piece of software be helpful to society or to your friends and family?- Once you have thought through those pieces of software, now is the time to do some light prototyping. We will have you sketch out pictures of what the user interface might look like, on a mobile, tablet and desktop dimension.- Now it's time to think through the data - what kind of information do I need to be able to store and modify, in order to add value to the users? Saving their names and simple personal information is a good start, but what other information and business logic would be helpful the the people your software is designed for?For review, upload pictures of each of the pages as files into a github repository and send the link for review. Either that, or pictures can be reviewed over video call.`],
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
        
            title: 'Choose Boilerplate',
            language: 'en',
            overview: [`Believe it or not, you do not need to build everything completely from scratch when starting a new project. You can take a 'starter-kit', often called boilerplate, or templates, and start your React-based project with a solid foundation. Most of the time, you don't need too much - some good, foundational CSS and a couple of well-crafted starter components with the right color scheme are best. `],
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
        
            title: 'Wireframes + UI Design',
            language: 'en',
            overview: [`Before you start writing code, it's often-times better to visualize what you want. That's where the wire-framing excercises included in the Ideation workbook come in - you have already done one round of wireframing and prototyping the most important screens.

            Now, we are going to do a second round of wireframing  for those sames screens - this time, try to eke out more details - and not just on paper! This time, we will be using some free UX Design software called Adobe XD (or paid options Sketch / Figma) to put together simple mockups of those screens. 
            
            You will Google for 'Sketch starter packs' and find many answers - a lot of graphic designers upload free templates that you can work from. You will find a lot of inspiration for interface design there, as well as get an idea of what modern applications may look like. Download multiple (10) and look through them, picking out the parts you like that will then be combined together into a 'real' mockup of the interfaces that you sketched out.
            
            Along the process, you might realize that the idea you had in your head looked better... in your head. And, that's totally fine! Improve the design, and when you think you have the screens for the most important functionality ready, then schedule a 30 minute meeting with you and your coach to review them together!`],
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
        
            title: 'Onboarding Documentation + API Modeling',
            language: 'en',
            overview: [`One of the keys to success as a professional software engineer is to leave thorough and helpful documentation. There are a number of things to consider: 

            Onboarding new developers into the dev environment
            
            Guidelines for naming git branches
            
            Pull-request requirements
            
            General information about the capabilities & functionality of the application inside the repository.
            
            Guidance involving environment variables, environment (prod/dev), etc.
            
            For review, please leave full-onboarding instructions that I can successfully follow, without error, to have the application successfully running in my local environment.
            
            Coming back to the topic of documentation, a Swagger document is an API guide that is meant to help team members instantly understand the required attributes needed to successfully complete an API request. In addition to helping you specify attribute types and all the available API routes, it will also auto-generate a test suite with Mocha & Chai to raise your backend test coverage.
            
            Why is this important? Aside from the fact that many teams use this type of documentation, it's important to remember that most software development teams are not operating in small silos, building out applications lone-wolf style. A lot of them are working in teams, and sometimes they need to expose their API's, so that a team, or client, or strategic partner can integrate that data with yours. 
            
            A Swagger document is the perfect way to demonstrate that you understand the importance of documentation, and you can include it on your resume.
            
            `],
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
        
            title: 'Main Feature 1 - Static Components',
            language: 'en',
            overview: [`For building out your full-stack MVP, you will have two features that provide the proper value for the application to be a viable product. For the first feature, before we implement a database solution, we are going to focus on building out the front-end code purely using mock data. This can be done by have 'useState' objects that refresh when using forms, and when receiving data back from a mock API. Once we have the final mock data thats necessary for the components, that is when we will put together the final database - and at that point, integrating the database will be as simple as writing the queries/structuring the request body, sending it over and receiving the updated state to show in the front-end.`],
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
        
            title: 'Login & Registration with Cognito',
            language: 'en',
            overview: [`One of the easier tasks, implementing the Authentication system you will use to track your users. This involves three things:

            1. Creating the Cognito backend, either through the aws-cli or through Cognito dashboard, which will store the authentication information for your users.
            
            2. Creating the forms in your front-end to register and login those users.
            
            3. Create an 'authenticated' and 'inauthenticated' view in your application, with React Router blocking access to Routes that require authentication if you are unauthenticated.
            
            For review, send the pull-request with those work inside of it.`],
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
        
            title: 'Database Integration',
            language: 'en',
            overview: [`After creating the static components for the main feature, integrating the back-end is going to be relatively simple. There are three parts - the JavaScript object containing the data we want to save/modify, the API, and the database.

            When saving or updating any information, we will be sending a POST or PUT http request to our Node.js serverless API. We will be including a JavaScript object as the 'body' of the event, meaning that its the primary payload. The AWS-Amplify 'API' library will automatically convert the JavaScript object to JSON, which is a string in the form of a JavaScript object.
            
            Inside the Node function, you will need to convert that JSON string back to a JS object using the 'JSON.parse(obj)' API. You will then run through some business logic, perhaps update a database, interact with a third-party API, and then return some data to the front-end. Will AWS Lambda, you will need to return a status code of 200, as well as a 'response body' that could, for example, include an updated database object that the front-end will receive and can use to refresh the 'state' of the application with the newest data.
            
            For review, please send the link to the branch of your GitHub repository that has the code you would like to review. Your coach will likely send a pull-request with commends, and ask for revisions made. Once revisions have been made, resubmit here to earn your EXP.`],
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
        
            title: 'Front-end Deployment & Continous Integration',
            language: 'en',
            overview: [`On a well-oiled development team, you may be pushing to the development and production branches multiple times a day. As such, it's important to have a continous integration flow that automates that entire process, while minimizing the risks of critical failure. Some of the useful facets of a CI integration:

            Importing development/production environment variables into the application build process, prior to automated deployment to your serverless service, Docker container, S3 bucket, etc.
            
            Being able to run through your dev/prod test suite, prior to deployment & able to identify potential issues before shipping broken code.
            
            Saving time, not having to manually run the  scripts necessary for deployment, especially if you do not have immediate access to private keys such as database credentials, API secrets, etc.
            
            You will be able to seamlessly deploy your React application through the AWS Amplify Console - simply connect a branch from GitHub, link it to a domain you own through Route53, and presto!
            
            For review, please send a link to the prod link for your continous integration deployment endpoint.`],
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
        
            title: 'Main Feature 2 - Static Front-end Components',
            language: 'en',
            overview: [`For building out your full-stack MVP, you will have two features that provide the proper value for the application to be a viable product. For the first feature, before we implement a database solution, we are going to focus on building out the front-end code purely using mock data. This can be done by have 'useState' objects that refresh when using forms, and when receiving data back from a mock API. Once we have the final mock data thats necessary for the components, that is when we will put together the final database - and at that point, integrating the database will be as simple as writing the queries/structuring the request body, sending it over and receiving the updated state to show in the front-end.

            For review, please send the link to the branch of your GitHub repository that has the code you would like to review. Your coach will likely send a pull-request with commends, and ask for revisions made. Once revisions have been made, resubmit here to earn your EXP.`],
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
        
            title: 'Main Feature 2 - Backend',
            language: 'en',
            overview: [`After creating the static components for the main feature, integrating the back-end is going to be relatively simple. There are three parts - the JavaScript object containing the data we want to save/modify, the API, and the database.

            When saving or updating any information, we will be sending a POST or PUT http request to our Node.js serverless API. We will be including a JavaScript object as the 'body' of the event, meaning that its the primary payload. The AWS-Amplify 'API' library will automatically convert the JavaScript object to JSON, which is a string in the form of a JavaScript object.
            
            Inside the Node function, you will need to convert that JSON string back to a JS object using the 'JSON.parse(obj)' API. You will then run through some business logic, perhaps update a database, interact with a third-party API, and then return some data to the front-end. Will AWS Lambda, you will need to return a status code of 200, as well as a 'response body' that could, for example, include an updated database object that the front-end will receive and can use to refresh the 'state' of the application with the newest data.
            
            For review, please send the link to the branch of your GitHub repository that has the code you would like to review. Your coach will likely send a pull-request with commends, and ask for revisions made. Once revisions have been made, resubmit here to earn your EXP.`],
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
        
            title: 'Architecture Diagram',
            language: 'en',
            overview: [`Security is one of those things that a lot of developers, especially junior developers, don't think too much about. After all, who could possible want to steal my little app's personally identifiable information?

            Well, I'm here to tell you that's a bad habit to form - you should be proactively thinking about your user's privacy and safeguarding their information.
            
            There are a few things to keep in mind:
            
            SQL Injection (if applicable)
            
            Cross-Site Scripting (XSS) Attacks
            
            Securing your API's with JWT Tokens
            
            When presenting dense technical information to clients, teammates, executives, or stakeholders of any kind, it is critical to be able to present that information simply and effectively. One of the best ways to do so is through visual aids - you will gain experience in this endeavor by drawing up an architecture diagram using the (mostly) free tool LucidCharts & include it in your documentation.
            
            Your application architecture is likely not very complex - you have a front-end, which receives authentication through AWS Cognito, and then sends API requests to a serverless serice, which then queries the database for data that is sent all the way back to the front-end.
            
            Drawing up an architectural diagram using Lucid Charts will be a great excercise to help you think about how these architectural designs look on paper, and will be a great guide that you can include on your portfolio website/wherever you are advertising your skills.
            
            For review, please submit a PDF/image of the architecture diagram - make sure the arrows on the requests document the two way dataflow from the front-end, to api, to database, and back. 
            
            For review, you must meet with your coach to identify the gaping holes - then send a pull-request showing the completed work.`],
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
        
            title: 'Search Engine Optimization',
            language: 'en',
            overview: [`Search engine optimization is the art and science of making sure that your website is as easily accessible through search engines as humanly possible. Ideally, they are the first 'organic' result that you see on the front page of Google.

            What we will want to do is to make sure that our application has decent SEO. This will involve setting some meta-tags inside of our index.html & using a library called 'React Helmet' - a way of adding custom HTML metadata inside of React components that are the main container for a Route through React Router.
            
            Work through the suggestions in this page​, more specifically to think through the choice of keywords in your HTML meta-data.
            
            Implement 'React-Helmet' npm library inside of your React application (assuming its web, not mobile) and add custom meta-information for each Route in React-Router.
            
            For review, please send the pull-request that contains the changes made for this Achievement.`],
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
        
            title: 'Guerilla UX: User Experience Audit',
            language: 'en',
            overview: [`Once your MVP is ready for use, it's time to find some users. As you find them, watch how they use the product, or use a service like LogRocket to record their entire user sesssion.

            The point is to collect feedback and whether or not they are using the application in a way that is helping them. If they do not understand how to use it, then it's not helping them. If they do understand it, but it doesn't help them - they might not be your target audience or you have some mistaken assumptions about what they need.
            
            What you want to do is to have an audit of the User Experience once you've had 5 people who match your ideal persona use it. Take the feedback from all 5, or just one, and use it to create more items for the product backlog towards iterating the application towards what's called 'Product Market Fit'.
            
            For review, please submit a link to a Google document summarizing your findings after this audit.`],
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
        
            title: 'Polish Sprint',
            language: 'en',
            overview: [`After completing your User Research, and observing the hang-ups that your users had, it's time to address that user feedback and improve the software in tangible ways. The first step is to carefully watch how they use it, and where you see a potential disconnect. If they are having trouble finding something important, or not understanding what they are supposed to do, that's a helpful indicator for you to review.

            You might also, while watching them use the software, notice some obvious deficiencies in the interface that were not necessarily obvious to you while developing them. Remember that software is like your child - you might think they are better and cooler than they are, and might not notice something until you put them next to another kid and notice how they compare. While watching the users, you need to be taking incredibly detailed notes. 
            
            The second step is to convert all of those issues into 'tickets', which you will then organize on your Project board on GitHub. You and your coach will then organize them in order of important, and run a sprint planning meeting to estimate the amount of work able to be done over the course of a two-week sprint.
            
            The third step is to relentlessly execute, finish the items and walk through a retrospective with your coach. `],
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
        
            title: 'MVP Launch',
            language: 'en',
            overview: [`Congrats on building your Minimum Viable Product (MVP)! Pending review, the hardest part of your learning journey is over - you now have a marquee item on your portfolio, and come move forward with confidence!`],
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

    ]
};