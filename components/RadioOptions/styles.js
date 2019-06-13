import {StyleSheet} from 'react-native'
import {ApplicationStyles, Colors, Fonts, Metrics} from "../../Themes";

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  labelContent: {
    fontSize: Fonts.size.regular,
    color: Colors.black
  },
})
