/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { ReactElement, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import {
  useAllUsersQuery,
  useDeleteUserMutation,
} from "../../redux/api/userApi";
import { CustomError } from "../../types/api-types";
import toast from "react-hot-toast";

import { Skeleton } from "../../components/loader";
import { responseToast } from "../../utils/features";

interface DataType {
  avatar: ReactElement;
  name: string;
  email: string;
  gender: string;
  role: string;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "avatar",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Gender",
    accessor: "gender",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Role",
    accessor: "role",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Customers = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const { isLoading, data, error, isError } = useAllUsersQuery(user?._id!);

  const [rows, setRows] = useState<DataType[]>([]);
  const [deleteUser] = useDeleteUserMutation();
  const deleteHandler = async (userId: string) => {
    const res = await deleteUser({ userId, adminUserId: user?._id! });
     
    responseToast(res, null, "");
 
  };

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }

  useEffect(() => {
    if (data) {
      setRows(
        data.users.map((user) => ({
          avatar: <img src={user.photo} />,
          name: user.name,
          email: user.email,
          gender: user.gender,
          role: user.role,
          action: (
            <button onClick={() => deleteHandler(user._id)}>
              <FaTrash />
            </button>
          ),
        }))
      );
    }
  }, [data]);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Customers",
    rows.length > 6
  )();

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <Skeleton /> : Table}</main>
    </div>
  );
};

export default Customers;
