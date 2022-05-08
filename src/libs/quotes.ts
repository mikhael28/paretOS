/**
 * Motivational quotes used in loading screen.
 */
// eslint-disable-next-line import/prefer-default-export
const quoteList = [
  {
    author: "Steve Martin",
    quotes: ["Be so good, they can't ignore you."],
  },
  {
    author: "Babe Ruth",
    quotes: ["It's hard to beat a person who never gives up."],
  },
  {
    author: "Michael Jordan",
    quotes: [
      "I've failed over and over and over again in my life. And that is why I succeed.",
    ],
  },
  {
    author: "John Wooden",
    quotes: ["Do not let what you cannot do interfere with what you can do."],
  },
  {
    author: "Socrates",
    quotes: [
      "We are what we repeatedly do. Therefore, excellence is not an act - but a habit.",
    ],
  },
  {
    author: "Muhammad Ali",
    quotes: [
      "It isn't the mountains ahead to climb that wear you out - it's the pebble in your shoes.",
      "Those who are not courageous enough to take risks will accomplish nothing.",
    ],
  },
  {
    author: "Carl Jung",
    quotes: [
      "You are what you do, not what you say you'll do.",
      "Everything that irritates us about others can lead us to an understanding of ourselves.",
    ],
  },
  {
    author: "Jim Carrey",
    quotes: [
      "I learned that you can fail at what you don't love, so you might as well do what you love.",
    ],
  },
  {
    author: "James Clear",
    quotes: [
      "Every action you take is a vote for the type of person you wish to become.",
      "When making plans, think big. When making progress, think small.",
    ],
  },
];

export default function getRandomQuote() {
  const quoteObject = quoteList[Math.floor(Math.random() * quoteList.length)];
  const quote =
    quoteObject.quotes[Math.floor(Math.random() * quoteObject.quotes.length)];
  const author = quoteObject.author;
  return { quote, author };
}
