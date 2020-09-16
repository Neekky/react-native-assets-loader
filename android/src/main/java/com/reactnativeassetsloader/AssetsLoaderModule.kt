package com.reactnativeassetsloader

import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.io.File

class AssetsLoaderModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {


  override fun getName(): String {
    return "AssetsLoader"
  }

  /**
   * 判断assets文件是否存在
   */
  @ReactMethod(isBlockingSynchronousMethod = true)
  fun assetsFileExist(path: String?): Boolean {
    return try {
      if (path == null) {
        return false
      }
      val file = File(path.replace("file://", ""))
      file.exists()
    } catch (e: Exception) {
      e.printStackTrace()
      false
    }
  }

  /**
   * 获取Assets文件的目录
   */
  @ReactMethod(isBlockingSynchronousMethod = true)
  fun getAssetsFileDir(): String? {
    return RNAssetsLoader.getRnAssetFileDir()
  }

  /**
   * 获取Assets文件的目录
   */
  @ReactMethod(isBlockingSynchronousMethod = true)
  fun getRemoteAssetsUrlPath(): String? {
    return RNAssetsLoader.getRemoteAssetsUrlPath()
  }

  /**
   * 判断drawable中是否由这个资源
   */
  @ReactMethod(isBlockingSynchronousMethod = true)
  fun assetsBundleExits(filename: String?): Boolean {
    return try {
      val resID = reactApplicationContext.resources.getIdentifier(
        filename,
        "drawable", reactApplicationContext.packageName)
      resID != 0
    } catch (e: Exception) {
      e.printStackTrace()
      false
    }
  }

  /**
   * 缓存文件到目录
   */
  @ReactMethod
  fun cacheAssetsToFile(fileUrl: String?, fileName: String) {
    try {
      val file = File(getAssetsFileDir() + File.separator + fileName)
      if (!file.parentFile.exists()) {
        file.parentFile.mkdirs()
      }
      AssetsDownloader.get()?.download(fileUrl, getAssetsFileDir() ?: "", fileName, null)
    } catch (e: java.lang.Exception) {
      e.printStackTrace()
    }
  }

}
