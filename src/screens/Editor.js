import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import DraftEditor from '../editor';
import DraftEditorToolbar from '../editor/toolbar';
import KeyboardSpacer from 'react-native-keyboard-spacer';

export default class RichTextExample extends Component {
  render() {
    return (
      <View style={styles.container}>
        <DraftEditor ref={r => (this.richtext = r)} style={styles.richText} />
        <DraftEditorToolbar getEditor={() => this.richtext} />
        {Platform.OS === 'ios' && <KeyboardSpacer />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#ffffff'
  },
  richText: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  }
});
