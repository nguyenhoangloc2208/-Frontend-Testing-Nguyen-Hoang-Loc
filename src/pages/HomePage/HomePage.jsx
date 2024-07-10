import useUserList from "@/hooks/useUserList";
import { ArrowUpDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  DialogDescription,
  DialogFooter,
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Paper from "@/components/Paper/Paper";
import { useEffect, useState } from "react";
import axios from "axios";
import capitalizeFirstLetter from "@/utils/CapitalizeFirstLetter";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const HomePage = () => {
  const { data: userList, isLoading, error, mutate } = useUserList();
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState({ key: "", direction: "" });
  const [roleFilter, setRoleFilter] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    setData(userList || []);
    if (filteredData.length === 0) {
      setFilteredData(userList || []);
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
      await axios.delete(`/api/users/${id}`);
      mutate();
      alert("User deleted successfully!");
      const updatedData = data.filter((user) => user._id !== id);
      setData(updatedData);
      setFilteredData(applyFilters(updatedData));
    } catch (error) {
      alert("Failed to delete user.");
    }
  };

  const handleExportToExcel = () => {
    const filteredForExport = applyFilters(data);

    const worksheet = XLSX.utils.json_to_sheet(
      filteredForExport.map((user) => ({
        "#": user.index,
        ID: user._id,
        Username: user.username,
        Password: user.password,
        Email: user.email,
        PhoneNumber: user.phoneNumber,
        FirstName: user.firstName,
        LastName: user.lastName,
        Role: capitalizeFirstLetter(user.role),
        "Create At": new Date(user.createdAt).toLocaleString("vi-VN", {
          timeZone: "Asia/Ho_Chi_Minh",
        }),
        "Last Update": new Date(user.updatedAt).toLocaleString("vi-VN", {
          timeZone: "Asia/Ho_Chi_Minh",
        }),
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    const fileName = "UserList.xlsx";
    XLSX.writeFile(workbook, fileName);
  };

  if (isLoading) return <div>loading...</div>;

  return (
    <div className="flex w-full">
      <main className="flex-1">
        <header className="flex justify-between items-center p-4 border-b-[1px]">
          <h1 className="text-3xl font-bold">HRDept Company</h1>
          <div className="flex items-center">
            <div className="mr-4 flex flex-col">
              <div className="font-bold text-right">Renee McKelvey</div>
              <div className="text-gray-500 text-xs text-right">
                Product Manager
              </div>
            </div>
            <Avatar>
              <AvatarImage src="https://picsum.photos/200" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <Paper className="w-[90%] mx-auto mt-5">
          <div className="flex justify-between">
            <div>User</div>
            <div>
              <Button
                variant="outline"
                className="mr-10"
                onClick={handleExportToExcel}>
                Export to Excel
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Add New User</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                      Make changes to your profile here. Click save when you're
                      done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        defaultValue="Pedro Duarte"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="username" className="text-right">
                        Username
                      </Label>
                      <Input
                        id="username"
                        defaultValue="@peduarte"
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("email")}>
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
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("role")}>
                        Role <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="text-center min-w-[20px]">
                        {user.index}
                      </TableCell>
                      <TableCell className="text-center">
                        {user.email}
                      </TableCell>
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
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Edit profile</DialogTitle>
                                <DialogDescription>
                                  Make changes to your profile here. Click save
                                  when you're done.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="name" className="text-right">
                                    Name
                                  </Label>
                                  <Input
                                    id="name"
                                    defaultValue="Pedro Duarte"
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="username"
                                    className="text-right">
                                    Username
                                  </Label>
                                  <Input
                                    id="username"
                                    defaultValue="@peduarte"
                                    className="col-span-3"
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button type="submit">Save changes</Button>
                              </DialogFooter>
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
                {paginatedData.length} of {filteredData.length} row(s)
                displayed.
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
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
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
      </main>
    </div>
  );
};

export default HomePage;
