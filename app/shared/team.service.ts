import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import applicationSettings = require("application-settings");

import { Observable } from "rxjs/Rx";
// import { Config } from "./config";
import { Team } from "./team";

@Injectable()
export class TeamService {
  
  constructor(private http: Http) { }
  
  private teams: Team[] = [];

  getTeamList():Observable<Array<Team>> {
    console.log("Get teams");
    //let key = `teams`;
    if (this.teams.length > 0) {
      let result = Observable.of(this.teams);
      return result;
    } else{
      let url = "http://rosterview.azurewebsites.net/api/team";
      let result =  this.http.get(url)
        .map(response => {
            var json = response.json();
          return json;
        })
        .map(data => {
          data.forEach((team) => {
            this.teams.push(new Team(team.Id, team.TeamName, team.League, team.EspnId));
          });
          this.teams.sort((a,b) => {
            var nameA = a.name.toUpperCase(); // ignore upper and lowercase
            var nameB = b.name.toUpperCase(); // ignore upper and lowercase
 
            if (nameA < nameB)
              return -1;
            if (nameA > nameB)
              return 1;
            return 0;
          });
          return this.teams;
        });

       return result;
    }
  }

}