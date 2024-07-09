import React from "react";
import { twMerge } from "tailwind-merge";

function Paper({ children, className, level = "md" }) {
  return (
    <div
      className={twMerge(
        `w-full rounded-3xl bg-white p-4 shadow-${level} shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px]`,
        className
      )}>
      {children}
    </div>
  );
}

export default Paper;
