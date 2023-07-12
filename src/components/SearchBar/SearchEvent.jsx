import React, { useState, useEffect, useRef } from "react";
import { selectEvents } from "../../store/authReducer";
import { useSelector } from "react-redux";

import { AiOutlineSearch } from "react-icons/ai";
import SearchedEvent from "./SearchedEvent";

function SearchEvent() {
  /* ver os resultados do input no searchBar */
  const events = useSelector(selectEvents);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchedEvent, setShowSearchedEvent] = useState(false);

  const searchContainerRef = useRef(null);

  const handlerSearchBar = (event) => {
    if (event.target.value.length === 0) {
      return setSearchResults([]);
    }
    setSearch(event.target.value);
    const searchedItem = events.filter((item) => {
      return item.title
        .toLowerCase()
        .includes(event.target.value.toLowerCase());
    });
    setSearchResults(searchedItem);
  };

  const handlerEventClick = (item) => {
    setShowSearchedEvent(item);
    setSearchResults([]);
  };
  /*delete the results of the search when i click outside of the container searchBar, that way when i click on a result it shows the details and won't delete them  */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setSearchResults([]);
        setSearch("");
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  /* function close eventoDetail  */

  const handlerCloseEventDetails = (props) => {
    setShowSearchedEvent(props);
  };

  return (
    <div className="relative mt-4 md:mt-0" ref={searchContainerRef}>
      <form className="relative z-10">
        <input
          type="text"
          placeholder="Search Event..."
          className="px-2 md:min-w-[260px] bg-white rounded-xl outline-none "
          value={search}
          onChange={handlerSearchBar}
        />
        <AiOutlineSearch size={15} className="absolute top-1 right-1" />
      </form>
      {searchResults && (
        <div className="absolute top-5 z-20 mt-2 bg-white rounded shadow min-w-[260px]">
          {searchResults.map((item) => (
            <p
              key={item.id}
              className="cursor-pointer px-2 hover:bg-blue-400"
              onClick={() => handlerEventClick(item)}
            >
              {item.title} : {item.start.slice(0, 10)}
            </p>
          ))}
        </div>
      )}
      {showSearchedEvent && (
        <SearchedEvent
          event={showSearchedEvent}
          open={showSearchedEvent}
          onClose={handlerCloseEventDetails}
        />
      )}
    </div>
  );
}

export default SearchEvent;
