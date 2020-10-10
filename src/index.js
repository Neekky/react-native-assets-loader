import { NativeModules, Platform } from 'react-native';
import AssetSourceResolver from 'react-native/Libraries/Image/AssetSourceResolver';

const PixelRatio = require('react-native/Libraries/Utilities/PixelRatio');
import * as assetPathUtils from 'react-native/Libraries/Image/assetPathUtils';

const { AssetsLoader } = NativeModules;

const _ = require('lodash');

const originServer = AssetsLoader.getRemoteAssetsUrlPath();

const assetsFileDir = AssetsLoader.getAssetsFileDir();

const LRU = require('lru-cache'), options = {
  max: 500,
  length: function(n, key) {
    return n * 2 + key.length;
  },
  maxAge: 1000 * 60 * 60 * 24,
}, cache = new LRU(options);

export default class AssetsSourceLoader {


  initLoader(debugMode = false) {
    AssetSourceResolver.prototype.defaultAsset = _.wrap(
      AssetSourceResolver.prototype.defaultAsset,
      function(func, ...args) {
        /**开发调试的时候走的是这个方法*/
        if (this.isLoadedFromServer() && !debugMode) {
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
          const drawableFileName = getAssetPathInDrawableFolder(this.asset);
          const cacheExitEnum = cache.get(drawableFileName);
          /***
           * 先判断cache里面是否保存了Assets的资源存在情况
           * 1--> drawable
           * 10->file
           * 如果cache存在就直接读取对应的资源，如果不存在就去Native获取bridge读取存在情况
           * 如果都不存在的话就去读取网络的资源 并且缓存到文件中
           */
          console.log(`AssetsSourceLoader=${drawableFileName}=cacheExitEnum1==${cache.get(drawableFileName)}`);
          if (cacheExitEnum) {
            if (cacheExitEnum === 1) {
              return this.resourceIdentifierWithoutScale();
            } else if (cacheExitEnum === 10) {
              return this.fromSource('file://' + assetsFileDir + '/' + drawableFileName);
            }
          } else {
            const resource = this.resourceIdentifierWithoutScale();
            const drawableExit = AssetsLoader.assetsBundleExits(resource.uri);
            if (drawableExit) {
              cache.set(drawableFileName, 1);
              return resource;
            }
            const fileExits = AssetsLoader.assetsFileExist(assetsFileDir + '/' + drawableFileName);
            if (fileExits) {
              cache.set(drawableFileName, 10);
              console.log(`AssetsSourceLoader=${drawableFileName}=cacheExitEnum2==${cache.has(drawableFileName)}`);
              console.log(`AssetsSourceLoader=${drawableFileName}=cacheExitEnum2==${cache.get(drawableFileName)}`);
              return this.fromSource('file://' + assetsFileDir + '/' + drawableFileName);
            }
            const url = this.fromSource(
              originServer +
              getScaledAssetPath(this.asset) +
              '?platform=' +
              Platform.OS +
              '&hash=' +
              this.asset.hash,
            );
            AssetsLoader.cacheAssetsToFile(originServer + getScaledAssetPath(this.asset), drawableFileName);
            return url;
          }
        } else if (Platform.OS === 'ios') {
          /***
           * 先判断cache里面是否保存了Assets的资源存在情况
           * 10->file
           * 如果cache存在就直接读取对应的资源，如果不存在就去Native获取bridge读取存在情况
           * 如果都不存在的话就去读取网络的资源 并且缓存到文件中
           */
          const assetName = getScaledAssetPath(this.asset).replace(/\.\.\//g, '_');
          const assetPath = assetsFileDir + assetName;
          const cacheExitEnum = cache.get(assetName);
          if (cacheExitEnum) {
            if (cacheExitEnum === 10) {
              return this.fromSource('file://' + assetPath);
            }
          } else {
            const assetsFileExist = AssetsLoader.assetsFileExist(assetPath);
            if (assetsFileExist) {
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
        }
      },
    );
  }
}
