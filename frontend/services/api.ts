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

// ✅ Fetch Athlete Performance
export const fetchAthletePerformance = async (athleteId: string) => {
  return await axiosInstance.get(`/athletes/${athleteId}`);
};
