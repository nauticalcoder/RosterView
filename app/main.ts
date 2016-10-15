// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic, NativeScriptModule } from "nativescript-angular/platform";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NgModule } from "@angular/core";

//import { RosterComponent } from "./roster.component";
import { RosterService } from "./shared/roster.service";
import { SettingsService } from "./shared/settings.service";
import { TeamService } from "./shared/team.service";

//import { SettingsComponent } from "./settings.component";
import { AppComponent } from "./app.component";

import { routes, navigatableComponents } from "./app.routing";

@NgModule({
    declarations: [AppComponent, ...navigatableComponents,],
    providers: [RosterService, SettingsService, TeamService],
    bootstrap: [AppComponent],
    imports: [
    	NativeScriptModule, 
    	NativeScriptHttpModule, 
    	NativeScriptRouterModule, 
    	NativeScriptRouterModule.forRoot(routes)
    	],
})
class AppComponentModule {}

platformNativeScriptDynamic().bootstrapModule(AppComponentModule);