import React from 'react';
import { Text, ScrollView, Button } from 'react-native';

class Home extends React.Component {
  static navigationOptions = {
    title: 'Home'
  };

  onNavigate(page) {
    this.props.navigation.navigate(page);
  }

  render() {
    return (
      <ScrollView>
        <Button
          title="Draft Editor"
          onPress={() => this.onNavigate('DraftEditor')}
        />

        <Button
          title="Test Focus"
          onPress={() => this.onNavigate('TestFocus')}
        />
      </ScrollView>
    );
  }
}

export default Home;
