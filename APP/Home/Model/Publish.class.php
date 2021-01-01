<?php
namespace App\Home\Model;
use Frame\Libs\BaseModel;

final class Publish extends BaseModel{
    protected $AnnexImgUrl = '';
    protected $AnnexYsbUrl = '';
    function Get_Content(){
        $PutDir = './Annex/' . date("Y/m/"); //创建保存目录 根据月份创建 一月一个
        if(!file_exists($PutDir)){
            mkdir($PutDir, 0777, true); //第三个参数true表示可以创建深层次的目录
        }
        $Result_Content = [];
        //因为发布页面是有上上传文件和普通文本需要用到POST FILES
        //1.获取直接可视的POST数据
            //1) 取出POST数据中的标题 标签(max_5) 文章内容

         $Post_Content = $_POST;
         $AnnexYsbUrl  = $Post_Content['panurl'];
         $Article_Title = $Post_Content['title'];
         $Article_Tags  =  explode(',',rtrim($Post_Content['tags'],',') ,5);
         /*这里需要加个判断 因为不能直接给4 */
         if(count($Article_Tags) >= 5){
             $Article_Tags[4] = substr($Article_Tags[4],0,strpos($Article_Tags[4],','));
         }

         $Article_Content = $this -> RemoveXSS($Post_Content['editor_content']); //这里的内容编辑器已经帮我给过滤到一些XSS可以直接在页面上显示

         //2.获取上传的文件
            //判断是否存在封面图片
        if(!isset($_FILES['coverfile'])){
            $Result_Content = ['code' => '0' , 'error' => '必须上传封面图片~'];
            return $Result_Content;
        }
            //1) 获取上传图片的真实类型
         $Post_File = $_FILES;
         $ExtType = ['image/jpeg','image/png','image/gif','application/zip','application/x-7z-compressed','application/x-rar-compressed'];
         $fileinfo = finfo_open(FILEINFO_MIME_TYPE);
         $ImgType = finfo_file($fileinfo,$_FILES['coverfile']['tmp_name']);
         /*这里如果上传的是gif还是有些bug */
         if($_FILES['onlineurl']['name'] != ''){
             $YsbType = finfo_file($fileinfo,$_FILES['onlineurl']['tmp_name']);
             if(!in_array($YsbType,$ExtType)){
                 $Result_Content = ['code' => '0' , 'error' => '上传的文件名不符合'];
                 return $Result_Content;
             }else{
                 //存在上传的压缩包 将其放在附件文件夹中
                 $Ysbfilename= uniqid(); //随机名 不重复
                 $Ysbext = strrchr($_FILES['onlineurl']['name'], '.'); //截取图片的后缀名
                 $DirPath = $PutDir . $Ysbfilename . $Ysbext;
                 move_uploaded_file($_FILES['onlineurl']['tmp_name'],$DirPath);
                 $AnnexYsbUrl = $DirPath;
             }
         }
         if(!in_array($ImgType,$ExtType)){
             $Result_Content = ['code' => '0' , 'error' => '上传的文件名不符合'];
             return $Result_Content;
         }
         if(($_FILES["coverfile"]["size"] > 10485760) || ($_FILES["coverfile"]["size"] == "" )) {
             $Result_Content = ['code' => '0' , 'error' => '上传的文件太大了'];
             return $Result_Content;
         }
         /*如果符合以上条件那么就将文件移动到指定的目录中*/
         //完成上传
         //move_uploaded_file(临时文件, 上传到哪里);

         /*移动图片到刚才创建的文件夹下*/
         $Imgfilename= uniqid(); //随机名 不重复
         $Imgext = strrchr($_FILES['coverfile']['name'], '.'); //截取图片的后缀名
         $DirPath = $PutDir . $Imgfilename . $Imgext;
         move_uploaded_file($_FILES['coverfile']['tmp_name'],$DirPath);
         $AnnexImgUrl = $DirPath;
         /*以上就是所有的获取和准备 接下来只需要将获取的结果组合成数组 发送给控制器即可*/
         $All_Content = [
             'code'        => '1',
             'title'       => $this -> RemoveXSS($Article_Title),
             'tags'        => $Article_Tags,
             'content'     => $Article_Content,
             'annex_img'   => $AnnexImgUrl,
             'annex_ysb'   => $AnnexYsbUrl,
             'addtime'     => time(),
         ];
         array_push($Result_Content,$All_Content);
         return $Result_Content;
    }

}