import { useLocation, useNavigate } from "react-router-dom";
import IconCalander from "../icons/IconCalander";
import IconCog from "../icons/IconCog";
import IconFlag from "../icons/IconFlag";
import IconGraphBar from "../icons/IconGraphBar";
import IconGroup from "../icons/IconGroup";
import IconImage from "../icons/IconImage";
import IconMail from "../icons/IconMail";
import IconMenu from "../icons/IconMenu";
import IconSearch from "../icons/IconSearch";

const icons = [
  {
    icon: <IconSearch />,
    link: "search",
  },
  {
    icon: <IconGroup />,
    link: "",
  },
  {
    icon: <IconFlag />,
    link: "flag",
  },
  {
    icon: <IconGraphBar />,
    link: "graph",
  },
  {
    icon: <IconMail />,
    link: "mail",
  },
  {
    icon: <IconImage />,
    link: "image",
  },
  {
    icon: <IconCalander />,
    link: "calendar",
  },
  {
    icon: <IconCog />,
    link: "settings",
  },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <aside className="h-screen sticky top-0 left-0 bg-gray-100">
      <nav>
        <ul>
          <li className="p-6 flex items-center cursor-pointer bg-gray-500">
            <IconMenu className="fill-white text-2xl" />
          </li>
          {Array.isArray(icons) &&
            icons.length > 0 &&
            icons.map((item, index) => (
              <li
                key={index}
                onClick={() => navigate(item.link)}
                className={`p-4 flex items-center cursor-pointer ${item.bg} fill-black text-2xl hover:bg-gray-300`}>
                <div
                  className={`w-full h-full p-2 rounded-lg ${
                    location.pathname === "/" + item.link && "bg-gray-300"
                  } `}>
                  {item.icon}
                </div>
              </li>
            ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Navbar;
