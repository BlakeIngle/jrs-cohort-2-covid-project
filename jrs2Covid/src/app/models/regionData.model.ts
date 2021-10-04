export class RegionData {
    region: string;
    parentRegion?: string;
    fips?: string;
    stateFips?: string;
    population?: number;
    timeline?: {
        cases: { date: Date, value: number }[],
        deaths: { date: Date, value: number }[],
        recovered?: { date: Date, value: number }[]
    }

    constructor(name: string) {
        this.region = name;
    }
}
