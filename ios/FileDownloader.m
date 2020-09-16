//
//  FileDownloader.m
//  rn_res_demo
//
//  Created by xiangyuan on 2020/9/11.
//

#import "FileDownloader.h"

@implementation FileDownloader

static FileDownloader *_instance = nil;

NSOperationQueue *queue;
NSFileManager *fileManager;

+(instancetype)getInstace{
    static dispatch_once_t onceToken ;
    dispatch_once(&onceToken, ^{
        _instance = [[self alloc] init] ;
        queue = [[NSOperationQueue alloc]init];
        queue.maxConcurrentOperationCount = 8;
        fileManager = [NSFileManager defaultManager];
    });

    return _instance;
}

- (void)downloadFile:(NSString *)fileUrl dir:(NSString *)dir name:(NSString *)name{
  [queue addOperationWithBlock:^{
     NSURL  *url = [NSURL URLWithString:fileUrl];
     NSData *urlData = [NSData dataWithContentsOfURL:url];
     if (urlData != nil) {
       BOOL dirExist = [fileManager fileExistsAtPath:dir];
       NSLog(@"=====FileDownloader=====下载目录%@",dir);
       NSLog(@"=====FileDownloader=====下载文件%@",name);
       if (!dirExist) {
           NSError * error = nil;
           BOOL ret = [fileManager createDirectoryAtPath:dir withIntermediateDirectories:YES attributes:nil error:&error];
           if (ret) {
               NSLog(@"=====FileDownloader=====目录创建成功");
           } else {
               NSLog(@"=====FileDownloader=====目录创建失败");
           }
           if (error != nil) {
               NSLog(@"=====FileDownloader===== handler error: %@", error);
           }
       }

       NSString *filePath = [NSString stringWithFormat:@"%@/%@", dir,name];
       BOOL success = [urlData writeToFile:filePath atomically:YES];
       if(success){
         NSLog(@"=====FileDownloader=====写入成功");
       } else {
         NSLog(@"=====FileDownloader=====写入失败");
       }
     }
   }];
}

@end
  
