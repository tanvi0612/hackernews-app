import React, { Component } from "react";
import rebase from "re-base";
import firebase from "firebase/app";
import database from "firebase/database";
import Stories from "./Stories";
import "./App.css";
import { Url } from "url";

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
      newStories: [],
      numberOfPosts: "",
      initialSetOfStories: [],
      activePostIndex: 0
    };
  }

  /*initialState = firstFetch => {
    const initialSetOfStories = firstFetch;
    console.log("Reached inside initialState", initialSetOfStories);
    this.setState({ initialSetOfStories: initialSetOfStories });
  };*/

  handleChange = event => {
    if (event.target.value < 30) {
      this.setState({
        numberOfPosts: event.target.value,
        activePostIndex: event.target.value
      });
      console.log("activePost", this.state.activePostIndex);
    } else {
      alert("You must supply a value less than 30");
    }
  };

  handleClick = () => {
    console.log("State number of posts", this.state.numberOfPosts);
    const newStories = this.state.newStories[this.state.activePostIndex];
    this.setState({ newStories: [newStories] });
    console.log(
      "activePostIndex inside handleClick",
      this.state.activePostIndex
    );
  };

  handleNextClick = () => {
    console.log("Inside handleNextCLick", this.state.numberOfPosts);
    console.log("handleNextClick", this.state.newStories);
    console.log("initialSetOfStories", this.state.initialSetOfStories);
    console.log("activePostIndex", this.state.activePostIndex);
    let index = this.state.activePostIndex;
    const newStories = this.state.initialSetOfStories[++index];
    console.log("newStories in handleNextClick", newStories);
    this.setState({
      newStories: [newStories],
      numberOfPosts: index,
      activePostIndex: index
    });
  };

  handlePreviousClick = () => {
    console.log("Inside handlePreviousCLick", this.state.numberOfPosts);
    console.log("handlePreviousClick", this.state.newStories);
    console.log("initialSetOfStories", this.state.initialSetOfStories);
    let index = this.state.numberOfPosts;
    const newStories = this.state.initialSetOfStories[--index];
    console.log("newStories in handleNextClick", newStories);
    this.setState({
      newStories: [newStories],
      numberOfPosts: index,
      activePostIndex: index
    });
  };

  componentDidMount() {
    Api.fetch(`/newstories`, {
      context: this,
      then(storyIds) {
        console.log(`This is logged storyIds ${storyIds}`);
        this.fetchNewStories(storyIds);
      }
    });
  }

  fetchNewStories = async storyIds => {
    let actions = storyIds.slice(0, 30).map(this.fetchSingleStory);
    let results = await Promise.all(actions);
    console.log("results", results);
    //this.initialState(results);
    this.setState({
      newStories: results,
      initialSetOfStories: results
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
    console.log("Render function", this.state.newStories);
    const activePostIndex = this.state.activePostIndex;
    const activePost = this.state.initialSetOfStories[activePostIndex];
    //const url = activePost.url;
    console.log("ACTIVE", activePost);
    console.log(typeof activePost);
    // console.log("active.url", url);
    return (
      <div>
        {/*<React.Fragment>
          {this.state.newStories.map(data => (
            <li key={data.id}>
              <div>
                <a href={data.url}>{data.title}</a>
                <br />
                <span>{data.by}</span>
              </div>
            </li>
          ))}
          </React.Fragment>*/}

        <React.Fragment>{JSON.stringify(activePost)}</React.Fragment>
        <input
          type="number"
          name="numberOfPosts"
          value={this.state.numberOfPosts}
          onChange={this.handleChange}
        />
        <button type="submit" onClick={this.handleClick}>
          Submit
        </button>
        <button type="submit" onClick={this.handleNextClick}>
          Next Story
        </button>
        <button type="submit" onClick={this.handlePreviousClick}>
          Previous Story
        </button>

        {/*<Stories
          stories={JSON.stringify(this.state.newStories, null, 2)}
          defaultInterval={1500}
          width={432}
          height={768}
        />*/}
      </div>
    );
  }
}

export default App;
