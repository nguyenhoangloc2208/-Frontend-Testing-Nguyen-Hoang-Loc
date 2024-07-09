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
    icon: <IconSearch className="fill-black text-2xl" />,
    bg: "hover:bg-gray-400",
  },
  {
    icon: <IconSearch className="fill-black text-2xl" />,
    bg: "hover:bg-gray-400",
  },
  {
    icon: <IconSearch className="fill-black text-2xl" />,
    bg: "hover:bg-gray-400",
  },
  {
    icon: <IconSearch className="fill-black text-2xl" />,
    bg: "hover:bg-gray-400",
  },
  {
    icon: <IconSearch className="fill-black text-2xl" />,
    bg: "hover:bg-gray-400",
  },
  {
    icon: <IconSearch className="fill-black text-2xl" />,
    bg: "hover:bg-gray-400",
  },
  {
    icon: <IconSearch className="fill-black text-2xl" />,
    bg: "hover:bg-gray-400",
  },
];

const RootPage = () => {
  return (
    <div className="flex w-full">
      <aside className="h-screen bg-gray-100">
        <nav>
          <ul>
            {icons.map((item, index) => (
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
