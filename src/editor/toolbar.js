import React, { Component } from 'react';
import {
  ListView,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  PixelRatio
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

const commands = {
  BOLD: 'BOLD',
  ITALIC: 'ITALIC',
  UL: 'unordered-list-item',
  OL: 'ordered-list-item',
  IMAGE: 'insert-image'
};

const defaultActions = [
  {
    label: 'Bold',
    command: commands.BOLD,
    icon: require('./img/icon_format_bold.png'),
    inline: true
  },
  {
    label: 'Italic',
    command: commands.ITALIC,
    icon: require('./img/icon_format_italic.png'),
    inline: true
  },
  {
    label: 'UL',
    command: commands.UL,
    icon: require('./img/icon_format_ul.png'),
    block: true
  },
  {
    label: 'OL',
    command: commands.OL,
    icon: require('./img/icon_format_ol.png'),
    block: true
  },
  {
    label: 'IMAGE',
    command: commands.IMAGE,
    icon: require('./img/icon_format_media.png'),
    block: true
  }
];

export default class Toolbar extends Component {
  static defaultProps = {
    selectedIconTint: '#00abea'
  };

  constructor(props) {
    super(props);
    this.state = {
      editor: undefined,
      selectedItems: [],
      ds: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      }).cloneWithRows(this.getRows([]))
    };
  }

  componentDidMount() {
    const editor = this.props.getEditor();
    if (!editor) {
      throw new Error('Toolbar has no editor!');
    } else {
      editor.registerToolbar(selectionState =>
        this.setSelectionState(selectionState)
      );
      this.setState({ editor });
    }
  }

  setSelectionState(selectionState) {
    const { block, style } = selectionState;
    const selectedItems = [block, ...style];
    this.setState({
      selectedItems,
      ds: this.state.ds.cloneWithRows(this.getRows(selectedItems))
    });
  }

  _removeArrayItem(array, item) {
    const index = array.indexOf(item);
    return [...array.slice(0, index), ...array.slice(index + 1)];
  }

  onImagePicker() {
    ImagePicker.openPicker({
      compressImageMaxWidth: 800,
      includeBase64: true
    })
      .then(image => {
        console.log(image);
        this.state.editor.sendAction({
          data: 'data:image/png;base64, ' + image.data,
          type: 'INSERT_IMAGE'
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  onPress(action) {
    switch (action.command) {
      case commands.BOLD:
      case commands.ITALIC:
      case commands.UL:
      case commands.OL:
        this.state.editor.sendAction({
          ...action,
          type: 'DOCUMENT_COMMAND'
        });
        break;
      case commands.IMAGE:
        this.onImagePicker();
        break;
      default:
        break;
    }
  }

  getRows(selectedItems) {
    return defaultActions.map(action => {
      return { active: selectedItems.includes(action.command), ...action };
    });
  }

  renderAction(row) {
    return (
      <TouchableOpacity
        key={row.label}
        style={[
          { height: 50, width: 50, justifyContent: 'center' },
          row.active
            ? styles.defaultSelectedButton
            : styles.defaultUnselectedButton
        ]}
        onPress={() => this.onPress(row)}
      >
        <Image
          source={row.icon}
          style={{
            tintColor: row.active
              ? this.props.selectedIconTint
              : this.props.iconTint
          }}
        />
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={[styles.toolbar, this.props.style]}>
        <ListView
          horizontal
          contentContainerStyle={{ flexDirection: 'row' }}
          dataSource={this.state.ds}
          renderRow={row => this.renderAction(row)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  toolbar: {
    height: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderTopColor: '#e9e9e9',
    borderTopWidth: 1 / PixelRatio.get()
  },
  defaultSelectedButton: {
    backgroundColor: '#e9e9e9'
  },
  defaultUnselectedButton: {
    backgroundColor: '#fff'
  }
});
