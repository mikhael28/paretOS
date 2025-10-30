import { User } from "../types/ProfileTypes";
import { Sprint } from "../types/ArenaTypes";
import { Coach, Relationship } from "../types/MentorshipTypes";
import { LibraryEntry } from "../types/ContextTypes";

// Import existing mock data
import mockUser from "../offline-data/user.json";
import mockSprints from "../offline-data/my-sprints.json";
import { exampleExperience } from "../offline-data/experience-items.js";
import { interviewExperience } from "../offline-data/interview-experience.js";
import { productExperience } from "../offline-data/product-experience.js";

// Mock user state - simulating a logged-in user
const MOCK_USER_ID = "bc382b6b-b3fc-4f9c-8f41-88280779ced0";
const MOCK_USERNAME = "mikhael-demo";

// Create a mock authenticated user
export const mockAuthenticatedUser: User = {
  ...mockUser[0],
  id: MOCK_USER_ID,
  _id: "63589e314839d6ae37da00f9",
  fName: "Demo",
  lName: "User",
  email: "demo@paretoos.com",
  score: 1250,
  percentage: 85,
  xp: 3500,
  cp: 450,
  learningPurchase: true,
  admin: false,
  instructor: false,
  achievements: ["early-bird", "consistent-learner", "problem-solver"],
  missions: [],
  planning: [],
  review: [],
  // Add experience IDs for navigation
  apprenticeshipId: "apprenticeship-experience",
  productId: "product-experience",
  masteryId: "interviewing-experience",
} as User;

// Mock coaches data
export const mockCoaches: Coach[] = [
  {
    _id: "coach1",
    mentor: {
      picture: "https://via.placeholder.com/150",
      fName: "Sarah",
      lName: "Johnson",
    },
  },
  {
    _id: "coach2",
    mentor: {
      picture: "https://via.placeholder.com/150",
      fName: "Michael",
      lName: "Chen",
    },
  },
  {
    _id: "coach3",
    mentor: {
      picture: "https://via.placeholder.com/150",
      fName: "Emily",
      lName: "Rodriguez",
    },
  },
];

// Mock athletes/mentees
export const mockAthletes: User[] = [
  {
    ...mockAuthenticatedUser,
    id: "athlete1",
    _id: "athlete1",
    fName: "Alex",
    lName: "Thompson",
    email: "alex@example.com",
    score: 800,
    xp: 2100,
    apprenticeshipId: "apprenticeship-experience",
    productId: "product-experience",
    masteryId: "interviewing-experience",
  } as User,
  {
    ...mockAuthenticatedUser,
    id: "athlete2",
    _id: "athlete2",
    fName: "Jordan",
    lName: "Lee",
    email: "jordan@example.com",
    score: 950,
    xp: 2800,
    apprenticeshipId: "apprenticeship-experience",
    productId: "product-experience",
    masteryId: "interviewing-experience",
  } as User,
];

// Mock relationships
export const mockRelationships: Relationship[] = [
  {
    _id: "rel1",
    id: "rel1",
    mentee: mockAthletes[0],
    mentor: {
      ...mockAuthenticatedUser,
      fName: mockCoaches[0].mentor.fName,
      lName: mockCoaches[0].mentor.lName,
    } as User,
    coachId: "coach1",
    athleteId: "athlete1",
    tasks: [],
    resources: [],
    sprints: [],
    events: [],
    reminders: [],
    accepted: true,
    completed: false,
    createdAt: "2023-01-15T10:00:00Z",
    __v: 0,
  },
];

// Helper function to convert modules to priority-keyed structure
function convertModulesToPriorityFormat(experience: any) {
  const converted = { ...experience };
  
  // Add priority-based properties from modules
  if (experience.modules && Array.isArray(experience.modules)) {
    experience.modules.forEach((module: any, index: number) => {
      const priorityKey = `_${String(index + 1).padStart(2, '0')}`;
      converted[priorityKey] = {
        ...module,
        priority: priorityKey,
        completed: module.completed || false,
        approved: module.approved || false,
        revisionsNeeded: module.revisionsNeeded || false,
        athleteNotes: module.athleteNotes || "",
        coachNotes: module.coachNotes || "",
        github: module.github || "",
        prLink: module.prLink || "",
        athleteAttachment: module.athleteAttachment || [],
        coachAttachment: module.coachAttachment || [],
      };
    });
  }
  
  // Add memberId for compatibility
  converted.memberId = converted.studentId;
  
  return converted;
}

// Mock experiences - keeping the original IDs from the experience files
export const mockExperiences = [
  convertModulesToPriorityFormat({
    ...exampleExperience,
    studentId: MOCK_USER_ID,
    type: "Apprenticeship",
  }),
  convertModulesToPriorityFormat({
    ...interviewExperience,
    studentId: MOCK_USER_ID,
    type: "Interviewing",
  }),
  convertModulesToPriorityFormat({
    ...productExperience,
    studentId: MOCK_USER_ID,
    type: "Product",
  }),
];

// Mock Sanity schemas
export const mockSanitySchemas = {
  technicalSchemas: [
    {
      _id: "tech1",
      _type: "project",
      title: "React Fundamentals",
      description: "Learn the basics of React including components, props, and state",
      priority: 1,
      category: "Frontend",
      difficulty: "Beginner",
      estimatedTime: "2 weeks",
      prerequisites: ["JavaScript basics", "HTML/CSS"],
      slug: { current: "react-fundamentals" },
      mainImage: null, // No image available in mock data
      body: [],
    },
    {
      _id: "tech2",
      _type: "project",
      title: "Node.js Backend",
      description: "Build RESTful APIs with Node.js and Express",
      priority: 2,
      category: "Backend",
      difficulty: "Intermediate",
      estimatedTime: "3 weeks",
      prerequisites: ["JavaScript", "HTTP basics"],
      slug: { current: "nodejs-backend" },
      mainImage: null,
      body: [],
    },
    {
      _id: "tech3",
      _type: "project",
      title: "Database Design",
      description: "Learn SQL and NoSQL database design patterns",
      priority: 3,
      category: "Database",
      difficulty: "Intermediate",
      estimatedTime: "2 weeks",
      prerequisites: ["Basic programming"],
      slug: { current: "database-design" },
      mainImage: null,
      body: [],
    },
  ] as LibraryEntry[],
  economicSchemas: [
    {
      _id: "econ1",
      _type: "economic",
      title: "Freelancing Basics",
      description: "Understanding the economics of freelancing",
      priority: 1,
      category: "Business",
      slug: { current: "freelancing-basics" },
      mainImage: null,
      body: [],
    },
    {
      _id: "econ2",
      _type: "economic",
      title: "Tech Startup Economics",
      description: "Economic principles for tech startups",
      priority: 2,
      category: "Business",
      slug: { current: "tech-startup-economics" },
      mainImage: null,
      body: [],
    },
  ] as LibraryEntry[],
  hubSchemas: [
    {
      _id: "hub1",
      _type: "hub",
      type: "hub",
      title: "Web Development Hub",
      description: "Resources and community for web developers",
      priority: 1,
      category: "Community",
      members: 1250,
      active: true,
      slug: { current: "web-development-hub" },
      mainImage: null,
      body: [],
    },
    {
      _id: "hub2",
      _type: "hub",
      type: "hub",
      title: "Mobile Development Hub",
      description: "iOS and Android development resources",
      priority: 2,
      category: "Community",
      members: 850,
      active: true,
      slug: { current: "mobile-development-hub" },
      mainImage: null,
      body: [],
    },
  ] as LibraryEntry[],
};

// Mock training modules from Sanity - these should match the modules in experience-items.js
export const mockSanityTraining = exampleExperience.modules.map((module: any, index: number) => ({
  ...module,
  _id: `train${index + 1}`,
  _type: "apprenticeExperienceSchema",
  priority: `_${String(index + 1).padStart(2, '0')}`,
  amount: module.amount || 100,
  overview: module.overview || [],
  completed: module.completed || false,
  approved: module.approved || false,
  revisionsNeeded: module.revisionsNeeded || false,
  athleteNotes: module.athleteNotes || [],
  coachNotes: module.coachNotes || [],
  github: module.github || "",
}));

export const mockSanityProduct = productExperience.modules.map((module: any, index: number) => ({
  ...module,
  _id: `prod${index + 1}`,
  _type: "productExperienceSchema",
  priority: `_${String(index + 1).padStart(2, '0')}`,
  amount: module.amount || 100,
  overview: module.overview || [],
  completed: module.completed || false,
  approved: module.approved || false,
  revisionsNeeded: module.revisionsNeeded || false,
  athleteNotes: module.athleteNotes || [],
  coachNotes: module.coachNotes || [],
  github: module.github || "",
}));

export const mockSanityInterview = interviewExperience.modules.map((module: any, index: number) => ({
  ...module,
  _id: `int${index + 1}`,
  _type: "interviewSchema",
  priority: `_${String(index + 1).padStart(2, '0')}`,
  amount: module.amount || 100,
  overview: module.overview || [],
  completed: module.completed || false,
  approved: module.approved || false,
  revisionsNeeded: module.revisionsNeeded || false,
  athleteNotes: module.athleteNotes || [],
  coachNotes: module.coachNotes || [],
  github: module.github || "",
}));

// Mock sprint templates from Sanity
export const mockSprintTemplates = [
  {
    _id: "template1",
    title: "Weekly Sprint",
    description: "Standard weekly sprint template",
    duration: 7,
    goals: ["Complete 3 tasks", "Daily standup", "Code review"],
  },
  {
    _id: "template2",
    title: "Biweekly Sprint",
    description: "Two-week sprint for larger features",
    duration: 14,
    goals: ["Feature development", "Testing", "Documentation", "Deployment"],
  },
];

// Authentication mock service
export const mockAuthService = {
  async signIn(email: string, password: string) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Always return success for demo
    return {
      success: true,
      user: mockAuthenticatedUser,
      token: "mock-jwt-token",
      session: {
        getIdToken: () => ({
          payload: {
            sub: MOCK_USERNAME,
          },
        }),
      },
    };
  },

  async signOut() {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { success: true };
  },

  async currentSession() {
    // Simulate checking for existing session
    await new Promise((resolve) => setTimeout(resolve, 200));
    
    // Always return authenticated session for demo
    return {
      getIdToken: () => ({
        payload: {
          sub: MOCK_USERNAME,
        },
      }),
    };
  },

  async signUp(email: string, password: string, firstName: string, lastName: string) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    return {
      success: true,
      user: {
        ...mockAuthenticatedUser,
        email,
        fName: firstName,
        lName: lastName,
      },
    };
  },

  async resetPassword(email: string) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true, message: "Password reset email sent" };
  },
};

// API mock service
export const mockAPIService = {
  async getUser(username: string): Promise<User[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [mockAuthenticatedUser];
  },

  async getExperiences(userId: string) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockExperiences;
  },

  async getExperienceById(experienceId: string) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const experience = mockExperiences.find((exp) => exp.id === experienceId);
    return experience ? [experience] : [];
  },

  async getSprints(userId: string): Promise<Sprint[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockSprints as Sprint[];
  },

  async getCoaches(userId: string): Promise<Coach[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockCoaches;
  },

  async getAthletes(mentorId: string): Promise<User[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockAthletes;
  },

  async getRelationships(userId: string, type: "mentor" | "mentee"): Promise<Relationship[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockRelationships;
  },

  async createSprint(sprint: Partial<Sprint>): Promise<Sprint> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      ...mockSprints[0],
      ...sprint,
      id: `sprint-${Date.now()}`,
      _id: `sprint-${Date.now()}`,
    } as Sprint;
  },

  async updateSprint(sprintId: string, updates: Partial<Sprint>): Promise<Sprint> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const sprint = mockSprints.find((s) => s.id === sprintId) || mockSprints[0];
    return {
      ...sprint,
      ...updates,
    } as Sprint;
  },

  async updateExperience(experienceId: string, updates: any): Promise<any> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const experience = mockExperiences.find((exp) => exp.id === experienceId);
    if (experience) {
      return { ...experience, ...updates };
    }
    return null;
  },

  async sendEmail(emailData: any): Promise<{ success: boolean }> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    console.log("Mock email sent:", emailData);
    return { success: true };
  },

  async getSprintTemplates(): Promise<any[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockSprintTemplates;
  },
};

// Local storage helpers
export const mockStorageService = {
  setUser(user: User) {
    localStorage.setItem("mockUser", JSON.stringify(user));
  },

  getUser(): User | null {
    const userStr = localStorage.getItem("mockUser");
    return userStr ? JSON.parse(userStr) : null;
  },

  clearUser() {
    localStorage.removeItem("mockUser");
  },

  isAuthenticated(): boolean {
    return !!this.getUser();
  },
};

// Export a unified mock service
export const mockService = {
  auth: mockAuthService,
  api: mockAPIService,
  storage: mockStorageService,
  data: {
    user: mockAuthenticatedUser,
    coaches: mockCoaches,
    athletes: mockAthletes,
    experiences: mockExperiences,
    sprints: mockSprints,
    sanitySchemas: mockSanitySchemas,
    sanityTraining: mockSanityTraining,
    sanityProduct: mockSanityProduct,
    sanityInterview: mockSanityInterview,
    relationships: mockRelationships,
    sprintTemplates: mockSprintTemplates,
  },
};
