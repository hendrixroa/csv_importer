import { Injectable } from '@nestjs/common';

type PropsOf<T> = { [key in Extract<keyof T, string | symbol>]?: T[key] };

@Injectable()
export class ClassParserService {
  public toClass<T>(Cls: new () => T, props: PropsOf<T>): T {
    const cls = new Cls();
    Object.assign(cls, props);
    return cls;
  }
}
