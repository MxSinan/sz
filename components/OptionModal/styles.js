import {StyleSheet} from 'react-native'
import {ApplicationStyles, Colors, Fonts, Metrics} from "../../Themes";

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  scroll: {},
  contentContainer: {
    width: 0.85 * Metrics.screenWidth,
    height: 0.5 * Metrics.screenHeight,
    backgroundColor: Colors.snow,
    marginTop: 0.25 * Metrics.screenHeight,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: Colors.gray,
    padding: Metrics.baseMargin,
    paddingBottom: 0
  }
})
