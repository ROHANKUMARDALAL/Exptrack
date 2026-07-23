import fetchData from "../services/Resources";

const signup = async () => {
  const body = {
    name: "Nitish Dalal",
    email: "nitishdalal@example.com",
    password: "NitishDalal@123",
    gender: "male",
    profile_photo: "https://placehold.co/100x100",
  };

  const res = await fetchData({
    endpoint: "/signup",
    method: "POST",
    body,
  });

  console.log(res);
};

const login = async (payload) => {
    console.log("payload checking ",payload);
    
  const body = {
    email: `${payload?.email}`,
    password: `${payload?.password}`,  
  };
  const response = await fetchData({
    endpoint: "/login",
    method: "POST",
    body,
  });
  console.log(response);
return response;
};

export{signup,login}