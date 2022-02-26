import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Card} from "../entities/card";

export type ExerciseEvent= { card:Card; correct:boolean; timeOut:boolean };

@Injectable({
    providedIn: 'root'
})
export class EventsService {
    private defaultSubject = new Subject<any>();

    publishData(data: any) {
        this.defaultSubject.next(data);
    }

    getObservable(): Subject<any> {
        return this.defaultSubject;
    }
}
