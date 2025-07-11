import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getDetailsUser, updateUser } from "../../services/UserService";
import { useMutationHook } from "../../hooks/UserMutationHook";
import { updateUserRD } from "../../redux/slides/userSlice";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Cập nhật form khi user thay đổi
  useEffect(() => {
    setForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
    });
  }, [user]);

  const mutation = useMutationHook((data) => {
    const { id, access_token, ...rests } = data;
    return updateUser(id, rests, access_token);
  });

  const { status, isSuccess } = mutation;

  useEffect(() => {
    if (isSuccess) {
      handleGetDetailsUsers(user.id, user.access_token);
    }
  }, [isSuccess]);

  const handleGetDetailsUsers = async (id, token) => {
    const res = await getDetailsUser(id, token);
    if (res?.data) {
      dispatch(updateUserRD({ ...res.data, access_token: token }));
    }
  };

  const handleOnChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      id: user.id,
      access_token: user.access_token,
      ...form,
    });
  };

  return (
    <div className="bg-[#f5f5fa] py-20">
      <div className="max-w-[1440px] px-5 mx-auto">
        <div className="bg-white p-4 w-[512px] mx-auto rounded-lg">
          <div className="text-center text-base font-normal text-[rgb(100,100,109)] mb-2">
            Thông tin cá nhân
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-3">
              <div>
                <label className="inline-block text-sm mb-2">Họ & tên</label>
                <input
                  className="rounded py-[10px] px-3 w-full focus:outline-none"
                  type="text"
                  id="name"
                  value={form.name}
                  onChange={handleOnChange}
                />
              </div>
              <div>
                <label className="inline-block text-sm mb-2">Email</label>
                <input
                  className="rounded py-[10px] px-3 w-full focus:outline-none"
                  type="email"
                  id="email"
                  value={form.email}
                  onChange={handleOnChange}
                />
              </div>
              <div>
                <label className="inline-block text-sm mb-2">Phone</label>
                <input
                  className="rounded py-[10px] px-3 w-full focus:outline-none"
                  type="text"
                  id="phone"
                  value={form.phone}
                  onChange={handleOnChange}
                />
              </div>
              <div>
                <label className="inline-block text-sm mb-2">Địa chỉ</label>
                <input
                  className="rounded py-[10px] px-3 w-full focus:outline-none"
                  type="text"
                  id="address"
                  value={form.address}
                  onChange={handleOnChange}
                />
              </div>
              <div className="mx-auto">
                <button
                  className="w-[200px] bg-[rgb(11,116,229)] h-[40px] text-white rounded text-sm"
                  type="submit"
                >
                  {status === "pending" ? "Loading..." : "Lưu thông tin"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
