// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic, NativeScriptModule } from "nativescript-angular/platform";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NgModule } from "@angular/core";

import { RosterComponent } from "./roster.component";
import { RosterService } from "./shared/roster.service";

@NgModule({
    declarations: [RosterComponent],
    providers: [RosterService],
    bootstrap: [RosterComponent],
    imports: [NativeScriptModule, NativeScriptHttpModule, NativeScriptRouterModule],
})
class AppComponentModule {}

platformNativeScriptDynamic().bootstrapModule(AppComponentModule);