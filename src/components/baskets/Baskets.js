import React, { useEffect, useState } from "react";
import Basket from "./Basket";
import "./baskets.css";

function Baskets({ keywords, removeSortedItem }) {
  const [baskets, setBaskets] = useState([]);
  const [openedBasketName, setOpenedBasketName] = useState(null);

  useEffect(() => {
    setBaskets(
      keywords.reduce((baskets, keyword) => {
        baskets.push({ name: keyword, items: [] });
        return baskets;
      }, [])
    );
  }, [keywords]);

  const handleOpenBasket = (basketName) => {
    if (openedBasketName === basketName) {
      setOpenedBasketName(null);
    } else {
      setOpenedBasketName(basketName);
    }
  };

  const addBasketItem = (item) => {
    setBaskets(
      baskets.map((basket) => {
        if (basket.name === item.tag) {
          basket.items = [...basket.items, item];
          removeSortedItem(item.id);
        }
        return basket;
      })
    );
  };

  return baskets.length ? (
    <div className="baskets_container">
      <div className="baskets">
        {baskets.map((basket) => (
          <Basket
            key={basket.name}
            isOpen={openedBasketName === basket.name}
            addBasketItem={addBasketItem}
            basket={basket}
            handleOpenBasket={handleOpenBasket}
          />
        ))}
      </div>
      {openedBasketName ? (
        <div className="opened_basket">
          {baskets
            .find((basket) => basket.name === openedBasketName)
            ?.items.map((item) => (
              <img key={item.id} src={item.url} alt={item.title} />
            ))}
          <button onClick={() => setOpenedBasketName(null)}>×</button>
        </div>
      ) : (
        <></>
      )}
    </div>
  ) : (
    <></>
  );
}

export default Baskets;
