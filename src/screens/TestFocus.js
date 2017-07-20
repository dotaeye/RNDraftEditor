import React from 'react';
import { Text, ScrollView, Button, View } from 'react-native';

import WebViewBridge from 'react-native-webview-bridge-updated';

class TestFocus extends React.Component {
  static navigationOptions = {
    title: 'TestFocus'
  };

  onNavigate(page) {
    this.props.navigation.navigate(page);
  }

  render() {
    const html = `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0,maximum-scale=1.0, user-scalable=no">
  <meta name="format-detection" content="telephone=no">
  <title>
    Draft-js
  </title>
</head>
<body>
  <div id="main" contenteditable="true" >
  </div>
</body>
</html>
    `;
    return (
      <View style={{ flex: 1 }}>
        <WebViewBridge
          javaScriptEnabled={true}
          keyboardDisplayRequiresUserAction={false}
          ref={r => (this.webviewBridge = r)}
          source={{
            html
          }}
        />
      </View>
    );
  }
}

export default TestFocus;
