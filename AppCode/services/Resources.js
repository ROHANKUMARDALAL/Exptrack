const BASE_URL = "https://exptrack-backend-z9bn.onrender.com/api";

 const fetchData = async ({
  endpoint,
  method,
  headers = {},
  body = null,
}) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : null,
    });

    const data = await response.json();

    return data;
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};
export default fetchData