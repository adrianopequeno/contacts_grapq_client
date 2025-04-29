import { useContatosContext } from "../../context/ContatosContext";
import Item from "../Item";

const ContainerContatos = ({ children }) => {
  return <div className="contatos">{children}</div>;
};

function Contatos() {
  const { contatos } = useContatosContext();

  if (contatos.loading)
    return <ContainerContatos>Carregando...</ContainerContatos>;

  return (
    <ContainerContatos>
      {contatos.itens.map((item, index) => (
        <Item key={index} item={item} />
      ))}
    </ContainerContatos>
  );
}

export default Contatos;
