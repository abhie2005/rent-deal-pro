import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://api.example.com",
});

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  city: string;
  state: string;
  address: string;
  zip: string;
  listingType: "rent" | "sale";
  images: string[];
  amenities: string[];
  createdAt: string;
  sellerId: string;
}

export interface Application {
  id: string;
  listingId: string;
  applicantName: string;
  applicantEmail: string;
  matchScore: number;
  creditScore: number;
  income: number;
  evictions: number;
  bankruptcy: boolean;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export const fetchListings = (params?: Record<string, string | number>) =>
  api.get<Listing[]>("/api/listings", { params }).then((r) => r.data);

export const fetchListing = (id: string) =>
  api.get<Listing>(`/api/listings/${id}`).then((r) => r.data);

export const createListing = (data: Partial<Listing>) =>
  api.post<Listing>("/api/listings", data).then((r) => r.data);

export const submitApplication = (listingId: string, consent: boolean) =>
  api.post<Application>("/api/applications", { listingId, consent }).then((r) => r.data);

export const fetchApplications = (listingId: string) =>
  api.get<Application[]>(`/api/applications/listing/${listingId}`).then((r) => r.data);

export const chatWithAI = (listingId: string, question: string) =>
  api.post<{ answer: string }>("/api/chat", { listingId, question }).then((r) => r.data);

export const textToSpeech = (text: string) =>
  api.post("/api/chat/tts", { text }, { responseType: "blob" }).then((r) => r.data);

export default api;
