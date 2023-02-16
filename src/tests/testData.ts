import { User, Project } from "../types/ProfileTypes";
import { LibraryEntry } from "../types/ContextTypes";
import { PlanningField, ReviewField, ActivePersonMissionsOnDay } from "../types/ArenaTypes";
import { nanoid } from "nanoid";

interface TemplateConfig {
  titles?: string[],
  firstNames?: string[],
  lastNames?: string[]
}

export function getSampleTemplates(number: number, config?: TemplateConfig) {
  if (number === 1) {
    return [getSampleTemplate()]
  }
  const { titles, firstNames, lastNames } = config ? config : { titles: null, firstNames: null, lastNames: null};
  const results = [...new Array(number).keys()]
  return results.map((item) => getSampleTemplate(
    titles && titles.length > 0 ? getRandomArrayEntry(titles) : undefined,
    firstNames && firstNames.length > 0 && lastNames && lastNames.length > 0 ? 
      {
        fName: getRandomArrayEntry(firstNames),
        lName: getRandomArrayEntry(lastNames),
        id: parseInt(`12345${item}`)
      } : undefined
  ))
}

function getRandomArrayEntry(array: string[]) {
  return array[Math.floor(Math.random() * array.length)]
}

function getSampleTemplate(title?: string, user?: { fName: string, lName: string, id: number}) {
  return {
        "admin": {
            "name": user ? `${user.fName} ${user.lName}` : "Vilfredo Pareto",
            "adminId": user?.id || 12345
        },
        "_id": "63daf2e82cfaad59af962622",
        "id": "OtdBEbqXMX7-zGdM-Llrr",
        "title": title || "Simple Sprint",
        "author": user ? `${user.fName} ${user.lName}` : "Vilfredo Pareto",
        "authorId": "8020",
        "version": "1.0",
        "missions": [
          {
            "_createdAt": "2021-02-01T00:14:21Z",
            "_id": "2ba02c2c-3073-4fad-96d7-6d5fb9771709",
            "_rev": "zU4HXxl43R2uTRsAhG6eAP",
            "_type": "achievement",
            "_updatedAt": "2022-08-21T16:43:39Z",
            "summary": "Wake up at the same time each day, and check-in within 15 minutes.",
            "title": "6am Club",
            "type": "morning",
            "xp": 100
          },
          {
            "_createdAt": "2021-08-08T18:32:47Z",
            "_id": "824b3644-cd9e-4897-a978-c22fb424c91d",
            "_rev": "BTNQUBmTfX76gSzz4d56H6",
            "_type": "achievement",
            "_updatedAt": "2021-08-08T18:32:47Z",
            "summary": "Drinking alcohol, especially alone, cripples performance and cognitive function - especially on a school night.",
            "title": "No Alcohol",
            "type": "fitness",
            "xp": 100
          },
          {
            "_createdAt": "2021-02-01T00:16:21Z",
            "_id": "21862220-3bd6-4a95-ad03-c5a919049839",
            "_rev": "iGUy6kFRUd9Q6s0z65x0zV",
            "_type": "achievement",
            "_updatedAt": "2021-08-17T21:03:46Z",
            "summary": "Clock in, and clock out. There is no substitute for putting in the work, whether it's at your 9-5, you art, or your craft.",
            "title": "3 Hours of Deep Work",
            "type": "productivity",
            "xp": 100
          },
          {
            "_createdAt": "2021-02-01T00:21:04Z",
            "_id": "61d7be0c-3c6b-4c82-9062-9c1dce3636b3",
            "_rev": "iGUy6kFRUd9Q6s0z65x0Pr",
            "_type": "achievement",
            "_updatedAt": "2021-08-17T21:03:12Z",
            "summary": "Accomplish your primary daily objective. Each day, there is something that is truly important. Have you finished that thing?",
            "title": "Eat the Frog",
            "type": "productivity",
            "xp": 100
          },
          {
            "_createdAt": "2021-02-01T00:38:21Z",
            "_id": "37ba114e-67c0-48dd-aa8e-1add923d9099",
            "_rev": "zU4HXxl43R2uTRsAhG6dDZ",
            "_type": "achievement",
            "_updatedAt": "2022-08-21T16:42:22Z",
            "summary": "Water is life. Hydration is key to high performance.",
            "title": "Drink 1 Liter of Water",
            "type": "fitness",
            "xp": 100
          },
          {
            "_createdAt": "2021-02-01T00:17:23Z",
            "_id": "3aa67ddc-d915-4517-b6c9-8f5c4aade79a",
            "_rev": "7MVN483ot3n2svmGAYvB2n",
            "_type": "achievement",
            "_updatedAt": "2021-08-17T21:03:38Z",
            "summary": "Whether it's playing a musical instrument, reading, writing or anything in between - do something special, creative and relaxing at night.",
            "title": "Evening Creativity",
            "type": "evening",
            "xp": 100
          }
        ],
        "planning": [],
        "league": "Pareto Athletic Association (PAA)",
        "createdAt": "2023-02-01T23:16:56.039Z",
        "__v": 0
      }
}

/* 
/* CONTEXT TEST DATA
 */

export function getSampleSanitySchemas(numberToGenerate = 3) {
  const schemas = []
  for (let i = 0; i < numberToGenerate; i++) {
    schemas.push(getSampleSanitySchema(nanoid(10)))
  }
  return schemas;
}

export function getSampleSanitySchema(uniqueString: string): LibraryEntry {
  return {
    createdAt: '2022-01-01',
    _id: `id${uniqueString}`,
    _rev: `rev${uniqueString}`,
    _type: `rev${uniqueString}`,
    _updatedAt: '2022-01-02',
    body: [`${uniqueString}1`, `${uniqueString}2`],
    description: `description${uniqueString}`,
    mainImage: {
      _type: 'image', asset: {_ref: `image-${uniqueString.replace(/-/g, '')}-2000x3000-jpg`
    }
  },
    public: `public${uniqueString}`,
    slug: {
      _type: `slugType${uniqueString}`,
      current: `current-slug-${uniqueString}`,
    },
    title: `title${uniqueString}`,
    type: `type${uniqueString}`,
    summary: `summary${uniqueString}`,
    logo: `logo${uniqueString}`
  }
}

/* 
/* USER TEST DATA
 */
interface TestUserDataOptions {
  rank?: number;
  score?: number;
  _id?: string;
  id?: number;
  fName?: string;
  lName?: string;
  email?: string;
  phone?: string;
  github?: string;
  modules?: [];
  percentage?: string | number;
  planning?: PlanningField[];
  review?: ReviewField[];
  missions?: ActivePersonMissionsOnDay[];
  profileImg?: string;
  defaultLanguage?: string;
  instructor?: boolean;
  picture?: string;
  mentors?: Array<User>;
  projects?: Array<Project>;
  notes?: Array<string>;
  achievements?: Array<string>;
  mentor?: string;
  country?: string;
  bio?: string;
  summary?: string;
  city?: string;
  admin?: boolean;
  xp?: number;
  learningPurchase?: boolean;
  cp?: number;
  createdAt?: string;
  _v?: number;
}

export function generateTestUserData(index: number, options: TestUserDataOptions) {

  return {
    rank: options.rank || index,
    score: options.score || 0,
    _id: options._id || `userId${index}`,
    id: options.id || index,
    fName: options.fName || `Firstname${index}`,
    lName: options.lName || `Lastname${index}`,
    email: options.email || `user${index}@fakeemail.com`,
    phone: options.phone || `123-456-7890`,
    github: options.github || `githubprofilelink${index}`,
    modules: options.modules || [],
    percentage: options.percentage || (1 / index),
    planning: options.planning || [] as PlanningField[],
    review: options.review || [] as ReviewField[],
    missions: options.missions || [] as ActivePersonMissionsOnDay[],
    profileImg: options.profileImg || `profileImg${index}`,
    defaultLanguage: options.defaultLanguage || 'en',
    instructor: options.instructor || false,
    picture: options.picture || `userPicture${index}`,
    mentors: options.mentors || [] as User[],
    projects: options.projects || [] as Project[],
    notes: options.notes || [] as string[],
    achievements: options.achievements || [] as string[],
    mentor: options.mentor || `mentor${index}`,
    country: options.country || 'USA',
    bio: options.bio || `User bio number ${index}`,
    summary: options.summary || `User summary number ${index}`,
    city: options.city || 'City',
    admin: options.admin || false,
    xp: options.xp || 100,
    learningPurchase: options.learningPurchase || false,
    cp: options.cp || 50,
    createdAt: options.createdAt || `2022-01-01`,
    __v: options._v || 1,
  }
}
