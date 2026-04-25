import axiosClient from "../config/axiosClient";

// Étudiant — liste tous les cours disponibles
export const listCours = () =>
  axiosClient.get("/api/admin/courses").then((r) => r.data);

// Prof — uploader un nouveau cours (FormData)
export const createCours = (coursData) =>
  axiosClient.post("/api/admin/courses", coursData).then((r) => r.data);

export const updateCours = (courseId, coursData) => {
  return axiosClient
    .put(`/api/admin/courses/${courseId}`, coursData)
    .then((r) => r.data);
};
// export const listCoursByProf = (username) =>
// axiosClient.get(`/api/prof/${username}/cours`)
//   .then(r => r.data);
