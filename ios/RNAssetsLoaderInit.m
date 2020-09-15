//
//  AssetsLoaderInit.m
//  rn_res_demo
//
//  Created by xiangyuan on 2020/9/12.
//

#import "RNAssetsLoaderInit.h"

static NSString* _assetsFileDir;

static NSString* _remoteAssetsPath;

@implementation RNAssetsLoaderInit

+ (NSString *)getRemoteAssetsPath{
  return _remoteAssetsPath;
}

+ (void)setAssetsFilePath:(NSString *)localFilePath remotePath:(NSString *)remoteUrlPath{
    _assetsFileDir = localFilePath;
    _remoteAssetsPath = remoteUrlPath;
}

+ (NSString *)getAssetsFileDir{
  return _assetsFileDir;
}

@end

