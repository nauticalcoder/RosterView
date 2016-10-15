import { Component, OnInit } from "@angular/core";
import { topmost } from "ui/frame";
import { Page } from "ui/page";
import { LoadingIndicator } from "nativescript-loading-indicator";
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from "@angular/router";

import { Player } from "./shared/player";
import { Team } from "./shared/team";
import { RosterService } from "./shared/roster.service";
import { TeamService } from "./shared/team.service";
import { SettingsService } from "./shared/settings.service";

@Component({
    selector: "my-app",
    templateUrl: "roster.component.html",
})


@Injectable()
export class RosterComponent implements OnInit {
 
    roster1: Array<Player> = [];
    roster2: Array<Player> = [];

    page: Page;
   
    isLoading1 = false;
    isLoading2 = false;
    
    constructor(private http: Http, private router: Router, private rosterService: RosterService, private settingsService: SettingsService){
        
        this.router = router;
        this.settingsService = settingsService;
               
    }

    ngOnInit() {
        // // Hide the action bar 
        // this.page = <Page>topmost().currentPage;
        // this.page.actionBarHidden = true;

        //this.isLoading1 = true;
        if (this.settingsService.team1)
        {
            this.rosterService.getRosterForTeam(this.settingsService.team1.id, false)
            .subscribe(loadedRoster => {
                loadedRoster.forEach((rosterObject) => {
                    this.roster1.push(rosterObject);
                });
                //this.isLoading1 = false;
            });
        }

        if (this.settingsService.team2)
        {   
            //this.isLoading2 = true;
            this.rosterService.getRosterForTeam(this.settingsService.team2.id, false)
            .subscribe(loadedRoster => {
                loadedRoster.forEach((rosterObject) => {
                    this.roster2.push(rosterObject);
                });
                //this.isLoading2 = false;
            });
        }

    }

    public refreshFromServer()
    {
        console.log("button pressed");
        console.log(this.settingsService.team1.id);
        this.isLoading1 = true;
        this.rosterService.getRosterForTeam(this.settingsService.team1.id, true)
        .subscribe(loadedRoster => {
            this.roster1 = [];
            loadedRoster.forEach((rosterObject) => {
                this.roster1.push(rosterObject);
            });
            this.isLoading1 = false;
        });

        this.isLoading2 = true;
        this.rosterService.getRosterForTeam(this.settingsService.team2.id, true)
        .subscribe(loadedRoster => {
            this.roster2 = [];
            loadedRoster.forEach((rosterObject) => {
                this.roster2.push(rosterObject);
            });
            this.isLoading2 = false;
        });        
    }

    public goSettings(){
        this.router.navigate(["settings"]);
    }

}
