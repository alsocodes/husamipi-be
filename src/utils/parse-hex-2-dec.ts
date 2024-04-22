const mapRules = [
  ['sn', 0, 8],
  ['time', 8, 8],
  ['unitMainStatus', 16, 2],
  ['batteryVoltag', 18, 4],
  ['keySwitch', 22, 4],
  ['sdcStatus', 66, 2],
  ['inBoxTemp', 86, 2],
  ['outBoxTemp', 88, 2],
  ['mcuAccTime', 90, 8],
  ['engineAccTime', 98, 8],
  ['longitude', 114, 8],
  ['latitude', 122, 8],
  ['speed', 130, 2],
  ['sateliteCount', 132, 2],
];

export const parseHex2Dec = (hexString: string): any => {
  // const test =
  // 'B2D05E0164CA60D6801C2010000000000000000000000000000000000000000000C30000000000000000002D25000003E8000007D00000000006B95B30006F4910C80BFFFFC0';
  // B2D05E01,64CA60D6,80,1C20,10,000000000000000000000000000000000000000000,C3,000000000000000000,2D,25,000003E8,000007D0,0000,0000,06B95B30,006F4910,C8,0B,FFFF,C0
  return mapRules.reduce((a, b) => {
    a[b[0]] = parseInt(
      hexString.substring(Number(b[1]), Number(b[1]) + Number(b[2])),
      16,
    );
    // a[b[0]] = hexString.substring(Number(b[1]), Number(b[1]) + Number(b[2]));
    return a;
  }, {});
};
