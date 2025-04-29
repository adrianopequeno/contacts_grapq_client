import { useMutation, useQuery } from "@apollo/client";
import { createContext, useContext } from "react";
import { ADD_CONTATO, GET_CONTATOS } from "../graphql";

const MyContext = createContext();

export default function ContatosContextProvider({ children }) {
  const { data, loading, error } = useQuery(GET_CONTATOS);

  const [criarContato] = useMutation(ADD_CONTATO, {
    update(cache, { data }) {
      const newContatoResponse = data?.criarContato;
      const existingContatos = cache.readQuery({ query: GET_CONTATOS });

      cache.writeQuery({
        query: GET_CONTATOS,
        data: {
          contatos: [...existingContatos.contatos, newContatoResponse],
        },
      });
    },
  });

  const contatos = {
    itens: data?.contatos ?? [],
    loading,
    error,
    criarContato,
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
