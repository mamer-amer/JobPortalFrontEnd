import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';


@Pipe({
    name:'myPipe'
})

export class MomentPipe implements PipeTransform{

        transform(date:any,before="Posting date"){
            const modifiedDate = moment(new Date(date)).fromNow();
            // console.log(modifiedDate)
            return `${modifiedDate}`
            
        }
}