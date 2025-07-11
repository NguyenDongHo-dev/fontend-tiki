import axios from "axios";
import { axiosJwt } from "./UserService";

export const createOrder = async (access_token, data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/order/create/${data?.user}`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const getOrderUserId = async (id, access_token) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/order/get-all-order/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const getDetailsOrder = async (id, access_token) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/order/get-details-order/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const deleteDetailsOrder = async (id, access_token, orderItems) => {
  const res = await axios.delete(
    `${process.env.REACT_APP_API_URL}/order/delete-details-order/${id}`,
    {
      data: orderItems,
    },

    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const getAllOrder = async (access_token, search) => {
  let res = {};

  if (search?.length > 0) {
    res = await axios.get(
      `${process.env.REACT_APP_API_URL}/order/all-order?filter=${search}`,
      {
        headers: {
          token: `Bearer ${access_token}`,
        },
      }
    );
  } else {
    res = await axios.get(`${process.env.REACT_APP_API_URL}/order/all-order`, {
      headers: {
        token: `Bearer ${access_token}`,
      },
    });
  }

  return res.data;
};

export const updateOrder = async (id, data, access_token) => {
  const res = await axios.put(
    `${process.env.REACT_APP_API_URL}/order/update-order/${id}`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};
