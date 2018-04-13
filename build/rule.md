## JavaScript 代码中可能的错误或逻辑错误相关

### "curly": [2, "multi-line"]

允许在单行中省略大括号，在其他使用中依然会强制使用大括号。

### "no-use-before-define": [2, "nofunc"]

函数声明作用域可以提升，所以function的声明可以写在调用后，而类声明作用于不会提升，所以要先定义

### "no-loop-func": 1

注意循环中创建函数可能会产生不符合预期的闭包的使用

### "new-cap": [2, {"capIsNew": false}]

允许调用首字母大写的函数时没有new操作符

### "no-underscore-dangle": 0

允许标识符中有悬空下划线

### "new-parens": 0

调用一个函数而且它的构造函数不带参数，则可以省略后面圆括号



## 关于Javascript代码风格

### "array-bracket-spacing": [2, "never"]

强制数组方括号中使用一致的空格

### "quotes": [2, "single"]

要求尽可能地使用单引号

### "indent": [2, 2]

强制使用两个空格缩进

### "comma-dangle": [2, "always-multiline"]

多行数组和对象的闭合括号前一行，末尾要加逗号

### "block-spacing": 2

强制在左花括号和同一行上的下一个 token 之间有一致的空格，强制右花括号和在同一行的前一个 token 之间有一致的空格

### "brace-style": [2, "1tbs", { "allowSingleLine": true }]

强制使用one true brace style风格，且允许块的开括号和闭括号在同一行，具体可查看[brace-style](https://cn.eslint.org/docs/rules/brace-style)

### "camelcase": 2

强制使用骆驼拼写法命名约定

### "no-mixed-spaces-and-tabs": 2

禁止空格和 tab 的混合缩进

### "no-multiple-empty-lines": 2

禁止使用连续多行空行，最多两行