import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import UserTable from "./UserTable";
import { IoTrashBinOutline, IoBanOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../config";

type User = {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  lastLoginAt: string;
  password: string;
  status: "active" | "banned";
};

const fetchUsers = () =>
  fetch(`${baseUrl}/users`, {
    credentials: "include",
  }).then((res) => {
    if (res.status === 403) throw { code: 403, message: "Login first" };
    return res.json();
  });

const deleteUsers = (ids: number[]) =>
  fetch(`${baseUrl}/users`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ids),
    credentials: "include",
  });

const changeUserStatus = (userData: { users: number[]; action: string }) => {
  return fetch(`${baseUrl}/users`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
    credentials: "include",
  });
};

function Dashboard() {
  const navigate = useNavigate();
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const queryClient = useQueryClient();
  const usersQuery = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
    retry: 0,
  });

  useEffect(() => {
    if (usersQuery.isFetchedAfterMount && usersQuery.isError)
      navigate("/login");
  }, [usersQuery.isError]);

  const handleLogout = () =>
    fetch(`${baseUrl}/logout`, {
      credentials: "include",
    }).then(() => navigate("/login"));

  const handleDeleteUsers = useMutation({
    mutationFn: deleteUsers,
    onError(err) {
      throw err;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const handleChangeUserStatus = useMutation({
    mutationFn: changeUserStatus,
    onError(err) {
      throw err;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return (
    <div className="container mx-auto max-w-2xl min-h-screen flex items-start">
      <div className="flex flex-col w-full pt-20">
        <div className="flex justify-between mb-20">
          <h1 className="text-4xl font-semibold">Welcome to the Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-zinc-200 px-3 py-2 flex items-center gap-1 hover:bg-zinc-800 hover:text-zinc-50"
          >
            Logout
          </button>
        </div>
        <div className="flex justify-between mb-4">
          <h1 className="text-xl font-semibold mb-2">Users</h1>
          <div className="flex gap-1 text-sm">
            <button
              className="bg-zinc-200 px-3 py-2 disabled:bg-zinc-100 disabled:text-zinc-400 flex items-center gap-1 hover:bg-zinc-800 hover:text-zinc-50"
              disabled={
                selectedUsers.length === 0 ||
                selectedUsers
                  .map((id) => usersQuery?.data?.find((user) => user.id === id))
                  .some((user) => user?.status === "banned")
              }
              onClick={() =>
                handleChangeUserStatus.mutate({
                  users: selectedUsers,
                  action: "block",
                })
              }
            >
              <IoBanOutline />
              Block
            </button>
            <button
              className="bg-zinc-200 px-3 py-2 disabled:bg-zinc-100 disabled:text-zinc-400 flex items-center gap-1 hover:bg-zinc-800 hover:text-zinc-50"
              disabled={
                selectedUsers.length === 0 ||
                selectedUsers
                  .map((id) => usersQuery?.data?.find((user) => user.id === id))
                  .some((user) => user?.status === "active")
              }
              onClick={() =>
                handleChangeUserStatus.mutate({
                  users: selectedUsers,
                  action: "unblock",
                })
              }
            >
              Unblock
            </button>
            <button
              className="bg-zinc-200 px-3 py-2 disabled:bg-zinc-100 disabled:text-zinc-400 flex items-center gap-1 hover:bg-zinc-800 hover:text-zinc-50"
              onClick={() => {
                handleDeleteUsers.mutate(selectedUsers);
              }}
            >
              <IoTrashBinOutline />
              Delete
            </button>
          </div>
        </div>
        {usersQuery.isLoading && <p>Loading...</p>}
        {usersQuery.isSuccess && (
          <UserTable
            users={usersQuery.data as User[]}
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
