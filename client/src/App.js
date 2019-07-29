import React, { Component, useState, useEffect, useRef } from "react";
import rebase from "re-base";
import firebase from "firebase/app";
//import axios from "axios";
// import { Card, CardWrapper } from "react-swipeable-cards";
import database from "firebase/database";
import "./App.css";

//let urlMetadata = require("url-metadata");
const HN_DATABASE_URL = "https://hacker-news.firebaseio.com/";
const HN_VERSION = "v0";

/*firebase.initializeApp({ baseURL: HN_DATABASE_URL + "/" + HN_VERSION });
let db = firebase.database();
let base = rebase.createClass(db);*/
const getNewStories = async url => {
  const req = await fetch(
    HN_DATABASE_URL + "/" + HN_VERSION + "/newstories.json"
  );
  const res = await req.json();
  return res;
};

const getStoryInfo = async storyId => {
  const req = await fetch(
    HN_DATABASE_URL + "/" + HN_VERSION + "/item/" + storyId + ".json"
  );
  const res = await req.json();
  if (res.url) {
    // console.log("res.url at line 29", res.url);
    //const Url = "http://localhost:5000";
    // const params = {
    //   website: res.url
    // };
    res.metadata = await fetch("http://localhost:5000/?website=" + res.url)
      .then(res => res.json())
      .catch(err => console.log(err));
  }

  return res;
};
// Api is a wrapper around base, to include the version child path to the binding automatically.
/*const Api = {
  bindToState: (endpoint, options) => {
    return base.bindToState(`/${HN_VERSION}${endpoint}`, options);
  },
  listenTo: (endpoint, options) => {
    return base.listenTo(`/${HN_VERSION}${endpoint}`, options);
  },
  fetch: (endpoint, options) => {
    return base.fetch(`/${HN_VERSION}${endpoint}`, options);
  }
};*/
const App = () => {
  const [stories, setStories] = useState([]);
  const [activePostIndex, setActivePost] = useState(0);
  const [fetching, setFetching] = useState(false);
  // const inputRef = useRef();

  const onSwipeLeft = () => {
    console.log("I was swiped left.");
    const lastChildIndex = this.state._stories.length - 1;
    let { activePostIndex } = this.state;
    activePostIndex = activePostIndex + 1;

    activePostIndex = Math.min(Math.max(activePostIndex, 0), lastChildIndex);

    if (activePostIndex >= lastChildIndex - 5 && !fetching) {
      this.fetchData();
    }

    setActivePost(activePostIndex);
  };

  const onSwipeRight = () => {
    console.log("I was swiped right.");
    let { activePostIndex } = this.state;
    activePostIndex = activePostIndex - 1;
    activePostIndex = Math.min(
      Math.max(activePostIndex, 0),
      this.state._stories.length - 1
    );

    setActivePost(activePostIndex);
  };

  const fetchData = async () => {
    console.log("fetch called");
    const storyIds = await getNewStories();
    let actions = storyIds.slice(0, 10).map(getStoryInfo);
    let results = await Promise.all(actions);
    let filterResults = results.filter(item => !!item);
    console.log("results", filterResults);
    const filteredUrls = filterResults.map(data => data.url);
    console.log("list of all filtered urls", filteredUrls);
  };

  useEffect(() => {
    this.fetchData();
  }, []);

  console.log("this.activePostIndex", this.state.activePostIndex);
  const activePost = this.state._stories[this.state.activePostIndex];
  const _stories = this.state._stories;
  console.log("this.activePostIndex", this.state.activePostIndex);
  const activePost = this.state._stories[this.state.activePostIndex];
  const _stories = this.state._stories;
  console.log("typeOf activePost", typeof activePost);
  console.log("activePost", activePost);
  console.log("_stories", _stories);

  return (
    <div className="background-gradient">
      <div className="split left" onClick={this.onSwipeRight} />
      <div className="split right" onClick={this.onSwipeLeft} />
      <div className="snap-container">
        {activePost && (
          <div
            className="snap-child"
            onSwipeRight={() => this.onSwipeRight(this)}
            onSwipeLeft={() => this.onSwipeLeft(this)}
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
