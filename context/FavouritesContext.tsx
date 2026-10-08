import { createContext, useContext, useState, type ReactNode } from "react";

type FavouritesValue = {
  ids: string[];                         // the favourite contact ids
  toggle: (id: string) => void;          // add if absent, remove if present
  isFavourite: (id: string) => boolean;  // read one answer
};

const FavouritesContext = createContext<FavouritesValue | null>(null);

export function useFavourites() {
  const value = useContext(FavouritesContext);

  if (!value) {
    throw new Error("useFavourites must be used inside FavouritesProvider");
  }

  return value;
}

export function FavouritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);

  function toggle(id: string) {
    setIds((current) =>
      current.includes(id)
        ? current.filter((x) => x !== id)   // remove
        : [...current, id]                  // add
    );
  }

  function isFavourite(id: string) {
    return ids.includes(id);
  }

  return (
    <FavouritesContext.Provider value={{ ids, toggle, isFavourite }}>
      {children}
    </FavouritesContext.Provider>
  );
}