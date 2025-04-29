import { useQuery } from "@apollo/client";
import { createContext, useContext } from "react";
import { GET_CONTATOS } from "../graphql";

const MyContext = createContext();

export default function ContatosContextProvider({ children }) {
  const { data, loading, error } = useQuery(GET_CONTATOS);

  const contatos = {
    itens: data?.contatos ?? [],
    loading,
    error,
  };

  return (
    <MyContext.Provider value={{ contatos }}>{children}</MyContext.Provider>
  );
}

export function useContatosContext() {
  const context = useContext(MyContext);
  if (context === undefined) {
    throw new Error(
      "useContatosContext must be used within a ContatosContextProvider"
    );
  }
  return context;
}
