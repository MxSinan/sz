import {StyleSheet} from 'react-native'
import {ApplicationStyles, Colors, Fonts, Metrics} from "../../Themes/index";

const roundContainer = {
  borderRadius: 35,
  alignItems: 'center',
  position: 'absolute',
  justifyContent: 'center',
  backgroundColor: Colors.blue,
}

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.blue
  },
  addContainer: {
    ...roundContainer,
    width: 70,
    right: 20,
    bottom: 25,
    height: 70,
  },
  userContainer: {
    ...roundContainer,
    width: 70,
    left: 20,
    bottom: 25,
    height: 70
  },
  icon: {
    fontSize: 35,
    color: Colors.snow
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25
  },
  heading: {
    color: Colors.black,
    padding: Metrics.baseMargin,
    fontSize: Fonts.size.h6,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderColor: Colors.gray
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: Metrics.smallMargin,
    borderTopWidth: 1,
    borderColor: Colors.gray
  },
  btn: {
    marginTop: Metrics.section,
    borderWidth: 0,
  },
  cancelText: {
    color: Colors.blue,
    fontSize: Fonts.size.regular,
    marginRight: Metrics.marginFifteen
  },
  okText: {
    color: Colors.gray,
    fontSize: Fonts.size.regular
  }
})
