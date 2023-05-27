import { createContext, useState } from "react";
import "./App.css";
import Baskets from "./components/baskets/Baskets";

export const Context = createContext(null);

function App() {
  const [data, setData] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [allSorted, setAllSorted] = useState(false);
  const [noResults, setNoResults] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const tags = inputValue
      .trim()
      .split(" ")
      .filter((tag) => tag.trim().length > 0);
    setKeywords(tags);
    const dataAcc = [];
    Promise.all(
      tags.map((tag) => {
        return fetch(
          `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=432038f9a2f76cf4ff57cc1e679c08c6&tags=${tag}&per_page=5&page=1&license=10&format=json&nojsoncallback=1`
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
        if (dataAcc.length) {
          setNoResults(false);
        } else {
          setNoResults(true);
        }
        setData(dataAcc.sort((a, b) => 0.5 - Math.random()));
        setAllSorted(false);
      })
      .catch((err) => console.log(err));
  };

  const handleDragStart = (e, item) => {
    e.target.classList.add("dragged");
    e.dataTransfer.setData("photoId", item.id);
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove("dragged");
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
        onDragEnd={handleDragEnd}
      />
    );
  });
  return (
    <div className="App">
      <header>
        <form onSubmit={handleSearch}>
          <h1>Search photos</h1>
          <div className="search">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button disabled={inputValue.trim().length === 0}>Search</button>
          </div>
        </form>
      </header>
      {allSorted ? (
        <div className="message_container">
          <div className="all_sorted">All photos are sorted!</div>
        </div>
      ) : (
        <></>
      )}
      <div className="photos">
        {photos}
        {noResults && <div>No Results</div>}
      </div>
      <Context.Provider value={{ data, setAllSorted }}>
        <Baskets keywords={keywords} removeSortedItem={removeSortedItem} />
      </Context.Provider>
    </div>
  );
}

export default App;
