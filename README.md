# react-native-assets-loader

react-native-assets-loader

## Installation

```sh
npm install react-native-assets-loader
```

## Usage

react-native

```js
import AssetsSourceLoader from "react-native-assets-loader";

// ...

new AssetsSourceLoader().initLoader()
```

android
```kotlin
 RNAssetsLoader.setRnAssetsFileDir(this.getFilesDir().getPath(),"https://sr.aihuishou.com/opt/apps/pjt-rn-assets/");
```

ios
```objective-c
 NSString *documentsPath = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES).firstObject;
 NSString *rnAssetsDir = [documentsPath stringByAppendingString:@"/AHSReactNative/"];
 [RNAssetsLoaderInit setAssetsFilePath:rnAssetsDir:@"https://sr.aihuishou.com/opt/apps/pjt-rn-assets/"];
```

## License

MIT
