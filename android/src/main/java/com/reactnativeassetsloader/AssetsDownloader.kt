package com.reactnativeassetsloader

import okhttp3.*
import java.io.File
import java.io.FileOutputStream
import java.io.IOException
import java.io.InputStream
import java.util.concurrent.ExecutorService
import java.util.concurrent.SynchronousQueue
import java.util.concurrent.ThreadPoolExecutor
import java.util.concurrent.TimeUnit

class AssetsDownloader private constructor() {

  private val okHttpClient: OkHttpClient = OkHttpClient()

  private val threadPool: ExecutorService = ThreadPoolExecutor(0, 8,
    60L, TimeUnit.SECONDS,
    SynchronousQueue())

  /**
   * @param url      下载连接
   * @param saveDir  储存下载文件的SDCard目录
   * @param listener 下载监听
   */
  fun download(url: String?, saveDir: String, fileName: String?, listener: OnDownloadListener?) {
    threadPool.execute {
      if (url == null) {
        return@execute
      }
      val request = Request.Builder().url(url).build()
      okHttpClient.newCall(request).enqueue(object : Callback {
        override fun onFailure(call: Call, e: IOException) {
          // 下载失败
          listener?.onDownloadFailed()
        }

        @Throws(IOException::class)
        override fun onResponse(call: Call, response: Response) {
          var `is`: InputStream? = null
          val buf = ByteArray(2048)
          var len = 0
          var fos: FileOutputStream? = null
          // 储存下载文件的目录
          val savePath = isExistDir(saveDir)
          try {
            `is` = response.body()!!.byteStream()
            val total = response.body()!!.contentLength()
            val file = File(savePath, fileName)
            fos = FileOutputStream(file)
            var sum: Long = 0
            while (`is`.read(buf).also { len = it } != -1) {
              fos.write(buf, 0, len)
              sum += len.toLong()
              val progress = (sum * 1.0f / total * 100).toInt()
              // 下载中
              listener?.onDownloading(progress)
            }
            fos.flush()
            // 下载完成
            listener?.onDownloadSuccess()
          } catch (e: Exception) {
            e.printStackTrace()
            listener?.onDownloadFailed()
          } finally {
            try {
              `is`?.close()
            } catch (e: IOException) {
            }
            try {
              fos?.close()
            } catch (e: IOException) {
            }
          }
        }
      })
    }
  }

  /**
   * @param saveDir
   * @return
   * @throws IOException 判断下载目录是否存在
   */
  @Throws(IOException::class)
  private fun isExistDir(saveDir: String): String {
    // 下载位置
    val downloadFile = File(saveDir)
    if (!downloadFile.mkdirs()) {
      downloadFile.createNewFile()
    }
    return downloadFile.absolutePath
  }

  interface OnDownloadListener {
    /**
     * 下载成功
     */
    fun onDownloadSuccess()

    /**
     * @param progress 下载进度
     */
    fun onDownloading(progress: Int)

    /**
     * 下载失败
     */
    fun onDownloadFailed()
  }

  companion object {
    private var fileDownloader: AssetsDownloader? = null

    fun get(): AssetsDownloader? {
      if (fileDownloader == null) {
        fileDownloader = AssetsDownloader()
      }
      return fileDownloader
    }
  }

}
