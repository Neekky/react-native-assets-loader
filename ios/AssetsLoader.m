#import "AssetsLoader.h"
#import "FileDownloader.h"
#import "RNAssetsLoaderInit.h"

@implementation AssetsLoader

RCT_EXPORT_MODULE(AssetsLoader);

//判断文件是否存在在文件资源中
RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(assetsFileExist:(NSString *) path)
{
  if([path hasPrefix:@"file://"]){
       path = [path substringFromIndex:6];
     }
     NSFileManager *fileManager = [NSFileManager defaultManager];
     BOOL fileExists = [fileManager fileExistsAtPath:path];
     return @(fileExists);
}

//获取assets资源的目录
RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getAssetsFileDir)
{
  return [RNAssetsLoaderInit getAssetsFileDir];
}

//获取assets远程资源的目录
RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getRemoteAssetsUrlPath)
{
  return [RNAssetsLoaderInit getRemoteAssetsPath];
}

//缓存assets资源到现有的文件系统 异步的加载
RCT_EXPORT_METHOD(cacheAssetsToFile:(NSString *)fileUrl fileName:(NSString *)fileName)
{
  NSString * name = [fileName lastPathComponent];
  NSString * dir = [fileName stringByDeletingLastPathComponent];
  dir = [[RNAssetsLoaderInit getAssetsFileDir] stringByAppendingString:dir];
  NSLog(@"AssetLoader-ios-cacheAssets url %@",fileUrl);
  NSLog(@"AssetLoader-ios-cacheAssets 目录 ==%@  文件名称===%@",dir,name);
  FileDownloader *fileDownloader = [FileDownloader getInstace];
  [fileDownloader downloadFile:fileUrl dir:dir name:name];
}

@end
