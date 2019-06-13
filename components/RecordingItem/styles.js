import {StyleSheet} from 'react-native'
import {ApplicationStyles, Metrics, Colors, Fonts} from "../../Themes/index";

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  itemContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: Metrics.smallMargin
  },
  borderBottom: {
    ...ApplicationStyles.borderBottom,
    width: '100%'
  },
  bottomLine: {
    borderBottomColor: Colors.silver,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  itemContent: {
    width: Metrics.screenWidth,
    flexDirection: 'row',
    backgroundColor: Colors.silver,
    padding: Metrics.baseMargin,
    justifyContent: 'space-evenly'
  },
  chatIcon: {
    color: Colors.gray,
    fontSize: Fonts.size.h4
  },
  infoContainer: {
    flex: 1,
    paddingRight: Metrics.section
  },
  itemText: {
    color: Colors.black,
    fontSize: Fonts.size.regular,
    fontFamily: Fonts.type.regular
  },
  subText: {
    color: Colors.gray,
    fontSize: Fonts.size.medium,
    fontFamily: Fonts.type.regular
  }
})
