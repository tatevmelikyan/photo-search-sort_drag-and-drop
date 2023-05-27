import { createContext, useEffect, useRef, useState } from "react";
import "./App.css";
import Baskets from "./components/baskets/Baskets";

export const Context = createContext(null);

function App() {
  const [data, setData] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [allSorted, setAllSorted] = useState(false);

  const firstRenderRef = useRef(true);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
    } else {
      if (!data.length) {
        setAllSorted(true);
      } else {
        setAllSorted(false);
      }
    }
  }, [data]);

  const handleSearch = () => {
    const tags = inputValue.trim().split(" ").filter(tag => tag.trim().length > 0);
    setKeywords(tags);
    const dataAcc = [];
    Promise.all(
      tags.map((tag) => {
        return fetch(
          `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=432038f9a2f76cf4ff57cc1e679c08c6&tags=${tag}&per_page=5&page=1&format=json&nojsoncallback=1`
        );
      })
    )
      .then((fetchResults) =>
        Promise.all(fetchResults.map((fetchResult) => fetchResult.json()))
      )
      .then((dataArr) => {
        dataArr.forEach((dataObj, index) => {
          const photos = dataObj.photos.photo.map((item) => {
            return {
              id: item.id + Math.random(),
              title: item.title,
              url: `https://live.staticflickr.com/${item.server}/${item.id}_${item.secret}_q.jpg`,
              tag: tags[index],
            };
          });
          dataAcc.push(...photos);
        });
        setData(dataAcc.sort((a, b) => 0.5 - Math.random()));
      })
      .catch((err) => console.log(err));
  };

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData("photoId", item.id);
  };

  const removeSortedItem = (sortedItemId) => {
    setData(data.filter((item) => item.id !== sortedItemId));
  };

  const photos = data.map((item) => {
    return (
      <img
        className="photo"
        key={item.id}
        src={item.url}
        alt={item.title}
        onDragStart={(e) => handleDragStart(e, item)}
      />
    );
  });

  return (
    <div className="App">
      <Context.Provider value={data}>
        <header>
          <h1>Search photos</h1>
          <div className="search">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button disabled={inputValue.length === 0} onClick={handleSearch}>
              Search
            </button>
          </div>
        </header>
        {allSorted && (
          <div className="message_container">
            <div className="all_sorted">All photos are sorted!</div>
          </div>
        )}
        {data.length ? <div className="photos">{photos}</div> : <></>}
        <Baskets removeSortedItem={removeSortedItem} keywords={keywords} />
      </Context.Provider>
    </div>
  );
}

export default App;
