import React from "react";

import Country from "./SearchBar/Country";
import SearchEvent from "./SearchBar/SearchEvent";

function SearchBar() {
  return (
    <div>
      <div className=" flex flex-col-reverse items-center md:flex-row md:justify-around">
        <SearchEvent />
        <Country />
      </div>
    </div>
  );
}

export default SearchBar;
