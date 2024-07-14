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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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
import {
  ArrowUpDown,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

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
  const toast = useToast();
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, filteredData.length);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (userList !== data) {
      setData(userList);
      if (filteredData.length === 0 && userList.length > 0) {
        setFilteredData(userList);
      }
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
      await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/users/${id}`);
      mutate();
      toast({
        description: "User deleted successfully!",
      });
      const updatedData = data.filter((user) => user._id !== id);
      setData(updatedData);
      setFilteredData(applyFilters(updatedData));
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to delete user.",
      });
    }
  };

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        <span class="loading loading-spinner loading-md"></span>
      </div>
    );

  return (
    <Paper className="mx-auto w-[90%] mt-5">
      <div className="flex justify-between text-center">
        <div className="lg:text-2xl text-xl font-bold lg:mb-5 leading-[48px]">
          User
        </div>
        <div>
          <ExportToExcel data={applyFilters(data)} />
          <AddNewUser formSchema={formSchema} mutate={mutate} />
        </div>
      </div>
      <div className="flex w-full items-center mb-4 lg:gap-10 gap-5">
        <Input
          placeholder="Search User ..."
          value={filter}
          onChange={handleFilter}
          className="max-w-sm"
        />
        <Select onValueChange={handleRoleFilter}>
          <SelectTrigger className="max-w-[180px] min-w-[80px] w-auto">
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
        <Button onClick={handleSearch}>Search</Button>
      </div>

      <div className="w-full">
        <div className="rounded-lg border">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center px-0 lg:px-4">#</TableHead>
                <TableHead className="text-center px-0 lg:px-4">
                  <Button variant="ghost" onClick={() => handleSort("email")}>
                    Email <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-center hidden md:table-cell lg:table-cell">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("phoneNumber")}>
                    Phone Number <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-center hidden xl:table-cell">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("firstName")}>
                    Firstname <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-center hidden xl:table-cell">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("lastName")}>
                    Lastname <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-center px-0 lg:px-4">
                  <Button
                    variant="ghost"
                    className="lg:px-4 px-0"
                    onClick={() => handleSort("role")}>
                    Role <ArrowUpDown className="lg:ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-center px-0 lg:px-4">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(paginatedData) &&
                paginatedData.length > 0 &&
                paginatedData.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="text-center px-2 lg:px-4 min-w-[20px]">
                      {user.index}
                    </TableCell>
                    <TableCell className="text-center px-0 lg:px-4">
                      {user.email}
                    </TableCell>
                    <TableCell className="text-center hidden md:table-cell lg:table-cell">
                      {user.phoneNumber}
                    </TableCell>
                    <TableCell className="text-center hidden xl:table-cell">
                      {user.firstName}
                    </TableCell>
                    <TableCell className="text-center hidden xl:table-cell">
                      {user.lastName}
                    </TableCell>
                    <TableCell className="text-center px-0 lg:px-4">
                      {capitalizeFirstLetter(user.role)}
                    </TableCell>
                    <TableCell className="text-center px-2 lg:px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 md:hidden lg:hidden">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Label
                              className="font-normal"
                              onClick={() => setEditDialogOpen(true)}>
                              Edit user
                            </Label>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Label
                              className="font-normal"
                              onClick={() => setDeleteDialogOpen(true)}>
                              Delete user
                            </Label>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <div className="hidden md:flex lg:flex items-center justify-center">
                        <UserEditForm
                          editDialogOpen={editDialogOpen}
                          setEditDialogOpen={setEditDialogOpen}
                          user={user}
                          formSchema={formSchema}
                        />

                        <Dialog
                          open={editDialogOpen}
                          onOpenChange={setEditDialogOpen}>
                          <DialogContent className="sm:max-w-[800px]">
                            <DialogHeader className="hidden lg:block">
                              <DialogTitle>Edit user</DialogTitle>
                            </DialogHeader>
                            <UserEditForm user={user} formSchema={formSchema} />
                          </DialogContent>
                        </Dialog>

                        <AlertDialog
                          open={deleteDialogOpen}
                          onOpenChange={setDeleteDialogOpen}>
                          <AlertDialogTrigger asChild>
                            <Button variant="link">
                              <span className="underline">Delete</span>
                            </Button>
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
        <div className="flex-col w-full md:flex-row lg:flex-row flex items-center justify-end lg:space-x-10 py-4">
          <div className="flex items-center space-x-2">
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
          </div>
          <div className="lg:text-sm text-sm text-muted-foreground my-2">
            {startItem} - {endItem} of {filteredData.length}
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setCurrentPage((prev) => Math.max(prev - pageSize, 1))
              }
              disabled={currentPage === 1}>
              <ChevronFirst />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}>
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}>
              <ChevronRight />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + pageSize, totalPages))
              }
              disabled={currentPage === totalPages}>
              <ChevronLast />
            </Button>
          </div>
        </div>
      </div>
    </Paper>
  );
};

export default UserTable;
