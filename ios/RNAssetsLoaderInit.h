//
//  AssetsLoaderInit.h
//  rn_res_demo
//
//  Created by xiangyuan on 2020/9/12.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RNAssetsLoaderInit : NSObject

//获取RNAssetsFileDir
+ (NSString *)getAssetsFileDir;

//获取RNAssetsFileDir 远程的资源路径
+ (NSString *)getRemoteAssetsPath;

//设置remoteUrlPath 远程的资源路径
//设置localFilePath 本地文件的资源路径
+ (void)setAssetsFilePath:(NSString *)localFilePath remotePath:(NSString *)remoteUrlPath;

@end

NS_ASSUME_NONNULL_END
