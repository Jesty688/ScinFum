<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="shortcut icon " type="images/x-icon" href="Public/Images/favicon.ico">
    <title>Database Install</title>
</head>
<body>
        <form action="" class="form-sign" method="post">
            <label for="name">数据库地址:　　</label>
            <input type="text" class="form-control" name="db_host" value="127.0.0.1"><br>
            <label for="name">数据库端口:　　</label>
            <input type="text" class="form-control" name="db_port" value="3306"><br>
            <label for="name">数据库用户名:　</label>
            <input type="text" class="form-control" name="db_user"><br>
            <label for="name">数据库密码:　　</label>
            <input type="text" class="form-control" name="db_pwd"><br>
            <label for="name">数据库名:　　　</label>
            <input type="text" name="db_name" value="scin">
            <label for="">已有数据库</label><input type="radio" class="form-control" name="dbn">
            <label for="">新建数据库</label><input type="radio" class="form-control" name="dbn"><br><br>
            <input type="submit" class="btn btn-primary btn-block" name="submit" value="保存配置"><br>
    </form>
</body>
</html>