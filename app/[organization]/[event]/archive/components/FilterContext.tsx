"use client";
import React, { useState, createContext, useEffect } from "react";

export interface FilterOption<T> {
  name: string;
  value: string;
  type: string;
  filterFunc: (item: T) => Promise<boolean>;
}

const FilterContext = createContext<{
  items: any[];
  isLoading: boolean;
  filteredItems: any[];
  filterOptions: FilterOption<any>[];
  setFilterOptions: React.Dispatch<React.SetStateAction<FilterOption<any>[]>>;
}>({
  items: [],
  isLoading: true,
  filteredItems: [],
  filterOptions: [],
  setFilterOptions: () => {},
});
const FilterContextProvider = <T extends object>({
  children,
  items,
}: {
  children: React.ReactNode;
  items: T[];
}) => {
  const [filterOptions, setFilterOptions] = useState<FilterOption<T>[]>([]);
  const [filteredItems, setFilteredItems] = useState<T[]>(items);
  const [isLoading, setIsLoading] = useState(true)

  const filterItems = async () => {
    let returnItems: T[] = [...items];

    if (filterOptions.length > 0) {
      for (const filterOption of filterOptions) {
        const filterResults = await Promise.all(
          returnItems.map(async (item) => await filterOption.filterFunc(item))
        );
        returnItems = returnItems.filter((_, index) => filterResults[index]);
      }
    }
    return returnItems;
  };

  useEffect(() => {
    filterItems().then((items) =>{
      setFilteredItems(items)
      setIsLoading(false)
    } );
  }, [filterOptions]);



  return (
    <FilterContext.Provider
      value={{
        items,
        isLoading,
        filteredItems,
        filterOptions,
        setFilterOptions,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export { FilterContext, FilterContextProvider };
