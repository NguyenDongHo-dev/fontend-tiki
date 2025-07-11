import axios from "axios";

export const axiosJwt = axios.create();

//dang nhap
export const loginUser = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/user/sign-in`,
    data
  );
  return res.data;
};

//dang ki
export const sigupUser = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/user/sign-up`,
    data
  );
  return res.data;
};

export const getDetailsUser = async (id, access_token) => {
  const res = await axiosJwt.get(
    `${process.env.REACT_APP_API_URL}/user/get-user/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );

  return res.data;
};

export const refreshToken = async (refreshToken) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/user/refresh-token`,
    {},
    {
      headers: {
        token: `Bearer ${refreshToken}`,
      },
    }
  );
  return res.data;
};

export const logoutUser = async (id, access_token) => {
  const res = await axiosJwt.post(
    `${process.env.REACT_APP_API_URL}/user/log-out`
  );
  return res.data;
};

export const updateUser = async (id, data, access_token) => {
  const res = await axiosJwt.put(
    `${process.env.REACT_APP_API_URL}/user/update-user/${id}`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );

  return res.data;
};

export const deleteUser = async (id, access_token) => {
  const res = await axios.delete(
    `${process.env.REACT_APP_API_URL}/user/delete-user/${id}`,

    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const getAllUser = async (access_token) => {
  const res = await axiosJwt.get(
    `${process.env.REACT_APP_API_URL}/user/getAll`,

    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const senOTP = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/user/senOtp`,
    data
  );
  return res.data;
};

export const verifyOtp = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/user/verifyOtp`,
    data
  );
  return res.data;
};

export const newPassword = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/user/updatePassword`,
    data
  );
  return res.data;
};
