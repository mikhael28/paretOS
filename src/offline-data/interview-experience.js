export const interviewExperience = {
    xp: 3000,
    xpEarned: 0,
    achievements: 15,
    completed: false,
    approved: false,
    authorId: 'memberId',
    studentId: 'bc382b6b-b3fc-4f9c-8f41-88280779ced0',
    id: 'interviewing-experience',
    title: 'Technical Interviewing',
    description: 'Understand some classic data structures and algorithms, and how to apply them to solve problems.',
    github: '',
    pricePaid: 19900,
    price: {
      amount: 19900,
      promotional: 149000,
    },
    
    modules: [
        {
        
            title: 'Read Computer Science Distilled',
            language: 'en',
            overview: [`Let's start things off, nice and slow with a great book that will teach you a lot of terms that you aren't familiar with and in a fun, no-nonsense way. You can buy the book here on Amazon.

            Throughout reading, make sure to take notes on concepts you are encountering that you find interesting or would like to revisit.
            
            For review, please submit a video of you leafing through the pages of notes in your notebook. You should have at least 6 pages of notes, likely more than that.`],
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
        
            title: 'Read Computer Science Distilled',
            language: 'en',
            overview: [`Technical interviewing is a grind, most of the time. A good comparison I would give to it is like the SAT for getting into college, or the GMAT to get into business school. It's a test, that has absolutely nothing to do with your ability to go to college or generate business - it's simply a roadblock meant to filter out the people who aren't serious.

            That is why you need to put sustained, prolonged focus towards setting dedicated study time into your schedule. In addition to work/professional obligations, and in addition to continuing work on your portfolio product, you need to squeeze in (recommended) one hour a day for technical interview practice.
            
            Go through the excercise of putting together a weekly, half-an-hour based planner sheet which you can download here.
            
            For review, send me a scan of the schedule filled out, highlighting where the technical interviewing slots are.`],
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
        
            title: 'Read Computer Science Distilled',
            language: 'en',
            overview: [`Lists are more commonly called Arrays in Javascript - they are objects which can carry multiple objects within themselves, thus proving valuable stores of data. 

            What we will do is to implement a "List" according to the standards of the Java Specification. Now, we are not Java programmers - we work exclusively with JavaScript. However, it is valuable to run through this excercise for a couple of reasons.
            
            1. It help you think through the core API's of a List/Array, and implement it manually with JavaScript.
            
            2. It gives you a little bit of insight into what programming lower-level languages is like, where often times you will need to implement a data structure yourself. In JS, this is rare, but common-place elsewhere.
            
            JavaScripts arrays are technically objects, meaning they are mutable. They are not immutable lists, such as Tuples in Python for example. 
            
            Although unlike native JS objects, array are ordered and values are accessed by using the index. This means that, in order to find the item in the Array you are looking for, you must know the ID - or iterate through the List one way or another until you find what you are looking for. 
            
            Big O Notation: The time complexity of searching in arrays is O(n) where n is the length of the array. However, access any item is constant time meaning O(1). Interestingly enough since Arrays are just objects under the hood where the key is the index and the value is the value in the array.
            
            For review, please post a video of yourself to your YouTube channel walking through on a white-board or screen-cast of Visual Studio code explaining the List, and implementing it in real-time.`],
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
        
            title: 'Read Computer Science Distilled',
            language: 'en',
            overview: [`A Linked List is a linear data structure, the easiest thing to compare it to in the real-world is a silver or gold necklace or bracelet. Each link of the bracelet is connected to the next - each 'node', or chain, in the list has two separate parts. Whatever data is stored in the List, and a reference to the next node.

            You 'enter' into a Linked List through it's 'head', and you exit out of a LinkedList at the end when you receive a value of 'null' for the last element in the List.
            
            It's easy to work with Linked Lists, especially to modify them - even though the list may grow in size, we only need to chance the 'pointers' of the previous and next element so that we can insert an element in between.
            
            Imagine that a Mother and Father were holding hands. Their daughter runs up the middle, and starts holding both of their hands - expanding the chain of people from 2 to 3. Inserting elements into a LinkedList is similar. Instead of saying that 'Mom and Dad are holding hands', you would say 'Mom is holding Daughter', and 'Daughter is holding Dad' - that's how the 'pointers' update as well.
            
            There are multiple types of Linked Lists:
            
            Singly linked list (Uni-directional)
            
            Doubly Linked List (Bi Directional)
            
            Circular Linked List
            
            For review, please post a video of yourself to your YouTube channel walking through on a white-board or screen-cast of Visual Studio code explaining the Single Linked List, and implementing it in real-time.`],
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
        
            title: 'Read Computer Science Distilled',
            language: 'en',
            overview: [`Imagine I hand you the Yellow Pages and I ask you to find page 375. How would you, as a human find it? Would you start at page one and keep flipping 374 pages? Or would you open the book in half and if you are on a page that is smaller than 375 you open up a random page further to the right and if it’s larger you go to the right. 

            Well that’s exactly what search algorithms try to answer for us - how do we find the data we are searching for, as effectively as possible.
            
            For example, there is a style of search algorithm called “Divide and Conquer”. One famous algorithm in particular is Binary Search - it will pick a value in the middle of the array and keep cutting the array in half until it finds it. Since the length is decreasing in length after every attempt, the size of the overall data we are searching for is decreasing exponentially.
            
            'Binary Search' is incredibly inefficient with a time complexity of O(log(n)).
            
            For review, please explain and implement the data structure in a screen-share or recorded video with your mentor.`],
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
        
            title: 'Read Computer Science Distilled',
            language: 'en',
            overview: [`An algorithm that is used to rearrange elements inside a given array, according to some sort of comparison operator applied to each individual element. That comparison operator, a function, is used to decided the new order for elements.

            A couple of Algorithms worth knowing:
            
            Bubble sort - the most useless of the sorts, in terms of performance. It simply iterates through the List, compares adjacent elements, and swaps them if they fail the comparison operators criteria. The sort continues until everything is finally sorted, meaning it passes through multiple times and can take a substantial amount of time.
            
            Merge sort - an efficient, general purpose sorting algorithm. Like Quick sort, and Binary Search, it is in the Divide and Conquer family of algorithms. The worst case time complexity is O(n log n), meaning performance is solid.
            
            Quick sort -  a divide and conquer algorithm, which picks an element as a 'pivor' and partitions the given array around the picket pivot. There are multiple ways to pick the pivot (as the first element, last element, median pivot or even random index pivot)
            
            Radix sort, unlike those we've already discussed, is a non-comparative sorting algorithm. What it does, is to create and sort elements into buckets according to their radix (the number of unique digits that are used to represent the number). This sorting technique is often used on collections of binary strings and integers.
            
            For review, I would like to see two different videos - one explaining quicksort, another explaining and building merge sort.`],
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
        
            title: 'Read Computer Science Distilled',
            language: 'en',
            overview: [`Hashing is a way to uniquely identify an element from a group of elements, more specifically an Object from a group of Objects.

            Hash Tables rely on 'key-value' pairs: if you know the key, or index, of a particular Table - you can get the value quickly. This is the underlying structure of JavaScript objects - very useful.
            
            O(1) access of data`],
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
        
            title: 'Read Computer Science Distilled',
            language: 'en',
            overview: [`A container of objects that are inserted (pushed) and removed (popped) from the top. A stack has two parts - the top, and the rest. It uses the LIFO principle, known as ‘Last In - First Out’, to determine what order the objects are pushed and popped out.

            Imaging a tray of dishes being washed. When washing the dishes, you stack the just-cleaned dish on top, one after another. When you are serving food off of the dishes, you remove the top dish first. You don’t skip and pull one out of the middle.`],
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
        
            title: 'Queues',
            language: 'en',
            overview: [`A linear collection of objects that are inserted and removed according to the first-in, first-out (FIFO). New additions to the queue are sent to the back of the line (queued), and objects are removed (dequeued) from the front of the line.

            Imagine a line of students in a cafeteria. Those who get in line, got to the back. Those in front of the line, get served.`],
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
        
            title: 'First Mock Interview',
            language: 'en',
            overview: [`Have your coach (or trusted friend in the industyr) do a one-hour interview simulation, complete with whiteboarding (2 technical questions), technical QA and behavioral questions.

            Record the entire session (so that you can see how your subconscious body language looks like) and so that we can see proof that the work has been committed.`],
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
        
            title: 'Test Driven Development Practice',
            language: 'en',
            overview: [`One of the important parts of working in a professional software development team, are the importance and expectations of automated tests. There are multiple types of tests:

            - Unit tests
            
            - Integration tests
            
            - Headless browser testing
            
            - Snapshot testing
            
            It is very likely during an interview they will test your ability to write tests, even if they don't ask you to do it.
            
            When they give you a whiteboarding problem or some other logic to code through, one way to surefire impress them is to write the test first. It may seem silly, but it is very helpful when a) dealing with large, complicated systems that you don't want to break and b) when dealing with other developers or engineering manager who are surprisingly picky about their test coverage. By writing the test before solving the question, you will place yourself into the upper echelon of candidates - without a doubt.`],
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
        
            title: 'System Design Interviewing Questions',
            language: 'en',
            overview: [`Systems design questions are coming up more and more in software development interviews - it's a much more technical interview question, more so than an algorithmic interview, because it actually is rooted in real-world circumstances.

            For example, what if you were asked in an interview to design Facebook, Twitter, Instagram, or some other network for billions of users - what are the considerations? I will add a different example later, but from now enjoy this overview from geeksforgeeks.org:
            
            You need to design a social media service for billions of users. Most of the interviewer spend time in the discussion of news feed generation service in these apps. 
            
            Features to be considered:
            
            Some of the specific Twitter/Facebook/Instagram features to be supported.
            
            Privacy controls around each tweet or post.
            
            User should be able to post tweets also the system should support replies to tweets/grouping tweets by conversations.
            
            User should be able to see trending tweets/post.
            
            Direct messaging
            
            Mentions/Tagging.
            
            User should be able to follow another user.
            
            Things to analyze:
            
            System should be able to handle the huge amount of traffic for billions of users.
            
            Number of followers
            
            Number of times the tweet has been favorited.
            
            Components:
            
            News feed generation.
            
            Social graph (Friend connection networking between users or who follows whom?—?specially when millions of users are following a celebrity)
            
            Efficient storage and search for posts or tweets.
            
            The point is, they are testing your ability to think through edge cases and a more comprehensive view of the system you are designing. They don't want a casual answer - they want you to go in depth how you would handle scaling a service, how to efficiently query millions of items in databases, social graphs, etc.
            
            Don't be too discouraged - these are hard questions, but become infinitely easier to answer with experience.`],
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
        
            title: 'Behavioral Questions',
            language: 'en',
            overview: [`For review, please write out a one paragraph answer for every one of the questions on the Pareto Interviewing sheet.`],
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
        
            title: 'Second Mock Interview',
            language: 'en',
            overview: [`For acceptance, schedule an interview with your coach or professional acquaintance - and review the performance + upload to YouTube, so that you can watch your body language and that your coach can review it as well.`],
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
        
            title: 'Third Mock Interview',
            language: 'en',
            overview: [`For acceptance, schedule an interview with your coach or professional acquaintance - and review the performance + upload to YouTube, so that you can watch your body language and that your coach can review it as well.`],
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