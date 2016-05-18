var addScene='<%for(var i = 0; i <data.sceneList.length; i++) {%>\
    <li data-id="<%=data.sceneList[i].id%>" data-pid="<%=data.sceneList[i].pid%>" data-cutpid="<%=data.sceneList[i].cutPid%>">\
        <i class="drap"></i>\
        <span class="left-bor"></span>\
        <input type="text" class="name editCommon" value="<%=result.sceneList[i].name%>" readonly maxlength="8">\
        <i class="delet-btn"></i>\
        <i class="clibg bj-common editName"></i>\
        <i class="bj-common save-com scene-save two-com"></i>\
    </li>\
<%}%>';