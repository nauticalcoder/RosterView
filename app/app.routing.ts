import { RosterComponent } from "./roster.component";
import { SettingsComponent } from "./settings.component";
import { SettingsTeamNameComponent } from "./settingsTeamName.component";

export const routes = [
 	{ path: "", component: RosterComponent },
    { path: "settings", component: SettingsComponent },
    { path: "edit-team/:id", component: SettingsTeamNameComponent }
];

export const navigatableComponents = [
  RosterComponent,
  SettingsComponent,
  SettingsTeamNameComponent
];