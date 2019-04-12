import React, { Component } from 'react';
import rebase from 're-base';
import firebase from 'firebase/app';
import database from 'firebase/database';

const HN_DATABASE_URL = "https://hacker-news.firebaseio.com";
const HN_VERSION = "v0";

firebase.initializeApp({ databaseURL: HN_DATABASE_URL });
let db = firebase.database();
let base = rebase.createClass(db);

// Api is a wrapper around base, to include the version child path to the binding automatically.
const Api = {
  bindToState(endpoint, options) {
    return base.bindToState(`/${HN_VERSION}${endpoint}`, options);
  },
  listenTo(endpoint, options) {
    return base.listenTo(`/${HN_VERSION}${endpoint}`, options);
  },
  fetch(endpoint, options) {
  return base.fetch(`/${HN_VERSION}${endpoint}`, options);
  }
};


function fetchSingleStory(id, index) {
  const rank = index + 1;
  return new Promise(resolve => {
    Api.fetch(`/item/${id}`, {
      then(data) {
        let item = data;
        // add the rank since it does not exist yet
        item.rank = rank;
        resolve(item);
      }
    });
  });
}


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      newStories: [],
      //isLoading: false,
    }
  }


  fetchNewStories(storyIds) {
    let actions = storyIds.slice(0, 30).map(fetchSingleStory);
    let results = Promise.all(actions);
    results.then(data =>
      this.setState(
        Object.assign({}, this.state, {
          newStories: data
        })
      )
    );
  }

  componentDidMount(){
    Api.fetch(`/newstories`, {
      context: this,
      then(storyIds) {
        this.fetchNewStories(storyIds);
      }
    });
  }
    /*fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => res.json())
      .then(json => {
        this.setState({
          isLoaded: true,
          items: json,
        })
      });
  }*/

  render() {

    var { isLoaded, items } = this.state;
    console.log(items);
    /*if(!isLoaded) {
      return <div>Loading...</div>
    }
    else {*/
      return (
        <div className="App">

          Data is being loaded.
          items={this.state.newStories}
        </div>
      );


  }
}

export default App;
