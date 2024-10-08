import Link from "next/link";
import React from "react";
import { buttonVariants } from "./ui/button";
import { PlusCircle } from "lucide-react";

interface HeadingProps {
  title: string;
  description: string;
  action: string;
  count: number;
}

const Heading: React.FC<HeadingProps> = ({
  title,
  description,
  action,
  count,
}) => {
  return (
    <div className="w-full flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{`${title} (${count})`}</h1>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <Link href={`/${action}/new`} className={buttonVariants()}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Add New
      </Link>
    </div>
  );
};

export default Heading;
