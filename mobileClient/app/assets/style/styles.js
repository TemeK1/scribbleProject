import React from 'react';

import {
  StyleSheet,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

export const styles = StyleSheet.create({
  body: {
    backgroundColor: "#F9FAE3",
  },
  fullscreen: {
    flexGrow: 1,
    backgroundColor: "#F9FAE3",
    alignItems: 'center',
  },
  sectioncontainer: {
    marginTop: '5%',
    paddingHorizontal: 0,
    flexDirection: 'row',
  },
  scroll: {
    width: '100%',
  },
  sectioncontainer2: {
  },
  appTitle: {
    fontSize: 35,
    marginTop: '10%',
    fontWeight: '700',
    textAlign: 'center',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 50,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontWeight: '600',
    padding: 20,
    alignItems: 'center',
  },
  flex: {
    flexGrow: 1,
    flexDirection: 'row',
    marginTop: 1,
  },
  viewNote: {
    width: '100%',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  cancel: {
    width: 40,
    height: 40,
  },
  edit: {
    width: 50,
    height: 50,
    marginTop: '-2%',
  },
  remove: {
    width: 40,
    height: 40,
  },
  add: {
    width: 70,
    height: 70,
  },
  logo: {
    width: 80,
    height: 80,
  },
  sync: {
    width: 70,
    height: 70,
  },
  arrows: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignSelf: 'flex-end',
    position: 'absolute',
    zIndex: 1,
  },
  arrow: {
    width: 40,
    height: 40,
  },
  button: {
    width: '80%',
    height: 100,
    alignSelf: 'center',
    marginVertical: 5,
  },
  swipeContentContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderColor: '#e3e3e3',
    borderWidth: 1,
  }
});
