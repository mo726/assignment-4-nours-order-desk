export type Employee = {
  id: number;
  name: string;
  title: string;
  department: string;
  location: string;
  email: string;
  bio: string;
  manager: boolean;
};

const employees: Employee[] = [
  {
    id: 1,
    name: "Yehia Rahman",
    title: "Senior Product Engineer",
    department: "Platform",
    location: "Cairo, Egypt",
    email: "yehia.rahman@company.com",
    bio: "Builds reliable systems and mentors engineers across the product org.",
    manager: true,
  },
  {
    id: 2,
    name: "Maya Hassan",
    title: "Design Lead",
    department: "Experience",
    location: "Dubai, UAE",
    email: "maya.hassan@company.com",
    bio: "Connects product vision with human-centered design and thoughtful UX.",
    manager: true,
  },
  {
    id: 3,
    name: "Ali Sabri",
    title: "Data Analyst",
    department: "Insights",
    location: "Amman, Jordan",
    email: "ali.sabri@company.com",
    bio: "Turns raw metrics into useful insights and decision-ready dashboards.",
    manager: false,
  },
  {
    id: 4,
    name: "Nora Haddad",
    title: "Engineering Manager",
    department: "Platform",
    location: "Beirut, Lebanon",
    email: "nora.haddad@company.com",
    bio: "Leads the engineering team through delivery, coaching, and process improvement.",
    manager: true,
  },
  {
    id: 5,
    name: "Omar Nassar",
    title: "Frontend Engineer",
    department: "Experience",
    location: "Riyadh, Saudi Arabia",
    email: "omar.nassar@company.com",
    bio: "Creates polished interfaces and keeps the customer experience intuitive.",
    manager: false,
  },
];

export async function getEmployees(): Promise<Employee[]> {
  await new Promise((resolve) => setTimeout(resolve, 900));
  return employees;
}

export async function getEmployeesWithFailure(): Promise<Employee[]> {
  await new Promise((resolve) => setTimeout(resolve, 700));
  throw new Error("Failed to load employees.");
}
