// ----------------------------------------------------------------------

export type IJobFilterValue = string | string[];

export type IJobFilters = {
  roles: string[];
  experience: string;
  locations: string[];
  benefits: string[];
  employmentTypes: string[];
};

// ----------------------------------------------------------------------

export type IJobCandidate = {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
};

export type IJobCompany = {
  name: string;
  logo: string;
  phoneNumber: string;
  fullAddress: string;
};

export type IJobSalary = {
  type: string;
  price: number;
  negotiable: boolean;
};

export type IJobItem = {
  id: string;
  role: string;
  title: string;
  content: string;
  publish: string;
  createdAt: Date;
  skills: string[];
  expiredDate: Date;
  totalViews: number;
  experience: string;
  salary: IJobSalary;
  benefits: string[];
  locations: string[];
  company: IJobCompany;
  employmentTypes: string[];
  workingSchedule: string[];
  candidates: IJobCandidate[];
};
