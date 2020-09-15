import { NativeModules, Platform } from 'react-native';
import AssetSourceResolver from 'react-native/Libraries/Image/AssetSourceResolver';

const PixelRatio = require('react-native/Libraries/Utilities/PixelRatio');
import * as assetPathUtils from 'react-native/Libraries/Image/assetPathUtils';
const { AssetsLoader } = NativeModules;

const _ = require('lodash');

const originServer = AssetsLoader.getRemoteAssetsUrlPath();

const assetsFileDir = AssetsLoader.getAssetsFileDir();

export class AssetsSourceLoader {
  initLoader() {
    AssetSourceResolver.prototype.defaultAsset = _.wrap(
      AssetSourceResolver.prototype.defaultAsset,
      function(func, ...args) {
        /**开发调试的时候走的是这个方法*/
        if (this.isLoadedFromServer()) {
          return this.assetServerURL();
        }

        function getAssetPathInDrawableFolder(asset) {
          const scale = AssetSourceResolver.pickScale(
            asset.scales,
            PixelRatio.get(),
          );
          const drawbleFolder = assetPathUtils.getAndroidResourceFolderName(
            asset,
            scale,
          );
          const fileName = assetPathUtils.getAndroidResourceIdentifier(asset);
          return drawbleFolder + '/' + fileName + '.' + asset.type;
        }

        function getScaledAssetPath(asset) {
          const scale = AssetSourceResolver.pickScale(asset.scales, PixelRatio.get());
          const scaleSuffix = scale === 1 ? '' : '@' + scale + 'x';
          const assetDir = assetPathUtils.getBasePath(asset);
          return assetDir + '/' + asset.name + scaleSuffix + '.' + asset.type;
        }

        if (Platform.OS === 'android') {
          const resource = this.resourceIdentifierWithoutScale();
          const drawableFileName = getAssetPathInDrawableFolder(this.asset);
          const drawableExit = AssetsLoader.assetsBundleExits(resource.uri);
          const fileExits = AssetsLoader.assetsFileExist(assetsFileDir + '/' + drawableFileName);
          const file = this.fromSource('file://' + assetsFileDir + '/' + drawableFileName);
          /**Android默认去drawable获取图片，如果没有获取到就会去，file里面找，如果没有找到就去网络下载并且缓存到文件里面*/
          if (drawableExit) {
            console.log(`AssetsSourceLoader:android-drawableExit=${drawableExit}`);
            return resource;
          } else if (fileExits) {
            console.log(`AssetsSourceLoader:fileExits=${fileExits}`);
            console.log(`AssetsSourceLoader:file=${JSON.stringify(file)}`);
            return file;
          } else {
            const url = this.fromSource(
              originServer +
              getScaledAssetPath(this.asset) +
              '?platform=' +
              Platform.OS +
              '&hash=' +
              this.asset.hash,
            );
            console.log(`AssetsSourceLoader:android-server-url${JSON.stringify(url)}`);
            AssetsLoader.cacheAssetsToFile(originServer + getScaledAssetPath(this.asset), drawableFileName);
            return url;
          }
        } else if (Platform.OS === 'ios') {
          /**ios首先去file里面找，如果没有找到就去网络下载并且缓存到文件里面*/
          const assetName = getScaledAssetPath(this.asset).replace(/\.\.\//g, '_');
          const assetPath = assetsFileDir + assetName;
          const assetsFileExist = AssetsLoader.assetsFileExist(assetPath);
          console.log(`AssetsSourceLoader:ios-assetsFileDir=${assetPath}`);
          console.log(`AssetsSourceLoader:ios-assetsFileExist=${assetsFileExist}`);
          if (assetsFileExist) {
            console.log(`AssetsSourceLoader:ios-assetsFileDir=${assetsFileDir}`);
            return this.fromSource('file://' + assetPath);
          } else {
            AssetsLoader.cacheAssetsToFile(
              originServer + getScaledAssetPath(this.asset),
              assetName,
            );
            return this.fromSource(
              originServer +
              getScaledAssetPath(this.asset) +
              '?platform=' +
              Platform.OS +
              '&hash=' +
              this.asset.hash,
            );
          }
        }
      },
    );
  }


}
