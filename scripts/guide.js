$(document).ready(function(){
});

let uri = '/www/file/notice.pdf'

$(".lienNotice").click(function(){

      window.resolveLocalFileSystemURL(cordova.file.applicationDirectory +  uri, function(fileEntry) {

            window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(dirEntry) {
        
                fileEntry.copyTo(dirEntry, 'notice.pdf', function(newFileEntry) {
        
                    cordova.plugins.fileOpener2.open(newFileEntry.nativeURL,'application/pdf');
                });
            });
        });

})
