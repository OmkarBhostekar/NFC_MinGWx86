
export interface TripType {
    "_id": string,
    "createdby": string,
    "source": string,
    "destination": string,
    "cost": number,
    "member": number,
    "max": number,
    "endTime": string,
    "startTime": string,
    "__v": number
}

export interface WeatherType {
    dt: number;
    main: MainClass;
    weather: Weather[];
    clouds: Clouds;
    wind: Wind;
    visibility: number;
    pop: number;
    sys: Sys;
    dt_txt: Date;
}

export interface Clouds {
    all: number;
}

export interface MainClass {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
}

export interface Sys {
    pod: Pod;
}

export enum Pod {
    D = "d",
    N = "n",
}

export interface Weather {
    id: number;
    main: MainEnum;
    description: Description;
    icon: string;
}

export enum Description {
    BrokenClouds = "broken clouds",
    ClearSky = "clear sky",
    FewClouds = "few clouds",
    OvercastClouds = "overcast clouds",
    ScatteredClouds = "scattered clouds",
}

export enum MainEnum {
    Clear = "Clear",
    Clouds = "Clouds",
    Thunderstorm = "Thunderstorm",
    Snow = "Snow",
    Rain = "Rain",
    Drizzle = "Drizzle",
    Mist = "Mist",
    Smoke = "Smoke",
    Haze = "Haze",
    Dust = "Dust",
    Fog = "Fog",
    Sand = "Sand",
    Ash = "Ash",
    Squall = "Squall",
    Tornado = "Tornado"
}

export interface Wind {
    speed: number;
    deg: number;
    gust: number;
}
