import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Paper from "@/components/Paper/Paper";
import useUserList from "@/hooks/useUserList";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import capitalizeFirstLetter from "@/utils/CapitalizeFirstLetter";
import ExportToExcel from "./components/ExportToExcel";
import AddNewUser from "./components/AddNewUser";
import UserEditForm from "./components/UserEditForm";

const formSchema = z
  .object({
    email: z.string().email("Invalid email address."),
    role: z.enum(["admin", "user", "editor"]),
    phone: z.string().min(10, {
      message: "Phone number must be at least 10 digits.",
    }),
    firstName: z.string().min(1, { message: "First name is required." }),
    lastName: z.string().min(1, { message: "Last name is required." }),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
    avatar: z.string().optional(),
    isVerified: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const UserTable = () => {
  const { data: userList, isLoading, error, mutate } = useUserList();
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState({ key: "", direction: "" });
  const [roleFilter, setRoleFilter] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    setData(userList);
    if (filteredData.length === 0 && userList.length > 0) {
      setFilteredData(userList);
    }
  }, [userList]);

  const applyFilters = (dataToFilter) => {
    return dataToFilter.filter((user) => {
      return (
        (user.email.toLowerCase().includes(filter.toLowerCase()) ||
          user.username.toLowerCase().includes(filter.toLowerCase()) ||
          user.firstName.toLowerCase().includes(filter.toLowerCase()) ||
          user.lastName.toLowerCase().includes(filter.toLowerCase()) ||
          user.phoneNumber.toLowerCase().includes(filter.toLowerCase())) &&
        (!roleFilter || user.role === roleFilter)
      );
    });
  };

  const handleSort = (key) => {
    const direction = sorting.direction === "asc" ? "desc" : "asc";
    setSorting({ key, direction });

    const sortedData = [...data].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setData(sortedData);
    setFilteredData(applyFilters(sortedData));
  };

  const handleFilter = (event) => {
    setFilter(event.target.value);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setFilteredData(applyFilters(sortedData));
  };

  const handleRoleFilter = (value) => {
    setRoleFilter(value == "all" ? "" : value);
    setFilteredData(
      data.filter((user) => {
        return !value || user.role === value;
      })
    );
    setCurrentPage(1);
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`/server/api/users/${id}`);
      mutate();
      alert("User deleted successfully!");
      const updatedData = data.filter((user) => user._id !== id);
      setData(updatedData);
      setFilteredData(applyFilters(updatedData));
    } catch (error) {
      alert("Failed to delete user.");
    }
  };

  if (isLoading) return <div>loading...</div>;

  return (
    <Paper className="w-[90%] mx-auto mt-5">
      <div className="flex justify-between">
        <div>User</div>
        <div>
          <ExportToExcel data={applyFilters(data)} />
          <AddNewUser formSchema={formSchema} mutate={mutate} />
        </div>
      </div>
      <div className="flex w-full items-center mb-4 gap-10">
        <Input
          placeholder="Search User ..."
          value={filter}
          onChange={handleFilter}
          className="max-w-sm"
        />
        <Select onValueChange={handleRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem disabled={roleFilter === ""} value="all">
                {roleFilter !== "" ? "All Roles" : "Roles"}
              </SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={handleSearch}>
          Search
        </Button>
      </div>

      <div className="w-full">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">#</TableHead>
                <TableHead className="text-center">
                  <Button variant="ghost" onClick={() => handleSort("email")}>
                    Email <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("phoneNumber")}>
                    Phone Number <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("firstName")}>
                    Firstname <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("lastName")}>
                    Lastname <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-center">
                  <Button variant="ghost" onClick={() => handleSort("role")}>
                    Role <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(paginatedData) &&
                paginatedData.length > 0 &&
                paginatedData.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="text-center min-w-[20px]">
                      {user.index}
                    </TableCell>
                    <TableCell className="text-center">{user.email}</TableCell>
                    <TableCell className="text-center">
                      {user.phoneNumber}
                    </TableCell>
                    <TableCell className="text-center">
                      {user.firstName}
                    </TableCell>
                    <TableCell className="text-center">
                      {user.lastName}
                    </TableCell>
                    <TableCell className="text-center">
                      {capitalizeFirstLetter(user.role)}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="mr-5">
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[800px]">
                            <DialogHeader>
                              <DialogTitle>Edit user</DialogTitle>
                            </DialogHeader>
                            <UserEditForm user={user} formSchema={formSchema} />
                          </DialogContent>
                        </Dialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline">Delete</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete this user and remove your
                                data from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteUser(user._id)}>
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {paginatedData.length} of {filteredData.length} row(s) displayed.
          </div>
          <div className="flex items-center space-x-2">
            <span>Rows per page:</span>
            <Select onValueChange={(value) => setPageSize(Number(value))}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder={String(pageSize)} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}>
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}>
              Next
            </Button>
          </div>
        </div>
      </div>
    </Paper>
  );
};

export default UserTable;
