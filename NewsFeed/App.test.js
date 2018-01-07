import React from 'react';
import App from './App';
import renderer from 'react-test-renderer';

import { shallow, mount, render , configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });


describe('Render NewsFeed', function() {
  it('renders without crashing', () => {
    const tree = renderer.create(
      <App />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // These serve as integration tests for the jest-react-native preset.
  it('renders the ActivityIndicator component', () => {
    const ActivityIndicator = require('ActivityIndicator');
    const tree = renderer
      .create(<ActivityIndicator animating={true} size="small" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders the Image component', done => {
    const Image = require('Image');
    Image.getSize('btn_close_32.png', (width, height) => {
      const tree = renderer.create(<Image style={{height, width}} />).toJSON();
      expect(tree).toMatchSnapshot();
      done();
    });
  });

  it('renders the ListView component', () => {
    const ListView = require('ListView');
    const Text = require('Text');
    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    }).cloneWithRows(['apple', 'banana', 'kiwi']);
    const tree = renderer
      .create(
        <ListView
          dataSource={dataSource}
          renderRow={rowData => <Text>{rowData}</Text>}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
