import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserTable from "./components/UserTable/UserTable";

const HomePage = () => {
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

        <UserTable />
      </main>
    </div>
  );
};

export default HomePage;
