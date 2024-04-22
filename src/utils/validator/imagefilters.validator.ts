import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function ImageFilters(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    let message = `Invalid ${propertyName}`;
    registerDecorator({
      name: 'ImageFilters',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        defaultMessage(): string {
          return message;
        },
        validate(data: string, args: ValidationArguments) {
          const allowedMimeTypes = /image\/webp/;
          const base64 = ';base64,';

          // message = `${args.property} must be string`;
          if (typeof data !== 'string') return true;
          // message = `${args.property} must be base64`;
          if (data.indexOf(base64) < 0) return true;
          const dataArray = data.split(base64);
          const imageData = dataArray.pop();
          const imageType = dataArray.pop();
          if (!imageData.match(/^[A-Za-z0-9+/]+={0,2}$/)) return false;

          message = 'Only webp|jpeg files are allowed!';
          if (!allowedMimeTypes.test(imageType)) return false;

          message = 'Min file size 1 kb';
          if ((Buffer.from(imageData).length / 3) * 2 < 1024) return false;

          message = 'Max file size 2 mb';
          if ((Buffer.from(imageData).length / 3) * 2 > 2048576) return false;

          return true;
        },
      },
    });
  };
}
