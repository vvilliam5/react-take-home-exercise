import React from "react";
const FilterButton = ({
  filter,
  filterFor,
  setFilter,
}: {
  filter: string;
  filterFor: string;
  setFilter: (param: string) => void;
}) => {
  return (
    <button
      onClick={() => setFilter(filterFor.toLowerCase())}
      className={`${
        filter === filterFor.toLowerCase()
          ? "text-white bg-gray-600 px-6 sm:px-8 py-2 rounded-md"
          : "text-gray-700 px-6 sm:px-8 py-2"
      }`}
    >
      {filterFor}
    </button>
  );
};

export default FilterButton;
