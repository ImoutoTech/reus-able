import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { BusinessException } from '../exceptions';

@Injectable()
export class RequiredPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BusinessException(`参数${metadata.data}缺失`);
    }
    return value;
  }
}
