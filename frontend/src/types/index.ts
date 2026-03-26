export interface User {
  id: number;
  email: string;
  hasProfile: boolean;
  token: string;
}

export interface Profile {
  id: number;
  adId: string;
  firstName: string;
  lastName: string;
  gender: 'MALE' | 'FEMALE';
  age: number;
  religion: string;
  ethnicity: string;
  civilStatus: string;
  height: number;
  country: string;
  district: string;
  city: string;
  education: string;
  profession: string;
  employedIn: string;
  annualIncome: string;
  aboutMe: string;
  partnerExpectations: string;
  fatherOccupation: string;
  motherOccupation: string;
  siblings: number;
  isVerified: boolean;
  photoUrl: string;
  createdAt: string;
}

export interface SearchParams {
  gender?: 'MALE' | 'FEMALE' | '';
  minAge: number;
  maxAge: number;
  religion?: string;
  ethnicity?: string;
  country?: string;
  page: number;
  size: number;
}

export interface PagedResponse {
  profiles: Profile[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface CreateProfileForm {
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  religion: string;
  ethnicity: string;
  civilStatus: string;
  height: number;
  country: string;
  district: string;
  city: string;
  education: string;
  profession: string;
  employedIn: string;
  annualIncome: string;
  aboutMe: string;
  partnerExpectations: string;
  fatherOccupation: string;
  motherOccupation: string;
  siblings: number;
}
