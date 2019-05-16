import React, { Component } from "react";
import rebase from "re-base";
import firebase from "firebase/app";
import database from "firebase/database";
import "./App.css";

const HN_DATABASE_URL = "https://hacker-news.firebaseio.com";
const HN_VERSION = "v0";

firebase.initializeApp({ databaseURL: HN_DATABASE_URL });
let db = firebase.database();
let base = rebase.createClass(db);

// Api is a wrapper around base, to include the version child path to the binding automatically.
const Api = {
  bindToState: (endpoint, options) => {
    return base.bindToState(`/${HN_VERSION}${endpoint}`, options);
  },
  listenTo: (endpoint, options) => {
    return base.listenTo(`/${HN_VERSION}${endpoint}`, options);
  },
  fetch: (endpoint, options) => {
    return base.fetch(`/${HN_VERSION}${endpoint}`, options);
  }
};

class App extends Component {
  constructor(props) {
    console.log("Inside app.js constructor function");
    super(props);
    this.state = {
      _stories: [],
      activePostIndex: 0
    };
  }

  handleNextClick = () => {
    const lastChildIndex = this.state._stories.length - 1;
    let { activePostIndex } = this.state;
    activePostIndex = activePostIndex + 1;

    activePostIndex = Math.min(Math.max(activePostIndex, 0), lastChildIndex);

    if (lastChildIndex - 5 === activePostIndex) {
      // fetch more stories ---> Can we do this.fetchData() here ??
      this.fetchData();
    }

    this.setState({
      activePostIndex
    });
  };

  handlePreviousClick = () => {
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

  fetchData = () => {
    console.log("fetch called");
    Api.fetch(`/newstories`, {
      context: this,
      then(storyIds) {
        console.log(`This is logged storyIds ${storyIds}`);
        this.fetchNewStories(storyIds);
      }
    });
  };

  componentDidMount() {
    console.log("componentDidMount called");
    this.fetchData();
  }

  fetchNewStories = async storyIds => {
    let actions = storyIds.map(this.fetchSingleStory);
    let results = await Promise.all(actions);
    console.log("results", results);
    this.setState({
      _stories: results
      //initialSetOfStories: results
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
  };

  render() {
    console.log("this.activePostIndex", this.state.activePostIndex);
    const activePost = this.state._stories[this.state.activePostIndex];
    return (
      <div className="background-gradient">
        <div className="split left" onClick={this.handlePreviousClick} />
        <div className="split right" onClick={this.handleNextClick} />
        {activePost && (
          <div className="note">
            <a href={activePost.url}>
              <strong>{activePost.title}</strong>
            </a>
            <br />
            <span>{activePost.by}</span>
          </div>
        )}
      </div>
    );
  }
}

export default App;
