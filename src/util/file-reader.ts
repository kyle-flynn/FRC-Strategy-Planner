import { Platform } from 'ionic-angular';
import {File, FileError, Entry} from 'ionic-native';
import {Config} from "./config";

declare var cordova: any;

export class MyEvent {

  private fs: string;

  constructor() {
    this.fs = AppDirectory.getPermDir();
  }

  saveMyEvent(event) {
    let eventJSON = JSON.stringify(event);
    let promise = File.writeFile(this.fs, "json/my_event.json", eventJSON, []).then((fileEntry) => {
      console.log("Saved MY_EVENT.JSON successfully");
      return fileEntry;
    }).catch((err) => {
      console.log(err);
    });
    return promise;
  }

  getMyEvent() {
    let fileEntry = null;
    let fileEntries:Entry[] = null;

    let promise = File.listDir(this.fs, "json").then((entries:Entry[]) => {
      fileEntries = entries;

      if (fileEntries.length <= 0) {
        return null;
      }

      for (let i = 0; i < fileEntries.length; i++) {
        if (fileEntries[i].name.indexOf("my_event") > -1) {
          fileEntry = fileEntries[i];
          break;
        }
      }

      let data = new Promise((resolve, reject) => {

        if (fileEntry) {
          fileEntry.file(function (file) {
            var reader = new FileReader();

            reader.onloadend = function() {
              // team.team_notes = this.result;
              resolve(this.result);
            };

            reader.readAsText(file);

          }, function(error) {
            reject(error);
          });
        } else {
          reject("FileEntry is null!");
        }

      });

      return data;

    }).catch((err:FileError) => {
      fileEntries = null;
      console.log("Error Listing Contents - " + err.message);
      return null;
    });

    return promise;

  }

}

export class TeamAvatar {

  private fs:string;

  constructor() {
    this.fs = AppDirectory.getPermDir();
  }

  public getAvatars() {
    let promise = File.listDir(AppDirectory.getPermDir(), "avatars").then((entries:Entry[]) => {
      return entries;
    }).catch((err:FileError) => {
      console.log("ERROR GETTING AVATARS - " + err.message);
    });
    return promise;
  }

  public getAvatar(team) {
    let promise = File.checkFile(this.fs, "avatars/" + team + ".jpg").then((bool:boolean) => {
      if (bool == true) {
        console.log("FOUND AVATAR FOR TEAM " + team);
        return this.fs + "avatars/" + team + ".jpg";
      }
      if (bool == false) {
        console.log("NO AVATAR FOR TEAM " + team);
        return "";
      }
    }).catch((err:FileError) => {
      console.log("ERROR FINDING AVATAR FOR TEAM " + team + " - " + err.message);
    });

    return promise;
  }

}

export class TeamNotes {

  private fs: string;

  constructor() {
    this.fs = AppDirectory.getPermDir();
  }

  saveNotes(team, data) {
    let promise = File.writeFile(this.fs, "notes/" + team + ".dat", data, []).then((fileEntry) => {
      console.log("Saved file successfully");
      return fileEntry;
    }).catch((err) => {
      console.log(err);
    });
    return promise;
  }

  getNotes(team) {
    let fileEntry = null;
    let fileEntries:Entry[] = null;

    let promise = File.listDir(this.fs, "notes").then((entries:Entry[]) => {
      fileEntries = entries;

      for (let i = 0; i < fileEntries.length; i++) {
        if (fileEntries[i].name == team.team_number + ".dat") {
          fileEntry = fileEntries[i];
          break;
        }
      }

      let data = new Promise((resolve, reject) => {

        if (fileEntry) {
          fileEntry.file(function (file) {
            var reader = new FileReader();

            reader.onloadend = function() {
              // team.team_notes = this.result;
              resolve(this.result);
            };

            reader.readAsText(file);

          }, function(error) {
            reject(error);
          });
        } else {
          reject("FileEntry is null!");
        }

      });

      return data;

    }).catch((err:FileError) => {
      fileEntries = null;
      console.log("Error Listing Contents - " + err.message);
      return null;
    });

    return promise;

  }

}

export class AppDirectory {

  private static fs: string;
  private static cache: string;
  private static config: string;

  constructor() {}

  public static init(platform: Platform) {
    let p = "";

    if (!cordova) {
      console.log("CORDOVA NOT DEFINED - SEVERE ERROR");
    } else {
      console.log("CORDOVA: " + cordova);

      if (!cordova.file) {
        console.log("CORDOVA FILE PLUGIN NOT FOUND - SEVERE ERROR");
      } else {
        console.log("CORDOVA FILE: " + cordova.file);

        if (platform.is("android")) {
          this.fs = cordova.file.externalDataDirectory;
          this.cache = cordova.file.externalApplicationStorageDirectory + "cache/";
          this.config = cordova.file.dataDirectory;
          p = "ANDROID";
        } else if (platform.is("ios")) {
          this.fs = cordova.file.documentsDirectory;
          this.cache = cordova.file.documentsDirectory;
          this.config = cordova.file.syncedDataDirectory;
          p = "ANDROID";
        } else if (platform.is("windows")) {
          this.fs = cordova.file.dataDirectory;
          this.cache = cordova.file.cacheDirectory;
          this.config = cordova.file.syncedDataDirectory;
          p = "WINDOWS";
        }

        console.log("SUCCESSFULLY MAPPED DIRECTORIES FOR " + p);
        console.log("MAPPED DIRECTORIES: ");
        console.log("PERM: " + this.fs);
        console.log("TEMP: " + this.cache);
        console.log("CONFIG: " + this.config);

      }

    }

  }

  public static createDirs() {
    File.checkDir(this.fs, 'avatars').then((bool) => {
      console.log('avatars successfully found');
    }).catch(err => {
      File.createDir(this.fs, "avatars", false).then((freeSpace) => {
        console.log("Successfully created directory avatars");
      }).catch((err => {
        console.log("SEVERE ERROR WHILE CREATING DIRECTORY: " + err.message);
      }));
    });

    File.checkDir(this.fs, 'notes').then((bool) => {
      console.log('notes successfully found');
    }).catch(err => {
      File.createDir(this.fs, "notes", false).then((freeSpace) => {
        console.log("Successfully created directory notes");
      }).catch((err => {
        console.log("SEVERE ERROR WHILE CREATING DIRECTORY: " + err.message);
      }));
    });

    File.checkDir(this.fs, 'json').then((bool) => {
      console.log('JSON successfully found');
    }).catch(err => {
      File.createDir(this.fs, "json", false).then((freeSpace) => {
        console.log("Successfully created directory JSON");
      }).catch((err => {
        console.log("SEVERE ERROR WHILE CREATING DIRECTORY: " + err.message);
      }));
    });

    File.checkDir(this.fs, 'strategy-saves').then((bool) => {
      console.log('JSON successfully found');
    }).catch(err => {
      File.createDir(this.fs, "strategy-saves", false).then((freeSpace) => {
        console.log("Successfully created directory strategy-saves");
      }).catch((err => {
        console.log("SEVERE ERROR WHILE CREATING DIRECTORY: " + err.message);
      }));
    });
  }

  public static checkConfig() {
    File.checkFile(this.config, "config.json").then((bool:boolean) => {
      if (bool == true) {
        console.log("CONFIG WAS FOUND");
        this.loadConfig();
      }
      if (bool == false) {
        console.log("CONFIG NOT FOUND - CREATING CONFIG");
        File.writeFile(this.config, "config.json", JSON.stringify(Config.getJSON()), []).then((fileEntry) => {
          console.log("CREATED DEFAULT CONFIG SUCCESSFULLY");
        }).catch((err) => {
          console.log(err);
        });
      }
    }).catch((err:FileError) => {
      console.log("CONFIG NOT FOUND - CREATING CONFIG");
      File.writeFile(this.config, "config.json", JSON.stringify(Config.getJSON()), []).then((fileEntry) => {
        console.log("CREATED DEFAULT CONFIG SUCCESSFULLY");
      }).catch((err) => {
        console.log(err);
      });
    });
  }

  public static loadConfig() {
    File.readAsText(this.config, "config.json").then((data:string) => {
      let configJSON = JSON.parse(data);
      Config.TEAM_NUMBER = configJSON.team_number;
    }, (err:FileError) => {
      console.log(err.message);
    });
  }

  public static saveConfig() {
    let config = {
      "team_number": Config.TEAM_NUMBER
    }
    File.writeFile(this.config, "config.json", JSON.stringify(config), { replace: true }).then((fileEntry) => {
      console.log("SAVED CONFIG SETTINGS SUCCESSFULLY");
    }).catch((err) => {
      console.log(err.message);
    });
  }

  public static getPermDir() {
    return this.fs;
  }

  public static getTempDir() {
    return this.cache;
  }

  public static getConfigDir() {
    return this.config;
  }

}
