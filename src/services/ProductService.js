import axios from "axios";





export const getAllProduct = async (search,type, limit,page) => {

  let res = {};
  if (search?.length > 0) {
    res = await axios.get(
      `${process.env.REACT_APP_API_URL}/product/getAll?filter=${type}&filter=${search}&limit=${limit}&page=${page}`
    );
  } else {
    res = await axios.get(
      `${process.env.REACT_APP_API_URL}/product/getAll?limit=${limit}&page=${page}`
    );
  }

  return res.data;
};

export const getAllProductSort = async (sort, typeSort, limit) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/product/getAll?sort=${sort}&sort=${typeSort}&limit=${limit}`
  );
  return res.data;
};

export const getProductType = async (type) => {
  
  if (type) {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/product/getAll?filter=type_normalized&filter=${type}`
    );
    return res.data;
  }
};

export const createProduct = async (data, access_token) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/product/create`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};
export const getDetailsProduct = async (id) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/product/getByProduct/${id}`
  );
  return res.data;
};

export const updataProduct = async (id, data, access_token) => {
  const res = await axios.put(
    `${process.env.REACT_APP_API_URL}/product/update/${id}`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const deleteProduct = async (id, access_token) => {
  const res = await axios.delete(
    `${process.env.REACT_APP_API_URL}/product/delete/${id}`,

    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const SortSearchFilerProduct = async (page, sort, filter) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/product/getAll?page=${page}&sort=${sort.sort},${sort.order}`
  );
  return res.data;
};
