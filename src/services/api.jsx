import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:3000/Blog/v1/",
  timeout: 5000,
});

apiClient.interceptors.request.use(
  (config) => {
    const userData = localStorage.getItem("users");
    if (userData) {
      const token = JSON.parse(userData).token;
      if (token) {
        config.headers["x-token"] = token;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const login = async (data) => {
  try {
    const response = await apiClient.post("/users/login", data);
    console.log("Login response:", response);
    return response;
  } catch (e) {
    return {
      error: true,
      e,
    };
  }
};

export const register = async (data) => {
  try {
    const response = await apiClient.post("/users/register", data);
    return { data: response.data };
  } catch (e) {
    console.log("Error en el registro:", e.response);
    if (e.response && e.response.data && e.response.data.errors) {
      const errors = e.response.data.errors;
      errors.forEach((error) => {
        console.log(`Error: ${JSON.stringify(error)}`);
      });
    }

    return {
      error: true,
      response: e.response,
    };
  }
};


export const getPublications = async ({ limite = 10, desde = 0 } = {}) => {
  try {
    const response = await apiClient.get("/publications/", {
      params: { limite, desde }, // <- así pasas query params en axios
    });
    return { data: response.data };
  } catch (e) {
    console.log("Error al obtener publicaciones:", e.response);
    return {
      error: true,
      response: e.response,
    };
  }
};


export const addComment = async ({ publicationId, username, content }) => {
  try {
    const response = await apiClient.post("/comments/addComment", {
      publicationId,
      username,
      content,
    });

    return { data: response.data };
  } catch (e) {
    console.log("Error al agregar comentario:", e.response);

    if (e.response && e.response.data && e.response.data.errors) {
      const errors = e.response.data.errors;
      errors.forEach((error) => {
        console.log(`Error: ${JSON.stringify(error)}`);
      });
    }

    return {
      error: true,
      response: e.response,
    };
  }
};

export const deleteComment = async (commentId) => {
  try {
    const response = await apiClient.delete(`/comments/${commentId}`);
    return { data: response.data };
  } catch (e) {
    console.log("Error al eliminar comentario:", e.response);

    if (e.response && e.response.data && e.response.data.errors) {
      const errors = e.response.data.errors;
      errors.forEach((error) => {
        console.log(`Error: ${JSON.stringify(error)}`);
      });
    }

    return {
      error: true,
      response: e.response,
    };
  }
};


