import { LoaderIcon } from "lucide-react";
import React from "react";

const Loader = () => {
  return (
    <div className="w-full my-10 py-10 flex items-center justify-center">
      <LoaderIcon className="w-8 h-8 animate-spin" />
    </div>
  );
};

export default Loader;
