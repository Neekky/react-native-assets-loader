package com.reactnativeassetsloader

import android.media.MediaDrmResetException
import java.lang.Exception

object RNAssetsLoader {

  private var rnAssetsFileDir = ""

  private var rnRemoteAssetsUrlPath = ""

  /**
   * 设置RNAssetsLoader
   * filePath: "/data/data/pkg/rn/"
   * remoteAssetUrlPath 'https://www.baidu.com/'
   */
  public fun setRnAssetsFileDir(filePath: String, remoteAssetsUrlPath: String) {
    rnAssetsFileDir = filePath
    rnRemoteAssetsUrlPath = remoteAssetsUrlPath
  }

  public fun getRnAssetFileDir(): String {
    if (rnAssetsFileDir.isBlank()) {
      throw Exception("请在MainApplication中初始化文件目录 RNAssetsLoader.setRnAssetsFileDir(dir)")
    }
    return rnAssetsFileDir
  }

  public fun getRemoteAssetsUrlPath(): String {
    if (rnRemoteAssetsUrlPath.isBlank()) {
      throw Exception("请在MainApplication中初始化文件目录 RNAssetsLoader.setRnAssetsFileDir(dir)")
    }
    return rnRemoteAssetsUrlPath
  }


}
