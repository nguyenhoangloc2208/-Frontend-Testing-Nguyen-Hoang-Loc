import { createBrowserRouter } from "react-router-dom";
import RootPage from "../pages/RootPage";
import HomePage from "../pages/HomePage/HomePage";
import ErrorPage from "@/pages/ErrorPage/ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    element: <RootPage />,
    children: [{ path: "/", element: <HomePage /> }],
  },
]);

export default router;
