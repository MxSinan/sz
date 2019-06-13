import {Platform} from 'react-native'

const type = {
  regular: Platform.OS === 'ios' ? 'HelveticaNeue' : 'HelveticaNeue-Regular',
  bold: 'HelveticaNeue-Bold',
  emphasis: 'HelveticaNeue-Italic'
}

const size = {
  h1: 36,
  h2: 32,
  h3: 28,
  h4: 22,
  h5: 20,
  h6: 18,
  h7: 20,
  regular: 16,
  medium: 14,
  small: 12,
  tiny: 6.5
}

const style = {
  h1: {
    fontFamily: type.base,
    fontSize: size.h1
  },
  h2: {
    fontWeight: 'bold',
    fontSize: size.h2
  },
  h3: {
    fontFamily: type.emphasis,
    fontSize: size.h3
  },
  h4: {
    fontFamily: type.base,
    fontSize: size.h4
  },
  h5: {
    fontFamily: type.base,
    fontSize: size.h5
  },
  h6: {
    fontFamily: type.emphasis,
    fontSize: size.h6
  },
  normal: {
    fontFamily: type.base,
    fontSize: size.regular
  },
  description: {
    fontFamily: type.base,
    fontSize: size.medium
  }
}

export default {
  type,
  size,
  style
}
