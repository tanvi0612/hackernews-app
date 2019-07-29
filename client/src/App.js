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
  const [_stories, setStories] = useState([]);
  const [activePostIndex] = useState(0);
  const [fetching, setFetching] = useState(false);
  const inputRef = useRef();
};
// class App extends Component {
  // constructor() {
  //   console.log("Inside app.js constructor function");
  //   super();
  //   this.state = {
  //     _stories: [],
  //     activePostIndex: 0
  //   };
  // }

  onSwipeLeft = () => {
    console.log("I was swiped left.");
    const lastChildIndex = this.state._stories.length - 1;
    let { activePostIndex } = this.state;
    activePostIndex = activePostIndex + 1;

    activePostIndex = Math.min(Math.max(activePostIndex, 0), lastChildIndex);

    if (lastChildIndex - 5 === activePostIndex) {
      this.fetchData();
    }

    this.setState({
      activePostIndex
    });
  };

  onSwipeRight = () => {
    console.log("I was swiped right.");
    let { activePostIndex } = this.state;
    activePostIndex = activePostIndex - 1;
    activePostIndex = Math.min(
      Math.max(activePostIndex, 0),
      this.state._stories.length - 1
    );

    this.setState({
      activePostIndex
    });
  };

  fetchData = async () => {
    console.log("fetch called");
    const storyIds = await getNewStories();
    let actions = storyIds.slice(0, 10).map(getStoryInfo);
    let results = await Promise.all(actions);
    let filterResults = results.filter(item => !!item);
    console.log("results", filterResults);
    const filteredUrls = filterResults.map(data => data.url);
    console.log("list of all filtered urls", filteredUrls);

    this.setState({
      _stories: filterResults
    });
    // const rank = index + 1;
    // return await new Promise(resolve => {
    //   Api.fetch(`/item/${id}`, {
    //     then(data) {
    //       let item = data;
    //       // add the rank since it does not exist yet
    //       item.rank = rank;
    //       resolve(item);
    //     }
    //   });
  };
  /*Api.fetch(
      `/newstories`,
      {
        context: this,
        then(storyIds) {
          console.log(`This is logged storyIds ${storyIds}`);
          this.fetchNewStories(storyIds);
        }
      },
      { mode: "cors" }
    );*/
  //};

  // componentDidMount() {
    useEffect( () =>{
    console.log("componentDidMount called");
    this.fetchData();})
    // }

  /*fetchNewStories = async storyIds => {
    let actions = storyIds.slice(0, 10).map(this.fetchSingleStory);
    let results = await Promise.all(actions);
    console.log("results", results);
    this.setState({
      _stories: results
    });
  };

  fetchSingleStory = async (id, index) => {
    const rank = index + 1;
    return await new Promise(resolve => {
      Api.fetch(`/item/${id}`, {
        then(data) {
          let item = data;
          // add the rank since it does not exist yet
          item.rank = rank;
          resolve(item);
        }
      });
    });
  };*/

  // render() {
  //   console.log("this.activePostIndex", this.state.activePostIndex);
  //   const activePost = this.state._stories[this.state.activePostIndex];
  //   const _stories = this.state._stories;
  //   console.log("typeOf activePost", typeof activePost);
  //   console.log("activePost", activePost);
  //   console.log("_stories", _stories);
    //metadata processing
    /*if (activePost) {
      console.log("url extracted", activePost.url);
      urlMetadata(activePost.url).then(function(metadata) {
        console.log(metadata);
      });
    }*/
    return (
    console.log("this.activePostIndex", this.state.activePostIndex);
  const activePost = this.state._stories[this.state.activePostIndex];
  const _stories = this.state._stories;
  console.log("typeOf activePost", typeof activePost);
  console.log("activePost", activePost);
  console.log("_stories", _stories);
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
        {/*{_stories.map(story => (
            <Card
              onSwipeRight={this.onSwipeRight}
              onSwipeLeft={this.onSwipeLeft}
              style={{ transform: "none" }}
              key={story.rank}
            >
              <a href={story.url}>
                <strong>{story.title}</strong>
              </a>
              <br />
              <hr />
              <span>-{story.by}</span>
            </Card>
          ))}
        </CardWrapper>
        {activePost && (
          <div>
            <div className="note">
              <a href={activePost.url}>
                <strong>{activePost.title}</strong>
              </a>

              <br />
              <hr />
              <span>-{activePost.by}</span>
            </div>
          </div>
        )}*/}
      </div>
    );
  // }
// }

export default App;
