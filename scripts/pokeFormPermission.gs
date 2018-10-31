function poke() {
 
  var formId = "1n-27QxG_Ja3YWf-dYL-vfBSIgVYVD3wB92Cx9pQBPKI";
  var file = DriveApp.getFileById(formId);

  file.setSharing(
    DriveApp.Access.ANYONE_WITH_LINK, 
    DriveApp.Permission.VIEW
  );
  
  Logger.log(file.getSharingAccess());
  Logger.log(file.getSharingPermission());
  
}
