import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform,
  Dimensions,
  TouchableOpacity,
  Keyboard
} from 'react-native';
import WebViewBridge from 'react-native-webview-bridge-updated';

const PlatformIOS = Platform.OS === 'ios';

const injectScript = `
  (function () {
    window.ENV_RN = true;
    if (WebViewBridge) {
      WebViewBridge.onMessage = window.onWebViewBridgeMessage;
    }
  }());
`;

class DraftEditor extends Component {
  static defaultProps = {
    contentInset: {},
    style: {}
  };

  constructor(props) {
    super(props);
    this.state = {
      keyboardHeight: 0,
      selectionChangeListeners: []
    };
  }

  componentWillMount() {
    if (PlatformIOS) {
      this.keyboardEventListeners = [
        Keyboard.addListener('keyboardWillShow', this.onKeyboardWillShow),
        Keyboard.addListener('keyboardWillHide', this.onKeyboardWillHide)
      ];
    } else {
      this.keyboardEventListeners = [
        Keyboard.addListener('keyboardDidShow', this.onKeyboardWillShow),
        Keyboard.addListener('keyboardDidHide', this.onKeyboardWillHide)
      ];
    }
  }

  componentWillUnmount() {
    this.keyboardEventListeners.forEach(eventListener =>
      eventListener.remove()
    );
  }

  onKeyboardWillShow = event => {
    console.log('!!!!', event);
    const newKeyboardHeight = event.endCoordinates.height;
    if (this.state.keyboardHeight === newKeyboardHeight) {
      return;
    }
    if (newKeyboardHeight) {
      this.setEditorAvailableHeightBasedOnKeyboardHeight(newKeyboardHeight);
    }
    this.setState({ keyboardHeight: newKeyboardHeight });
  };

  onKeyboardWillHide = event => {
    this.setState({ keyboardHeight: 0 });
  };

  onEditorInitialized() {
    if (this.props.onEditorInitialized) {
      this.props.onEditorInitialized();
    }
  }

  onMessage(message) {
    const data = JSON.parse(message);
    // 设置工具栏状态
    if (data.type === 'SET_TOOLBAR_STATE') {
      this.state.selectionChangeListeners.forEach(listener => {
        listener(data);
      });
    } else if (data.type === 'SYNC_SCROLL_POSITION') {
      if (this.webviewBridge.setNativeProps) {
        this.webviewBridge.setNativeProps({
          contentOffset: { y: data.position }
        });
      }
    }
    console.log(data);
  }

  registerToolbar(listener) {
    this.setState({
      selectionChangeListeners: [
        ...this.state.selectionChangeListeners,
        listener
      ]
    });
  }

  sendAction(action) {
    this.webviewBridge.sendToBridge(JSON.stringify(action));
  }

  setEditorAvailableHeightBasedOnKeyboardHeight(keyboardHeight) {
    const { top = 0, bottom = 0 } = this.props.contentInset;
    const { marginTop = 0, marginBottom = 0 } = this.props.style;
    const spacing = marginTop + marginBottom + top + bottom + 50;

    const editorAvailableHeight =
      Dimensions.get('window').height - keyboardHeight - spacing;
    console.log('editorAvailableHeight', editorAvailableHeight);
    this.sendAction({
      type: 'SET_EDITOR_HEIGHT',
      editorHeight: editorAvailableHeight
    });
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
  <link href="main.css" rel="stylesheet">
</head>
<body>
  <div id="main">
  </div>
  <script type="text/javascript" src="main.js"></script>
</body>
</html>
    `;
    return (
      <View style={{ flex: 1 }}>
        <WebViewBridge
          javaScriptEnabled={true}
          keyboardDisplayRequiresUserAction={false}
          injectedJavaScript={injectScript}
          onBridgeMessage={message => this.onMessage(message)}
          ref={r => (this.webviewBridge = r)}
          source={{
            html,
            baseUrl: 'web/'
          }}
        />
      </View>
    );
  }
}

export default DraftEditor;
