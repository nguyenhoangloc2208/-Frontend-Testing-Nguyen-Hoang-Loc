import { createBrowserRouter } from "react-router-dom";
import RootPage from "../pages/RootPage";
import HomePage from "../pages/HomePage/HomePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootPage />,
    children: [{ path: "/", element: <HomePage /> }],
  },
]);

export default router;
