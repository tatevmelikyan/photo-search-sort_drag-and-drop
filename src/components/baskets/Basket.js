import { useContext } from "react";
import { Context } from "../../App";

function Basket({ basket, handleOpenBasket, addBasketItem, isOpen }) {
  const { data, setAllSorted } = useContext(Context);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const photoId = e.dataTransfer.getData("photoId");
    const item = data.find((obj) => obj.id === photoId);
    if (item.tag === basket.name) {
      addBasketItem(item);
      if (data.length - 1 === 0) {
        setAllSorted(true);
      }
    }
    e.target.classList.remove("drag_enter");
  };

  const handleDragEnter = (e) => {
    e.target.classList.add("drag_enter");
  };

  const handleDragLeave = (e) => {
    e.target.classList.remove("drag_enter");
  };

  return (
    <div
      className={isOpen ? "basket_name open" : "basket_name"}
      onClick={() => handleOpenBasket(basket.name)}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      {basket.name}
    </div>
  );
}

export default Basket;
