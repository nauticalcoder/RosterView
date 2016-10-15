import { Injectable } from '@angular/core';
import applicationSettings = require("application-settings");
import { Team } from "./team";

@Injectable()
export class SettingsService {
  constructor() { }
  
  private _team1:Team;
  get team1():Team {
    this._team1 = JSON.parse(applicationSettings.getString('team1'));
    return this._team1;
  }
  set team1(value:Team) {
    this._team1 = value;
    applicationSettings.setString('team1', JSON.stringify(this._team1));       
  }

  private _team2:Team;
  get team2():Team {
    this._team2 = JSON.parse(applicationSettings.getString('team2'));
    return this._team2;
  }
  set team2(value:Team) {
    this._team2 = value;
    applicationSettings.setString('team2', JSON.stringify(this._team2));       
  }

}