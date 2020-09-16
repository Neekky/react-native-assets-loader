import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import AssetsSourceLoader from 'react-native-assets-loader';

new AssetsSourceLoader().initLoader();
export default function App() {

  React.useEffect(() => {
  }, []);

  return (
    <View style={styles.container}>
      <Text>Resul1Resul1111111tResul1111111tResul1111111tResul1111111tResul1111111tResul1111111tResul1111111tResul1111111tResul1111111tResul1111111t111111t</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
