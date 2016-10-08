import { Component, OnInit } from "@angular/core";
import { topmost } from "ui/frame";
import { Page } from "ui/page";
import { LoadingIndicator } from "nativescript-loading-indicator";
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Player } from "./shared/player";
import { RosterService } from "./shared/roster.service";

@Component({
    selector: "my-app",
    templateUrl: "roster.component.html",
})


@Injectable()
export class RosterComponent implements OnInit {
 
    public roster1: Array<Player> = [];
    public roster2: Array<Player> = [];

    page: Page;
    teamName1: string;
    teamName2: string;

    isLoading1 = false;
    isLoading2 = false;
    
    constructor(private http: Http, private rosterService: RosterService){

        this.teamName1 = "Penn State";
        this.teamName2 = "Maryland";
       
    }

    ngOnInit() {
        // Hide the action bar 
        this.page = <Page>topmost().currentPage;
        this.page.actionBarHidden = true;

        //this.isLoading1 = true;
        this.rosterService.getRosterForTeam(810, false)
        .subscribe(loadedRoster => {
            loadedRoster.forEach((rosterObject) => {
                this.roster1.push(rosterObject);
            });
            //this.isLoading1 = false;
        });

        //this.isLoading2 = true;
        this.rosterService.getRosterForTeam(803, false)
        .subscribe(loadedRoster => {
            loadedRoster.forEach((rosterObject) => {
                this.roster2.push(rosterObject);
            });
            //this.isLoading2 = false;
        });


    }

    public refreshFromServer()
    {
        console.log("button pressed");
        this.isLoading1 = true;
        this.rosterService.getRosterForTeam(810, true)
        .subscribe(loadedRoster => {
            this.roster1 = [];
            loadedRoster.forEach((rosterObject) => {
                this.roster1.push(rosterObject);
            });
            this.isLoading1 = false;
        });

        this.isLoading2 = true;
        this.rosterService.getRosterForTeam(803, true)
        .subscribe(loadedRoster => {
            this.roster2 = [];
            loadedRoster.forEach((rosterObject) => {
                this.roster2.push(rosterObject);
            });
            this.isLoading2 = false;
        });        
    }

}
