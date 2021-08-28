import cloneDeep from "lodash.clonedeep";
export const COMPLETE_SPRINT_TASK = "COMPLETE_SPRINT_TASK";
export const NEXT_DAY = "NEXT_DAY";
export const GET_ACTIVE_SPRINT_DATA = "GET_ACTIVE_SPRINT_DATA";
export const GET_INITIAL_SPRINT_DATA = "GET_INITIAL_SPRINT_DATA";
export const PUT_UPDATED_SPRINT_DATA = "PUT_UPDATED_SPRINT_DATA";
export const PLANNING_FORMS = "PLANNING_FORMS";

/**
 * Most of the Sprint business logic is here - including calculating an updated sprint, when an achievement has been completed.
 */

export let missions = {
  dailyScore: 0,
  dailyCompletion: 0,
  missions: [
    {
      xp: 10,
      esTitle: "Hora de Poder",
      title: "Hour of Power",
      questions: [],
      key: "",
      img: "",
      completedAt: Date.now(),
      proof: [],
      confirmed: false,
      completed: false,
      esDescription:
        "Comience el día con la intencionalidad correcta: concéntrese en reescribir sus metas, exprese verbalmente afirmaciones positivas y exprese aquello por lo que está agradecido.",
      description:
        "Start your day with the right intentionality - focus on re-writing your goals, verbally express positive affirmations & express what you are grateful for.",
    },
    {
      xp: 10,
      esTitle: "Sudor Temprando",
      title: "Morning Sweat",
      questions: [],
      key: "",
      img: "",
      completedAt: Date.now(),
      proof: [],
      confirmed: false,
      completed: false,
      esDescription:
        "20 minutos de ejercicios intensos por 30 minutos de ejercicio moderado dentro de una hora después de despertarse.",
      description:
        "20 minutes of intense excercises or 30 minutes of moderate excercise within one hour of waking up.",
    },
    {
      xp: 10,
      esTitle: "Meditacion en la Tarde",
      title: "Afternoon Meditation",
      questions: [],
      key: "",
      img: "",
      completedAt: Date.now(),
      proof: [],
      confirmed: false,
      completed: false,
      esDescription:
        "Inmediatamente después del almuerzo, alrededor de la 1 o 2, meditas para evitar llegar al punto más bajo de la actuación.",
      description:
        "Right after lunch, around 1 or 2, you meditate to avoid hitting the performance trough.",
    },
    {
      xp: 10,
      esTitle: "Escribiendo en la Noche",
      title: "Evening Journaling",
      questions: [],
      key: "",
      img: "",
      completedAt: Date.now(),
      proof: [],
      confirmed: false,
      completed: false,
      esDescription:
        "Reflexión sobre los acontecimientos del día, lo que hizo bien, lo que podría mejorar, lo que agradece.",
      description:
        "Reflection on the days events, what you did right, what you could improve, what you are thankful for.",
    },
    {
      xp: 10,
      esTitle: "Consistidad es Rey",
      title: "Consistency is King",
      questions: [],
      key: "",
      img: "",
      completedAt: Date.now(),
      proof: [],
      confirmed: false,
      completed: false,
      esDescription:
        "Levántese a la misma hora todos los días y regístrese en 5 minutos.",
      description:
        "Wake up at the same time each day, and check-in within 5 minutes.",
    },
    {
      xp: 10,
      esTitle: "Trabaja por 3 Horas",
      title: "3 hour work session",
      questions: [],
      key: "",
      img: "",
      completedAt: Date.now(),
      proof: [],
      confirmed: false,
      completed: false,
      esDescription:
        "Ficha de entrada y salida. No hay sustituto para poner el trabajo, ya sea en su 9-5, su arte o su oficio.",
      description:
        "Clock in, and clock out. There is no substitute for putting in the work, whether it's at your 9-5, you art, or your craft.",
    },
    {
      xp: 10,
      esTitle: "Trabajo por 3 horas",
      title: "3 hour work session",
      questions: [],
      key: "",
      img: "",
      completedAt: Date.now(),
      proof: [],
      confirmed: false,
      completed: false,
      esDescription: "No hay sustituto para el trabajo.",
      description: "There is no substitute for the work.",
    },
    {
      xp: 10,
      esTitle: "Creatividad Nocturna",
      title: "Evening Creativity",
      questions: [],
      key: "",
      img: "",
      completedAt: Date.now(),
      proof: [],
      confirmed: false,
      completed: false,
      esDescription:
        "Ya sea tocando un instrumento musical, leyendo, escribiendo o cualquier otra cosa, haga algo especial, creativo y relajante por la noche.",
      description: `Whether it's playing a musical instrument, reading, writing or anything in between - do something special, creative and relaxing at night.`,
    },
    {
      xp: 10,
      esTitle: "No Fumando",
      title: "Abstain from Smoking",
      questions: [],
      key: "",
      img: "",
      completedAt: Date.now(),
      proof: [],
      confirmed: false,
      completed: false,
      esDescription: "Responda a esta consulta entre las 9 y las 10 p.m.",
      description: "Respond to this query between 9 and 10pm.",
    },
    {
      xp: 10,
      esTitle: "No Borracho",
      title: "No more than two drinks on a weekday.",
      questions: [],
      key: "",
      img: "",
      completedAt: Date.now(),
      proof: [],
      confirmed: false,
      completed: false,
      esDescription: "Responda a esta consulta entre las 9 y las 10 p.m.",
      description: "Respond to this query between 9-10pm.",
    },
    {
      xp: 10,
      esTitle: "Lograr el objetivo diario principal",
      title: "Accomplish primary daily objective",
      questions: [],
      key: "",
      img: "",
      completedAt: Date.now(),
      proof: [],
      confirmed: false,
      completed: false,
      esDescription:
        "Cada día, hay algo que es realmente importante. ¿Has terminado esa cosa?",
      description:
        "Each day, there is something that is truly important. Have you finished that thing?",
    },
    {
      xp: 10,
      esTitle: "Lograr el objetivo diario segundo",
      title: "Accomplish secondary daily objective",
      questions: [],
      key: "",
      img: "",
      completedAt: Date.now(),
      proof: [],
      confirmed: false,
      completed: false,
      esDescription:
        "Hay un elemento que ocupa el segundo lugar en importancia. ¿Lo has terminado?",
      description:
        "There is an item that is second in importance. Have you finished it?",
    },
  ],
};

const initialState = [
  {
    id: "String",
    athleteId: "String",
    coachId: "String",
    startDate: Date.now(),
    endDate: Date.now(),
    // the day 0 below is a static mechanism for us to rotate through completing tasks while testing static components
    // meaning is it a draft, or what
    started: false,
    events: [],
    studySessions: [],
    // the above are relevant for mentorship sprints
    type: "String",
    // type: mentorship, match, private match, league
    days: [],
    // Number below better? I guess that can be calculated daily or at the very end?
    score: "String",
    verified: false,
    teams: [
      {
        fName: "Michael Litchev",
        lName: "",
        email: "mikhael@hey.com",
        github: "mikhael28",
        id: "b9c6ec04-26f2-4298-95d7-a12df090dec9",
        score: 0,
        percentage: 0,
        missions: [
          cloneDeep(missions),
          cloneDeep(missions),
          cloneDeep(missions),
          cloneDeep(missions),
          cloneDeep(missions),
        ],
      },
    ],
    stake: {
      title: "String",
      value: "String",
      conditions: [],
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

function sprint(state = [], action) {
  switch (action.type) {
    case GET_ACTIVE_SPRINT_DATA:
      state = action.payload;
      return state;
    case GET_INITIAL_SPRINT_DATA:
      state = action.payload;
      return state;
    case COMPLETE_SPRINT_TASK:
      let newTeams = state[action.payload.activeSprintIndex].teams.slice();

      // marking task as complete
      newTeams[action.payload.index].missions[action.payload.day].missions[
        action.payload.idx
      ].completed = true;
      newTeams[action.payload.index].missions[action.payload.day].missions[
        action.payload.idx
      ].proofLink = action.payload.key;

      // update daily score, imperfect with local objects
      newTeams[action.payload.index].missions[action.payload.day].dailyScore =
        newTeams[action.payload.index].missions[action.payload.day].dailyScore +
        10;

      // finding number of completed tasks

      let completedTasks = 0;
      newTeams[action.payload.index].missions[action.payload.day].missions.map(
        (mission) => {
          if (mission.completed === true) {
            completedTasks = completedTasks + 1;
          }
        }
      );

      // calculating daily completion

      newTeams[action.payload.index].missions[
        action.payload.day
      ].dailyCompletion =
        completedTasks /
        newTeams[action.payload.index].missions[action.payload.day].missions
          .length;

      // weekly score updated
      newTeams[action.payload.index].score =
        newTeams[action.payload.index].score + 10;

      // weekly completion

      let newPercentage =
        newTeams[action.payload.index].score /
        (newTeams[action.payload.index].missions.length *
          (newTeams[action.payload.index].missions[0].missions.length * 10));
      if (isNaN(newPercentage) !== true) {
        newTeams[action.payload.index].percentage = newPercentage.toFixed(2);
      }

      let newSprints = state.slice();
      newSprints[action.payload.activeSprintIndex].teams = newTeams;

      return {
        ...newSprints,
      };
    case PLANNING_FORMS:
      let newFormsState = state[action.payload.activeSprintIndex].teams.slice();
      newFormsState[action.payload.teamIndex].planning[
        action.payload.planningIndex
      ].content = action.payload.content;
      let newForms = state.slice();
      newForms[action.payload.activeSprintIndex].teams = newFormsState;
      return {
        ...newForms,
      };
    case NEXT_DAY:
      return { ...state, day: state.day + 1 };
    case PUT_UPDATED_SPRINT_DATA:
      state = action.payload;
      return state;
    default:
      return state;
  }
}

export function updatePlanningForms(payload) {
  return { type: PLANNING_FORMS, payload };
}

export function getActiveSprintData(payload) {
  return { type: GET_ACTIVE_SPRINT_DATA, payload };
}

export function getInitialSprintData(payload) {
  return { type: GET_INITIAL_SPRINT_DATA, payload };
}

export function completeSprintTask(payload) {
  return { type: COMPLETE_SPRINT_TASK, payload };
}

export function putUpdatedSprintData(payload) {
  return { type: PUT_UPDATED_SPRINT_DATA, payload };
}

export function nextDay() {
  return { type: NEXT_DAY };
}

export default sprint;
