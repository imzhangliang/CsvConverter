$(document).ready(function(){
    var dataArray = [];
    var delimiterOptions = {
        '/,/':',',
        '/\\s/':'单个空白空格',
        '/\\s+/':'空白字符',
        '/\\t/':'tab',
    };
    var specialOptions = {
        '':'无',
        'singleQuote': '不切分单引号内',
        'doubleQuote': '不切分双引号内',
    }

    function initDelimiter() {
        let html = ''
        for (let value in delimiterOptions) {
            comment = delimiterOptions[value];
            html += `<option value="${value}">${comment}</option>\n`;
        }
        $("#delimiter").html(html);
    }

    function initSpecialOptions() {
        let html = ''
        for (let value in specialOptions) {
            comment = specialOptions[value];
            html += `<option value="${value}">${comment}</option>\n`;
        }
        $("#specialOption").html(html);   
    }

    initDelimiter();
    initSpecialOptions();

    $("#convButton").click(function(){
        dataArray = getDataArray();
        console.log(dataArray);
        putDataArray(dataArray);
    })

    function putDataArray(dataArray, format) {
        let lineArray = []
        for (let dataLine of dataArray) {
            dataLine2 = dataLine.map(elem => "'" + elem + "'")
            lineStr = '(' + dataLine2.join(', ') + ')\n';
            lineArray.push(lineStr);
        }

        $("#dst").html(lineArray.join(', <br />'));
    }


    function getDataArray() {
        let text = $("#srcText").val();
        let lines = text.split('\n');
        let array = []
        let delimiter = $("#delimiter").val();
        let option = $("#specialOption").val();
        
        console.log(delimiter);
        console.log(option);
        
        let pattern = /^$/;   //特殊选项的模式匹配, 默认为没有意义的匹配
        if (option == 'singleQuote') {
            pattern = /\'[^\']*\'/g;
        } else if (option == 'doubleQuote') {
            pattern = /\"[^\"]*\"/g;
        }
        
        for (let line of lines) {
            let replaceTable = {}   //替换表，存储被替换的数据，之后再替换回来
            let nonReplaceStr = '[*$%^]';  //不可替代字符
            let count = 0;  //计数器，为了区分不同的替换部分

            line = line.replace(pattern, function(s){
                console.log(s);
                s = s.replace(eval(delimiter + 'g'), function(s){ 
                    let t = nonReplaceStr + count + nonReplaceStr;
                    replaceTable[t] = s;
                    ++count;
                    return t;
                })
                console.log(s);
                return s;
            })
            let lineArray = line.split(eval(delimiter));
            for (let i = 0; i < lineArray.length; i++) {
                for (let key in replaceTable) {
                    let value = replaceTable[key];
                    lineArray[i] = lineArray[i].replace(key, value);    //把字符再替换回来
                }
            }

            array.push(lineArray);
        }

        return array;
    }

    //允许tab键输入
    $(document).delegate('#srcText', 'keydown', function(e) {
        var keyCode = e.keyCode || e.which;
      
        if (keyCode == 9) {
          e.preventDefault();
          var start = this.selectionStart;
          var end = this.selectionEnd;
      
          // set textarea value to: text before caret + tab + text after caret
          $(this).val($(this).val().substring(0, start)
                      + "\t"
                      + $(this).val().substring(end));
      
          // put caret at right position again
          this.selectionStart =
          this.selectionEnd = start + 1;
        }
      });
})