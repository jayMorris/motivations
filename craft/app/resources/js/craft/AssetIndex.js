Craft.AssetIndex=Craft.BaseElementIndex.extend({$includeSubfoldersContainer:null,$includeSubfoldersCheckbox:null,showingIncludeSubfoldersCheckbox:!1,$uploadButton:null,$uploadInput:null,$progressBar:null,$folders:null,uploader:null,promptHandler:null,progressBar:null,_uploadTotalFiles:0,_uploadFileProgress:{},_uploadedFileIds:[],_currentUploaderSettings:{},_fileDrag:null,_folderDrag:null,_expandDropTargetFolderTimeout:null,_tempExpandedFolders:[],init:function(e,t,r){this.base(e,t,r),"index"==this.settings.context?(this._initIndexPageMode(),this.addListener(Garnish.$win,"resize,scroll","_positionProgressBar")):(this.addListener(this.$main,"scroll","_positionProgressBar"),this.settings.modal&&this.settings.modal.on("updateSizeAndPosition",$.proxy(this,"_positionProgressBar")))},initSource:function(e){this.base(e),this._createFolderContextMenu(e),"index"==this.settings.context&&(this._folderDrag&&this._getSourceLevel(e)>1&&this._getFolderIdFromSourceKey(e.data("key"))&&this._folderDrag.addItems(e.parent()),this._fileDrag&&this._fileDrag.updateDropTargets())},deinitSource:function(e){this.base(e);var t=e.data("contextmenu");t&&t.destroy(),"index"==this.settings.context&&(this._folderDrag&&this._getSourceLevel(e)>1&&this._folderDrag.removeItems(e.parent()),this._fileDrag&&this._fileDrag.updateDropTargets())},_getSourceLevel:function(e){return e.parentsUntil("nav","ul").length},_initIndexPageMode:function(){this.settings.selectable=!0,this.settings.multiSelect=!0;var e=$.proxy(this,"_onDragStart"),t=$.proxy(this,"_onDropTargetChange");this._fileDrag=new Garnish.DragDrop({activeDropTargetClass:"sel",helperOpacity:.75,filter:$.proxy(function(){return this.view.getSelectedElements()},this),helper:$.proxy(function(e){return this._getFileDragHelper(e)},this),dropTargets:$.proxy(function(){for(var e=[],t=0;t<this.$sources.length;t++)this._getFolderIdFromSourceKey(this.$sources.eq(t).data("key"))&&e.push($(this.$sources[t]));return e},this),onDragStart:e,onDropTargetChange:t,onDragStop:$.proxy(this,"_onFileDragStop")}),this._folderDrag=new Garnish.DragDrop({activeDropTargetClass:"sel",helperOpacity:.75,filter:$.proxy(function(){for(var e=this.sourceSelect.getSelectedItems(),t=[],r=0;r<e.length;r++){var s=e.eq(r);this._getFolderIdFromSourceKey(s.data("key"))&&(s.hasClass("sel")&&this._getSourceLevel(s)>1&&t.push(s.parent()[0]))}return $(t)},this),helper:$.proxy(function(e){var t=$('<div class="sidebar" style="padding-top: 0; padding-bottom: 0;"/>'),r=$("<nav/>").appendTo(t),s=$("<ul/>").appendTo(r);return e.appendTo(s).removeClass("expanded"),e.children("a").addClass("sel"),e.css({"padding-top":this._folderDrag.$draggee.css("padding-top"),"padding-right":this._folderDrag.$draggee.css("padding-right"),"padding-bottom":this._folderDrag.$draggee.css("padding-bottom"),"padding-left":this._folderDrag.$draggee.css("padding-left")}),t},this),dropTargets:$.proxy(function(){var e=[],t=[];this._folderDrag.$draggee.find("a[data-key]").each(function(){t.push($(this).data("key"))});for(var r=0;r<this.$sources.length;r++){var s=this.$sources.eq(r);this._getFolderIdFromSourceKey(s.data("key"))&&(Craft.inArray(s.data("key"),t)||e.push(s))}return e},this),onDragStart:e,onDropTargetChange:t,onDragStop:$.proxy(this,"_onFolderDragStop")})},_onFileDragStop:function(){if(this._fileDrag.$activeDropTarget&&this._fileDrag.$activeDropTarget[0]!=this.$source[0]){for(var e=this.$source,t=this._getFolderIdFromSourceKey(this._fileDrag.$activeDropTarget.data("key")),r=[],s=[],o=0;o<this._fileDrag.$draggee.length;o++){var i=Craft.getElementInfo(this._fileDrag.$draggee[o]).id,a=Craft.getElementInfo(this._fileDrag.$draggee[o]).url.split("/").pop();-1!==a.indexOf("?")&&(a=a.split("?").shift()),r.push(i),s.push(a)}if(r.length){this.setIndexBusy(),this._positionProgressBar(),this.progressBar.resetProgressBar(),this.progressBar.setItemCount(r.length),this.progressBar.showProgressBar();var l=[];for(o=0;o<r.length;o++)l.push({fileId:r[o],folderId:t,fileName:s[o]});var n=$.proxy(function(s){this.promptHandler.resetPrompts();for(var o=0;o<s.length;o++){var i=s[o];i.prompt&&this.promptHandler.addPrompt(i),i.error&&alert(i.error)}this.setIndexAvailable(),this.progressBar.hideProgressBar();var a=!1,d=function(){this.sourceSelect.selectItem(e),this._totalVisible-=this._fileDrag.$draggee.length;for(var s=0;s<r.length;s++)$("[data-id="+r[s]+"]").remove();this.view.deselectAllElements(),this._collapseExtraExpandedFolders(t),a&&this.updateElements()};if(this.promptHandler.getPromptCount()){var h=$.proxy(function(e){for(var t=[],r=0;r<e.length;r++)if("cancel"!=e[r].choice)for(var s=0;s<l.length;s++)l[s].fileName==e[r].fileName&&(l[s].action=e[r].choice,t.push(l[s]));else a=!0;0==t.length?d.apply(this):(this.setIndexBusy(),this.progressBar.resetProgressBar(),this.progressBar.setItemCount(this.promptHandler.getPromptCount()),this.progressBar.showProgressBar(),this._moveFile(t,0,n))},this);this._fileDrag.fadeOutHelpers(),this.promptHandler.showBatchPrompts(h)}else d.apply(this),this._fileDrag.fadeOutHelpers()},this);return void this._moveFile(l,0,n)}}else this.$source.addClass("sel"),this._collapseExtraExpandedFolders();this._fileDrag.returnHelpersToDraggees()},_onFolderDragStop:function(){if(this._folderDrag.$activeDropTarget&&0==this._folderDrag.$activeDropTarget.siblings("ul").children("li").filter(this._folderDrag.$draggee).length){var e=this._getFolderIdFromSourceKey(this._folderDrag.$activeDropTarget.data("key"));this._collapseExtraExpandedFolders(e);for(var t=[],r=0;r<this._folderDrag.$draggee.length;r++){var s=this._folderDrag.$draggee.eq(r).children("a"),o=this._getFolderIdFromSourceKey(s.data("key")),i=this._getSourceByFolderId(o);this._getFolderIdFromSourceKey(this._getParentSource(i).data("key"))!=e&&t.push(o)}if(t.length){t.sort(),t.reverse(),this.setIndexBusy(),this._positionProgressBar(),this.progressBar.resetProgressBar(),this.progressBar.setItemCount(t.length),this.progressBar.showProgressBar();for(var a=[],l=[],r=0;r<t.length;r++)l.push({folderId:t[r],parentId:e});this.requestId++;var n=[],d=[],h={},p=[],u=$.proxy(function(t){this.promptHandler.resetPrompts();for(var r=0;r<t.length;r++){var s=t[r];if(s.success&&s.transferList&&s.deleteList&&s.changedFolderIds){for(var o=0;o<s.transferList.length;o++)n.push(s.transferList[o]);for(var o=0;o<s.deleteList.length;o++)d.push(s.deleteList[o]);for(var i in s.changedFolderIds)h[i]=s.changedFolderIds[i];p.push(s.removeFromTree)}s.prompt&&this.promptHandler.addPrompt(s),s.error&&alert(s.error)}if(this.promptHandler.getPromptCount()){var a=$.proxy(function(e){this.promptHandler.resetPrompts(),this.setNewElementDataHtml("");for(var t=[],r=0;r<e.length;r++)"cancel"!=e[r].choice&&(l[0].action=e[r].choice,t.push(l[0]));0==t.length?$.proxy(this,"_performActualFolderMove",n,d,h,p)():(this.setIndexBusy(),this.progressBar.resetProgressBar(),this.progressBar.setItemCount(this.promptHandler.getPromptCount()),this.progressBar.showProgressBar(),c(t,0,u))},this);this.promptHandler.showBatchPrompts(a),this.setIndexAvailable(),this.progressBar.hideProgressBar()}else $.proxy(this,"_performActualFolderMove",n,d,h,p,e)()},this),c=$.proxy(function(e,t,r){0==t&&(a=[]),Craft.postActionRequest("assets/moveFolder",e[t],$.proxy(function(s,o){t++,this.progressBar.incrementProcessedItemCount(1),this.progressBar.updateProgressBar(),"success"==o&&a.push(s),t>=e.length?r(a):c(e,t,r)},this))},this);return void c(l,0,u)}}else this.$source.addClass("sel"),this._collapseExtraExpandedFolders();this._folderDrag.returnHelpersToDraggees()},_performActualFolderMove:function(e,t,r,s,o){this.setIndexBusy(),this.progressBar.resetProgressBar(),this.progressBar.setItemCount(1),this.progressBar.showProgressBar();var i=$.proxy(function(e,t,r){var s,i;for(var a in t)i=this._getSourceByFolderId(a),i.attr("data-key","folder:"+t[a].newId).data("key","folder:"+t[a].newId),i=i.parent(),(!s||s.parents().filter(i).length>0)&&(s=i,topFolderMovedId=t[a].newId);if(0==s.length)return this.setIndexAvailable(),this.progressBar.hideProgressBar(),void this._folderDrag.returnHelpersToDraggees();var l=s.children("a"),n=s.siblings("ul, .toggle"),d=this._getParentSource(l),h=this._getSourceByFolderId(o);this._prepareParentForChildren(h),this._appendSubfolder(h,s),l.after(n),this._cleanUpTree(d),this.$sidebar.find("ul>ul, ul>.toggle").remove();for(var p=0;p<e.length;p++)Craft.postActionRequest("assets/deleteFolder",{folderId:e[p]});this.setIndexAvailable(),this.progressBar.hideProgressBar(),this._folderDrag.returnHelpersToDraggees(),this._selectSourceByFolderId(topFolderMovedId)},this);e.length>0?this._moveFile(e,0,$.proxy(function(){i(t,r,s)},this)):i(t,r,s)},_getParentSource:function(e){if(this._getSourceLevel(e)>1)return e.parent().parent().siblings("a")},_moveFile:function(e,t,r){0==t&&(this.responseArray=[]),Craft.postActionRequest("assets/moveFile",e[t],$.proxy(function(s,o){this.progressBar.incrementProcessedItemCount(1),this.progressBar.updateProgressBar(),"success"==o&&(this.responseArray.push(s),Craft.cp.runPendingTasks()),t++,t>=e.length?r(this.responseArray):this._moveFile(e,t,r)},this))},_selectSourceByFolderId:function(e){for(var t=this._getSourceByFolderId(e),r=t.parent().parents("li"),s=0;s<r.length;s++){var o=$(r[s]);o.hasClass("expanded")||o.children(".toggle").click()}this.selectSource(t),this.updateElements()},afterInit:function(){this.$uploadButton||(this.$uploadButton=$('<div class="btn submit" data-icon="upload" style="position: relative; overflow: hidden;" role="button">'+Craft.t("Upload files")+"</div>"),this.addButton(this.$uploadButton),this.$uploadInput=$('<input type="file" multiple="multiple" name="assets-upload" />').hide().insertBefore(this.$uploadButton)),this.promptHandler=new Craft.PromptHandler,this.progressBar=new Craft.ProgressBar(this.$main,!0);var e={url:Craft.getActionUrl("assets/uploadFile"),fileInput:this.$uploadInput,dropZone:this.$main};e.events={fileuploadstart:$.proxy(this,"_onUploadStart"),fileuploadprogressall:$.proxy(this,"_onUploadProgress"),fileuploaddone:$.proxy(this,"_onUploadComplete")},void 0!==this.settings.criteria.kind&&(e.allowedKinds=this.settings.criteria.kind),this._currentUploaderSettings=e,this.uploader=new Craft.Uploader(this.$uploadButton,e),this.$uploadButton.on("click",$.proxy(function(){this.$uploadButton.hasClass("disabled")||this.isIndexBusy||this.$uploadButton.parent().find("input[name=assets-upload]").click()},this)),this.base()},onSelectSource:function(){this.uploader.setParams({folderId:this._getFolderIdFromSourceKey(this.sourceKey)}),this.$source.attr("data-upload")?this.$uploadButton.removeClass("disabled"):this.$uploadButton.addClass("disabled"),this.base()},_getFolderIdFromSourceKey:function(e){var t=e.split(":");return t.length>1&&"folder"==t[0]?t[1]:null},startSearching:function(){if(this.$source.siblings("ul").length){if(null===this.$includeSubfoldersContainer){var e="includeSubfolders-"+Math.floor(1e9*Math.random());this.$includeSubfoldersContainer=$('<div style="margin-bottom: -23px; opacity: 0;"/>').insertAfter(this.$search);var t=$('<div style="padding-top: 5px;"/>').appendTo(this.$includeSubfoldersContainer);this.$includeSubfoldersCheckbox=$('<input type="checkbox" id="'+e+'" class="checkbox"/>').appendTo(t),$('<label class="light smalltext" for="'+e+'"/>').text(" "+Craft.t("Search in subfolders")).appendTo(t),this.addListener(this.$includeSubfoldersCheckbox,"change",function(){this.setSelecetedSourceState("includeSubfolders",this.$includeSubfoldersCheckbox.prop("checked")),this.updateElements()})}else this.$includeSubfoldersContainer.velocity("stop");var r=this.getSelectedSourceState("includeSubfolders",!1);this.$includeSubfoldersCheckbox.prop("checked",r),this.$includeSubfoldersContainer.velocity({marginBottom:0,opacity:1},"fast"),this.showingIncludeSubfoldersCheckbox=!0}this.base()},stopSearching:function(){this.showingIncludeSubfoldersCheckbox&&(this.$includeSubfoldersContainer.velocity("stop"),this.$includeSubfoldersContainer.velocity({marginBottom:-23,opacity:0},"fast"),this.showingIncludeSubfoldersCheckbox=!1),this.base()},getViewParams:function(){var e=this.base();return this.showingIncludeSubfoldersCheckbox&&this.$includeSubfoldersCheckbox.prop("checked")&&(e.criteria.includeSubfolders=!0),e},_onUploadStart:function(e){this.setIndexBusy(),this._positionProgressBar(),this.progressBar.resetProgressBar(),this.progressBar.showProgressBar(),this.promptHandler.resetPrompts()},_onUploadProgress:function(e,t){var r=parseInt(t.loaded/t.total*100,10);this.progressBar.setProgressPercentage(r)},_onUploadComplete:function(e,t){var r=t.result,s=t.files[0].name,o=!0;r.success||r.prompt?(this._uploadedFileIds.push(r.fileId),r.prompt&&this.promptHandler.addPrompt(r)):(r.error?alert(Craft.t("Upload failed for {filename}. The error message was: “{error}”",{filename:s,error:r.error})):alert(Craft.t("Upload failed for {filename}.",{filename:s})),o=!1),this.uploader.isLastUpload()&&(this.setIndexAvailable(),this.progressBar.hideProgressBar(),this.promptHandler.getPromptCount()?this.promptHandler.showBatchPrompts($.proxy(this,"_uploadFollowup")):o&&this.updateElements())},_uploadFollowup:function(e){this.setIndexBusy(),this.progressBar.resetProgressBar(),this.promptHandler.resetPrompts();var t=$.proxy(function(){this.setIndexAvailable(),this.progressBar.hideProgressBar(),this.updateElements()},this);this.progressBar.setItemCount(e.length);var r=$.proxy(function(e,t,s){var o={newFileId:e[t].fileId,fileName:e[t].fileName,userResponse:e[t].choice};Craft.postActionRequest("assets/uploadFile",o,$.proxy(function(o,i){"success"==i&&o.fileId&&this._uploadedFileIds.push(o.fileId),t++,this.progressBar.incrementProcessedItemCount(1),this.progressBar.updateProgressBar(),t==e.length?s():r(e,t,s)},this))},this);this.progressBar.showProgressBar(),r(e,0,t)},onUpdateElements:function(){this._onUpdateElements(!1,this.view.getAllElements()),this.view.on("appendElements",$.proxy(function(e){this._onUpdateElements(!0,e.newElements)},this)),this.base()},_onUpdateElements:function(e,t){if("index"==this.settings.context&&(e||this._fileDrag.removeAllItems(),this._fileDrag.addItems(t)),this._uploadedFileIds.length){if(this.view.settings.selectable)for(var r=0;r<this._uploadedFileIds.length;r++)this.view.selectElementById(this._uploadedFileIds[r]);this._uploadedFileIds=[]}},_onDragStart:function(){this._tempExpandedFolders=[]},_getFileDragHelper:function(e){switch(this.getSelectedSourceState("mode")){case"table":var t=$('<div class="elements datatablesorthelper"/>').appendTo(Garnish.$bod),r=$('<div class="tableview"/>').appendTo(t),s=$('<table class="data"/>').appendTo(r),o=$("<tbody/>").appendTo(s);e.appendTo(o),this._$firstRowCells=this.view.$table.children("tbody").children("tr:first").children();for(var i=e.children(),a=0;a<i.length;a++){var l=$(i[a]);if(l.hasClass("checkbox-cell"))l.remove(),t.css("margin-"+Craft.left,19);else{var n=$(this._$firstRowCells[a]),d=n.width();n.width(d),l.width(d)}}return t;case"thumbs":var t=$('<div class="elements thumbviewhelper"/>').appendTo(Garnish.$bod),r=$('<ul class="thumbsview"/>').appendTo(t);return e.appendTo(r),t}return $()},_onDropTargetChange:function(e){if(clearTimeout(this._expandDropTargetFolderTimeout),e){var t=this._getFolderIdFromSourceKey(e.data("key"));t?(this.dropTargetFolder=this._getSourceByFolderId(t),this._hasSubfolders(this.dropTargetFolder)&&!this._isExpanded(this.dropTargetFolder)&&(this._expandDropTargetFolderTimeout=setTimeout($.proxy(this,"_expandFolder"),500))):this.dropTargetFolder=null}e&&e[0]!=this.$source[0]?this.$source.removeClass("sel"):this.$source.addClass("sel")},_collapseExtraExpandedFolders:function(e){clearTimeout(this._expandDropTargetFolderTimeout);var t;e&&(t=this._getSourceByFolderId(e).parents("li").children("a"));for(var r=this._tempExpandedFolders.length-1;r>=0;r--){var s=this._tempExpandedFolders[r];e&&0!=t.filter('[data-key="'+s.data("key")+'"]').length||(this._collapseFolder(s),this._tempExpandedFolders.splice(r,1))}},_getSourceByFolderId:function(e){return this.$sources.filter('[data-key="folder:'+e+'"]')},_hasSubfolders:function(e){return e.siblings("ul").find("li").length},_isExpanded:function(e){return e.parent("li").hasClass("expanded")},_expandFolder:function(){this._collapseExtraExpandedFolders(this._getFolderIdFromSourceKey(this.dropTargetFolder.data("key"))),this.dropTargetFolder.siblings(".toggle").click(),this._tempExpandedFolders.push(this.dropTargetFolder)},_collapseFolder:function(e){e.parent().hasClass("expanded")&&e.siblings(".toggle").click()},_createFolderContextMenu:function(e){if(this._getFolderIdFromSourceKey(e.data("key"))){var t=[{label:Craft.t("New subfolder"),onClick:$.proxy(this,"_createSubfolder",e)}];"index"==this.settings.context&&this._getSourceLevel(e)>1&&(t.push({label:Craft.t("Rename folder"),onClick:$.proxy(this,"_renameFolder",e)}),t.push({label:Craft.t("Delete folder"),onClick:$.proxy(this,"_deleteFolder",e)})),new Garnish.ContextMenu(e,t,{menuClass:"menu"})}},_createSubfolder:function(e){var t=prompt(Craft.t("Enter the name of the folder"));if(t){var r={parentId:this._getFolderIdFromSourceKey(e.data("key")),folderName:t};this.setIndexBusy(),Craft.postActionRequest("assets/createFolder",r,$.proxy(function(t,r){if(this.setIndexAvailable(),"success"==r&&t.success){this._prepareParentForChildren(e);var s=$('<li><a data-key="folder:'+t.folderId+'"'+(Garnish.hasAttr(e,"data-has-thumbs")?" data-has-thumbs":"")+' data-upload="'+e.attr("data-upload")+'">'+t.folderName+"</a></li>"),o=s.children("a:first");this._appendSubfolder(e,s),this.initSource(o)}"success"==r&&t.error&&alert(t.error)},this))}},_deleteFolder:function(e){if(confirm(Craft.t("Really delete folder “{folder}”?",{folder:$.trim(e.text())}))){var t={folderId:this._getFolderIdFromSourceKey(e.data("key"))};this.setIndexBusy(),Craft.postActionRequest("assets/deleteFolder",t,$.proxy(function(t,r){if(this.setIndexAvailable(),"success"==r&&t.success){var s=this._getParentSource(e);this.deinitSource(e),e.parent().remove(),this._cleanUpTree(s)}"success"==r&&t.error&&alert(t.error)},this))}},_renameFolder:function(e){var t=$.trim(e.text()),r=prompt(Craft.t("Rename folder"),t);if(r&&r!=t){var s={folderId:this._getFolderIdFromSourceKey(e.data("key")),newName:r};this.setIndexBusy(),Craft.postActionRequest("assets/renameFolder",s,$.proxy(function(t,r){this.setIndexAvailable(),"success"==r&&t.success&&e.text(t.newName),"success"==r&&t.error&&alert(t.error)},this),"json")}},_prepareParentForChildren:function(e){this._hasSubfolders(e)||(e.parent().addClass("expanded").append('<div class="toggle"></div><ul></ul>'),this.initSourceToggle(e))},_appendSubfolder:function(e,t){for(var r=e.siblings("ul"),s=r.children("li"),o=$.trim(t.children("a:first").text()),i=!1,a=0;a<s.length;a++){var l=$(s[a]);if($.trim(l.children("a:first").text())>o){l.before(t),i=!0;break}}i||e.siblings("ul").append(t)},_cleanUpTree:function(e){null!==e&&0==e.siblings("ul").children("li").length&&(this.deinitSourceToggle(e),e.siblings("ul").remove(),e.siblings(".toggle").remove(),e.parent().removeClass("expanded"))},_positionProgressBar:function(){var e=$(),t=0,r=0;"index"==this.settings.context?(e=this.progressBar.$progressBar.closest("#content"),t=Garnish.$win.scrollTop()):(e=this.progressBar.$progressBar.closest(".main"),t=this.$main.scrollTop());var s=e.offset().top,o=t-s,i=Garnish.$win.height();r=e.height()>i?i/2-6+o:e.height()/2-6,"index"!=this.settings.context&&(r=t+(e.height()/2-6)),this.progressBar.$progressBar.css({top:r})}}),Craft.registerElementIndexClass("Asset",Craft.AssetIndex);