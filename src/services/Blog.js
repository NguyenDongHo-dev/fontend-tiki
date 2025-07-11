import axios from "axios";

export const getBlogs = async (search, limit) => {
  let res = {};
  if (search?.length > 0) {
    res = await axios.get(
      `${process.env.REACT_APP_API_URL}/blog/get-blogs?filter=title&filter=${search}&limit=${limit}`
    );
  } else {
    res = await axios.get(
      `${process.env.REACT_APP_API_URL}/blog/get-blogs?limit=${limit}`
    );
  }

  return res.data;
};

export const likeBlog = async (id, access_token) => {
  axios.defaults.headers.common["token"] = `Bearer ${access_token}`;
  const res = await axios.put(`${process.env.REACT_APP_API_URL}/blog/like/${id}`, {
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  // headers: {'X-Custom-Header': 'foobar'});
  return res.data;
};

export const dislikeBlog = async (id, access_token) => {
  axios.defaults.headers.common["token"] = `Bearer ${access_token}`;
  const res = await axios.put(`${process.env.REACT_APP_API_URL}/blog/dislike/${id}`, {
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  // headers: {'X-Custom-Header': 'foobar'});
  return res.data;
};

export const createBlog = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/blog/create-blog`,
    data
  );
  return res.data;
};

export const getProductType = async (type) => {
  if (type) {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/product/getAll?filter=type&filter=${type}`
    );
    return res.data;
  }
};

export const createProduct = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/product/create`,
    data
  );
  return res.data;
};
export const getDetailsBlog = async (id) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/blog/get-by-blog/${id}`
  );
  return res.data;
};

export const updataBlog = async (id, data, access_token) => {
  axios.defaults.headers.common["token"] = `Bearer ${access_token}`;
  const res = await axios.put(
    `${process.env.REACT_APP_API_URL}/blog/update-blog/${id}`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const deleteBlog = async (id, access_token) => {
  axios.defaults.headers.common["token"] = `Bearer ${access_token}`;
  const res = await axios.delete(
    `${process.env.REACT_APP_API_URL}/blog/detele-blog/${id}`,
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
