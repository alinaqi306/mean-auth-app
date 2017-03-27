
export interface Reading {
  LogDate: Date,
  MeterID:number,
  Value:number,
  Cost:number,
  CO2:number,
  Estimated: number
}

/*export const Readings: Reading[] = [
{MeterID:1213, LogDate: new Date("2017-03-15 13:30:00.000"), Value:42.3248470516, Cost:3.5087299306, CO2:17.3349879674, Estimated:0},
{MeterID:1213, LogDate: new Date("2017-03-15 13:00:00.000"), Value:42.3765636415, Cost:3.5130172360, CO2:17.3561695316, Estimated:0},
{MeterID:1213, LogDate: new Date("2017-03-15 12:30:00.000"), Value:41.0394538020, Cost:3.4021708268, CO2:16.8085294432, Estimated:0},
{MeterID:1213, LogDate: new Date("2017-03-15 12:00:00.000"), Value:43.4765205564, Cost:3.6042036671, CO2:17.8066788945, Estimated:0},
{MeterID:1213, LogDate: new Date("2017-03-15 11:30:00.000"), Value:40.4865648322, Cost:3.3563363298, CO2:16.5820827031, Estimated:0},
{MeterID:1213, LogDate: new Date("2017-03-15 11:00:00.000"), Value:40.3155360023, Cost:3.3421580394, CO2:16.5120344238, Estimated:0},
{MeterID:1213, LogDate: new Date("2017-03-15 10:30:00.000"), Value:40.5407752852, Cost:3.3608303765, CO2:16.6042856788, Estimated:0},
{MeterID:1213, LogDate: new Date("2017-03-15 10:00:00.000"), Value:39.4327581904, Cost:3.2689757565, CO2:16.1504751078, Estimated:0},
{MeterID:1213, LogDate: new Date("2017-03-15 09:30:00.000"), Value:39.2418273340, Cost:3.2531475880, CO2:16.0722755554, Estimated:0},
{MeterID:1213, LogDate: new Date("2017-03-15 09:00:00.000"), Value:36.5303349125, Cost:3.0283648592, CO2:14.9617295812, Estimated:0}
];*/