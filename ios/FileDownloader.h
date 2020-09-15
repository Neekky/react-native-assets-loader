//
//  FileDownloader.h
//  rn_res_demo
//
//  Created by xiangyuan on 2020/9/11.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface FileDownloader : NSObject

+(instancetype)getInstace;

-(void)downloadFile:(NSString *)fileUrl dir:(NSString *)dir name:(NSString *)name;

@end

NS_ASSUME_NONNULL_END
