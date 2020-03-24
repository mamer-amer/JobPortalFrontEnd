
export  class JobDetails {

    title: String;
    description: String;
    salary: number;
    country: String;
    city: String;
    category: String;
    type: String;
    companyProfile: Object = {
        name: "",
        corporateAddress: "",
        logo: "",
        logoContentType: ""
    }
}