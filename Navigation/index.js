import {createAppContainer, createStackNavigator} from 'react-navigation';
import RecordingListingScreen from "../containers/RecordingListingScreen";
import {Colors} from "../Themes";

const MainNavigator = createStackNavigator({
  RecordingListing: {
    screen: RecordingListingScreen
  }
}, {
  initialRouteName: 'RecordingListing', defaultNavigationOptions: {
    title: 'Recording App',
    headerTintColor: Colors.gray,
    headerStyle: {
      backgroundColor: Colors.snow,
    }
  }
});

const App = createAppContainer(MainNavigator);

export default App;
