export const BASE_URL = "https://api.stephanydev.justlearning.net";

export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },

    body: JSON.stringify({ email, password }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else if (response.status === 400) {
        throw new Error(
          "400 - Bad Request. One or more fields were not provided."
        );
      } else if (response.status === 409) {
        throw new Error("409 - Conflict. User already exists.");
      } else {
        throw new Error(`Registration failed with status: ${response.status}`);
      }
    })
    .catch((error) => {
      console.error("Registration error:", error.message);
      throw error;
    });
};

export const authorize = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (!data.message) {
        localStorage.setItem("token", data.token);
        return data;
      } else {
        return;
      }
    });
};

export const getContent = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      return res.ok
        ? res.json()
        : Promise.reject(`${res.status} - ${res.message}`);
    })
    .then((data) => {
      return data;
    })
    .catch((err) => console.log(err));
};
