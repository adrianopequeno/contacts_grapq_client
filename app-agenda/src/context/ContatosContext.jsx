import { useMutation, useQuery } from "@apollo/client";
import { createContext, createRef, useContext } from "react";
import {
  ADD_CONTATO,
  GET_CONTATOS,
  REMOVE_CONTATO,
  UPDATE_CONTATO,
} from "../graphql";

const MyContext = createContext();

const cacheCreate = {
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
};

export default function ContatosContextProvider({ children }) {
  const { data, loading, error } = useQuery(GET_CONTATOS);
  const [criarContato] = useMutation(ADD_CONTATO, cacheCreate);
  const [deletarContato] = useMutation(REMOVE_CONTATO);
  const [atualizarContato] = useMutation(UPDATE_CONTATO);

  const [refId, refNome, refEmail, refTelefone] = useMyRef(4);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (refId.current.value) {
      console.log("Update");
      atualizarContato({
        variables: {
          id: parseInt(refId.current.value),
          nome: refNome.current.value,
          email: refEmail.current.value,
          telefone: refTelefone.current.value,
        },
      });

      refId.current.value = "";
    } else {
      criarContato({
        variables: {
          nome: refNome.current.value,
          email: refEmail.current.value,
          telefone: refTelefone.current.value,
        },
      });
    }

    refNome.current.value = "";
    refEmail.current.value = "";
    refTelefone.current.value = "";
  };

  const handleUpdate = (item) => {
    refId.current.value = item.id;
    refNome.current.value = item.nome;
    refEmail.current.value = item.email;
    refTelefone.current.value = item.telefone;
  };

  const contatos = {
    itens: data?.contatos ?? [],
    loading,
    error,
    criarContato,
    deletarContato,
  };

  const form = {
    handleSubmit,
    handleUpdate,
    refId,
    refNome,
    refEmail,
    refTelefone,
  };

  return (
    <MyContext.Provider
      value={{
        contatos,
        form,
      }}
    >
      {children}
    </MyContext.Provider>
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

const useMyRef = (size) => {
  return Array(size)
    .fill(0)
    .map(() => createRef());
};
