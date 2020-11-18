# Google Apps Script Project: CopyFolder
This repo (CopyFolder) was automatically created on 18 August 2016 11:39:06 BST by GasGit
for more information see the [desktop liberation site](https://ramblings.mcpher.com/drive-sdk-and-github/getting-your-apps-scripts-to-github/ "desktop liberation")
you can see [library and dependency information here](dependencies.md)

More info at https://ramblings.mcpher.com/google-apps-scripts-snippets-2/a-webapp-to-share-copies-of-the-contents-of-folders/

CopyFolder is a way of sharing copies of the contents of a folder. When you use Google Docs sharing, you are not sharing a copy of a document, but rather, you are sharing the document. For things like scripts though, you probably want people to make a copy of what you are sharing so they can go ahead and edit their own copy. 

The CopyFolder webApp does that. It takes 2 parameters

Parameter| Usage
--- |---
sourceid|The source folder id
target|The target folder name. It will create it if necessary

Of course the contents and the folder should be accessible by the person trying to make the copy, but the main usage would anyway be to share public files.

Let's say I want to share the contents of the folder that contains this document and source of copy Folder so that you have your own copy to edit. I dont want to share my documents, but I want to let you have your own copy. 

I would share this link with you.

https://script.google.com/macros/s/AKfycbz3todkXzvm82x4JgaoffjYkJTleyA15vcLptfoRQ2Pa2KxntQ/exec?sourceid=0B92ExLh4POiZcnJtZ3R5TGFoa1k&target=BrucesCopyFolderProject


And hitting copy would make a new copy of each of these files on your Drive.

Go ahead and try if you want a copy of this script and document.


