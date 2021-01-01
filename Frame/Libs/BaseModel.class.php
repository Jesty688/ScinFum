<?php
namespace Frame\Libs;
use Frame\Vendor\PDOWrapper;
abstract class BaseModel{

    protected $pdo = null;
    public function __construct(){
        #创建PDO对象 --使用了Vendor下的PDO类
        $this->pdo = new PDOWrapper();
    }
    //工厂 :: 调用
    public static function getInstance(){
        //获取静态绑定后的类名
        $ClassName = get_called_class();
        //实例化类
        return new $ClassName;
    }
    /*下面这些类 都是调用了PDOWrapper中的方法 调用pdo中的方法 传参 然后交给PDOWrapper执行*/
    public function fetch($where = 1,$orderby = ''){
        $sql = "SELECT * FROM $this->table where $where";
        return $this -> pdo -> fetch($sql);
    }
    public function fetchAll($orderby = 'id desc'){
        $sql = "SELECT * FROM $this->table order by $orderby";
        return $this -> pdo -> fetchAll($sql);
    }
    public function delete($id){
        $sql = "DELETE from $this->table where id = $id";
        return $this -> pdo -> exec($sql);
    }

    public function update($data,$id){
        $field = '';
        //将数据从数组中取出 拼接成sql
        foreach($data as $key => $value){
            $field .= "$key";
            $field .= '=' . "'$value'" . ',';
        }
        $field = rtrim($field,',');
        $sql = "UPDATE $this->table SET $field where $id";
        return $this -> pdo -> exec($sql);
    }
    public function rowCount($condition = 1){
        $sql = "SELECT * from $this->table where $condition";
        return $this -> pdo -> rowCount($sql);
    }
    public function insert($data){
        $field = ''; //字段名
        $values = ''; //对应的字段值
        foreach ($data as $key => $value) {
            $field .= $key . ',';
            $values .= "'$value'" . ',';
        }
        $field = rtrim($field , ',');
        $values = rtrim($values , ',');
        $sql = "INSERT INTO $this->table($field) VALUES($values)";
        return $this -> pdo -> exec($sql);
    }

    /************************** 拓展  *******************************/

    /*这个查询评论用户的信息*/
    public function Commentfetch($where){
        $sql = "SELECT user_img,user_name,user_alias FROM scin_user where $where";
        return $this -> pdo -> fetch($sql);
    }
    /*自定义查询*/
    public function CommentfetchAll($query = '*',$tablename,$where){
        $sql = "SELECT $query FROM $tablename where $where";
        return $this -> pdo -> fetchAll($sql);
    }
    /*评论内容插入*/
    public function CommentInsert($where,$artid,$addtime,$content){
        $values = 'null,';
        $values.= "$artid,";
        $values.= "(SELECT user_id from scin_user where user_name = '$where'),";
        $values.= "(SELECT user_alias from scin_user where user_name = '$where'),";
        $values.= "(SELECT user_img from scin_user where user_name = '$where'),";
        $values.= "default,default,default,";
        $values.= "'$addtime',";
        $values.= "'$content'";
        $sql = "INSERT INTO $this->table VALUES($values)";
        //echo $sql;die();
        return $this -> pdo -> exec($sql);
    }

    /*评论回复插入*/
    public function ReplyInsert($comment_id,$addtime,$username,$content,$second_reply = 'default',$second_replytouser= 'default'){
        $values = 'null,';
        $values.= "$comment_id,";
        $values.= "(SELECT comment_userimg from scin_article_comment where comment_id = '$comment_id'),";
        $values.= "'$addtime',";
        $values.= "(SELECT user_alias from scin_user where user_name = '$username'),";
        $values.= "(SELECT comment_userid from scin_article_comment where comment_id = '$comment_id'),";
        $values.= "'$username',";
        $values.= "$second_reply,";
        $values.= "'$second_replytouser',";
        $values.= "'$content'";
        $sql = "INSERT INTO scin_comment_reply VALUES($values)";
        return $this -> pdo -> exec($sql);
    }
    /*查询所有的回复*/
    public function ReplyfetchAll($comment_id){
        //根据评论id查找这个评论下的所有的回复
        $sql = "SELECT * FROM scin_comment_reply where reply_pid = '$comment_id'";
        return $this -> pdo -> fetchAll($sql);
    }
    /*插入发布数据*/
    public function PublishInsert($title,$tags,$content,$addtime,$mainimg,$annex,$puser){
        $values = "null,";
        $values.= "'$title','$tags','$content',";
        $values.= "default,default,default,default,default,";
        $values.= "'$addtime','$mainimg','$annex','$puser'";
        $sql = "INSERT INTO scin_article VALUES($values)";
        return $this -> pdo -> exec($sql);
    }
    public function PublishfetchAll($table,$where = ''){
        $sql = "SELECT * FROM $table $where";
        return $this -> pdo -> fetchAll($sql);
    }
    public function Publishfetch($query,$table,$where = ''){
        $sql = "SELECT $query FROM $table $where";
        return $this -> pdo -> fetch($sql);
    }

    /*过滤XSS*/
    public function RemoveXSS($val)
    {
        $val = preg_replace('/([\x00-\x08\x0b-\x0c\x0e-\x19])/', '', $val);
        $search = 'abcdefghijklmnopqrstuvwxyz';
        $search .= 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $search .= '1234567890!@#$%^&*()';
        $search .= '~`";:?+/={}[]-_|\'\\';
        for ($i = 0; $i < strlen($search); $i++) {
            $val = preg_replace('/(&#[xX]0{0,8}' . dechex(ord($search [$i])) . ';?)/i', $search [$i], $val);
            $val = preg_replace('/(&#0{0,8}' . ord($search [$i]) . ';?)/', $search [$i], $val);
        }
        $ra1 = array(
            'javascript',
            'vbscript',
            'expression',
            'applet',
            'meta',
            'xml',
            'blink',
            'script',
            'object',
            'iframe',
            'frame',
            'frameset',
            'ilayer',
            'bgsound'
        );
        $ra2 = array(
            'onabort',
            'onactivate',
            'onafterprint',
            'onafterupdate',
            'onbeforeactivate',
            'onbeforecopy',
            'onbeforecut',
            'onbeforedeactivate',
            'onbeforeeditfocus',
            'onbeforepaste',
            'onbeforeprint',
            'onbeforeunload',
            'onbeforeupdate',
            'onblur',
            'onbounce',
            'oncellchange',
            'onchange',
            'onclick',
            'oncontextmenu',
            'oncontrolselect',
            'oncopy',
            'oncut',
            'ondataavailable',
            'ondatasetchanged',
            'ondatasetcomplete',
            'ondblclick',
            'ondeactivate',
            'ondrag',
            'ondragend',
            'ondragenter',
            'ondragleave',
            'ondragover',
            'ondragstart',
            'ondrop',
            'onerror',
            'onerrorupdate',
            'onfilterchange',
            'onfinish',
            'onfocus',
            'onfocusin',
            'onfocusout',
            'onhelp',
            'onkeydown',
            'onkeypress',
            'onkeyup',
            'onlayoutcomplete',
            'onload',
            'onlosecapture',
            'onmousedown',
            'onmouseenter',
            'onmouseleave',
            'onmousemove',
            'onmouseout',
            'onmouseover',
            'onmouseup',
            'onmousewheel',
            'onmove',
            'onmoveend',
            'onmovestart',
            'onpaste',
            'onpropertychange',
            'onreadystatechange',
            'onreset',
            'onresize',
            'onresizeend',
            'onresizestart',
            'onrowenter',
            'onrowexit',
            'onrowsdelete',
            'onrowsinserted',
            'onscroll',
            'onselect',
            'onselectionchange',
            'onselectstart',
            'onstart',
            'onstop',
            'onsubmit',
            'onunload'
        );
        $ra = array_merge($ra1, $ra2);
        $found = true;
        while ($found == true) {
            $val_before = $val;
            for ($i = 0; $i < sizeof($ra); $i++) {
                $pattern = '/';
                for ($j = 0; $j < strlen($ra [$i]); $j++) {
                    if ($j > 0) {
                        $pattern .= '(';
                        $pattern .= '(&#[xX]0{0,8}([9ab]);)';
                        $pattern .= '|';
                        $pattern .= '|(&#0{0,8}([9|10|13]);)';
                        $pattern .= ')*';
                    }
                    $pattern .= $ra [$i] [$j];
                }
                $pattern .= '/i';
                $replacement = substr($ra [$i], 0, 2) . ' ' . substr($ra [$i], 2);
                $val = preg_replace($pattern, $replacement, $val);
                if ($val_before == $val) {

                    $found = false;
                }
            }
        }
        /*
          htmlspecialchars和htmlentities的区别：
          htmlspecialchars 只转义 & 、" 、' 、< 、> 这几个html代码，
          htmlentities 却会转化所有的html代码，连同里面的它无法识别的中文字符也会转化。
          //参数 ent_quotes 单引号和双引号都会转换
       */
        return htmlentities($val, ENT_QUOTES);
    }


}