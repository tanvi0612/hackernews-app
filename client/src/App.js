import React, { useState, useEffect, useRef } from "react";
import rebase from "re-base";
import firebase from "firebase/app";
import database from "firebase/database";
import "./App.css";
const axios = require("axios");

const HN_DATABASE_URL = "https://hacker-news.firebaseio.com/";
const HN_VERSION = "v0";

const getNewStories = async pageNo => {
  const req = await fetch(
    HN_DATABASE_URL + "/" + HN_VERSION + "/newstories.json"
  );
  const res = await req.json();
  return res;
  // const req = await axios
  //   .get(
  //     "https://api.hnpwa.com/v0/newest/6.json"
  //     // "https://hacker-news.firebaseio.com/v0/newstories.json"
  //   )
  //   .then(json => {
  //     console.log(json.data);
  //   })
  //   .catch(function(error) {
  //     // handle error
  //     console.log(error);
  //   });
  // const res = await req.json();
  // console.log("req at line 27", req);
  // return res;
};

const getStoryInfo = async storyId => {
  const req = await fetch(
    HN_DATABASE_URL + "/" + HN_VERSION + "/item/" + storyId + ".json"
  );
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
    // setActivePostIndex(activePostIndex + 1);
    // console.log("setActivePostIndex in line 35", activePostIndex);
    setActivePostIndex(Math.min(Math.max(activePostIndex, 0), lastChildIndex));
    if (activePostIndex >= lastChildIndex - 5 && !fetching) {
      fetchData();
    }
    setActivePostIndex(activePostIndex + 1);
    console.log("setActivePostIndex in line 41", activePostIndex);
  };

  const onSwipeRight = () => {
    console.log("I was swiped right.");
    //  setActivePostIndex(activePostIndex - 1);
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
    const storyIds = await getNewStories();
    console.log("storyIds", storyIds);
    let actions = storyIds.slice(0, 10).map(getStoryInfo);
    let results = await Promise.all(actions);
    let filterResults = results.filter(item => !!item);
    console.log("results", filterResults);
    setStories(filterResults);
    // const filteredUrls = filterResults.map(data => data.url);
    // console.log("list of all filtered urls", filteredUrls);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // console.log("this.activePostIndex", this.state.activePostIndex);
  const activePost = stories[activePostIndex];
  // const stories = this.state._stories;
  // console.log("this.activePostIndex", this.state.activePostIndex);
  // const stories = this.state._stories;
  console.log("typeOf activePost", typeof activePost);
  console.log("activePost", activePost);
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
            onSwipeRight={() => onSwipeRight(this)}
            onSwipeLeft={() => onSwipeLeft(this)}
          >
            <a href={activePost.url}>
              <strong>{activePost.title}</strong>
            </a>
            {/* {activePost.metadata.results.data.ogImage && (
                <span>{activePost.metadata.results.data.ogImage.url}</span>
                )} */}

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
