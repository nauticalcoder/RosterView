import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import applicationSettings = require("application-settings");

import { Observable } from "rxjs/Rx";
// import { Config } from "./config";
import { Player } from "./player";

@Injectable()
export class RosterService {
  constructor(private http: Http) { }
  
  getRosterForTeam(teamId:number, refresh:boolean):Observable<Array<Player>> {
    let key = `team-${teamId}`;

    if (refresh){
      let url = "http://rosterview.azurewebsites.net/api/" + 'player?teamId=' + teamId;
      let result =  this.http.get(url)
        .map(response => {
          var json = response.json();
          applicationSettings.setString(key, JSON.stringify(json)); 
          return json;
        })
        .map(data => {
          let playerList: Player[] = [];
          data.forEach((player) => {
            playerList.push(new Player(player.Number, player.LastName, player.FirstName, player.Position, player.Class));
          });
          return playerList;
        });
       return result;
     } else{
       var json = applicationSettings.getString(key, "[]");
       console.log("From cache");
       console.log(json);
       var parsed = JSON.parse(json);
       let playerList: Player[] = [];
       parsed.forEach((player) => {
            playerList.push(new Player(player.Number, player.LastName, player.FirstName, player.Position, player.Class));
       });

       // playerList.push(new Player("1", "test", "test", "te", "te"));
       // playerList.push(new Player("1", "test", "test", "te", "te"));
       let result = Observable.of(playerList);
       return result;
     }
  }

}