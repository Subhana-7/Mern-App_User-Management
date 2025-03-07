import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminDashboard = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    if (!currentUser?.isAdmin) {
      navigate("/sign-in");
    }
    fetchUsers();
  }, [page, search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/users?page=${page}&search=${search}&limit=5`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser?.token}`,
        },
      });
  
      if (!res.ok) {
        throw new Error("Unauthorized: Please log in again");
      }
  
      const data = await res.json();
      setUsers(data.users);
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (error) {
      setError(error.message || "Failed to fetch users");
      setLoading(false);
      toast.error(error.message || "Failed to fetch users");
    }
  };
  

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    try {
      const res = await fetch("/api/admin/user/create", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        if (data.message.includes("validation failed")) {
          const errors = [];
          if (data.message.includes("username"))
            errors.push("Username is required");
          if (data.message.includes("email"))
            errors.push("Valid email is required");
          if (data.message.includes("password"))
            errors.push("Password is required");

          toast.error(errors.join(", "));
        } else {
          toast.error(data.message || "Failed to create user");
        }
        return;
      }
      setUsers([data, ...users]);
      setFormData({
        username: "",
        email: "",
        password: "",
      });
      toast.success("User created successfully!");
    } catch (error) {
      setError("Failed to create user");
      toast.error("Failed to create user");
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email) {
      toast.error("Username and email are required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    try {
      const res = await fetch(`/api/admin/user/update/${editingUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        if (data.message.includes("validation failed")) {
          const errors = [];
          if (data.message.includes("username"))
            errors.push("Username is required");
          if (data.message.includes("email"))
            errors.push("Valid email is required");

          toast.error(errors.join(", "));
        } else {
          toast.error(data.message || "Failed to update user");
        }
        return;
      }
      setUsers(
        users.map((user) => (user._id === editingUser._id ? data : user))
      );
      setEditingUser(null);
      setFormData({
        username: "",
        email: "",
        password: "",
      });
      toast.success("User updated successfully!");
    } catch (error) {
      setError("Failed to update user");
      toast.error("Failed to update user");
    }
  };

  const handleDeleteUser = async (userId, username) => {
    toast.info(
      <div>
        <p>Are you sure you want to delete this user?</p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss()}
            className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss();
              try {
                const res = await fetch(`/api/admin/user/delete/${userId}`, {
                  method: "DELETE",
                });
                const data = await res.json();
                if (data.success === false) {
                  setError(data.message);
                  toast.error(data.message);
                  return;
                }
                setUsers(users.filter((user) => user._id !== userId));
                toast.success("User deleted successfully!");
              } catch (error) {
                setError("Failed to delete user");
                toast.error("Failed to delete user");
              }
            }}
            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
      }
    );
  };

  return (
    <div className="admin-dashboard p-4 max-w-7xl mx-auto" style={{ backgroundColor: "rgb(17, 24, 39)" }}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <h1 className="text-3xl font-semibold mb-4 text-white">Admin Dashboard</h1>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Left side: Search and Users Table (Taking more space) */}
        <div className="md:w-2/3">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="p-2 border rounded w-full bg-white text-gray-800"
            />
          </div>

          {loading ? (
            <p className="text-white">Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="overflow-x-auto bg-white rounded">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="p-2">Username</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b">
                      <td className="p-2">{user.username}</td>
                      <td className="p-2">{user.email}</td>
                      <td className="p-2">
                        <button
                          onClick={() => {
                            setEditingUser(user);
                            setFormData({
                              username: user.username,
                              email: user.email,
                              password: "",
                            });
                          }}
                          className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id, user.username)}
                          className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`px-3 py-1 rounded ${
                  page === pageNum ? "bg-slate-700 text-white" : "bg-slate-100"
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>
        </div>

        {/* Right side: Create/Edit User Form */}
        <div className="md:w-1/3">
          <form
            onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
            className="p-4 bg-white rounded"
          >
            <h2 className="text-xl font-semibold mb-2">
              {editingUser ? "Edit User" : "Create New User"}
            </h2>
            <div className="grid gap-4">
              <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="p-2 border rounded"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="p-2 border rounded"
              />
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="p-2 border rounded"
              />

              <button
                type="submit"
                className="bg-slate-700 text-white p-2 rounded hover:opacity-95"
              >
                {editingUser ? "Update User" : "Create User"}
              </button>
              {editingUser && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingUser(null);
                    setFormData({
                      username: "",
                      email: "",
                      password: "",
                    });
                  }}
                  className="bg-gray-500 text-white p-2 rounded hover:opacity-95"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;