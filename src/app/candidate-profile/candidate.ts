export class Candidate{
    name:String
    email:String;
    field:String;
    presentationLetter:String;
    cv:any;
    dp:any=null;
    resumeContentType:any;
    imageContentType:any;
}

export interface ViewCandidateObject{
    candId?:any;
    name?: String
    email?: String;
    field?: String;
    presentationLetter?: String;
    cv?: any;
    dp?: any
    resumeContentType?: any;
    imageContentType?: any;
}