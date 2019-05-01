import React, { Component } from 'react'
import Container from './components/Container'
import PropTypes from 'prop-types'

export default class Stories extends Component {



  componentDidMount() {
    console.log(`Inside Stories.js componentDidMount func and trying to log this.props.stories ${this.props.stories}`);
    this.props.stories.map(s => {
      let i = new Image()
      if (!(typeof s === 'object' && s.type === 'video')) {
        i.src = typeof s === 'object' ? s.url : s
      }
    });
  }

  render() {
    return (
      <div>
        {console.log("Inside Stories.js render")}
        <Container
          stories={JSON.stringify(this.props.stories, null, 2)}
          defaultInterval={this.props.defaultInterval}
          width={this.props.width}
          height={this.props.height}
          loader={this.props.loader}
          header={this.props.header}
          storyContentStyles={this.props.storyStyles}
        />
      </div>
    )
  }
}

Stories.propTypes = {
  stories: PropTypes.array,
  defaultInterval: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  loader: PropTypes.element,
  header: PropTypes.element,
  storyStyles: PropTypes.object
}
