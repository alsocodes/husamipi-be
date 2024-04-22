import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'filtersValidator', async: false })
export class FiltersValidator implements ValidatorConstraintInterface {
  validate(filterText: string) {
    const filters = filterText.split(',');
    if (filters.length === 0) return false;

    const hasColon = filters.filter((a) => a.includes('::'), []);

    if (hasColon.length !== filters.length) return false;

    return true;
  }

  defaultMessage(): string {
    return 'Format filter tidak sesuai, gunakan sesuai contoh: field1:value1,sub1.sub2.sub3:value2';
  }
}
