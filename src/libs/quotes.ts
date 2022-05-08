/**
 * Motivational quotes used in loading screen.
 */
// eslint-disable-next-line import/prefer-default-export
const quotesList = [
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
    author: "Muhammad Ali",
    quotes: [
      "It isn't the mountains ahead to climb that wear you out - it's the pebble in your shoes.",
    ],
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
      "Those who are not courageous enough to take risks will accomplish nothing.",
    ],
  },
];

export default function getRandomQuote() {
  const randomQuoteObject =
    quotesList[Math.floor(Math.random() * quotesList.length)];
  const quote =
    randomQuoteObject.quotes[
      Math.floor(Math.random() * randomQuoteObject.quotes.length)
    ];
  const author = randomQuoteObject.author;
  return { quote, author };
}
