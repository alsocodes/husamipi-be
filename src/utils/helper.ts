const crypto = require('crypto');
export const slugify = (str: string) => {
  str = str.replace(/^\s+|\s+$/g, '');

  // Make the string lowercase
  str = str.toLowerCase();

  // Remove accents, swap ñ for n, etc
  var from =
    'ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;';
  var to =
    'AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------';
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  // Remove invalid chars
  str = str
    .replace(/[^a-z0-9 -]/g, '')
    // Collapse whitespace and replace by -
    .replace(/\s+/g, '-')
    // Collapse dashes
    .replace(/-+/g, '-');

  return str;
};

export const randomString = async (stringLength: number) => {
  return crypto
    .randomBytes(Math.ceil(stringLength / 2))
    .toString('hex')
    .slice(0, stringLength)
    .toUpperCase();
};

export const distance = (
  posA: number[],
  posB: number[],
  unit: string = 'K',
) => {
  const [lat1, lon1] = posA;
  const [lat2, lon2] = posB;
  if (lat1 == lat2 && lon1 == lon2) return 0;

  var radlat1 = (Math.PI * lat1) / 180;
  var radlat2 = (Math.PI * lat2) / 180;
  var theta = lon1 - lon2;
  var radtheta = (Math.PI * theta) / 180;
  var dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  if (dist > 1) {
    dist = 1;
  }
  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  if (unit == 'K') {
    dist = dist * 1.609344;
  }
  if (unit == 'N') {
    dist = dist * 0.8684;
  }
  return dist;
};

export const isInRadius = (pos: number[], point: number[], range: number) => {
  const dist = distance(pos, point);
  return dist <= range;
};

export const filterDtoTransform = (filter: string) => {
  const filters = filter.split(',');
  return filters.map((fil) => {
    const [key, val] = fil.split('::');
    let value: any;
    if (val === 'true') value = true;
    else if (val === 'false') value = false;
    else if (!isNaN(Number(val))) value = Number(val);
    else value = val;
    return { [key]: value };
  }, []);
};

export const milisecondToHours = (seconds: number) => {
  let secondss = seconds;
  const hours = Math.floor(secondss / 3600000);
  secondss = secondss - hours * 3600000;
  const minutes = Math.floor(secondss / 60000);
  secondss = secondss - minutes * 60000;
  const sec = Math.floor(secondss / 1000);

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
};

export const countBreakHours = (dates: Date[]) => {
  let diff = 0;
  for (let i = 0; i < dates.length; i += 2) {
    diff += dates[i + 1].valueOf() - dates[i].valueOf();
  }

  return diff;
};

export const toJsonIfValid = (str: string) => {
  try {
    return JSON.parse(str);
  } catch (error) {
    return str;
  }
};

export const datesInRanges = (start: Date, end: Date): Date[] => {
  let days: Date[] = [start];
  let day = new Date(start.valueOf());
  while (day < end) {
    days.push(day);
    day = new Date(day.setDate(day.getDate() + 1));
  }
  return days;
};

export const toUtcHour = (hh: string) => {
  const utc = process.env.IS_UTC === 'true';
  if (utc) {
    let h = parseInt(hh) - 7;
    if (h < 0) h = 24 + h;
    return h.toString().padStart(2, '0');
    // 7-7 =0
    // 6-7 =-1  => 24-1 = 23
    // 5-7 =-1  => 24-1 = 22
    // 4-7 =-1  => 24-1 = 21
    // 3-7 =-4  => 24-4 = 20
    // 2-7 =-5  => 24-5 = 19
    // 1-7 =-6  => 24-6 = 18
    // 0-7 =-7  => 24-7 = 17
  }
  return hh;
};

export const Alphabets = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];

export const orderingQuery = (order?: string, direction?: string) => {
  if (order?.includes('.')) {
    const [key1, key2] = order.split('.');
    return { [key1]: { [key2]: direction || 'desc' } };
  }
  return { [order || 'id']: direction || 'desc' };
};
