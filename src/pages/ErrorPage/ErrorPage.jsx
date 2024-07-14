import { useNavigate, useRouteError } from "react-router-dom";
import ErrorSVG from "./icons/ErrorSVG";
import { useCallback } from "react";
import Navbar from "@/components/Navbar/Navbar";

export default function ErrorPage() {
  const error = useRouteError();
  console.error("Error: ", error);
  const navigate = useNavigate();

  const onHomeClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  return (
    <div className="flex relative w-full">
      <Navbar />
      <div id="error-page">
        <div className="h-screen w-screen bg-gray-100 flex items-center">
          <div className="container flex flex-col md:flex-row items-center justify-center px-5 text-gray-700">
            <div className="max-w-md">
              <div className="text-5xl font-dark font-bold">404</div>
              <p className="text-2xl md:text-3xl font-light leading-normal">
                Sorry we couldn&apos;t find this page.{" "}
              </p>
              <p>
                <i>{error?.statusText || error?.message}</i>
              </p>
              <p className="mb-8">
                But don&apos;t worry, I&apos;m here to take you to our homepage.
              </p>
              <button
                className="px-4 inline py-2 text-sm font-medium leading-5 shadow text-white transition-colors duration-150 border border-transparent rounded-lg focus:outline-none focus:shadow-outline-blue bg-gray-600 active:bg-gray-600 hover:bg-gray-700"
                onClick={onHomeClick}>
                Back To HomePage
              </button>
            </div>
            <div className="max-w-lg">
              <ErrorSVG />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
