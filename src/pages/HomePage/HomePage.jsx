import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserTable from "./components/UserTable/UserTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const HomePage = () => {
  const { toast } = useToast();
  return (
    <div className="flex w-full">
      <main className="flex-1">
        <header className="flex justify-between items-center p-4 border-b-[1px]">
          <h1 className="text-3xl font-bold">HRDept Company</h1>
          <div className="flex items-center mr-5">
            <div className="mr-4 flex flex-col cursor-default">
              <div className="font-bold text-right">Renee McKelvey</div>
              <div className="text-gray-500 text-xs text-right">
                Product Manager
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src="https://picsum.photos/200" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-4">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => {
                      toast({
                        title: "Uh oh! Something went wrong.",
                        description: "There was a problem with your request.",
                      });
                    }}
                    className="cursor-pointer">
                    <User className="mr-5 h-4 w-4" />
                    <span className="text-base">Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      toast({
                        title: "Uh oh! Something went wrong.",
                        description: "There was a problem with your request.",
                      });
                    }}
                    className="cursor-pointer">
                    <LogOut className="mr-5 h-4 w-4" />
                    <span className="text-base">Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <UserTable />
      </main>
    </div>
  );
};

export default HomePage;
