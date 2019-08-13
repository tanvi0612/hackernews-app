import React, { useState, useEffect } from "react";
import "./App.css";

let pageNumber = 1;

const getNewStories = async () => {
  const req = await fetch(`https://api.hnpwa.com/v0/news/${pageNumber}.json`);
  pageNumber++;
  const res = await req.json();
  return res;
};

const App = () => {
  const [stories, setStories] = useState([]);
  const [activePostIndex, setActivePostIndex] = useState(0);
  const [fetching, setFetching] = useState(false);

  const onSwipeLeft = () => {
    console.log("I was swiped left.");
    const lastChildIndex = stories.length - 1;

    setActivePostIndex(Math.min(Math.max(activePostIndex, 0), lastChildIndex));
    if (activePostIndex >= lastChildIndex - 5 && !fetching) {
      fetchData();
    }
    setActivePostIndex(activePostIndex + 1);
    console.log("setActivePostIndex in line 41", activePostIndex);
  };

  const onSwipeRight = () => {
    console.log("I was swiped right.");
    if (activePostIndex < 0) {
      return;
    }
    setActivePostIndex(
      Math.min(Math.max(activePostIndex, 0), stories.length - 1)
    );
    setActivePostIndex(activePostIndex - 1);
  };

  const fetchData = async () => {
    console.log("fetch called");
    setFetching(true);
    const stories = await getNewStories(pageNumber);
    setStories(previousStories => [...previousStories, ...stories]);
    console.log("stories: ", stories);
    setFetching(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const activePost = stories[activePostIndex];

  const fetchFunc = async () => {
    if (!activePost) {
      return;
    }
    let fetchRes = await fetch(
      `http://localhost:5000/?website=${activePost.url}`
    );
    let res = await fetchRes.json();
    let img = res.results.data.ogImage.url;
    console.log("fetch res", res.results.data.ogImage.url);
    console.log("img", img);
    return img;
  };

  let showImageUrl = fetchFunc();
  // console.log("typeof fetchFunc", fetchFunc);

  console.log("typeOf activePost", typeof activePost);
  console.log("activePost", activePost);
  //console.log("fetchRes", fetchRes);
  console.log("stories", stories);
  console.log("activePostIndex", activePostIndex);

  if (fetching) {
    return <p>Loading...</p>;
  }

  return (
    <div className="background-gradient">
      <div className="split left" onClick={onSwipeRight} />
      <div className="split right" onClick={onSwipeLeft} />
      <div className="snap-container">
        {activePost && (
          <div
            className="snap-child"
            // onSwipeRight="onSwipeRight()"
            // onSwipeLeft="onSwipeLeft()"
          >
            <a href={activePost.url}>
              <strong>{activePost.title}</strong>
            </a>
            {/* <img src={showImageUrl} alt="Alt text" /> */}
            <br />
            <hr />
            <span>-{activePost.by}</span>
          </div>
        )}
      </div>
    </div>
  );
};
export default App;
