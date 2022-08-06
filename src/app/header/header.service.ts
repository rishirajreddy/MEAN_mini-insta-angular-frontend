import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
    providedIn: "root"
})

export class HeaderService{
    listenToLoadHeader = new Subject<null>();

    getListenToHeader(){
        this.listenToLoadHeader.next(null);
    }
}