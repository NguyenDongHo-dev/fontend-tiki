import HomePage from "../pages/HomePage/HomePage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import OrderPage from "../pages/OrderPage/OrderPage";
import ProductPage from "../pages/ProductPage/ProductPage";
import SignIn from "../pages/SignIn/SignIn";
import Register from "../pages/Register/Register";
import ProfilePage from "../pages/Profile/ProfilePage";
import AdminUsers from "../pages/AdminPage/AdminUsers";
import AdminProduct from "../pages/AdminPage/AdminProduct";
import HomeAdmin from "../pages/AdminPage/HomeAdmin";
import TypeProductPage from "../pages/TypeProductPage/TypeProductPage";
import PaymentPage from "../pages/PaymentPage/PaymentPage";
import OrderSuccess from "../pages/OrderSuccess/OrderSuccess";
import MyOrder from "../pages/MyOrder/MyOrder";
import DetailsOrder from "../pages/DetailsOrder";
import Blogs from "../pages/Blogs/Blogs";
import DetailBlog from "../pages/DetailBlog/DetailBlog";

import AdminOrder from "../pages/AdminPage/AdminOrder";
import AdminBlog from "../pages/AdminPage/AdminBlog";

export const routes = [
  {
    path: "/",
    page: HomePage,
    isShowHeader: true,
  },
  {
    path: "/blogs",
    page: Blogs,
    isShowHeader: true,
  },
  {
    path: "/blog/:id",
    page: DetailBlog,
    isShowHeader: true,
  },
  {
    path: "/order",
    page: OrderPage,
    isShowHeader: true,
  },
  {
    path: "/my-order",
    page: MyOrder,
    isShowHeader: true,
  },
  {
    path: "/details-order/:id",
    page: DetailsOrder,
    isShowHeader: true,
  },
  {
    path: "/payment",
    page: PaymentPage,
    isShowHeader: true,
  },
  {
    path: "/orderSuccess",
    page: OrderSuccess,
    isShowHeader: true,
  },
  {
    path: "/products/:id",
    page: ProductPage,
    isShowHeader: true,
  },
  ,
  {
    path: "/profile-user",
    page: ProfilePage,
    isShowHeader: true,
  },
  {
    path: "/:type",
    page: TypeProductPage,
    isShowHeader: true,
  },
  {
    path: "*",
    page: NotFoundPage,
    isShowHeader: false,
  },
  {
    path: "/register",
    page: Register,
    isShowHeader: true,
  },
  {
    path: "/system/admin",
    page: HomeAdmin,
    isShowHeader: false,
    isPrivate: true,
  },
  {
    path: "/system/admin/users",
    page: AdminUsers,
    isShowHeader: false,
    isPrivate: true,
  },
  {
    path: "/system/admin/products",
    page: AdminProduct,
    isShowHeader: false,
    isPrivate: true,
  },
  {
    path: "/system/admin/order",
    page: AdminOrder,
    isShowHeader: false,
    isPrivate: true,
  },
  {
    path: "/system/admin/blog",
    page: AdminBlog,
    isShowHeader: false,
    isPrivate: true,
  },

  {
    path: "/login",
    page: SignIn,
    isShowHeader: true,
  },
];
