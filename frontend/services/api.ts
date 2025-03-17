import axiosInstance from "@/utils/axiosInstance";

// ✅ Register User
export const registerUser = async (data: any) => {
  return await axiosInstance.post("/auth/register", data);
};

// ✅ Login User
export const loginUser = async (data: any) => {
  return await axiosInstance.post("/auth/login", data);
};

// ✅ Get All Athletes API (For Admin, Manager, Coach)
export const getAllAthletes = async () => {
  const response = await axiosInstance.get('/athletes');
  return response.data;
};

// ✅ Delete Athlete (Only for Admin)
export const deleteAthlete = async (athleteId: string) => {
  return await axiosInstance.delete(`/athletes/${athleteId}`);
};

// ✅ Fetch Athlete Performance API
export const fetchAthletePerformance = async (athleteId: string) => {
  const response = await axiosInstance.get(`/athletes/${athleteId}/performance`);
  return response.data;
};

// ✅ Send Performance Data to AI Model
export const analyzePerformance = async (athleteId: string) => {
  const response = await axiosInstance.post(`/athletes/${athleteId}/analyze`);
  return response.data;
};


// ✅ Predict Injury API
export const predictInjury = async (athleteId: string) => {
  const response = await axiosInstance.get(`/athletes/${athleteId}/injury`);
  return response.data;
};


// ✅ Fetch Athlete Profile
export const fetchAthleteProfile = async (athleteId: string) => {
  const response = await axiosInstance.get(`/athletes/${athleteId}/profile`);
  return response.data;
};

// ✅ Update Athlete API
export const updateAthlete = async (athleteId: string, updatedData: any) => {
  return await axiosInstance.put(`/athletes/${athleteId}`, updatedData);
};


// ✅ Fetch Athlete Stats API
export const fetchAthleteStats = async (athleteId: string) => {
  const response = await axiosInstance.get(`/athletes/${athleteId}/stats`);
  return response.data;
};

export const registerAthlete = async (athleteData: any) => {
  const response = await axiosInstance.post('/athletes/register', athleteData);
  return response.data;
};