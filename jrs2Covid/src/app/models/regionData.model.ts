export class RegionData {
    region: string;

    parentRegion?: string;
    fips?: string;
    stateFips?: string;
    population?: number;

    totalCases?: number;
    totalDeaths?: number;
    totalRecovered?: number;
    totalActive?: number;
    totalVaccinations?: number;

    todayCases?: number;
    todayDeaths?: number;
    todayRecovered?: number;
    todayActive?: number;
    todayVaccinations?: number;

    timeline?: {
        cases?: { date: Date, value: number }[],
        deaths?: { date: Date, value: number }[],
        recovered?: { date: Date, value: number }[],
        vaccinations?: { date: Date, value: number }[]
    }

    constructor(name?: string) {
        this.region = name;
    }
}
