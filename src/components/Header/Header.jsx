import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import IconMenu from "../icons/IconMenu";
import { useState } from "react";
import IconClose from "../icons/IconClose";
import Navbar from "../Navbar/Navbar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";

const Header = () => {
  const { toast } = useToast();
  const [nav, setNav] = useState(false);
  return (
    <>
      <header className="flex justify-between items-center p-4 border-b-[1px]">
        <div className="flex items-center justify-center">
          <Sheet open={nav} onOpenChange={setNav}>
            <SheetTrigger asChild>
              {nav ? (
                <IconClose
                  onClick={() => setNav(!nav)}
                  className="w-5 h-5 mr-2 lg:hidden"
                />
              ) : (
                <IconMenu
                  onClick={() => setNav(!nav)}
                  className="w-5 h-5 mr-2 lg:hidden"
                />
              )}
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[72px] border-none">
              <Navbar menu={true} />
            </SheetContent>
          </Sheet>
          <h1 className="lg:text-3xl text-xl font-bold flex">
            HRDept{" "}
            <span className="ml-2 hidden md:block lg:block">Company</span>
          </h1>
        </div>
        <div className="flex items-center lg:mr-5">
          <div className="mr-4 flex flex-col cursor-default">
            <div className="font-bold lg:text-base text-xs text-right">
              Renee McKelvey
            </div>
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
    </>
  );
};

export default Header;
