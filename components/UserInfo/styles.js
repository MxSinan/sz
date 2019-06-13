import {StyleSheet} from 'react-native'
import {ApplicationStyles, Colors, Metrics} from "../../Themes";

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  textInput: {
    height: 50,
    borderWidth: 1,
    marginVertical: Metrics.doubleSection,
    marginHorizontal: Metrics.marginFifteen,
    borderColor: Colors.gray
  }
})
