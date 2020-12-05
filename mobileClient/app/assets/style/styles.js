import React from 'react';

import {
  StyleSheet
} from 'react-native';

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
  appTitle: {
    fontSize: 25,
    marginTop: '10%',
    fontWeight: '700',
    textAlign: 'center',
    color: 'black',
  },
  sectionDescription: {
    marginTop: 50,
    fontSize: 18,
    fontWeight: '400',
    color: 'black',
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    fontWeight: '600',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: 20,
    backgroundColor: '#63EBC4',
  },
  about: {
    textAlign: 'center',
    flexGrow: 1,
    width: '100%',
    zIndex: 5,
    flexDirection: 'column',
    justifyContent: 'space-around',
    paddingHorizontal: '5%',
  },
  notes: {
    width: '100%',
    marginTop: '10%',
  },
  cancel: {
    width: 40,
    height: 40,
    alignSelf: 'center',
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
  arrow: {
    width: 35,
    height: 35,
  },
  arrows: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignSelf: 'flex-end',
    position: 'absolute',
    zIndex: 1,
  },
  button: {
    width: '80%',
    height: 100,
    alignSelf: 'center',
    marginVertical: 5,
  },
  buttons: {
    justifyContent: 'space-around',
    flexGrow: 1,
    flexDirection: 'row',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textAlign: 'center',
    marginTop: 5,
  },
  text: {
    fontSize: 14,
    paddingHorizontal: 30,
    marginBottom: 5,
    marginTop: 5,
  }
});
