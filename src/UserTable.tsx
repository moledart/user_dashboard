type User = {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  lastLoginAt: string;
  password: string;
  status: "active" | "banned";
};

type TableProps = {
  users: User[];
  selectedUsers: number[];
  setSelectedUsers: React.Dispatch<React.SetStateAction<number[]>>;
};

const UserTable = ({ users, selectedUsers, setSelectedUsers }: TableProps) => {
  const handleSelectUser = (id: number) => {
    selectedUsers.includes(id)
      ? setSelectedUsers((prev) => prev.filter((el) => el !== id))
      : setSelectedUsers((prev) => [...prev, id]);
  };

  const handleSelectAllUsers = () => {
    selectedUsers.length < users.length
      ? setSelectedUsers(users.map((user) => user.id))
      : setSelectedUsers([]);
  };

  const columns = [
    {
      header: <input type="checkbox" onChange={handleSelectAllUsers} />,
      accessorKey: "select",
    },
    {
      header: "Id",
      accessorKey: "id",
    },
    {
      header: "Username",
      accessorKey: "username",
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Status",
      accessorKey: "status",
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
    },
    {
      header: "Last login",
      accessorKey: "lastLoginAt",
    },
  ];

  return (
    <table>
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              className="text-zinc-400 text-sm font-normal text-start px-1 py-2"
              key={column.accessorKey}
            >
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr
            key={user.id}
            onClick={() => handleSelectUser(user.id)}
            className="cursor-pointer hover:bg-zinc-100"
          >
            <td className="text-zinc-500 text-sm font-normal text-start px-1 py-2">
              <div className="align-middle flex items-center">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => handleSelectUser(user.id)}
                  className="my-auto"
                />
              </div>
            </td>
            <td className="text-zinc-500 text-sm font-normal text-start px-1 py-2">
              <div className="align-middle flex items-center">{user.id}</div>
            </td>
            <td className="text-zinc-500 text-sm font-normal text-start px-1 py-2">
              <div className="align-middle flex items-center">
                {user.username}
              </div>
            </td>
            <td className="text-zinc-500 text-sm font-normal text-start px-1 py-2">
              <div className="align-middle flex items-center">{user.email}</div>
            </td>
            <td className="text-zinc-500 text-sm font-normal text-start px-1 py-2">
              <div
                className={`${
                  user.status === "active" ? "text-teal-500" : "text-pink-500"
                } align-middle flex items-center`}
              >
                {user.status}
              </div>
            </td>
            <td className="text-zinc-500 text-sm font-normal text-start px-1 py-2">
              <div className="align-middle flex items-center">
                {new Date(user.createdAt).toDateString()}
              </div>
            </td>
            <td className="text-zinc-500 text-sm font-normal text-start px-1 py-2">
              <div className="align-middle flex items-center">
                {user.lastLoginAt && new Date(user.lastLoginAt).toDateString()}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
