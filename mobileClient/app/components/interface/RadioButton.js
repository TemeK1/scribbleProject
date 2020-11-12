import React from 'react';

import {
  View,
} from 'react-native';

export function RadioButton(props) {
return (
    <View style={[{
      height: 24,
      width: 24,
      borderRadius: 0,
      borderWidth: 2,
      borderColor: 'black',
      backgroundColor: '#' + props.color,
      alignItems: 'center',
      justifyContent: 'center',
    }, props.style]}>
      {
        props.selected ?
          <View style={{
            height: 28,
            width: 28,
            borderWidth: 4,
            borderColor: 'black',
            backgroundColor: '#' + props.color,
          }}/>
          : null
      }
    </View>
);
}
