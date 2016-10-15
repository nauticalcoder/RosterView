import { Component, OnInit } from "@angular/core";
import { topmost } from "ui/frame";
import { Page } from "ui/page";
import { LoadingIndicator } from "nativescript-loading-indicator";
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute, Params } from '@angular/router';
import { RouterExtensions } from "nativescript-angular/router";

import { Team } from "./shared/team";
import { TeamService } from "./shared/team.service";
import { SettingsService } from "./shared/settings.service";

@Component({
    selector: "my-app",
    templateUrl: "settingsTeamName.component.html",
})


@Injectable()
export class SettingsTeamNameComponent implements OnInit {
 
    teamList: Array<Team> = [];
    teamId: number;

    page: Page;
   
    isLoading = false;
    
    constructor(private http: Http, private routerExtensions: RouterExtensions, private route: ActivatedRoute, 
        private teamService: TeamService, private settingsService: SettingsService) {
        
        this.routerExtensions = routerExtensions;
        this.route = route;
        this.teamService = teamService;
        this.settingsService = settingsService;
    }

    ngOnInit() {
        this.route.params.forEach((params: Params) => {
             this.teamId = +params['id']; // (+) converts string 'id' to a number
           });

        this.isLoading = true;

        this.teamService.getTeamList()
        .subscribe(teamList => {
            teamList.forEach((team) => {
                this.teamList.push(team);
            });
            this.isLoading = false;
        });

    }

    onTeamSelect(args){
        console.log(args.index);
        let selectedTeam = this.teamList[args.index];
        if (this.teamId == 1)
        {
            this.settingsService.team1 = selectedTeam;
            this.routerExtensions.backToPreviousPage();
        } else if (this.teamId == 2)
        {
            this.settingsService.team2 = selectedTeam;
            this.routerExtensions.backToPreviousPage();
        }
    }

    public goBack(){
        this.routerExtensions.backToPreviousPage();
    }
 
}
