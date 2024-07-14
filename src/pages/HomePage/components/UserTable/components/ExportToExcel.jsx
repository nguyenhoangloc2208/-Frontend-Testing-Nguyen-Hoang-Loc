import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";

const ExportToExcel = ({ data }) => {
  if (!Array.isArray(data)) {
    console.error("Expected data to be an array but got:", data);
    return;
  }

  const handleExportToExcel = () => {
    const filteredForExport = data;

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
        Role: user.role,
        Avatar: user.avatar ? user.avatar : "",
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

  return (
    <Button className="mr-10" onClick={handleExportToExcel}>
      Export to Excel
    </Button>
  );
};

export default ExportToExcel;
