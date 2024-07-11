import IconCalander from "@/components/icons/IconCalander";
import IconCog from "@/components/icons/IconCog";
import IconFlag from "@/components/icons/IconFlag";
import IconGraphBar from "@/components/icons/IconGraphBar";
import IconGroup from "@/components/icons/IconGroup";
import IconImage from "@/components/icons/IconImage";
import IconMail from "@/components/icons/IconMail";
import IconMenu from "@/components/icons/IconMenu";
import IconSearch from "@/components/icons/IconSearch";
import { Outlet } from "react-router-dom";

const icons = [
  { icon: <IconMenu className="fill-white text-2xl" />, bg: "bg-gray-500" },
  {
    icon: <IconSearch className="fill-black text-2xl" />,
    bg: "hover:bg-gray-400",
  },
  {
    icon: <IconGroup className="fill-black text-2xl" />,
    bg: "hover:bg-gray-400",
  },
  {
    icon: <IconFlag className="fill-black text-2xl" />,
    bg: "hover:bg-gray-400",
  },
  {
    icon: <IconGraphBar className="fill-black text-2xl" />,
    bg: "hover:bg-gray-400",
  },
  {
    icon: <IconMail className="fill-black text-2xl" />,
    bg: "hover:bg-gray-400",
  },
  {
    icon: <IconImage className="fill-black text-2xl" />,
    bg: "hover:bg-gray-400",
  },
  {
    icon: <IconCalander className="fill-black text-2xl" />,
    bg: "hover:bg-gray-400",
  },
  {
    icon: <IconCog className="fill-black text-2xl" />,
    bg: "hover:bg-gray-400",
  },
];

const RootPage = () => {
  return (
    <div className="flex relative w-full">
      <aside className="h-screen sticky top-0 left-0 bg-gray-100">
        <nav>
          <ul>
            {icons &&
              icons.length > 0 &&
              icons.map((item, index) => (
                <li
                  key={index}
                  className={`p-6 flex items-center cursor-pointer ${item.bg}`}>
                  {item.icon}
                </li>
              ))}
          </ul>
        </nav>
      </aside>
      <Outlet />
    </div>
  );
};

export default RootPage;
