import React, { useEffect, useState } from "react";
import axios from "axios";
import { setHolidays } from "../../store/authReducer";
import { useDispatch } from "react-redux";

function Country() {
  const dispatch = useDispatch();
  const [countryData, setCountryData] = useState([]);
  const [countryToFetchData, setCountryToFetchData] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "https://date.nager.at/api/v3/AvailableCountries"
      );
      setCountryData(response.data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      let response;

      if (!countryToFetchData) {
        response = await axios.get(
          `https://date.nager.at/api/v3/NextPublicHolidays/PT`
        );
      } else {
        response = await axios.get(
          `https://date.nager.at/api/v3/NextPublicHolidays/${countryToFetchData}`
        );
      }

      const countries = response.data;
      const holidays = countries.map((country) => {
        console.log(country);
        return {
          title: country.name,
          start: country.date,
          end: country.date,
          priority: "holidays",
          id: `${country.countryCode}${new Date(country.date).getTime()}`,
        };
      });

      dispatch(setHolidays(holidays));
    };

    fetchData();
  }, [countryToFetchData, dispatch]);

  const handleCountryChange = (event) => {
    setCountryToFetchData(event.target.value);
  };

  return (
    <div>
      <label
        htmlFor="country"
        className="text-sm md:text-xl mr-2 font-semibold"
      >
        Country:
      </label>
      <select
        id="country"
        name="country"
        onChange={handleCountryChange}
        value={countryToFetchData}
        className="rounded outline-none text-sm md:text-xl scrollbar-hide overflow-auto"
      >
        <option value="PT">Portugal</option>
        {countryData?.map((country) => (
          <option key={country.countryCode} value={country.countryCode}>
            {country.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Country;
