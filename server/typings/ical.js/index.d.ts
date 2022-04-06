declare module 'ical.js' {
  type JcalData = any

  function parse(input: string): JcalData | JcalData[];

  interface EventOptions {
    exceptions: Array<Component|Event>
    strictExceptions: boolean
  }

  interface TimeConstructorData {
    year?: number
    month?: number
    day?: number
    minute?: number
    second?: number
    isDate?: boolean
  }

  interface TimezoneConstructorData {
    component: string | Component
    tzid?: string
    location?: string
    tznames?: string
    latitude?: number
    longitude?: number
  }

  class Component {
    public readonly name: string;

    constructor(jCal: JcalData | string, parent?: Component)

    public getAllSubcomponents(name?: string): Component[]
    public getFirstPropertyValue(name?: string): string | Duration | null
    public getFirstSubcomponent(name?: string): Component | null
  }

  class Duration {
    public static fromSeconds(aSeconds: number): Duration
    public static fromString(aStr: string): Duration

    public fromSeconds(aSeconds: number): Duration
    public toICALString(): string
    public toSeconds(): number
    public toString(): string
  }

  class Event {
    public description: string;
    public duration: Duration;
    public endDate: Time;
    public location: string;
    public startDate: Time;
    public summary: string;
    public uid: string;

    constructor(component?: Component | null, options?: EventOptions)
  }

  class Time {
    constructor(data: TimeConstructorData)

    public readonly icaltype: 'date' | 'date-time';

    public toJSDate(): Date
    public toString(): string
  }

  class Timezone {
    constructor(data: Component | TimezoneConstructorData)

    public toString(): string
  }
}
