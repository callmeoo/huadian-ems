export const ENTERPRISES = ["广州大学城华电新能源有限公司"];

export const OUTLETS = ["废气排放口01", "废气排放口02"];

export type Pollutant = {
  key: string;
  name: string;
  unit: string;
  hasEmissionLimit: boolean;
};

export const POLLUTANTS: Pollutant[] = [
  { key: "nox",            name: "氮氧化物", unit: "毫克/立方米", hasEmissionLimit: true  },
  { key: "smoke_humidity", name: "烟气湿度", unit: "百分比",      hasEmissionLimit: false },
  { key: "flow",           name: "流量",     unit: "立方米/秒",   hasEmissionLimit: false },
  { key: "smoke_pressure", name: "烟气压力", unit: "千帕",         hasEmissionLimit: false },
  { key: "oxygen",         name: "氧含量",   unit: "百分比",      hasEmissionLimit: false },
  { key: "smoke_temp",     name: "烟气温度", unit: "摄氏度",      hasEmissionLimit: false },
  { key: "smoke_velocity", name: "烟气流速", unit: "米/秒",       hasEmissionLimit: false },
];
