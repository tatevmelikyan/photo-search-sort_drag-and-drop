import { useContext } from "react";
import { Context } from "../../App";

function Basket({ basket, handleOpenBasket, isOpen }) {
  const data = useContext(Context);

  return (
    <div
      className={isOpen ? "basket_name open" : "basket_name"}
      onClick={() => handleOpenBasket(basket.name)}
    >
      {basket.name}
    </div>
  );
}

export default Basket;
