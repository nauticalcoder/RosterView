import { Component, OnInit } from "@angular/core";
import { topmost } from "ui/frame";
import { Page } from "ui/page";
import { LoadingIndicator } from "nativescript-loading-indicator";
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";

import { Team } from "./shared/team";
import { SettingsService } from "./shared/settings.service";

@Component({
    selector: "my-app",
    templateUrl: "settings.component.html",
})


@Injectable()
export class SettingsComponent implements OnInit {
 

    page: Page;

    isLoading1 = false;
    isLoading2 = false;
    
    constructor(private http: Http, private routerExtensions: RouterExtensions, private settingsService: SettingsService, private router: Router) {
        this.routerExtensions = routerExtensions;
        this.settingsService = settingsService;       
    }

    ngOnInit() {
        // // Hide the action bar 
        // this.page = <Page>topmost().currentPage;
        // this.page.actionBarHidden = true;


    }

    changeTeam(teamNumber:number){
        console.log(teamNumber); 
        this.routerExtensions.navigate(["edit-team", teamNumber], 
             {
                animated: false
                
            });
    }

    public goBack(){
        this.routerExtensions.backToPreviousPage();
    }

}
