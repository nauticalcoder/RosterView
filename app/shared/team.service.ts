import { Injectable } from '@angular/core';
// import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import applicationSettings = require("application-settings");
import { Http, Headers, Response } from "@angular/http";

import { Observable } from "rxjs/Rx";
// import { Config } from "./config";
import { Team } from "./team";

@Injectable()
export class TeamService {
  
  constructor(private http: Http) { }
  
  private teams: Team[] = [];

  getTeamList():Observable<Array<Team>> {
    console.log("Get teams");
    //let key `= `teams`;
    console.log(this.teams.length);
    if (this.teams.length > 0) {
      let result = Observable.of(this.teams);
      return result;
    } else{
      console.log("Call api")
      let url = "http://irongoatarmory.com/FFLInventory/api/v1/team";
      let result =  this.http.get(url)
        .map(response => {
          // console.log(JSON.stringify(response));
          var json = response.json();
          // console.log(json);
          console.log(json.length);
          return json;
        })
        .map(data => {
          console.log(data.length);
          data.forEach((team) => {
            console.log(team);
            this.teams.push(new Team(team.id, team.team_name, team.league, team.espn_id));
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
        console.log("Return from getTeamList")
       return result;
    }
  }

}